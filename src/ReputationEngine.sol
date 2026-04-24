// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract ReputationEngine {
    event ScoreUpdated(uint256 indexed agentId, uint256 newScore, bool success);

    address public immutable router;

    mapping(uint256 => uint256) private _score;

    constructor(address router_) {
        require(router_ != address(0), "ROUTER_REQUIRED");
        router = router_;
    }

    modifier onlyRouter() {
        require(msg.sender == router, "ONLY_ROUTER");
        _;
    }

    function updateScore(uint256 agentId, bool success) external onlyRouter returns (uint256 newScore) {
        uint256 s = _score[agentId];
        if (success) {
            unchecked {
                s += 1;
            }
        } else if (s > 0) {
            unchecked {
                s -= 1;
            }
        }
        _score[agentId] = s;
        emit ScoreUpdated(agentId, s, success);
        return s;
    }

    function getScore(uint256 agentId) external view returns (uint256) {
        return _score[agentId];
    }
}

