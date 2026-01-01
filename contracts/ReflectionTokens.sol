// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ============================================================================
// REFLECTION TOKEN - ALL VARIANTS
// Constructor: (string name, string symbol, uint8 decimals, uint256 totalSupply, uint256 reflectionRate)
// reflectionRate is in basis points (100 = 1%, 1000 = 10%)
// ============================================================================

/**
 * @title Reflection_Basic
 * @dev Token with automatic holder rewards on every transfer
 */
contract Reflection_Basic {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    uint256 public reflectionRate; // in basis points (100 = 1%)
    uint256 public totalReflections;
    address public owner;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event ReflectionDistributed(uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _totalSupply, uint256 _reflectionRate) {
        require(_reflectionRate <= 10000, "Reflection rate too high");
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;
        reflectionRate = _reflectionRate;
        owner = msg.sender;
        balanceOf[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
        emit OwnershipTransferred(address(0), msg.sender);
    }
    
    function transfer(address to, uint256 value) public returns (bool) {
        require(to != address(0), "Invalid address");
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        
        uint256 reflectionAmount = (value * reflectionRate) / 10000;
        uint256 netAmount = value - reflectionAmount;
        
        balanceOf[msg.sender] -= value;
        balanceOf[to] += netAmount;
        
        if (reflectionAmount > 0) {
            _distributeReflection(reflectionAmount);
        }
        
        emit Transfer(msg.sender, to, netAmount);
        return true;
    }
    
    function approve(address spender, uint256 value) public returns (bool) {
        require(spender != address(0), "Invalid address");
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(from != address(0), "Invalid from address");
        require(to != address(0), "Invalid to address");
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Insufficient allowance");
        
        uint256 reflectionAmount = (value * reflectionRate) / 10000;
        uint256 netAmount = value - reflectionAmount;
        
        balanceOf[from] -= value;
        balanceOf[to] += netAmount;
        allowance[from][msg.sender] -= value;
        
        if (reflectionAmount > 0) {
            _distributeReflection(reflectionAmount);
        }
        
        emit Transfer(from, to, netAmount);
        return true;
    }
    
    function _distributeReflection(uint256 amount) internal {
        // Simplified reflection: reduce total supply (deflationary)
        // In production, this would distribute proportionally to all holders
        totalSupply -= amount;
        totalReflections += amount;
        emit ReflectionDistributed(amount);
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

/**
 * @title Reflection_Excludable
 * @dev Reflection token with ability to exclude addresses from rewards
 */
contract Reflection_Excludable {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    uint256 public reflectionRate;
    uint256 public totalReflections;
    address public owner;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => bool) public isExcludedFromReward;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event ReflectionDistributed(uint256 amount);
    event ExcludedFromReward(address indexed account);
    event IncludedInReward(address indexed account);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _totalSupply, uint256 _reflectionRate) {
        require(_reflectionRate <= 10000, "Reflection rate too high");
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;
        reflectionRate = _reflectionRate;
        owner = msg.sender;
        balanceOf[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
        emit OwnershipTransferred(address(0), msg.sender);
    }
    
    function transfer(address to, uint256 value) public returns (bool) {
        require(to != address(0), "Invalid address");
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        
        uint256 reflectionAmount = 0;
        if (!isExcludedFromReward[msg.sender] && !isExcludedFromReward[to]) {
            reflectionAmount = (value * reflectionRate) / 10000;
        }
        uint256 netAmount = value - reflectionAmount;
        
        balanceOf[msg.sender] -= value;
        balanceOf[to] += netAmount;
        
        if (reflectionAmount > 0) {
            _distributeReflection(reflectionAmount);
        }
        
        emit Transfer(msg.sender, to, netAmount);
        return true;
    }
    
    function approve(address spender, uint256 value) public returns (bool) {
        require(spender != address(0), "Invalid address");
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(from != address(0), "Invalid from address");
        require(to != address(0), "Invalid to address");
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Insufficient allowance");
        
        uint256 reflectionAmount = 0;
        if (!isExcludedFromReward[from] && !isExcludedFromReward[to]) {
            reflectionAmount = (value * reflectionRate) / 10000;
        }
        uint256 netAmount = value - reflectionAmount;
        
        balanceOf[from] -= value;
        balanceOf[to] += netAmount;
        allowance[from][msg.sender] -= value;
        
        if (reflectionAmount > 0) {
            _distributeReflection(reflectionAmount);
        }
        
        emit Transfer(from, to, netAmount);
        return true;
    }
    
    function _distributeReflection(uint256 amount) internal {
        totalSupply -= amount;
        totalReflections += amount;
        emit ReflectionDistributed(amount);
    }
    
    function excludeFromReward(address account) public onlyOwner {
        require(!isExcludedFromReward[account], "Already excluded");
        isExcludedFromReward[account] = true;
        emit ExcludedFromReward(account);
    }
    
    function includeInReward(address account) public onlyOwner {
        require(isExcludedFromReward[account], "Already included");
        isExcludedFromReward[account] = false;
        emit IncludedInReward(account);
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

/**
 * @title Reflection_Pausable
 * @dev Reflection token with pausable functionality
 */
contract Reflection_Pausable {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    uint256 public reflectionRate;
    uint256 public totalReflections;
    address public owner;
    bool public paused;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event ReflectionDistributed(uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event Paused(address account);
    event Unpaused(address account);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }
    
    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _totalSupply, uint256 _reflectionRate) {
        require(_reflectionRate <= 10000, "Reflection rate too high");
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;
        reflectionRate = _reflectionRate;
        owner = msg.sender;
        paused = false;
        balanceOf[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
        emit OwnershipTransferred(address(0), msg.sender);
    }
    
    function transfer(address to, uint256 value) public whenNotPaused returns (bool) {
        require(to != address(0), "Invalid address");
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        
        uint256 reflectionAmount = (value * reflectionRate) / 10000;
        uint256 netAmount = value - reflectionAmount;
        
        balanceOf[msg.sender] -= value;
        balanceOf[to] += netAmount;
        
        if (reflectionAmount > 0) {
            _distributeReflection(reflectionAmount);
        }
        
        emit Transfer(msg.sender, to, netAmount);
        return true;
    }
    
    function approve(address spender, uint256 value) public whenNotPaused returns (bool) {
        require(spender != address(0), "Invalid address");
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 value) public whenNotPaused returns (bool) {
        require(from != address(0), "Invalid from address");
        require(to != address(0), "Invalid to address");
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Insufficient allowance");
        
        uint256 reflectionAmount = (value * reflectionRate) / 10000;
        uint256 netAmount = value - reflectionAmount;
        
        balanceOf[from] -= value;
        balanceOf[to] += netAmount;
        allowance[from][msg.sender] -= value;
        
        if (reflectionAmount > 0) {
            _distributeReflection(reflectionAmount);
        }
        
        emit Transfer(from, to, netAmount);
        return true;
    }
    
    function _distributeReflection(uint256 amount) internal {
        totalSupply -= amount;
        totalReflections += amount;
        emit ReflectionDistributed(amount);
    }
    
    function pause() public onlyOwner {
        require(!paused, "Already paused");
        paused = true;
        emit Paused(msg.sender);
    }
    
    function unpause() public onlyOwner {
        require(paused, "Not paused");
        paused = false;
        emit Unpaused(msg.sender);
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
