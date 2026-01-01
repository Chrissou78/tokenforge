# TokenForge Pro - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Open the Platform
```bash
# Option 1: Simple file open
open index.html in your browser

# Option 2: Local server (recommended)
cd tokenforge-pro
python -m http.server 8000
# Then visit: http://localhost:8000

# Option 3: Node server
npx serve .
```

### Step 2: Connect Your Wallet

1. Click "Connect Wallet" button
2. Select your wallet type:
   - **MetaMask** for EVM chains (Ethereum, Polygon, BSC, Arbitrum)
   - **Phantom** for Solana
   - **Sui Wallet** for Sui network
3. Approve the connection in your wallet

### Step 3: Choose Your Tool

Navigate using the top menu:
- **🪙 Token Creator** - Create new tokens
- **📤 Multi Sender** - Batch send to multiple addresses
- **🛒 Multi Buyer** - Buy with multiple wallets
- **📥 Batch Collector** - Collect from multiple wallets
- **🔄 Multi Swap** - Swap across multiple wallets
- **✨ Vanity Tools** - Generate custom addresses
- **👛 Wallet Generator** - Create new wallets
- **🧬 Token Clone** - Clone existing tokens
- **🚀 Fair Launch** - Launch on popular platforms

## 💡 Quick Examples

### Example 1: Create a Token

1. Go to **Token Creator** tab
2. Select your chain (e.g., Polygon for low fees)
3. Fill in:
   - Name: "My Community Token"
   - Symbol: "MCT"
   - Supply: 1,000,000
   - Features: Check "Burnable" and "Pausable"
4. Review fee: ~25 MATIC
5. Click "Create Token"
6. Confirm in wallet
7. Done! Your token is deployed 🎉

**Cost: ~$10 on Polygon** (vs ~$100 on Ethereum)

### Example 2: Airdrop Tokens

1. Go to **Multi Sender** tab
2. Select chain
3. Enter token address
4. Upload CSV with addresses and amounts:
   ```
   address,amount
   0x123...,100
   0x456...,200
   0x789...,150
   ```
5. Review: 3 recipients, Total fee: ~0.0003 ETH
6. Click "Send to All Recipients"
7. All 3 receive tokens in one transaction! 🎁

**Saves 60% on gas vs individual sends**

### Example 3: Fair Launch on Pump.fun

1. Go to **Fair Launch** tab
2. Select "Pump.fun" (Solana)
3. Configure your token:
   - Name, symbol, description
   - Upload logo
4. Set bonding curve parameters
5. Fee: 0.02 SOL (~$3)
6. Launch! Your token is live 🚀

**Ready to trade in under 2 minutes**

### Example 4: Generate Vanity Address

1. Go to **Vanity Tools** tab
2. Enter desired prefix: "0xDEAD"
3. Click "Generate"
4. Wait for computation (30-120 seconds)
5. Get custom address: 0xDEAD1234...
6. Export private key (keep safe!)

**Perfect for memorable token contracts**

## 💰 Pricing at a Glance

### Token Creation
- Ethereum: $100-250
- Polygon: $5-15
- BSC: $10-25
- Arbitrum: $20-50
- Solana: $50-120
- Sui: $25-60

### Multi-Operations
- Multi Sender: ~$0.10-5 per batch
- Multi Buyer: ~$1-10 per operation
- Batch Collector: ~$1-5
- Multi Swap: ~$2-10

### Fair Launch
- Pump.fun: ~$3
- DEX listings: $10-100

## 🔧 Configuration

### Fee Customization
Edit `js/config.js`:
```javascript
fees: {
    tokenCreation: {
        ethereum: { standard: 0.05, tax: 0.08 }
        // Adjust as needed
    }
}
```

### Chain Configuration
Add/remove chains in `CONFIG.chains`:
```javascript
newchain: {
    name: 'New Chain',
    chainId: 999,
    rpcUrl: 'https://rpc.newchain.com',
    nativeCurrency: 'NEW',
    explorer: 'https://explorer.newchain.com'
}
```

### Launch Platform Integration
Add platforms in `CONFIG.launchPlatforms`:
```javascript
solana: [
    {
        id: 'newplatform',
        name: 'New Platform',
        icon: '🆕',
        description: 'Description',
        fee: 0.1
    }
]
```

## 🛠️ Troubleshooting

### Wallet Won't Connect
- Ensure wallet extension is installed
- Check you're on correct network
- Try refreshing the page
- Clear browser cache

### Transaction Fails
- Check sufficient balance for fees
- Verify token address is correct
- Ensure recipient addresses are valid
- Try increasing gas limit

### Slow Performance
- Use faster RPC endpoint
- Reduce batch size for multi-operations
- Choose less congested network
- Enable browser hardware acceleration

## 🔐 Security Tips

1. **Never share private keys** - We never ask for them
2. **Verify transactions** - Always review before signing
3. **Use testnets first** - Test with fake tokens
4. **Backup everything** - Save addresses and keys securely
5. **Check smart contracts** - Verify on block explorer

## 📱 Mobile Usage

The platform is mobile-responsive! Use with:
- MetaMask Mobile
- Phantom Mobile
- Trust Wallet
- Any browser with wallet support

## 🆘 Getting Help

### Common Issues

**"Insufficient funds for gas"**
- Add more native currency to your wallet
- Choose cheaper chain (Polygon/BSC)

**"Token already exists"**
- Change token name/symbol
- Verify you're on correct chain

**"Transaction timeout"**
- Network congestion - try again
- Increase gas price
- Use different RPC

### Support Channels

- 📧 Email: support@tokenforge.pro
- 💬 Discord: discord.gg/tokenforge
- 📱 Telegram: t.me/tokenforge
- 🐦 Twitter: @tokenforge

## 🎓 Learn More

- [Full Documentation](README.md)
- [API Reference](docs/API.md)
- [Video Tutorials](https://youtube.com/@tokenforge)
- [Blog Articles](https://blog.tokenforge.pro)

## 🎯 Next Steps

### For Beginners
1. Start on testnet
2. Create a simple token
3. Test multi-sender with small amounts
4. Join our Discord community

### For Advanced Users
1. Explore API integration
2. Build custom workflows
3. Use white-label features
4. Contribute to open source

### For Projects
1. Schedule a demo call
2. Explore enterprise features
3. Discuss custom integrations
4. Get white-label licensing

## 💎 Pro Tips

1. **Batch operations save gas** - Use multi-tools when possible
2. **Test on cheap chains first** - Polygon/BSC for testing
3. **Use vanity addresses** - More memorable for users
4. **Launch on multiple platforms** - Maximize exposure
5. **Keep some native currency** - Always have gas funds

## 🎉 Success Stories

> "Launched our token in 2 minutes on Pump.fun. Hit $100K market cap in an hour!" - DeFi Project

> "Saved over $5000 in gas fees using multi-sender vs individual transactions." - NFT Community

> "The vanity address feature made our token instantly recognizable." - Meme Coin Creator

---

**Ready to forge your tokens?** 🔨

[Open TokenForge Pro →](index.html)
