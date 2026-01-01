# TokenLocker Contract Addresses & Indexing

## 🔒 Official Locker Addresses

### Mainnet Deployments

```javascript
const LOCKER_ADDRESSES = {
  // Ethereum Mainnet (Chain ID: 1)
  1: {
    official: "0x...", // Official TokenForge locker
    registry: "0x...", // Locker registry contract
    version: "v1.0.0"
  },
  
  // Polygon (Chain ID: 137)
  137: {
    official: "0x...",
    registry: "0x...",
    version: "v1.0.0"
  },
  
  // BSC (Chain ID: 56)
  56: {
    official: "0x...",
    registry: "0x...",
    version: "v1.0.0"
  },
  
  // Arbitrum One (Chain ID: 42161)
  42161: {
    official: "0x...",
    registry: "0x...",
    version: "v1.0.0"
  },
  
  // Base (Chain ID: 8453)
  8453: {
    official: "0x...",
    registry: "0x...",
    version: "v1.0.0"
  },
  
  // Optimism (Chain ID: 10)
  10: {
    official: "0x...",
    registry: "0x...",
    version: "v1.0.0"
  },
  
  // Avalanche C-Chain (Chain ID: 43114)
  43114: {
    official: "0x...",
    registry: "0x...",
    version: "v1.0.0"
  }
};
```

### Testnet Deployments

```javascript
const TESTNET_LOCKER_ADDRESSES = {
  // Goerli (Chain ID: 5)
  5: {
    official: "0x...",
    registry: "0x...",
    version: "v1.0.0-testnet"
  },
  
  // Mumbai (Chain ID: 80001)
  80001: {
    official: "0x...",
    registry: "0x...",
    version: "v1.0.0-testnet"
  },
  
  // BSC Testnet (Chain ID: 97)
  97: {
    official: "0x...",
    registry: "0x...",
    version: "v1.0.0-testnet"
  }
};
```

---

## 📊 Indexing Architecture

### 1. Central Registry Contract

**LockerRegistry.sol** - Deployed on each chain
```
Purpose: Track all official TokenLocker deployments
Location: Smart contract on-chain
Access: Read-only for public, write for admin
```

**Key Functions:**
```solidity
// Get official locker for current chain
getOfficialLocker() → address

// Get locker info
getLockerInfo(chainId, address) → LockerInfo

// Check if locker is valid
isValidLocker(chainId, address) → bool

// Get all lockers for chain
getLockersForChain(chainId) → address[]
```

### 2. Off-Chain Indexing

**Database Schema:**
```sql
-- Locker contracts table
CREATE TABLE locker_contracts (
    id SERIAL PRIMARY KEY,
    chain_id INTEGER NOT NULL,
    contract_address VARCHAR(42) NOT NULL,
    version VARCHAR(20),
    deployed_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    total_locks INTEGER DEFAULT 0,
    total_value_locked DECIMAL(36, 18) DEFAULT 0,
    UNIQUE(chain_id, contract_address)
);

-- Individual locks table
CREATE TABLE token_locks (
    id SERIAL PRIMARY KEY,
    lock_id INTEGER NOT NULL,
    locker_address VARCHAR(42) NOT NULL,
    chain_id INTEGER NOT NULL,
    token_address VARCHAR(42) NOT NULL,
    owner_address VARCHAR(42) NOT NULL,
    amount DECIMAL(36, 18) NOT NULL,
    unlock_time TIMESTAMP NOT NULL,
    locked_at TIMESTAMP NOT NULL,
    withdrawn BOOLEAN DEFAULT false,
    tx_hash VARCHAR(66),
    INDEX idx_owner (owner_address),
    INDEX idx_token (token_address),
    INDEX idx_unlock (unlock_time)
);

-- User locks index
CREATE TABLE user_locks (
    user_address VARCHAR(42) NOT NULL,
    chain_id INTEGER NOT NULL,
    lock_id INTEGER NOT NULL,
    locker_address VARCHAR(42) NOT NULL,
    PRIMARY KEY (user_address, chain_id, lock_id)
);
```

### 3. Event Indexing

**Monitor These Events:**
```solidity
// TokenLocker events
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
```

