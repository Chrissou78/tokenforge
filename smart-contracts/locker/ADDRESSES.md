# TokenForge Locker Contract Addresses

## Official Deployed Lockers

### Mainnet Deployments

| Chain | Chain ID | Locker Address | Registry Address | Status |
|-------|----------|----------------|------------------|--------|
| Ethereum | 1 | `TBD` | `TBD` | 🟡 Pending |
| Polygon | 137 | `TBD` | `TBD` | 🟡 Pending |
| BSC | 56 | `TBD` | `TBD` | 🟡 Pending |
| Arbitrum | 42161 | `TBD` | `TBD` | 🟡 Pending |
| Optimism | 10 | `TBD` | `TBD` | 🟡 Pending |
| Base | 8453 | `TBD` | `TBD` | 🟡 Pending |
| Avalanche | 43114 | `TBD` | `TBD` | 🟡 Pending |

### Testnet Deployments

| Chain | Chain ID | Locker Address | Registry Address | Status |
|-------|----------|----------------|------------------|--------|
| Goerli | 5 | `0x...` | `0x...` | 🟢 Active |
| Mumbai | 80001 | `0x...` | `0x...` | 🟢 Active |
| BSC Testnet | 97 | `0x...` | `0x...` | 🟢 Active |

## How to Index Locker Addresses

### Method 1: On-Chain Registry (Recommended)

The `LockerRegistry` contract maintains a list of all deployed lockers.

**Query Official Locker:**
```javascript
// Get official locker for current chain
const lockerAddress = await registry.getOfficialLocker();

// Get official locker for specific chain
const ethLocker = await registry.getOfficialLockerForChain(1); // Ethereum
const polyLocker = await registry.getOfficialLockerForChain(137); // Polygon
```

**Registry Functions:**
```solidity
// Get official locker for chain
function getOfficialLockerForChain(uint256 chainId) returns (address)

// Get all lockers on a chain
function getChainLockers(uint256 chainId) returns (address[])

// Get user's deployed lockers
function getUserLockers(address user) returns (address[])

// Get locker info
function getLockerInfo(address locker) returns (...)
```

### Method 2: Configuration File

Update `locker-config.json` with deployed addresses:

```json
{
  "version": "1.0.0",
  "lockers": {
    "1": {
      "name": "Ethereum",
      "locker": "0x...",
      "registry": "0x...",
      "verified": true
    },
    "137": {
      "name": "Polygon",
      "locker": "0x...",
      "registry": "0x...",
      "verified": true
    },
    "56": {
      "name": "BSC",
      "locker": "0x...",
      "registry": "0x...",
      "verified": true
    }
  }
}
```

### Method 3: Hardcoded Constants

In your frontend application:

```javascript
// config/lockers.js
export const LOCKER_ADDRESSES = {
  ethereum: {
    chainId: 1,
    locker: '0x...',
    registry: '0x...'
  },
  polygon: {
    chainId: 137,
    locker: '0x...',
    registry: '0x...'
  },
  bsc: {
    chainId: 56,
    locker: '0x...',
    registry: '0x...'
  }
};

// Usage
import { LOCKER_ADDRESSES } from './config/lockers';

const currentChain = 'polygon';
const lockerAddress = LOCKER_ADDRESSES[currentChain].locker;
```

### Method 4: ENS/DNS Resolution (Advanced)

Register locker addresses with ENS for easy discovery:

```
ethereum-locker.tokenforge.eth → 0x...
polygon-locker.tokenforge.eth → 0x...
bsc-locker.tokenforge.eth → 0x...
```

Query via ENS:
```javascript
const provider = new ethers.providers.JsonRpcProvider(...);
const lockerAddress = await provider.resolveName('ethereum-locker.tokenforge.eth');
```

## Frontend Integration

### Option A: Direct Config Import

```javascript
// locker.html
const LOCKER_CONFIGS = {
  1: '0x...', // Ethereum
  137: '0x...', // Polygon
  56: '0x...', // BSC
  42161: '0x...', // Arbitrum
  10: '0x...', // Optimism
  8453: '0x...', // Base
};

async function getLockerAddress() {
  const chainId = await window.ethereum.request({ 
    method: 'eth_chainId' 
  });
  return LOCKER_CONFIGS[parseInt(chainId, 16)];
}
```

### Option B: Registry Query

