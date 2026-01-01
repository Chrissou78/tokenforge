# TokenForge Pro API Documentation

## Base URL
```
Production: https://api.tokenforge.pro/v1
Development: http://localhost:3000/api/v1
```

## Authentication
All endpoints require API authentication via Bearer token or wallet signature.

```bash
Authorization: Bearer YOUR_API_KEY
# or
X-Wallet-Signature: SIGNED_MESSAGE
X-Wallet-Address: WALLET_ADDRESS
```

## Endpoints

### Token Creator

#### POST /tokens/create
Create a new token on specified chain.

**Request:**
```json
{
  "chain": "ethereum",
  "tokenType": "standard",
  "config": {
    "name": "My Token",
    "symbol": "MTK",
    "totalSupply": "1000000",
    "decimals": 18,
    "features": {
      "burnable": true,
      "mintable": false,
      "pausable": true
    }
  },
  "metadata": {
    "website": "https://mytoken.com",
    "description": "My awesome token"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tokenAddress": "0x...",
    "transactionHash": "0x...",
    "explorerUrl": "https://etherscan.io/tx/0x...",
    "fee": "0.05 ETH"
  }
}
```

**Fee Structure:**
- Standard: 0.05 - 0.5 (chain dependent)
- Tax Token: 1.5x standard fee
- Advanced: 2x standard fee

### Multi Sender

#### POST /multisender/send
Send tokens to multiple addresses.

**Request:**
```json
{
  "chain": "polygon",
  "tokenAddress": "0x...",
  "recipients": [
    {"address": "0x123...", "amount": "100"},
    {"address": "0x456...", "amount": "200"}
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionHash": "0x...",
    "totalSent": "300",
    "recipientCount": 2,
    "fee": "1.5 MATIC"
  }
}
```

**Fees:**
- Base fee + per-address fee
- Max 1000 addresses per transaction
- Batch processing for large sends

### Multi Buyer

#### POST /multibuyer/execute
Execute multi-wallet token purchases.

**Request:**
```json
{
  "chain": "bsc",
  "tokenAddress": "0x...",
  "wallets": [
    {"privateKey": "encrypted_key_1", "amount": "1"},
    {"privateKey": "encrypted_key_2", "amount": "2"}
  ],
  "slippage": 1.0
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {"wallet": "0x...", "txHash": "0x...", "status": "success"},
      {"wallet": "0x...", "txHash": "0x...", "status": "success"}
    ],
    "totalSpent": "3 BNB",
    "tokensReceived": "15000",
    "fee": "0.005 BNB"
  }
}
```

**Security:**
- Private keys encrypted client-side
- MEV protection enabled
- Transaction simulation before execution

### Batch Collector

#### POST /collector/collect
Collect tokens from multiple wallets.

**Request:**
```json
{
  "chain": "arbitrum",
  "tokenAddress": "0x...",
  "sourceWallets": ["0x...", "0x..."],
  "destinationAddress": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCollected": "5000",
    "transactionHashes": ["0x...", "0x..."],
    "fee": "0.003 ETH"
  }
}
```

### Multi Swap

#### POST /multiswap/execute
Swap multiple tokens across wallets.

**Request:**
```json
{
  "chain": "ethereum",
  "swaps": [
    {
      "wallet": "0x...",
      "tokenIn": "0x...",
      "tokenOut": "0x...",
      "amountIn": "100",
      "minAmountOut": "95"
    }
  ],
  "dexPreference": "uniswap"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "swaps": [
      {
        "wallet": "0x...",
        "txHash": "0x...",
        "amountOut": "98",
        "status": "success"
      }
    ],
    "totalFee": "0.005 ETH"
  }
}
```

### Vanity Address

#### POST /vanity/generate
Generate vanity address for contract.

**Request:**
```json
{
  "chain": "polygon",
  "prefix": "0xDEAD",
  "maxAttempts": 1000000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "0xDEAD1234...",
    "privateKey": "encrypted_key",
    "attempts": 54321,
    "fee": "0.05 MATIC"
  }
}
```

### Wallet Generator

#### POST /wallet/generate
Generate new wallets.

**Request:**
```json
{
  "chain": "solana",
  "count": 10,
  "vanity": {
    "enabled": true,
    "prefix": "PUMP"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "wallets": [
      {
        "address": "PUMP...",
        "privateKey": "encrypted_key"
      }
    ],
    "fee": "0.1 SOL"
  }
}
```

### Token Clone

#### POST /clone/execute
Clone existing token with modifications.

**Request:**
```json
{
  "chain": "sui",
  "sourceToken": "0x...",
  "modifications": {
    "name": "Cloned Token",
    "symbol": "CLONE",
    "supply": "2000000"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "newTokenAddress": "0x...",
    "transactionHash": "0x...",
    "fee": "3 SUI"
  }
}
```

### Fair Launch

#### POST /launch/create
Create fair launch on platform.

**Request:**
```json
{
  "chain": "solana",
  "platform": "pumpfun",
  "tokenConfig": {
    "name": "Fair Launch Token",
    "symbol": "FLT",
    "description": "Community token",
    "initialSupply": "1000000000"
  },
  "bondingCurve": {
    "type": "linear",
    "startPrice": "0.0001",
    "endPrice": "0.001"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "launchUrl": "https://pump.fun/token/...",
    "tokenAddress": "...",
    "bondingCurveAddress": "...",
    "fee": "0.02 SOL"
  }
}
```

## Webhooks

Subscribe to events:
- Token creation complete
- Multi-send complete
- Launch platform listing

**Webhook payload:**
```json
{
  "event": "token.created",
  "timestamp": "2025-01-15T10:30:00Z",
  "data": {
    "tokenAddress": "0x...",
    "creator": "0x...",
    "chain": "ethereum"
  }
}
```

## Rate Limits

- **Standard**: 100 requests/minute
- **Pro**: 1000 requests/minute
- **Enterprise**: Unlimited

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid API key |
| 402 | Payment Required - Insufficient balance |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## SDK Examples

### JavaScript/TypeScript
```typescript
import { TokenForgeSDK } from '@tokenforge/sdk';

const sdk = new TokenForgeSDK({
  apiKey: process.env.TOKENFORGE_API_KEY
});

const token = await sdk.tokens.create({
  chain: 'ethereum',
  name: 'My Token',
  symbol: 'MTK',
  supply: '1000000'
});
```

### Python
```python
from tokenforge import TokenForgeClient

client = TokenForgeClient(api_key=os.getenv('TOKENFORGE_API_KEY'))

token = client.tokens.create(
    chain='ethereum',
    name='My Token',
    symbol='MTK',
    supply='1000000'
)
```

### Rust
```rust
use tokenforge_sdk::TokenForge;

let client = TokenForge::new(api_key);

let token = client.tokens().create(
    TokenConfig::new()
        .chain("ethereum")
        .name("My Token")
        .symbol("MTK")
        .supply("1000000")
).await?;
```

## Support

- API Status: status.tokenforge.pro
- Documentation: docs.tokenforge.pro
- Discord: discord.gg/tokenforge
- Email: api@tokenforge.pro