**Indexing Service (Node.js Example):**
```javascript
const ethers = require('ethers');

// Setup provider
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Locker contract
const locker = new ethers.Contract(
    LOCKER_ADDRESS,
    LOCKER_ABI,
    provider
);

// Listen for TokensLocked events
locker.on('TokensLocked', async (lockId, token, owner, amount, unlockTime, event) => {
    console.log('New lock detected:', {
        lockId: lockId.toString(),
        token,
        owner,
        amount: ethers.formatEther(amount),
        unlockTime: new Date(unlockTime * 1000),
        txHash: event.log.transactionHash
    });
    
    // Save to database
    await saveLockToDatabase({
        lockId: lockId.toString(),
        chainId: event.log.chainId,
        lockerAddress: LOCKER_ADDRESS,
        tokenAddress: token,
        ownerAddress: owner,
        amount: amount.toString(),
        unlockTime: new Date(unlockTime * 1000),
        lockedAt: new Date(),
        txHash: event.log.transactionHash
    });
});

// Index historical events
async function indexHistoricalLocks() {
    const fromBlock = DEPLOYMENT_BLOCK;
    const toBlock = 'latest';
    
    const filter = locker.filters.TokensLocked();
    const events = await locker.queryFilter(filter, fromBlock, toBlock);
    
    for (const event of events) {
        // Process each historical lock
        await saveLockToDatabase({
            lockId: event.args.lockId.toString(),
            // ... rest of data
        });
    }
}
```

---

## 🔍 Query Methods

### Method 1: Direct Contract Query

**Get Locker Address:**
```javascript
// From registry contract
const registry = new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, provider);
const officialLocker = await registry.getOfficialLocker();
```

**Get User's Locks:**
```javascript
const locker = new ethers.Contract(LOCKER_ADDRESS, LOCKER_ABI, provider);
const userLockIds = await locker.getUserLocks(userAddress);

// Get details for each lock
for (const lockId of userLockIds) {
    const lockInfo = await locker.getLock(lockId);
    console.log({
        token: lockInfo.token,
        amount: lockInfo.amount,
        unlockTime: new Date(lockInfo.unlockTime * 1000),
        withdrawn: lockInfo.withdrawn
    });
}
```

### Method 2: Subgraph (The Graph)

**GraphQL Schema:**
```graphql
type LockerContract @entity {
  id: ID!
  address: Bytes!
  chainId: BigInt!
  version: String!
  totalLocks: BigInt!
  totalValueLocked: BigDecimal!
  locks: [Lock!]! @derivedFrom(field: "locker")
}

type Lock @entity {
  id: ID!
  lockId: BigInt!
  locker: LockerContract!
  token: Token!
  owner: User!
  amount: BigDecimal!
  unlockTime: BigInt!
  lockedAt: BigInt!
  withdrawn: Boolean!
  txHash: Bytes!
}

type User @entity {
  id: ID!
  address: Bytes!
  locks: [Lock!]! @derivedFrom(field: "owner")
  totalLocksCreated: BigInt!
}

type Token @entity {
  id: ID!
  address: Bytes!
  symbol: String!
  name: String!
  decimals: Int!
  locks: [Lock!]! @derivedFrom(field: "token")
}
```

**Query Examples:**
```graphql
# Get user's locks
{
  user(id: "0x...") {
    locks {
      lockId
      token {
        symbol
        name
      }
      amount
      unlockTime
      withdrawn
    }
  }
}

# Get all active locks for a token
{
  locks(where: {
    token: "0x...",
    withdrawn: false,
    unlockTime_gt: "1704067200"
  }) {
    owner {
      address
    }
    amount
    unlockTime
  }
}

# Get locker statistics
{
  lockerContract(id: "0x...") {
    totalLocks
    totalValueLocked
    locks(first: 10, orderBy: lockedAt, orderDirection: desc) {
      token {
        symbol
      }
      amount
    }
  }
}
```

### Method 3: REST API

**API Endpoints:**
```
GET /api/v1/lockers
    → Get all locker addresses by chain

GET /api/v1/lockers/:chainId
    → Get official locker for chain

GET /api/v1/locks/:address
    → Get all locks for user address

GET /api/v1/locks/:address/:chainId
    → Get user's locks on specific chain

GET /api/v1/lock/:chainId/:lockId
    → Get specific lock details

GET /api/v1/tokens/:tokenAddress/locks
    → Get all locks for a token

GET /api/v1/stats/:chainId
    → Get locker statistics for chain
```

**Example API Response:**
```json
{
  "chainId": 1,
  "lockerAddress": "0x...",
  "userAddress": "0x...",
  "locks": [
    {
      "lockId": 123,
      "token": {
        "address": "0x...",
        "symbol": "USDC",
        "name": "USD Coin"
      },
      "amount": "1000000.0",
      "unlockTime": "2025-06-01T00:00:00Z",
      "lockedAt": "2024-12-01T00:00:00Z",
      "withdrawn": false,
      "canUnlock": false,
      "daysRemaining": 156,
      "txHash": "0x..."
    }
  ],
  "totalLocks": 1,
  "totalValueLocked": "1000000.0"
}
```

---

## 🛠️ Integration Guide

### Frontend Integration

**1. Load Locker Address:**
```javascript
// config.js
export const LOCKER_CONFIG = {
  // Load from registry or hardcoded
  addresses: {
    1: "0x...",     // Ethereum
    137: "0x...",   // Polygon
    56: "0x...",    // BSC
    // ... etc
  },
  
  getLockerAddress(chainId) {
    return this.addresses[chainId] || null;
  }
};

// In your app
const chainId = await provider.getNetwork().then(n => n.chainId);
const lockerAddress = LOCKER_CONFIG.getLockerAddress(chainId);
```

