// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "../lib/forge-std/src/Script.sol";
import { AgentRegistry } from "../src/AgentRegistry.sol";
import { PaymentRouter } from "../src/PaymentRouter.sol";
import { HashVerifier } from "../src/verifiers/HashVerifier.sol";

contract DeployOnly is Script {
    address constant ARC_TESTNET_USDC = 0x3600000000000000000000000000000000000000;

    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(pk);

        AgentRegistry registry = new AgentRegistry();
        PaymentRouter router = new PaymentRouter(ARC_TESTNET_USDC, address(registry));
        HashVerifier verifier = new HashVerifier();

        // Lấy địa chỉ ReputationEngine và Escrow được tạo tự động bởi PaymentRouter
        address reputationAddr = address(router.reputation());
        address escrowAddr = address(router.escrow());

        console.log("AgentRegistry deployed at:", address(registry));
        console.log("PaymentRouter deployed at:", address(router));
        console.log("HashVerifier deployed at:", address(verifier));
        console.log("ReputationEngine deployed at:", reputationAddr);
        console.log("AgentEscrow deployed at:", escrowAddr);

        vm.stopBroadcast();
    }
}
