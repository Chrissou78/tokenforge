// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title TokenLocker
 * @dev Lock ERC20 tokens with time-based release
 * Used by TokenForge platform for token/LP locking
 */
contract TokenLocker {
    struct Lock {
        address token;
        address owner;
        uint256 amount;
        uint256 unlockTime;
        bool withdrawn;
    }
    
    uint256 public lockCount;
    uint256 public constant LOCK_FEE_PERCENT = 50; // 0.5% (50/10000)
    uint256 public constant UNLOCK_FEE_PERCENT = 30; // 0.3% (30/10000)
    uint256 public constant EMERGENCY_UNLOCK_FEE = 300; // $300 equivalent in native token
    
    address public feeCollector;
    address public owner;
    
    mapping(uint256 => Lock) public locks;
    mapping(address => uint256[]) public userLocks;
    
    event TokensLocked(
        uint256 indexed lockId,
        address indexed token,
        address indexed owner,
        uint256 amount,
        uint256 unlockTime
    );
    
    event TokensUnlocked(
        uint256 indexed lockId,
        address indexed token,
        address indexed owner,
        uint256 amount
    );
    
    event EmergencyUnlock(
        uint256 indexed lockId,
        address indexed owner,
        uint256 amount,
        uint256 fee
    );
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor(address _feeCollector) {
        owner = msg.sender;
        feeCollector = _feeCollector != address(0) ? _feeCollector : msg.sender;
    }
    
    /**
     * @dev Lock tokens
     * @param token Token contract address
     * @param amount Amount to lock
     * @param unlockTime Unix timestamp when tokens can be unlocked
     */
    function lockTokens(
        address token,
        uint256 amount,
        uint256 unlockTime
    ) external payable returns (uint256) {
        require(token != address(0), "Invalid token");
        require(amount > 0, "Amount must be > 0");
        require(unlockTime > block.timestamp, "Unlock time must be in future");
        
        // Calculate lock fee (0.5%)
        uint256 fee = (amount * LOCK_FEE_PERCENT) / 10000;
        uint256 lockAmount = amount - fee;
        
        // Transfer tokens from user
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        
        // Transfer fee to collector
        if (fee > 0) {
            IERC20(token).transfer(feeCollector, fee);
        }
        
        // Create lock
        uint256 lockId = lockCount++;
        locks[lockId] = Lock({
            token: token,
            owner: msg.sender,
            amount: lockAmount,
            unlockTime: unlockTime,
            withdrawn: false
        });
        
        userLocks[msg.sender].push(lockId);
        
        emit TokensLocked(lockId, token, msg.sender, lockAmount, unlockTime);
        
        return lockId;
    }
    
    /**
     * @dev Unlock tokens after lock period expires
     * @param lockId ID of the lock
     */
    function unlockTokens(uint256 lockId) external {
        Lock storage lock = locks[lockId];
        
        require(lock.owner == msg.sender, "Not lock owner");
        require(!lock.withdrawn, "Already withdrawn");
        require(block.timestamp >= lock.unlockTime, "Still locked");
        
        lock.withdrawn = true;
        
        // Calculate unlock fee (0.3%)
        uint256 fee = (lock.amount * UNLOCK_FEE_PERCENT) / 10000;
        uint256 withdrawAmount = lock.amount - fee;
        
        // Transfer fee to collector
        if (fee > 0) {
            IERC20(lock.token).transfer(feeCollector, fee);
        }
        
        // Transfer tokens to owner
        IERC20(lock.token).transfer(msg.sender, withdrawAmount);
        
        emit TokensUnlocked(lockId, lock.token, msg.sender, withdrawAmount);
    }
    
    /**
     * @dev Emergency unlock (costs extra fee)
     * @param lockId ID of the lock
     */
    function emergencyUnlock(uint256 lockId) external payable {
        Lock storage lock = locks[lockId];
        
        require(lock.owner == msg.sender, "Not lock owner");
        require(!lock.withdrawn, "Already withdrawn");
        require(msg.value >= EMERGENCY_UNLOCK_FEE, "Insufficient emergency fee");
        
        lock.withdrawn = true;
        
        // Send emergency fee to collector
        payable(feeCollector).transfer(msg.value);
        
        // Transfer tokens to owner (no additional token fee for emergency)
        IERC20(lock.token).transfer(msg.sender, lock.amount);
        
        emit EmergencyUnlock(lockId, msg.sender, lock.amount, msg.value);
    }
    
    /**
     * @dev Get user's lock IDs
     */
    function getUserLocks(address user) external view returns (uint256[] memory) {
        return userLocks[user];
    }
    
    /**
     * @dev Get lock details
     */
    function getLock(uint256 lockId) external view returns (
        address token,
        address lockOwner,
        uint256 amount,
        uint256 unlockTime,
        bool withdrawn,
        bool canUnlock
    ) {
        Lock memory lock = locks[lockId];
        return (
            lock.token,
            lock.owner,
            lock.amount,
            lock.unlockTime,
            lock.withdrawn,
            block.timestamp >= lock.unlockTime && !lock.withdrawn
        );
    }
    
    /**
     * @dev Update fee collector
     */
    function setFeeCollector(address _feeCollector) external onlyOwner {
        require(_feeCollector != address(0), "Zero address");
        feeCollector = _feeCollector;
    }
    
    /**
     * @dev Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        owner = newOwner;
    }
}
