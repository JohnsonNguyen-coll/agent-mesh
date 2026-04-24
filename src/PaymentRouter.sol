// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import { AgentRegistry } from "./AgentRegistry.sol";
import { AgentEscrow } from "./AgentEscrow.sol";
import { ReputationEngine } from "./ReputationEngine.sol";
import { IERC20 } from "./interfaces/IERC20.sol";
import { IUSDCTransferWithAuthorization } from "./interfaces/IUSDCTransferWithAuthorization.sol";
import { IVerifier } from "./verifiers/IVerifier.sol";

contract PaymentRouter {
    enum TaskStatus {
        None,
        Posted,
        Claimed,
        Completed,
        Cancelled
    }

    struct Task {
        uint256 agentId;
        address payer;
        address claimer;
        address payoutAddress;
        uint64 createdAt;
        uint64 deadline;
        uint96 reward;
        bytes32 expectedResultHash;
        address verifier;
        TaskStatus status;
        bytes taskData;

        // EIP-3009 transfer authorization (USDC)
        uint64 authValidAfter;
        uint64 authValidBefore;
        bytes32 authNonce;
        uint8 authV;
        bytes32 authR;
        bytes32 authS;
    }

    event TaskRouted(bytes32 indexed taskId, uint256 indexed agentId, address indexed payer, uint256 reward);
    event TaskClaimed(bytes32 indexed taskId, address indexed claimer);
    event TaskCompleted(bytes32 indexed taskId, bool success);
    event TaskCancelled(bytes32 indexed taskId);

    AgentRegistry public immutable registry;
    AgentEscrow public immutable escrow;
    ReputationEngine public immutable reputation;
    IERC20 public immutable usdc;
    IUSDCTransferWithAuthorization public immutable usdcAuth;

    uint256 public nonce;
    mapping(bytes32 => Task) public tasks;

    constructor(address usdc_, address registry_) {
        require(usdc_ != address(0), "USDC_REQUIRED");
        require(registry_ != address(0), "REG_REQUIRED");
        usdc = IERC20(usdc_);
        usdcAuth = IUSDCTransferWithAuthorization(usdc_);
        registry = AgentRegistry(registry_);

        escrow = new AgentEscrow(address(this));
        reputation = new ReputationEngine(address(this));
    }

    function routePayment(
        uint256 agentId,
        bytes calldata taskData,
        uint96 reward,
        uint64 deadline,
        address verifier,
        bytes32 expectedResultHash,
        uint64 authValidAfter,
        uint64 authValidBefore,
        bytes32 authNonce,
        uint8 authV,
        bytes32 authR,
        bytes32 authS
    ) external returns (bytes32 taskId) {
        AgentRegistry.AgentInfo memory agent = registry.getAgent(agentId);
        require(agent.active, "AGENT_INACTIVE");
        require(reward > 0, "REWARD_ZERO");
        require(deadline == 0 || deadline > block.timestamp, "BAD_DEADLINE");
        require(verifier != address(0), "VERIFIER_REQUIRED");
        require(agent.payoutAddress != address(0), "BAD_PAYOUT");
        require(authValidBefore > block.timestamp, "AUTH_EXPIRED");
        require(authValidBefore > authValidAfter, "AUTH_WINDOW");
        require(!usdcAuth.authorizationState(msg.sender, authNonce), "AUTH_USED");

        taskId = keccak256(abi.encodePacked(block.chainid, address(this), msg.sender, agentId, ++nonce));
        Task storage t = tasks[taskId];
        require(t.status == TaskStatus.None, "TASK_EXISTS");

        tasks[taskId] = Task({
            agentId: agentId,
            payer: msg.sender,
            claimer: address(0),
            payoutAddress: agent.payoutAddress,
            createdAt: uint64(block.timestamp),
            deadline: deadline,
            reward: reward,
            expectedResultHash: expectedResultHash,
            verifier: verifier,
            status: TaskStatus.Posted,
            taskData: taskData,
            authValidAfter: authValidAfter,
            authValidBefore: authValidBefore,
            authNonce: authNonce,
            authV: authV,
            authR: authR,
            authS: authS
        });

        // Record the commitment (accounting-only).
        escrow.depositFrom(address(usdc), msg.sender, taskId, reward);

        emit TaskRouted(taskId, agentId, msg.sender, reward);
    }

    function claimTask(bytes32 taskId) external {
        Task storage t = tasks[taskId];
        require(t.status == TaskStatus.Posted, "NOT_POSTED");
        t.status = TaskStatus.Claimed;
        t.claimer = msg.sender;
        emit TaskClaimed(taskId, msg.sender);
    }

    function settlePayment(bytes32 taskId, bytes calldata result) external {
        Task storage t = tasks[taskId];
        require(t.status == TaskStatus.Claimed, "NOT_CLAIMED");
        require(msg.sender == t.claimer, "ONLY_CLAIMER");
        require(t.deadline == 0 || block.timestamp <= t.deadline, "DEADLINE_PASSED");

        bool ok = IVerifier(t.verifier).verify(t.taskData, result, t.expectedResultHash);
        require(ok, "VERIFY_FAILED");

        t.status = TaskStatus.Completed;

        // Pull payment using EIP-3009 authorization signed by payer at route time.
        usdcAuth.transferWithAuthorization(
            t.payer,
            t.payoutAddress,
            uint256(t.reward),
            uint256(t.authValidAfter),
            uint256(t.authValidBefore),
            t.authNonce,
            t.authV,
            t.authR,
            t.authS
        );
        reputation.updateScore(t.agentId, true);

        emit TaskCompleted(taskId, true);
    }

    function cancel(bytes32 taskId) external {
        Task storage t = tasks[taskId];
        require(t.status == TaskStatus.Posted || t.status == TaskStatus.Claimed, "NOT_ACTIVE");
        require(msg.sender == t.payer, "ONLY_PAYER");
        require(t.deadline != 0 && block.timestamp > t.deadline, "NOT_EXPIRED");

        t.status = TaskStatus.Cancelled;
        escrow.refundTo(taskId, t.payer);
        reputation.updateScore(t.agentId, false);

        emit TaskCancelled(taskId);
    }
}

