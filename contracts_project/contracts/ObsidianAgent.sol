// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ObsidianPortfolio.sol";

/**
 * @title ObsidianAgent
 * @dev Interacts with Ritual LLM precompiles to recommend trades based on market data.
 */
contract ObsidianAgent {
    ObsidianPortfolio public portfolio;
    
    // Ritual LLM Precompile Address
    address constant LLM_PRECOMPILE = 0x0000000000000000000000000000000000000802;

    event AgentAdviceRequested(address indexed user, string prompt);
    event AgentAdviceReceived(address indexed user, string advice);

    constructor(address portfolioAddress) {
        portfolio = ObsidianPortfolio(portfolioAddress);
    }

    /**
     * @dev Simple interface for LLM precompile based on standard Ritual documentation
     */
    function _callLLM(string memory prompt) internal returns (string memory) {
        // ABI encoding for the LLM precompile call.
        // Assuming a standard completion signature: `complete(string)`
        bytes memory callData = abi.encodeWithSignature("complete(string)", prompt);
        
        (bool success, bytes memory resultData) = LLM_PRECOMPILE.call(callData);
        if (!success) {
            return "Error: LLM Precompile call failed. The agent is currently unavailable.";
        }
        
        // Assuming the precompile returns a string
        return abi.decode(resultData, (string));
    }

    /**
     * @dev Users request advice by passing current market data context
     */
    function requestTradeAdvice(string memory marketContext) external returns (string memory) {
        emit AgentAdviceRequested(msg.sender, marketContext);
        
        // On a live testnet, we would use the actual precompile.
        // For local development without Ritual node, we might simulate or catch the error.
        
        // To prevent full reverts during UI testing if precompile is missing:
        string memory advice;
        if (LLM_PRECOMPILE.code.length > 0) {
            advice = _callLLM(marketContext);
        } else {
            advice = "Simulation: Based on the provided market data, I recommend holding Blue Chips. Volatility is elevated.";
        }
        
        emit AgentAdviceReceived(msg.sender, advice);
        return advice;
    }
}
