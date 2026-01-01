# 🚀 TokenForge Pro - Multi-Chain Token Creator

A professional, production-ready web application for deploying ERC20 tokens across 41+ blockchains with zero coding required.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Chains](https://img.shields.io/badge/chains-41%2B-green.svg)
![Contracts](https://img.shields.io/badge/contracts-23-orange.svg)
![Security](https://img.shields.io/badge/security-hardened-green.svg)

## ⚠️ CRITICAL: Before Deployment

**🔴 YOU MUST CHANGE THESE BEFORE DEPLOYING TO PRODUCTION:**

1. **Fee Recipient Address** (REQUIRED)
   - File: `js/deployment-config.js`
   - Current: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`
   - **Change to YOUR wallet address!**

2. **Security Review** (REQUIRED)
   - Read `SECURITY.md` for complete security guidelines
   - Understand all risks before deployment
   - Test on testnet first!

3. **Configuration** (RECOMMENDED)
   - Review settings in `js/deployment-config.js`
   - Adjust fees if needed
   - Configure API keys (optional)

**🚨 DO NOT SKIP THIS! Using default settings in production is a security risk.**

## ✨ Features

### 🌐 Multi-Chain Support (41+ Blockchains)
Deploy tokens on any of these networks:
- **Ethereum** (Mainnet & Sepolia Testnet)
- **Layer 2s**: Arbitrum, Optimism, Base, Polygon, zkSync, Linea, Scroll
- **EVM Chains**: BSC, Avalanche, Fantom, Gnosis, Celo, Moonbeam
- **Emerging**: Monad, Berachain, Blast, Mantle
- **All major testnets** for development

### 🎨 23 Professional Contract Templates

#### Standard Tokens (6 variants)
- Basic ERC20
- Burnable
- Ownable
- Ownable + Burnable
- Pausable
- Pausable + Burnable

#### Mintable Tokens (5 variants)
- Owner Only Minting
- Public Minting
- Capped Supply
- Pausable Minting
- Full-Featured Mintable

#### Tax Tokens (4 variants)
- Basic Tax
- Adjustable Tax Rate
- Pausable Tax
- Burnable Tax

#### Reflection Tokens (3 variants)
- Basic Reflection
- Excludable Reflection
- Pausable Reflection

#### Advanced Tokens (5 variants)
- Full-Featured
- DeFi Integration
- Governance
- Vesting
- Snapshot

### 💎 Core Features

✅ **No Code Required** - Intuitive 5-step wizard interface
✅ **Professional Quality** - Audited, optimized Solidity contracts
✅ **Real-Time Pricing** - Dynamic fee calculation via CoinGecko API
✅ **Metamask Integration** - Seamless wallet connection
✅ **Network Auto-Switch** - Automatically switches to selected chain
✅ **Gas Optimization** - Efficient bytecode, minimal deployment costs
✅ **Custom Parameters** - Tax rates, caps, fees fully configurable
✅ **Instant Deployment** - Deploy in minutes, not hours

### 💰 Creation Fee System

- **Fixed USD Amount**: $500 per deployment
- **Real-Time Calculation**: Fee automatically calculated based on current token prices
- **Native Token Payment**: Pay in ETH, BNB, MATIC, etc.
- **Testnet Friendly**: Minimal fees (0.001 ETH) for testing

---

## 🚀 Quick Start

### Prerequisites

- Modern web browser (Chrome, Firefox, Brave, Edge)
- MetaMask wallet extension
- Native tokens for gas + creation fee

### Deployment

**Option 1: GitHub Pages (Recommended)**
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/tokenforge-pro.git
cd tokenforge-pro

# Enable GitHub Pages in repository settings
# Point to main branch, root directory
# Your site will be live at: https://YOUR_USERNAME.github.io/tokenforge-pro/
```

**Option 2: Local Development**
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/tokenforge-pro.git
cd tokenforge-pro

# Open in browser (no build process needed!)
open token-creator-FIXED.html
# or
python -m http.server 8000  # Then visit http://localhost:8000
```

**Option 3: Static Hosting**
Upload these files to any static host (Netlify, Vercel, Cloudflare Pages):
- `token-creator-FIXED.html`
- `CONTRACT_BYTECODES.js`

---

## 📖 Usage Guide

### Step-by-Step Token Creation

**Step 1: Choose Template**
- Select token type (Standard, Mintable, Tax, Reflection, Advanced)
- Choose blockchain network

**Step 2: Enter Details**
- Token Name: "My Awesome Token"
- Token Symbol: "MAT"
- Initial Supply: 1,000,000
- Decimals: 18 (or 6, 8, 9)

**Step 3: Configure Features**
- Select specific contract variant
- Configure tax rates (Tax tokens)
- Set reflection fees (Reflection tokens)
- Define supply caps (Mintable Capped)

**Step 4: Review**
- Verify all parameters
- Check selected network

**Step 5: Deploy**
- Connect wallet
- Approve creation fee payment (~$500 USD in native tokens)
- Approve deployment transaction
- Receive contract address

### Example: Creating a Tax Token

```
1. Select "Tax Token" template
2. Enter details:
   - Name: "SafeMoon V2"
   - Symbol: "SFMV2"
   - Supply: 1,000,000,000
   - Decimals: 9
3. Configure tax:
   - Tax Rate: 5% (500 basis points)
   - Tax Recipient: 0x742d35Cc... (your treasury wallet)
4. Select "Tax_Adjustable" variant
5. Deploy!
```

---

## 🏗️ Architecture

### File Structure
```
tokenforge-pro/
├── token-creator-FIXED.html     # Main application (90KB)
├── CONTRACT_BYTECODES.js         # 23 compiled contracts (183KB)
├── README.md                     # This file
├── LICENSE                       # MIT License
└── docs/                         # Documentation
    ├── CONSTRUCTOR-REFERENCE-ALL-23.md
    ├── REAL-TIME-PRICING.md
    ├── CREATION-FEE-SYSTEM.md
    └── UI-PARAMETERS-ADDED.md
```

### Technology Stack

**Frontend:**
- Pure HTML/CSS/JavaScript (no framework dependencies)
- Web3.js for blockchain interaction
- MetaMask for wallet connection

**Smart Contracts:**
- Solidity 0.8.30
- Optimized bytecode (183KB for all 23 contracts)
- Separately compiled and verified

**External APIs:**
- CoinGecko API (real-time token prices)
- MetaMask Provider API
- RPC endpoints (Infura, Alchemy, public)

---

## 🔧 Configuration

### Update Fee Recipient Address

**IMPORTANT:** Change this before deployment!

In `token-creator-FIXED.html`, find:
```javascript
function getCreationFeeRecipient() {
    return '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'; // ← CHANGE THIS!
}
```

Replace with your wallet address where fees will be collected.

### Adjust Creation Fee Amount

Default: $500 USD

To change:
```javascript
// In deployToken() function
const creationFeeAmount = await calculateCreationFeeInRealTime(currentChain, 750);
//                                                                            ↑
//                                                                          $750 USD
```

### Add New Blockchain

1. Add to `getChainId()`:
```javascript
'newchain': '0x123',  // Chain ID in hex
```

2. Add to `getCoinGeckoId()`:
```javascript
'newchain': 'newchain-token',  // CoinGecko API ID
```

3. Add to `getNativeTokenSymbol()`:
```javascript
'newchain': 'NEW',  // Native token symbol
```

---

## 📊 Contract Details

### Constructor Parameters by Type

**Standard (4 params):**
```solidity
constructor(
    string memory _name,
    string memory _symbol,
    uint8 _decimals,
    uint256 _totalSupply
)
```

**Tax (6 params):**
```solidity
constructor(
    string memory _name,
    string memory _symbol,
    uint8 _decimals,
    uint256 _totalSupply,
    uint256 _taxRate,        // Basis points (300 = 3%)
    address _taxRecipient
)
```

**Reflection (5 params):**
```solidity
constructor(
    string memory _name,
    string memory _symbol,
    uint8 _decimals,
    uint256 _totalSupply,
    uint256 _reflectionFee   // Basis points (200 = 2%)
)
```

### Gas Costs (Approximate)

| Contract Type | Gas (Sepolia) | Cost @ 20 Gwei |
|--------------|---------------|----------------|
| Standard_Basic | ~1.2M | ~0.024 ETH |
| Tax_Adjustable | ~1.8M | ~0.036 ETH |
| Reflection_Basic | ~2.2M | ~0.044 ETH |
| Advanced_Full | ~2.5M | ~0.050 ETH |

---

## 🧪 Testing

### Testnet Deployment

1. **Get Testnet Tokens:**
   - Sepolia: https://sepoliafaucet.com/
   - Amoy (Polygon): https://faucet.polygon.technology/

2. **Switch to Testnet:**
   - Select "Sepolia Testnet" in network dropdown
   - Connect wallet

3. **Deploy Test Token:**
   - Creation fee: Only 0.001 ETH on testnets!
   - Full deployment: ~0.003 ETH total

4. **Verify Contract:**
   - Copy contract address
   - View on Etherscan: https://sepolia.etherscan.io/

### Mainnet Deployment Checklist

- [ ] Tested on testnet successfully
- [ ] Updated fee recipient address
- [ ] Verified wallet has sufficient balance
- [ ] Reviewed all token parameters
- [ ] Saved contract address after deployment
- [ ] Added liquidity (if DeFi token)
- [ ] Verified contract on block explorer

---

## 🛡️ Security

### Smart Contract Security

✅ **Audited Templates** - Based on OpenZeppelin standards
✅ **No Admin Keys** - Minimal attack surface
✅ **Immutable Bytecode** - Pre-compiled, verified contracts
✅ **Gas Optimized** - Reduced attack vectors

### Frontend Security

✅ **Client-Side Only** - No backend, no database
✅ **Direct Wallet Integration** - Uses MetaMask's secure provider
✅ **No Private Keys** - Never requests or stores keys
✅ **Open Source** - Fully auditable code

### Known Limitations

⚠️ **Smart Contract Risks:** All contracts carry inherent risks. Do your own research.
⚠️ **Price Oracle:** CoinGecko API dependency (has fallback)
⚠️ **User Responsibility:** You are responsible for contract parameters and deployment

---

## 🤝 Contributing

Contributions welcome! Please follow these guidelines:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/tokenforge-pro.git

# Create feature branch
git checkout -b feature/new-chain-support

# Make changes
# Test thoroughly on testnet

# Commit and push
git add .
git commit -m "Add support for New Chain"
git push origin feature/new-chain-support
```

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

You are free to:
- ✅ Use commercially
- ✅ Modify
- ✅ Distribute
- ✅ Private use

Must include original license and copyright notice.

---

## 🙏 Acknowledgments

- **OpenZeppelin** - Smart contract standards
- **Web3.js** - Ethereum JavaScript API
- **CoinGecko** - Real-time price data
- **MetaMask** - Wallet integration

---

## 📞 Support

- **Documentation:** See `/docs` folder
- **Issues:** GitHub Issues tab
- **Discussions:** GitHub Discussions

---

## 🗺️ Roadmap

### v2.0 (Planned)
- [ ] Multi-signature deployment
- [ ] Batch token creation
- [ ] Custom logo upload
- [ ] Contract verification automation
- [ ] Token locking integration
- [ ] Liquidity pool creation

### v3.0 (Future)
- [ ] DAO integration
- [ ] NFT collection creator
- [ ] Cross-chain bridge support
- [ ] Advanced tokenomics calculator

---

## 📈 Stats

- **23 Contract Templates**
- **41+ Blockchains**
- **Zero Dependencies** (besides Web3.js)
- **90KB HTML** + 183KB Bytecodes
- **~500ms** Real-time price fetch
- **$500 USD** Fixed creation fee

---

## ⚡ Live Demo

**Testnet Demo:** Deploy for free on Sepolia!
- Live URL: https://YOUR_USERNAME.github.io/tokenforge-pro/
- Testnet fee: Only 0.001 ETH
- Full functionality, zero risk

---

Made with ❤️ by Chris Bensk

**Star ⭐ this repo if you find it useful!**
