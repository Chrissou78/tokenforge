/**
 * TokenForge Locker Address Helper
 * Resolves locker contract addresses for any supported chain
 */

// Official TokenLocker addresses (UPDATE AFTER DEPLOYMENT)
const LOCKER_ADDRESSES = {
  // Mainnet
  ethereum: {
    chainId: 1,
    locker: "0x0000000000000000000000000000000000000000", // DEPLOY & UPDATE
    registry: "0x0000000000000000000000000000000000000000", // DEPLOY & UPDATE
    explorer: "https://etherscan.io"
  },
  polygon: {
    chainId: 137,
    locker: "0x0000000000000000000000000000000000000000",
    registry: "0x0000000000000000000000000000000000000000",
    explorer: "https://polygonscan.com"
  },
  bsc: {
    chainId: 56,
    locker: "0x0000000000000000000000000000000000000000",
    registry: "0x0000000000000000000000000000000000000000",
    explorer: "https://bscscan.com"
  },
  arbitrum: {
    chainId: 42161,
    locker: "0x0000000000000000000000000000000000000000",
    registry: "0x0000000000000000000000000000000000000000",
    explorer: "https://arbiscan.io"
  },
  optimism: {
    chainId: 10,
    locker: "0x0000000000000000000000000000000000000000",
    registry: "0x0000000000000000000000000000000000000000",
    explorer: "https://optimistic.etherscan.io"
  },
  base: {
    chainId: 8453,
    locker: "0x0000000000000000000000000000000000000000",
    registry: "0x0000000000000000000000000000000000000000",
    explorer: "https://basescan.org"
  },
  avalanche: {
    chainId: 43114,
    locker: "0x0000000000000000000000000000000000000000",
    registry: "0x0000000000000000000000000000000000000000",
    explorer: "https://snowtrace.io"
  },
  fantom: {
    chainId: 250,
    locker: "0x0000000000000000000000000000000000000000",
    registry: "0x0000000000000000000000000000000000000000",
    explorer: "https://ftmscan.com"
  },
  
  // Testnets
  goerli: {
    chainId: 5,
    locker: "0x0000000000000000000000000000000000000000",
    registry: "0x0000000000000000000000000000000000000000",
    explorer: "https://goerli.etherscan.io"
  },
  mumbai: {
    chainId: 80001,
    locker: "0x0000000000000000000000000000000000000000",
    registry: "0x0000000000000000000000000000000000000000",
    explorer: "https://mumbai.polygonscan.com"
  }
};

// TokenLocker ABI (minimal for common operations)
const LOCKER_ABI = [
  "function lockTokens(address token, uint256 amount, uint256 unlockTime) external payable returns (uint256)",
  "function unlockTokens(uint256 lockId) external",
  "function emergencyUnlock(uint256 lockId) external payable",
  "function getUserLocks(address user) external view returns (uint256[])",
  "function getLock(uint256 lockId) external view returns (address token, address owner, uint256 amount, uint256 unlockTime, bool withdrawn, bool canUnlock)",
  "function lockCount() external view returns (uint256)",
  "event TokensLocked(uint256 indexed lockId, address indexed token, address indexed owner, uint256 amount, uint256 unlockTime)",
  "event TokensUnlocked(uint256 indexed lockId, address indexed token, address indexed owner, uint256 amount)",
  "event EmergencyUnlock(uint256 indexed lockId, address indexed owner, uint256 amount, uint256 fee)"
];

// LockerRegistry ABI
const REGISTRY_ABI = [
  "function getOfficialLocker() external view returns (address)",
  "function getOfficialLockerForChain(uint256 chainId) external view returns (address)",
  "function isValidLocker(uint256 chainId, address lockerAddress) external view returns (bool)",
  "function getLockerInfo(uint256 chainId, address lockerAddress) external view returns (tuple(address lockerAddress, string version, uint256 deployedAt, bool isActive, uint256 totalLocks, uint256 totalValueLocked))"
];

/**
 * Get locker address for a chain
 * @param {string} chainName - Chain name (e.g., 'ethereum', 'polygon')
 * @returns {string|null} - Locker contract address or null
 */
function getLockerAddress(chainName) {
  const config = LOCKER_ADDRESSES[chainName.toLowerCase()];
  return config ? config.locker : null;
}

/**
 * Get locker address by chain ID
 * @param {number} chainId - Chain ID
 * @returns {string|null} - Locker contract address or null
 */
function getLockerAddressByChainId(chainId) {
  for (const [chain, config] of Object.entries(LOCKER_ADDRESSES)) {
    if (config.chainId === chainId) {
      return config.locker;
    }
  }
  return null;
}

/**
 * Get registry address for a chain
 * @param {string} chainName - Chain name
 * @returns {string|null} - Registry contract address or null
 */
function getRegistryAddress(chainName) {
  const config = LOCKER_ADDRESSES[chainName.toLowerCase()];
  return config ? config.registry : null;
}

/**
 * Get block explorer URL
 * @param {string} chainName - Chain name
 * @param {string} address - Contract address
 * @returns {string} - Full explorer URL
 */
function getExplorerUrl(chainName, address) {
  const config = LOCKER_ADDRESSES[chainName.toLowerCase()];
  if (!config) return '#';
  return `${config.explorer}/address/${address}`;
}