```javascript
// Query from on-chain registry
const REGISTRY_ADDRESSES = {
  1: '0x...', // Ethereum registry
  137: '0x...', // Polygon registry
  // ... other chains
};

async function getLockerAddress(chainId) {
  const registryAddress = REGISTRY_ADDRESSES[chainId];
  const registry = new ethers.Contract(
    registryAddress,
    REGISTRY_ABI,
    provider
  );
  
  return await registry.getOfficialLocker();
}
```

### Option C: API Endpoint

Host a simple API that returns locker addresses:

```javascript
// GET https://api.tokenforge.io/lockers
{
  "1": {
    "locker": "0x...",
    "registry": "0x...",
    "verified": true
  },
  "137": {
    "locker": "0x...",
    "registry": "0x...",
    "verified": true
  }
}

// Frontend usage
const response = await fetch('https://api.tokenforge.io/lockers');
const lockers = await response.json();
const lockerAddress = lockers[chainId].locker;
```

## Deployment Process

### 1. Deploy LockerRegistry (Once per chain)

```bash
npx hardhat run scripts/deploy-registry.js --network ethereum
# Output: Registry deployed at 0x...
```

### 2. Deploy TokenLocker

```bash
npx hardhat run scripts/deploy-locker.js --network ethereum
# Output: Locker deployed at 0x...
```

### 3. Register Locker in Registry

```javascript
await registry.setOfficialLocker(1, lockerAddress); // Ethereum
await registry.setOfficialLocker(137, lockerAddress); // Polygon
```

### 4. Verify Contracts

```bash
npx hardhat verify --network ethereum LOCKER_ADDRESS FEE_COLLECTOR
npx hardhat verify --network ethereum REGISTRY_ADDRESS
```

### 5. Update Configuration

Update all config files with new addresses:
- `locker-config.json`
- Frontend constants
- Documentation
- README files

## Multi-Chain Deployment Script

```javascript
// scripts/deploy-all.js
const chains = [
  { name: 'ethereum', id: 1, rpc: 'https://...' },
  { name: 'polygon', id: 137, rpc: 'https://...' },
  { name: 'bsc', id: 56, rpc: 'https://...' }
];

for (const chain of chains) {
  console.log(`Deploying to ${chain.name}...`);
  
  // Deploy Registry
  const registry = await LockerRegistry.deploy();
  await registry.waitForDeployment();
  
  // Deploy Locker
  const locker = await TokenLocker.deploy(feeCollector);
  await locker.waitForDeployment();
  
  // Register
  await registry.setOfficialLocker(chain.id, await locker.getAddress());
  
  console.log(`${chain.name}:`);
  console.log(`  Registry: ${await registry.getAddress()}`);
  console.log(`  Locker: ${await locker.getAddress()}`);
}
```

## Verification Example

```bash
# Ethereum
npx hardhat verify --network ethereum \
  0xYourLockerAddress \
  0xFeeCollectorAddress

# Polygon
npx hardhat verify --network polygon \
  0xYourLockerAddress \
  0xFeeCollectorAddress

# BSC
npx hardhat verify --network bsc \
  0xYourLockerAddress \
  0xFeeCollectorAddress
```

## Address Discovery Flow

```
User opens locker.html
      ↓
Detects wallet network (chainId)
      ↓
Option 1: Query on-chain registry
    → registry.getOfficialLocker()
    → returns locker address
      ↓
Option 2: Read from config
    → LOCKER_CONFIGS[chainId]
    → returns locker address
      ↓
Option 3: API call
    → fetch('api.tokenforge.io/lockers')
    → returns all addresses
      ↓
Use locker address for operations
```

## Security Considerations

1. **Verify Addresses**: Always verify contract addresses on block explorer
2. **Registry Ownership**: Secure the registry owner address (use multisig)
3. **Immutable After Deploy**: Once set, locker addresses shouldn't change
4. **Backup Methods**: Have multiple ways to discover addresses (registry + config)
5. **Version Control**: Track which version of locker is deployed where

## Monitoring

Track locker deployments:
- Total locks created
- Total value locked (TVL)
- Active locks
- Expired locks
- Fees collected

## Support

For deployment support:
- Discord: https://discord.gg/tokenforge
- Docs: https://docs.tokenforge.io/lockers
- Email: support@tokenforge.io
