// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import { IERC20 } from "./interfaces/IERC20.sol";

contract AgentEscrow {
    struct Deposit {
        address payer;
        address token;
        uint256 amount;
        bool released;
    }

    event Deposited(bytes32 indexed taskId, address indexed payer, address indexed token, uint256 amount);
    event Released(bytes32 indexed taskId, address indexed to, uint256 amount);
    event Refunded(bytes32 indexed taskId, address indexed to, uint256 amount);

    address public immutable router;
    mapping(bytes32 => Deposit) public deposits;

    constructor(address router_) {
        require(router_ != address(0), "ROUTER_REQUIRED");
        router = router_;
    }

    modifier onlyRouter() {
        require(msg.sender == router, "ONLY_ROUTER");
        _;
    }

    /// @dev Accounting-only "escrow".
    /// We record the task deposit, but we do NOT move funds into this contract at route time.
    /// On Arc testnet, transferring USDC from a contract can revert unexpectedly; using
    /// `transferFrom(payer, payout, amount)` at settlement avoids contract-as-sender transfers.
    function depositFrom(address token, address payer, bytes32 taskId, uint256 amount) external onlyRouter {
        require(deposits[taskId].payer == address(0), "DUP_TASK");
        require(amount > 0, "AMOUNT_ZERO");
        deposits[taskId] = Deposit({ payer: payer, token: token, amount: amount, released: false });
        emit Deposited(taskId, payer, token, amount);
    }

    function releaseTo(bytes32 taskId, address to) external onlyRouter {
        Deposit storage d = deposits[taskId];
        require(d.payer != address(0), "NOT_FOUND");
        require(!d.released, "ALREADY_FINAL");
        d.released = true;

        bool ok = IERC20(d.token).transferFrom(d.payer, to, d.amount);
        require(ok, "TRANSFER_FROM_FAILED");
        emit Released(taskId, to, d.amount);
    }

    function refundTo(bytes32 taskId, address to) external onlyRouter {
        Deposit storage d = deposits[taskId];
        require(d.payer != address(0), "NOT_FOUND");
        require(!d.released, "ALREADY_FINAL");
        d.released = true;

        // No token movement needed (since we never pulled funds in).
        emit Refunded(taskId, to, d.amount);
    }
}

