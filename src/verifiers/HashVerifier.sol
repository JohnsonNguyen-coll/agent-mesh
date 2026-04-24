// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import { IVerifier } from "./IVerifier.sol";

contract HashVerifier is IVerifier {
    function verify(bytes calldata, bytes calldata result, bytes32 expectedResultHash)
        external
        pure
        returns (bool)
    {
        return keccak256(result) == expectedResultHash;
    }
}