**2. Query User Locks:**
```javascript
async function getUserLocks(userAddress, chainId) {
  const lockerAddress = LOCKER_CONFIG.getLockerAddress(chainId);
  const locker = new ethers.Contract(lockerAddress, LOCKER_ABI, provider);
  
  const lockIds = await locker.getUserLocks(userAddress);
  const locks = [];
  
  for (const lockId of lockIds) {
    const lock = await locker.getLock(lockId);
    locks.push({
      lockId: lockId.toString(),
      token: lock.token,
      amount: ethers.formatUnits(lock.amount, 18),
      unlockTime: new Date(lock.unlockTime * 1000),
      withdrawn: lock.withdrawn,
      canUnlock: lock.canUnlock
    });
  }
  
  return locks;
}
```

**3. Display Locks:**
```javascript
const locks = await getUserLocks(userAddress, chainId);

locks.forEach(lock => {
  console.log(`Lock #${lock.lockId}`);
  console.log(`Token: ${lock.token}`);
  console.log(`Amount: ${lock.amount}`);
  console.log(`Unlock: ${lock.unlockTime}`);
  console.log(`Status: ${lock.withdrawn ? 'Withdrawn' : 'Active'}`);
});
```

---

## 📱 Platform Configuration

**In locker.html:**
```javascript
// Add at top of script section
const LOCKER_ADDRESSES = {
  ethereum: "0x...",
  polygon: "0x...",
  bsc: "0x...",
  arbitrum: "0x...",
  base: "0x...",
  optimism: "0x...",
  // ... all chains
};

function getLockerAddress(chain) {
  return LOCKER_ADDRESSES[chain];
}

// When user locks tokens
async function lockTokens() {
  const lockerAddress = getLockerAddress(currentChain);
  const locker = new ethers.Contract(lockerAddress, LOCKER_ABI, signer);
  
  // Proceed with locking...
}
```

---

## 🔐 Security Considerations

### Verify Locker Address

**Always verify:**
1. Check official documentation
2. Verify contract on block explorer
3. Check registry contract
4. Compare with multiple sources

**Verification Code:**
```javascript
async function verifyLockerAddress(chainId, address) {
  // 1. Check registry
  const registry = new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, provider);
  const official = await registry.getOfficialLockerForChain(chainId);
  
  if (official.toLowerCase() !== address.toLowerCase()) {
    console.warn('Address does not match registry!');
    return false;
  }
  
  // 2. Verify contract bytecode
  const code = await provider.getCode(address);
  const expectedCodeHash = ethers.keccak256(EXPECTED_BYTECODE);
  const actualCodeHash = ethers.keccak256(code);
  
  if (expectedCodeHash !== actualCodeHash) {
    console.warn('Bytecode does not match!');
    return false;
  }
  
  return true;
}
```

---

## 📊 Statistics & Analytics

### Track These Metrics:

1. **Total Locks Created**
2. **Total Value Locked (TVL)**
3. **Active Locks**
4. **Locks by Token**
5. **Average Lock Duration**
6. **Locks by Chain**
7. **Emergency Unlocks Count**
8. **Fees Collected**

### Analytics Dashboard Query:
```sql
-- Total Value Locked
SELECT 
    chain_id,
    COUNT(*) as total_locks,
    SUM(amount) as total_value_locked,
    COUNT(CASE WHEN withdrawn = false THEN 1 END) as active_locks
FROM token_locks
GROUP BY chain_id;

-- Top Locked Tokens
SELECT 
    token_address,
    COUNT(*) as lock_count,
    SUM(amount) as total_locked
FROM token_locks
WHERE withdrawn = false
GROUP BY token_address
ORDER BY total_locked DESC
LIMIT 10;

-- User Activity
SELECT 
    owner_address,
    COUNT(*) as total_locks,
    MAX(locked_at) as last_lock
FROM token_locks
GROUP BY owner_address
ORDER BY total_locks DESC
LIMIT 100;
```

---

## 🚀 Deployment Checklist

- [ ] Deploy TokenLocker contract
- [ ] Deploy LockerRegistry contract
- [ ] Register locker in registry
- [ ] Set as official locker
- [ ] Verify contracts on explorer
- [ ] Update frontend config
- [ ] Setup event indexing
- [ ] Deploy API/subgraph
- [ ] Update documentation
- [ ] Test all functions
- [ ] Announce deployment

---

## 📖 Resources

- **Contract Explorer:** https://etherscan.io/address/LOCKER_ADDRESS
- **Registry:** https://etherscan.io/address/REGISTRY_ADDRESS
- **API Docs:** https://docs.tokenforge.io/api
- **Subgraph:** https://thegraph.com/explorer/tokenforge-locker
