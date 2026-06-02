// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ObsidianAgent.sol";

/**
 * @title ObsidianScheduler
 * @dev Simple contract to trigger portfolio evaluations using Ritual's scheduler.
 */
contract ObsidianScheduler {
    ObsidianAgent public agent;
    
    // Addresses permitted to trigger the scheduled execution (e.g., Ritual Scheduler nodes)
    mapping(address => bool) public authorizedCallers;
    address public owner;

    event ScheduledTaskExecuted(uint256 timestamp, string result);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyAuthorized() {
        require(authorizedCallers[msg.sender] || msg.sender == owner, "Not authorized");
        _;
    }

    constructor(address agentAddress) {
        agent = ObsidianAgent(agentAddress);
        owner = msg.sender;
    }

    function setAuthorizedCaller(address caller, bool authorized) external onlyOwner {
        authorizedCallers[caller] = authorized;
    }

    /**
     * @dev Called by the Ritual Scheduler every X hours.
     * We pass a generic context string which the agent uses to evaluate the market.
     */
    function executeScheduledEvaluation(string memory marketContextSummary) external onlyAuthorized {
        string memory advice = agent.requestTradeAdvice(marketContextSummary);
        
        // In a fully autonomous setup, we'd parse this advice and automatically execute
        // trades via ObsidianPortfolio. For now, we emit the result for off-chain execution
        // or user review.
        emit ScheduledTaskExecuted(block.timestamp, advice);
    }
}
