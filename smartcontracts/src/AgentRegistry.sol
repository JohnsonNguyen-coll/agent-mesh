// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract AgentRegistry {
    struct AgentInfo {
        address owner;
        address payoutAddress;
        uint96 pricePerCall; // priced in USDC's smallest unit (e.g. 6 decimals on Arc's USDC ERC-20 interface)
        string name;
        string description;
        string endpoint; // offchain endpoint (URL, DID, etc.)
        bool active;
    }

    event AgentRegistered(uint256 indexed agentId, address indexed owner, address payoutAddress);
    event AgentUpdated(uint256 indexed agentId);
    event AgentStatusChanged(uint256 indexed agentId, bool active);

    uint256 public agentCount;
    mapping(uint256 => AgentInfo) private _agents;

    function registerAgent(
        string calldata name,
        string calldata description,
        uint96 pricePerCall,
        string calldata endpoint,
        address payoutAddress
    ) external returns (uint256 agentId) {
        require(bytes(name).length != 0, "NAME_REQUIRED");
        require(payoutAddress != address(0), "PAYOUT_REQUIRED");

        agentId = ++agentCount;
        _agents[agentId] = AgentInfo({
            owner: msg.sender,
            payoutAddress: payoutAddress,
            pricePerCall: pricePerCall,
            name: name,
            description: description,
            endpoint: endpoint,
            active: true
        });

        emit AgentRegistered(agentId, msg.sender, payoutAddress);
    }

    function updateAgent(
        uint256 agentId,
        string calldata name,
        string calldata description,
        uint96 pricePerCall,
        string calldata endpoint,
        address payoutAddress
    ) external {
        AgentInfo storage a = _agents[agentId];
        require(a.owner != address(0), "NOT_FOUND");
        require(msg.sender == a.owner, "NOT_OWNER");
        require(bytes(name).length != 0, "NAME_REQUIRED");
        require(payoutAddress != address(0), "PAYOUT_REQUIRED");

        a.name = name;
        a.description = description;
        a.pricePerCall = pricePerCall;
        a.endpoint = endpoint;
        a.payoutAddress = payoutAddress;

        emit AgentUpdated(agentId);
    }

    function setActive(uint256 agentId, bool active) external {
        AgentInfo storage a = _agents[agentId];
        require(a.owner != address(0), "NOT_FOUND");
        require(msg.sender == a.owner, "NOT_OWNER");
        a.active = active;
        emit AgentStatusChanged(agentId, active);
    }

    function getAgent(uint256 agentId) external view returns (AgentInfo memory) {
        AgentInfo memory a = _agents[agentId];
        require(a.owner != address(0), "NOT_FOUND");
        return a;
    }

    function listAgents(uint256 offset, uint256 limit) external view returns (AgentInfo[] memory agents) {
        if (offset >= agentCount) return new AgentInfo[](0);
        uint256 end = offset + limit;
        if (end > agentCount) end = agentCount;

        agents = new AgentInfo[](end - offset);
        uint256 idx;
        for (uint256 id = offset + 1; id <= end; id++) {
            agents[idx++] = _agents[id];
        }
    }
}

