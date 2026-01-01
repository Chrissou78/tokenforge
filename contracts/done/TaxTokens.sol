// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ============================================================================
// TAX TOKEN - ALL VARIANTS
// Constructor: (string name, string symbol, uint8 decimals, uint256 totalSupply, uint256 taxRate, address taxRecipient)
// taxRate is in basis points (100 = 1%, 1000 = 10%)
// ============================================================================

/**
 * @title Tax_Basic
 * @dev Token with fixed transfer tax
 */
contract Tax_Basic {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    uint256 public taxRate; // in basis points (100 = 1%)
    address public taxRecipient;
    address public owner;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event TaxCollected(address indexed from, address indexed recipient, uint256 value);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _totalSupply, uint256 _taxRate, address _taxRecipient) {
        require(_taxRate <= 10000, "Tax rate too high"); // max 100%
        require(_taxRecipient != address(0), "Invalid tax recipient");
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;
        taxRate = _taxRate;
        taxRecipient = _taxRecipient;
        owner = msg.sender;
        balanceOf[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
        emit OwnershipTransferred(address(0), msg.sender);
    }
    
    function transfer(address to, uint256 value) public returns (bool) {
        require(to != address(0), "Invalid address");
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        
        uint256 taxAmount = (value * taxRate) / 10000;
        uint256 netAmount = value - taxAmount;
        
        balanceOf[msg.sender] -= value;
        balanceOf[to] += netAmount;
        
        if (taxAmount > 0) {
            balanceOf[taxRecipient] += taxAmount;
            emit TaxCollected(msg.sender, taxRecipient, taxAmount);
            emit Transfer(msg.sender, taxRecipient, taxAmount);
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
        
        uint256 taxAmount = (value * taxRate) / 10000;
        uint256 netAmount = value - taxAmount;
        
        balanceOf[from] -= value;
        balanceOf[to] += netAmount;
        allowance[from][msg.sender] -= value;
        
        if (taxAmount > 0) {
            balanceOf[taxRecipient] += taxAmount;
            emit TaxCollected(from, taxRecipient, taxAmount);
            emit Transfer(from, taxRecipient, taxAmount);
        }
        
        emit Transfer(from, to, netAmount);
        return true;
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

/**
 * @title Tax_Adjustable
 * @dev Tax token with adjustable tax rate and recipient
 */
contract Tax_Adjustable {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    uint256 public taxRate;
    address public taxRecipient;
    address public owner;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event TaxCollected(address indexed from, address indexed recipient, uint256 value);
    event TaxRateUpdated(uint256 oldRate, uint256 newRate);
    event TaxRecipientUpdated(address indexed oldRecipient, address indexed newRecipient);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _totalSupply, uint256 _taxRate, address _taxRecipient) {
        require(_taxRate <= 10000, "Tax rate too high");
        require(_taxRecipient != address(0), "Invalid tax recipient");
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;
        taxRate = _taxRate;
        taxRecipient = _taxRecipient;
        owner = msg.sender;
        balanceOf[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
        emit OwnershipTransferred(address(0), msg.sender);
    }
    
    function transfer(address to, uint256 value) public returns (bool) {
        require(to != address(0), "Invalid address");
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        
        uint256 taxAmount = (value * taxRate) / 10000;
        uint256 netAmount = value - taxAmount;
        
        balanceOf[msg.sender] -= value;
        balanceOf[to] += netAmount;
        
        if (taxAmount > 0) {
            balanceOf[taxRecipient] += taxAmount;
            emit TaxCollected(msg.sender, taxRecipient, taxAmount);
            emit Transfer(msg.sender, taxRecipient, taxAmount);
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
        
        uint256 taxAmount = (value * taxRate) / 10000;
        uint256 netAmount = value - taxAmount;
        
        balanceOf[from] -= value;
        balanceOf[to] += netAmount;
        allowance[from][msg.sender] -= value;
        
        if (taxAmount > 0) {
            balanceOf[taxRecipient] += taxAmount;
            emit TaxCollected(from, taxRecipient, taxAmount);
            emit Transfer(from, taxRecipient, taxAmount);
        }
        
        emit Transfer(from, to, netAmount);
        return true;
    }
    
    function setTaxRate(uint256 newRate) public onlyOwner {
        require(newRate <= 10000, "Tax rate too high");
        uint256 oldRate = taxRate;
        taxRate = newRate;
        emit TaxRateUpdated(oldRate, newRate);
    }
    
    function setTaxRecipient(address newRecipient) public onlyOwner {
        require(newRecipient != address(0), "Invalid address");
        address oldRecipient = taxRecipient;
        taxRecipient = newRecipient;
        emit TaxRecipientUpdated(oldRecipient, newRecipient);
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

/**
 * @title Tax_Pausable
 * @dev Tax token with pausable functionality
 */
contract Tax_Pausable {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    uint256 public taxRate;
    address public taxRecipient;
    address public owner;
    bool public paused;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event TaxCollected(address indexed from, address indexed recipient, uint256 value);
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
    
    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _totalSupply, uint256 _taxRate, address _taxRecipient) {
        require(_taxRate <= 10000, "Tax rate too high");
        require(_taxRecipient != address(0), "Invalid tax recipient");
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;
        taxRate = _taxRate;
        taxRecipient = _taxRecipient;
        owner = msg.sender;
        paused = false;
        balanceOf[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
        emit OwnershipTransferred(address(0), msg.sender);
    }
    
    function transfer(address to, uint256 value) public whenNotPaused returns (bool) {
        require(to != address(0), "Invalid address");
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        
        uint256 taxAmount = (value * taxRate) / 10000;
        uint256 netAmount = value - taxAmount;
        
        balanceOf[msg.sender] -= value;
        balanceOf[to] += netAmount;
        
        if (taxAmount > 0) {
            balanceOf[taxRecipient] += taxAmount;
            emit TaxCollected(msg.sender, taxRecipient, taxAmount);
            emit Transfer(msg.sender, taxRecipient, taxAmount);
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
        
        uint256 taxAmount = (value * taxRate) / 10000;
        uint256 netAmount = value - taxAmount;
        
        balanceOf[from] -= value;
        balanceOf[to] += netAmount;
        allowance[from][msg.sender] -= value;
        
        if (taxAmount > 0) {
            balanceOf[taxRecipient] += taxAmount;
            emit TaxCollected(from, taxRecipient, taxAmount);
            emit Transfer(from, taxRecipient, taxAmount);
        }
        
        emit Transfer(from, to, netAmount);
        return true;
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

/**
 * @title Tax_Burnable
 * @dev Tax token with burning capability
 */
contract Tax_Burnable {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    uint256 public taxRate;
    address public taxRecipient;
    address public owner;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event TaxCollected(address indexed from, address indexed recipient, uint256 value);
    event Burn(address indexed from, uint256 value);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _totalSupply, uint256 _taxRate, address _taxRecipient) {
        require(_taxRate <= 10000, "Tax rate too high");
        require(_taxRecipient != address(0), "Invalid tax recipient");
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;
        taxRate = _taxRate;
        taxRecipient = _taxRecipient;
        owner = msg.sender;
        balanceOf[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
        emit OwnershipTransferred(address(0), msg.sender);
    }
    
    function transfer(address to, uint256 value) public returns (bool) {
        require(to != address(0), "Invalid address");
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        
        uint256 taxAmount = (value * taxRate) / 10000;
        uint256 netAmount = value - taxAmount;
        
        balanceOf[msg.sender] -= value;
        balanceOf[to] += netAmount;
        
        if (taxAmount > 0) {
            balanceOf[taxRecipient] += taxAmount;
            emit TaxCollected(msg.sender, taxRecipient, taxAmount);
            emit Transfer(msg.sender, taxRecipient, taxAmount);
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
        
        uint256 taxAmount = (value * taxRate) / 10000;
        uint256 netAmount = value - taxAmount;
        
        balanceOf[from] -= value;
        balanceOf[to] += netAmount;
        allowance[from][msg.sender] -= value;
        
        if (taxAmount > 0) {
            balanceOf[taxRecipient] += taxAmount;
            emit TaxCollected(from, taxRecipient, taxAmount);
            emit Transfer(from, taxRecipient, taxAmount);
        }
        
        emit Transfer(from, to, netAmount);
        return true;
    }
    
    function burn(uint256 value) public returns (bool) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        balanceOf[msg.sender] -= value;
        totalSupply -= value;
        emit Burn(msg.sender, value);
        emit Transfer(msg.sender, address(0), value);
        return true;
    }
    
    function burnFrom(address from, uint256 value) public returns (bool) {
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Insufficient allowance");
        balanceOf[from] -= value;
        totalSupply -= value;
        allowance[from][msg.sender] -= value;
        emit Burn(from, value);
        emit Transfer(from, address(0), value);
        return true;
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
