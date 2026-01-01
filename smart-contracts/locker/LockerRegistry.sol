// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LockerRegistry
 * @dev Central registry for all TokenLocker contract deployments
 * Tracks locker addresses across chains and provides discovery
 */
contract LockerRegistry {
    struct LockerInfo {
        address lockerAddress;
        address deployer;
        uint256 deployedAt;
        uint256 chainId;
        string version;
        bool isActive;
    }
    
    // Registry owner
    address public owner;
    
    // Official TokenForge locker addresses per chain
    mapping(uint256 => address) public officialLockers;
    
    // All registered lockers
    mapping(address => LockerInfo) public lockers;
    address[] public lockerList;
    
    // User deployed lockers
    mapping(address => address[]) public userLockers;
    
    // Chain ID to locker addresses
    mapping(uint256 => address[]) public chainLockers;
    
    event LockerRegistered(
        address indexed lockerAddress,
        address indexed deployer,
        uint256 chainId,
        string version
    );
    
    event OfficialLockerSet(
        uint256 indexed chainId,
        address indexed lockerAddress
    );
    
    event LockerDeactivated(address indexed lockerAddress);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Register a new locker contract
     */
    function registerLocker(
        address lockerAddress,
        string memory version
    ) external returns (bool) {
        require(lockerAddress != address(0), "Zero address");
        require(lockers[lockerAddress].lockerAddress == address(0), "Already registered");
        
        uint256 chainId = block.chainid;
        
        LockerInfo memory info = LockerInfo({
            lockerAddress: lockerAddress,
            deployer: msg.sender,
            deployedAt: block.timestamp,
            chainId: chainId,
            version: version,
            isActive: true
        });
        
        lockers[lockerAddress] = info;
        lockerList.push(lockerAddress);
        userLockers[msg.sender].push(lockerAddress);
        chainLockers[chainId].push(lockerAddress);
        
        emit LockerRegistered(lockerAddress, msg.sender, chainId, version);
        return true;
    }
    
    /**
     * @dev Set official TokenForge locker for a chain
     */
    function setOfficialLocker(
        uint256 chainId,
        address lockerAddress
    ) external onlyOwner {
        require(lockerAddress != address(0), "Zero address");
        officialLockers[chainId] = lockerAddress;
        emit OfficialLockerSet(chainId, lockerAddress);
    }
    
    /**
     * @dev Get official locker for current chain
     */
    function getOfficialLocker() external view returns (address) {
        return officialLockers[block.chainid];
    }
    
    /**
     * @dev Get official locker for specific chain
     */
    function getOfficialLockerForChain(uint256 chainId) external view returns (address) {
        return officialLockers[chainId];
    }
    
    /**
     * @dev Get all lockers deployed by user
     */
    function getUserLockers(address user) external view returns (address[] memory) {
        return userLockers[user];
    }
    
    /**
     * @dev Get all lockers on specific chain
     */
    function getChainLockers(uint256 chainId) external view returns (address[] memory) {
        return chainLockers[chainId];
    }
    
    /**
     * @dev Get locker info
     */
    function getLockerInfo(address lockerAddress) external view returns (
        address deployer,
        uint256 deployedAt,
        uint256 chainId,
        string memory version,
        bool isActive
    ) {
        LockerInfo memory info = lockers[lockerAddress];
        return (
            info.deployer,
            info.deployedAt,
            info.chainId,
            info.version,
            info.isActive
        );
    }
    
    /**
     * @dev Get total number of registered lockers
     */
    function getTotalLockers() external view returns (uint256) {
        return lockerList.length;
    }
    
    /**
     * @dev Deactivate a locker (emergency only)
     */
    function deactivateLocker(address lockerAddress) external onlyOwner {
        require(lockers[lockerAddress].lockerAddress != address(0), "Not registered");
        lockers[lockerAddress].isActive = false;
        emit LockerDeactivated(lockerAddress);
    }
    
    /**
     * @dev Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        owner = newOwner;
    }
}
