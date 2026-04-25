// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

interface IVerifier {
    function verify(bytes calldata taskData, bytes calldata result, bytes32 expectedResultHash)
        external
        view
        returns (bool);
}

