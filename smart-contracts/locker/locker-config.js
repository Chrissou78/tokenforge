/**
 * TokenForge Locker Contract Addresses
 * Update these addresses after deployment to each chain
 */

// Official TokenForge Locker addresses per chain
export const LOCKER_ADDRESSES = {
  // Ethereum Mainnet
  ethereum: {
    chainId: 1,
    name: 'Ethereum',
    locker: '0x0000000000000000000000000000000000000000', // TODO: Update after deployment
    registry: '0x0000000000000000000000000000000000000000', // TODO: Update after deployment
    explorer: 'https://etherscan.io',
    rpc: 'https://eth.llamarpc.com'
  },
  
  // Polygon
  polygon: {
    chainId: 137,
    name: 'Polygon',
    locker: '0x0000000000000000000000000000000000000000', // TODO: Update after deployment
    registry: '0x0000000000000000000000000000000000000000', // TODO: Update after deployment
    explorer: 'https://polygonscan.com',
    rpc: 'https://polygon-rpc.com'
  },
  
  // Binance Smart Chain
  bsc: {
    chainId: 56,
    name: 'BNB Smart Chain',
    locker: '0x0000000000000000000000000000000000000000', // TODO: Update after deployment
    registry: '0x0000000000000000000000000000000000000000', // TODO: Update after deployment
    explorer: 'https://bscscan.com',
    rpc: 'https://bsc-dataseed.binance.org'
  },
  
  // Arbitrum One
  arbitrum: {
    chainId: 42161,
    name: 'Arbitrum One',
    locker: '0x0000000000000000000000000000000000000000', // TODO: Update after deployment
    registry: '0x0000000000000000000000000000000000000000', // TODO: Update after deployment
    explorer: 'https://arbiscan.io',
    rpc: 'https://arb1.arbitrum.io/rpc'
  },
  
  // Optimism
  optimism: {
    chainId: 10,
    name: 'Optimism',
    locker: '0x0000000000000000000000000000000000000000', // TODO: Update after deployment
    registry: '0x0000000000000000000000000000000000000000', // TODO: Update after deployment
    explorer: 'https://optimistic.etherscan.io',
    rpc: 'https://mainnet.optimism.io'
  },
  
  // Base
  base: {
    chainId: 8453,
    name: 'Base',
    locker: '0x0000000000000000000000000000000000000000', // TODO: Update after deployment
    registry: '0x0000000000000000000000000000000000000000', // TODO: Update after deployment
    explorer: 'https://basescan.org',
    rpc: 'https://mainnet.base.org'
  },
  
  // Avalanche
  avalanche: {
    chainId: 43114,
    name: 'Avalanche',
    locker: '0x0000000000000000000000000000000000000000', // TODO: Update after deployment
    registry: '0x0000000000000000000000000000000000000000', // TODO: Update after deployment
    explorer: 'https://snowtrace.io',
    rpc: 'https://api.avax.network/ext/bc/C/rpc'
  },
  
  // Fantom
  fantom: {
    chainId: 250,
    name: 'Fantom',
    locker: '0x0000000000000000000000000000000000000000', // TODO: Update after deployment
    registry: '0x0000000000000000000000000000000000000000', // TODO: Update after deployment
    explorer: 'https://ftmscan.com',
    rpc: 'https://rpc.ftm.tools'
  },
  
  // zkSync Era
  zksync: {
    chainId: 324,
    name: 'zkSync Era',
    locker: '0x0000000000000000000000000000000000000000', // TODO: Update after deployment
    registry: '0x0000000000000000000000000000000000000000', // TODO: Update after deployment
    explorer: 'https://explorer.zksync.io',
    rpc: 'https://mainnet.era.zksync.io'
  },
  
  // Polygon zkEVM
  polygonzk: {
    chainId: 1101,
    name: 'Polygon zkEVM',
    locker: '0x0000000000000000000000000000000000000000', // TODO: Update after deployment
    registry: '0x0000000000000000000000000000000000000000', // TODO: Update after deployment
    explorer: 'https://zkevm.polygonscan.com',
    rpc: 'https://zkevm-rpc.com'
  }
};

// Chain ID to chain name mapping
export const CHAIN_ID_MAP = {
  1: 'ethereum',
  137: 'polygon',
  56: 'bsc',
  42161: 'arbitrum',
  10: 'optimism',
  8453: 'base',
  43114: 'avalanche',
  250: 'fantom',
  324: 'zksync',
  1101: 'polygonzk'
};

// Get locker address by chain ID
export function getLockerAddress(chainId) {
  const chainName = CHAIN_ID_MAP[chainId];
  if (!chainName) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }
  return LOCKER_ADDRESSES[chainName].locker;
}

// Get registry address by chain ID
export function getRegistryAddress(chainId) {
  const chainName = CHAIN_ID_MAP[chainId];
  if (!chainName) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }
  return LOCKER_ADDRESSES[chainName].registry;
}

// Get full config by chain ID
export function getChainConfig(chainId) {
  const chainName = CHAIN_ID_MAP[chainId];
  if (!chainName) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }
  return LOCKER_ADDRESSES[chainName];
}

// Check if locker is deployed on chain
export function isLockerDeployed(chainId) {
  try {
    const address = getLockerAddress(chainId);
    return address !== '0x0000000000000000000000000000000000000000';
  } catch {
    return false;
  }
}

// Get all deployed locker addresses
export function getAllDeployedLockers() {
  const deployed = {};
  
  Object.entries(LOCKER_ADDRESSES).forEach(([chain, config]) => {
    if (config.locker !== '0x0000000000000000000000000000000000000000') {
      deployed[chain] = config;
    }
  });
  
  return deployed;
}

// Standalone usage (for HTML files)
if (typeof window !== 'undefined') {
  window.LOCKER_ADDRESSES = LOCKER_ADDRESSES;
  window.getLockerAddress = getLockerAddress;
  window.getRegistryAddress = getRegistryAddress;
  window.getChainConfig = getChainConfig;
  window.isLockerDeployed = isLockerDeployed;
  window.getAllDeployedLockers = getAllDeployedLockers;
}

// Example usage:
/*
// In your frontend code:

// Get locker for current network
const chainId = await window.ethereum.request({ method: 'eth_chainId' });
const lockerAddress = getLockerAddress(parseInt(chainId, 16));

// Get full config
const config = getChainConfig(1); // Ethereum
console.log(config.name, config.locker, config.explorer);

// Check if deployed
if (isLockerDeployed(137)) {
  console.log('Locker is deployed on Polygon');
}

// Get all deployments
const deployed = getAllDeployedLockers();
console.log('Deployed on chains:', Object.keys(deployed));
*/
