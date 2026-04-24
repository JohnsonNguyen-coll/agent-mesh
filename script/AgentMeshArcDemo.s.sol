// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "../lib/forge-std/src/Script.sol";

import { AgentRegistry } from "../src/AgentRegistry.sol";
import { PaymentRouter } from "../src/PaymentRouter.sol";
import { HashVerifier } from "../src/verifiers/HashVerifier.sol";
import { IERC20 } from "../src/interfaces/IERC20.sol";

/// @dev Arc’s USDC implementation calls a chain-specific precompile at
/// 0x1800...0001 (e.g. `isBlocklisted(address)`).
/// Foundry’s local EVM (used to build the broadcast tx list) doesn’t implement it,
/// which can cause a local `StackUnderflow` during simulation.
/// We stub it via `vm.etch` so the script can generate/broadcast transactions.
contract _ArcBlocklistPrecompileStub {
    function isBlocklisted(address) external pure returns (bool) {
        return false;
    }
}

/// @dev Arc USDC also dispatches transfers through a chain precompile at 0x1800...0000.
/// Foundry's local VM doesn't implement it, so we stub a minimal surface for simulation.
contract _ArcTransferPrecompileStub {
    function transfer(address, address, uint256) external pure returns (bool) {
        return true;
    }

    function transferFrom(address, address, address, uint256) external pure returns (bool) {
        return true;
    }
}

/// @dev Arc Testnet demo:
/// - deploy AgentRegistry + PaymentRouter + HashVerifier
/// - register an agent
/// - approve USDC to escrow
/// - route task -> claim -> settle
///
/// Requires env:
/// - ARC_TESTNET_RPC_URL
/// - PRIVATE_KEY (funded with testnet USDC)
contract AgentMeshArcDemo is Script {
    // Arc Testnet USDC ERC-20 interface address (docs.arc.network reference)
    address constant ARC_TESTNET_USDC = 0x3600000000000000000000000000000000000000;
    address constant ARC_BLOCKLIST_PRECOMPILE = 0x1800000000000000000000000000000000000001;
    address constant ARC_TRANSFER_PRECOMPILE = 0x1800000000000000000000000000000000000000;

    bytes32 constant EIP712_DOMAIN_TYPEHASH =
        keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");
    bytes32 constant TRANSFER_WITH_AUTHORIZATION_TYPEHASH = keccak256(
        "TransferWithAuthorization(address from,address to,uint256 value,uint256 validAfter,uint256 validBefore,bytes32 nonce)"
    );

    function run() external {
        // Stub Arc blocklist precompile for local simulation (no effect on-chain).
        vm.etch(ARC_BLOCKLIST_PRECOMPILE, type(_ArcBlocklistPrecompileStub).runtimeCode);
        vm.etch(ARC_TRANSFER_PRECOMPILE, type(_ArcTransferPrecompileStub).runtimeCode);

        uint256 pk = vm.envUint("PRIVATE_KEY");
        address caller = vm.addr(pk);

        vm.startBroadcast(pk);

        AgentRegistry registry = new AgentRegistry();
        PaymentRouter router = new PaymentRouter(ARC_TESTNET_USDC, address(registry));
        HashVerifier verifier = new HashVerifier();
        IERC20 usdc = IERC20(ARC_TESTNET_USDC);

        // 1) Register an agent (payout is caller for demo)
        uint256 agentId = registry.registerAgent(
            "Summarize Agent",
            "demo agent",
            3000, // 0.003 USDC (6 decimals)
            "https://example.invalid/agent/summarize",
            caller
        );

        // 2) No approve needed: payment is executed via USDC EIP-3009 transferWithAuthorization.

        // 3) Create a task, claim, settle.
        bytes memory taskData = abi.encode("Summarize: https://docs.arc.network/");
        bytes memory result = bytes("Arc docs summary (demo)");
        bytes32 expectedHash = keccak256(result);
        uint96 reward = 3000;

        // Hard checks (clearer errors than deep token revert).
        require(usdc.balanceOf(caller) >= reward, "INSUFFICIENT_USDC");

        // Build and sign the EIP-3009 authorization.
        // In this demo, payout == caller (agent payout address).
        // USDC EIP-3009 checks `block.timestamp > validAfter` (strict), so using `block.timestamp`
        // can revert as "authorization is not yet valid" in the same tx. Use 0 to be always valid.
        uint64 validAfter = 0;
        uint64 validBefore = uint64(block.timestamp + 1 hours);
        bytes32 authNonce = keccak256(abi.encodePacked(address(router), caller, block.number, uint256(0xA11CE)));

        bytes32 domainSeparator = keccak256(
            abi.encode(
                EIP712_DOMAIN_TYPEHASH,
                keccak256(bytes("USDC")),
                keccak256(bytes("2")),
                block.chainid,
                ARC_TESTNET_USDC
            )
        );

        bytes32 structHash = keccak256(
            abi.encode(
                TRANSFER_WITH_AUTHORIZATION_TYPEHASH,
                caller,
                caller,
                uint256(reward),
                uint256(validAfter),
                uint256(validBefore),
                authNonce
            )
        );

        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", domainSeparator, structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(pk, digest);

        bytes32 taskId = router.routePayment(
            agentId,
            taskData,
            reward,
            uint64(block.timestamp + 1 hours),
            address(verifier),
            expectedHash,
            validAfter,
            validBefore,
            authNonce,
            v,
            r,
            s
        );

        router.claimTask(taskId);
        router.settlePayment(taskId, result);

        vm.stopBroadcast();
    }
}

