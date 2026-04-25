// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @notice Minimal USDC EIP-3009 interface.
/// Reference: "transferWithAuthorization" / "authorizationState" functions.
interface IUSDCTransferWithAuthorization {
    function transferWithAuthorization(
        address from,
        address to,
        uint256 value,
        uint256 validAfter,
        uint256 validBefore,
        bytes32 nonce,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    function authorizationState(address authorizer, bytes32 nonce) external view returns (bool);
}

