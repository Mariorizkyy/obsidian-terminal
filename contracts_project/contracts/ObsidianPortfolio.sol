// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ObsidianPortfolio
 * @dev Manages user balances (uSDCR) and their virtual portfolio.
 */
contract ObsidianPortfolio {
    // 10,000 uSDCR with 18 decimals
    uint256 public constant INITIAL_BALANCE = 10000 * 10**18;

    struct Asset {
        string symbol;
        uint256 amount;
        uint256 avgPrice;
    }

    struct UserPortfolio {
        uint256 balance; // uSDCR
        bool isInitialized;
        address owner;
        // Symbol -> Asset mapping for holdings
    }

    mapping(address => UserPortfolio) public portfolios;
    mapping(address => mapping(string => Asset)) public userAssets;
    mapping(address => string[]) public userAssetSymbols;

    event PortfolioInitialized(address indexed user, uint256 initialBalance);
    event TradeExecuted(address indexed user, string symbol, uint256 amount, uint256 price, bool isBuy);

    /**
     * @dev Initialize a new portfolio for the caller with 10,000 uSDCR
     */
    function initializePortfolio() external {
        require(!portfolios[msg.sender].isInitialized, "Portfolio already initialized");

        portfolios[msg.sender].balance = INITIAL_BALANCE;
        portfolios[msg.sender].isInitialized = true;
        portfolios[msg.sender].owner = msg.sender;

        emit PortfolioInitialized(msg.sender, INITIAL_BALANCE);
    }

    /**
     * @dev Buy an asset using uSDCR. In reality, prices come from Oracle or off-chain data signed.
     * For simulation, we trust the caller's price (or the agent).
     */
    function buyAsset(string memory symbol, uint256 amount, uint256 price) external {
        require(portfolios[msg.sender].isInitialized, "Not initialized");
        
        uint256 cost = (amount * price) / 10**18;
        require(portfolios[msg.sender].balance >= cost, "Insufficient uSDCR balance");

        portfolios[msg.sender].balance -= cost;

        Asset storage asset = userAssets[msg.sender][symbol];
        if (asset.amount == 0) {
            asset.symbol = symbol;
            userAssetSymbols[msg.sender].push(symbol);
        }

        // Calculate new average price
        uint256 totalValue = (asset.amount * asset.avgPrice) + (amount * price);
        asset.amount += amount;
        asset.avgPrice = totalValue / asset.amount;

        emit TradeExecuted(msg.sender, symbol, amount, price, true);
    }

    /**
     * @dev Sell an asset to get uSDCR.
     */
    function sellAsset(string memory symbol, uint256 amount, uint256 price) external {
        require(portfolios[msg.sender].isInitialized, "Not initialized");
        
        Asset storage asset = userAssets[msg.sender][symbol];
        require(asset.amount >= amount, "Insufficient asset balance");

        uint256 revenue = (amount * price) / 10**18;
        
        asset.amount -= amount;
        portfolios[msg.sender].balance += revenue;

        emit TradeExecuted(msg.sender, symbol, amount, price, false);
    }

    function getBalance(address user) external view returns (uint256) {
        return portfolios[user].balance;
    }

    function getAsset(address user, string memory symbol) external view returns (Asset memory) {
        return userAssets[user][symbol];
    }
}