/**
 * Check if locker is deployed on chain
 * @param {string} chainName - Chain name
 * @returns {boolean} - True if deployed
 */
function isLockerDeployed(chainName) {
  const address = getLockerAddress(chainName);
  return address && address !== '0x0000000000000000000000000000000000000000';
}

/**
 * Get all supported chains with deployed lockers
 * @returns {Array} - Array of chain names
 */
function getSupportedChains() {
  return Object.keys(LOCKER_ADDRESSES).filter(chain => isLockerDeployed(chain));
}

/**
 * Get chain config
 * @param {string} chainName - Chain name
 * @returns {Object|null} - Chain configuration
 */
function getChainConfig(chainName) {
  return LOCKER_ADDRESSES[chainName.toLowerCase()] || null;
}

/**
 * Verify locker address matches official address
 * @param {string} chainName - Chain name
 * @param {string} address - Address to verify
 * @returns {boolean} - True if matches official
 */
function verifyLockerAddress(chainName, address) {
  const official = getLockerAddress(chainName);
  return official && official.toLowerCase() === address.toLowerCase();
}

/**
 * Get locker contract instance (requires ethers.js)
 * @param {string} chainName - Chain name
 * @param {Object} providerOrSigner - Ethers provider or signer
 * @returns {Object|null} - Contract instance or null
 */
function getLockerContract(chainName, providerOrSigner) {
  if (typeof ethers === 'undefined') {
    console.error('ethers.js not loaded');
    return null;
  }
  
  const address = getLockerAddress(chainName);
  if (!address) return null;
  
  return new ethers.Contract(address, LOCKER_ABI, providerOrSigner);
}

/**
 * Get registry contract instance (requires ethers.js)
 * @param {string} chainName - Chain name
 * @param {Object} provider - Ethers provider
 * @returns {Object|null} - Contract instance or null
 */
function getRegistryContract(chainName, provider) {
  if (typeof ethers === 'undefined') {
    console.error('ethers.js not loaded');
    return null;
  }
  
  const address = getRegistryAddress(chainName);
  if (!address) return null;
  
  return new ethers.Contract(address, REGISTRY_ABI, provider);
}

/**
 * Fetch locker address from registry (on-chain query)
 * @param {string} chainName - Chain name
 * @param {Object} provider - Ethers provider
 * @returns {Promise<string>} - Locker address from registry
 */
async function fetchLockerAddressFromRegistry(chainName, provider) {
  try {
    const registry = getRegistryContract(chainName, provider);
    if (!registry) return null;
    
    const address = await registry.getOfficialLocker();
    return address;
  } catch (error) {
    console.error('Error fetching from registry:', error);
    return null;
  }
}

/**
 * Get user's locks
 * @param {string} chainName - Chain name
 * @param {string} userAddress - User's wallet address
 * @param {Object} provider - Ethers provider
 * @returns {Promise<Array>} - Array of lock IDs
 */
async function getUserLocks(chainName, userAddress, provider) {
  try {
    const locker = getLockerContract(chainName, provider);
    if (!locker) return [];
    
    const lockIds = await locker.getUserLocks(userAddress);
    return lockIds.map(id => id.toString());
  } catch (error) {
    console.error('Error getting user locks:', error);
    return [];
  }
}

/**
 * Get lock details
 * @param {string} chainName - Chain name
 * @param {number} lockId - Lock ID
 * @param {Object} provider - Ethers provider
 * @returns {Promise<Object|null>} - Lock details
 */
async function getLockDetails(chainName, lockId, provider) {
  try {
    const locker = getLockerContract(chainName, provider);
    if (!locker) return null;
    
    const lock = await locker.getLock(lockId);
    
    return {
      token: lock.token,
      owner: lock.owner,
      amount: lock.amount.toString(),
      unlockTime: new Date(lock.unlockTime * 1000),
      withdrawn: lock.withdrawn,
      canUnlock: lock.canUnlock
    };
  } catch (error) {
    console.error('Error getting lock details:', error);
    return null;
  }
}

/**
 * Export for use in browser or Node.js
 */
if (typeof module !== 'undefined' && module.exports) {
  // Node.js
  module.exports = {
    LOCKER_ADDRESSES,
    LOCKER_ABI,
    REGISTRY_ABI,
    getLockerAddress,
    getLockerAddressByChainId,
    getRegistryAddress,
    getExplorerUrl,
    isLockerDeployed,
    getSupportedChains,
    getChainConfig,
    verifyLockerAddress,
    getLockerContract,
    getRegistryContract,
    fetchLockerAddressFromRegistry,
    getUserLocks,
    getLockDetails
  };
} else {
  // Browser
  window.TokenForgeLocker = {
    LOCKER_ADDRESSES,
    LOCKER_ABI,
    REGISTRY_ABI,
    getLockerAddress,
    getLockerAddressByChainId,
    getRegistryAddress,
    getExplorerUrl,
    isLockerDeployed,
    getSupportedChains,
    getChainConfig,
    verifyLockerAddress,
    getLockerContract,
    getRegistryContract,
    fetchLockerAddressFromRegistry,
    getUserLocks,
    getLockDetails
  };
}

console.log('✅ TokenForge Locker Helper loaded');
