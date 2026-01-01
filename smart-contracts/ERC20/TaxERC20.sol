// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TaxERC20
 * @dev ERC20 token with configurable buy/sell taxes
 * Taxes collected go to treasury address
 */
contract TaxERC20 {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    
    address public owner;
    address public treasury;
    
    uint256 public buyTax = 5;  // 5% default
    uint256 public sellTax = 5; // 5% default
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => bool) public isExcludedFromTax;
    mapping(address => bool) public isPair; // DEX pairs
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event TaxCollected(address indexed from, uint256 amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _initialSupply,
        address _treasury
    ) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        owner = msg.sender;
        treasury = _treasury != address(0) ? _treasury : msg.sender;
        
        totalSupply = _initialSupply * 10**_decimals;
        balanceOf[msg.sender] = totalSupply;
        
        // Exclude owner and treasury from tax
        isExcludedFromTax[msg.sender] = true;
        isExcludedFromTax[treasury] = true;
        
        emit Transfer(address(0), msg.sender, totalSupply);
    }
    
    function transfer(address to, uint256 value) public returns (bool) {
        return _transfer(msg.sender, to, value);
    }
    
    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(allowance[from][msg.sender] >= value, "Insufficient allowance");
        allowance[from][msg.sender] -= value;
        return _transfer(from, to, value);
    }
    
    function _transfer(address from, address to, uint256 value) internal returns (bool) {
        require(to != address(0), "Transfer to zero address");
        require(balanceOf[from] >= value, "Insufficient balance");
        
        uint256 taxAmount = 0;
        
        // Calculate tax if not excluded
        if (!isExcludedFromTax[from] && !isExcludedFromTax[to]) {
            if (isPair[to]) {
                // Selling to DEX
                taxAmount = (value * sellTax) / 100;
            } else if (isPair[from]) {
                // Buying from DEX
                taxAmount = (value * buyTax) / 100;
            }
        }
        
        uint256 transferAmount = value - taxAmount;
        
        balanceOf[from] -= value;
        balanceOf[to] += transferAmount;
        
        if (taxAmount > 0) {
            balanceOf[treasury] += taxAmount;
            emit TaxCollected(from, taxAmount);
            emit Transfer(from, treasury, taxAmount);
        }
        
        emit Transfer(from, to, transferAmount);
        return true;
    }
    
    function approve(address spender, uint256 value) public returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
    
    // Admin functions
    
    function setTaxes(uint256 _buyTax, uint256 _sellTax) external onlyOwner {
        require(_buyTax <= 25 && _sellTax <= 25, "Tax too high"); // Max 25%
        buyTax = _buyTax;
        sellTax = _sellTax;
    }
    
    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Zero address");
        treasury = _treasury;
    }
    
    function excludeFromTax(address account, bool excluded) external onlyOwner {
        isExcludedFromTax[account] = excluded;
    }
    
    function setPair(address pair, bool isPairAddress) external onlyOwner {
        isPair[pair] = isPairAddress;
    }
    
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        owner = newOwner;
    }
}
