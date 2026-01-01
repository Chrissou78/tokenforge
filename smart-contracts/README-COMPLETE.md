# ⚒️ TokenForge Pro - Complete Package

## 🎯 Overview

TokenForge Pro is a comprehensive multi-chain token and wallet management platform supporting Ethereum, Solana, and Sui blockchains.

## ✅ Working Features

### 1. Wallet Connection
- ✅ MetaMask integration
- ✅ Phantom wallet support
- ✅ Auto-detection of installed wallets
- ✅ Multi-wallet support (MetaMask, Coinbase, Trust, SafePal, OKX, Binance)

### 2. Wallet Generator
- ✅ Generate wallets for any supported chain
- ✅ Includes address, private key, and seed phrase
- ✅ Export to CSV
- ✅ Copy individual fields

### 3. Vanity Wallet Generators ⭐ NEW!
Two powerful tools for creating custom wallet addresses:

#### A. Single Vanity Generator (`vanity-generator-simple.html`)
- Generate one vanity wallet at a time
- Real-time progress tracking
- Detailed statistics

#### B. Batch Vanity Generator (`vanity-generator.html`) ⭐ FEATURED
- **Random Batch Mode**: Generate 1-50 instant wallets
- **Vanity Batch Mode**: Find 1-10 vanity wallets matching your pattern
- Supports all 3 blockchains
- Export all wallets to single CSV

## 🚀 Quick Start

### Prerequisites
- Python 3.x installed
- Modern web browser (Chrome, Firefox, Edge)
- MetaMask or Phantom wallet extension (optional, for connection features)

### Installation

1. **Extract the package**
```bash
unzip tokenforge-pro-complete.zip
cd tokenforge-final
```

2. **Start the server**

**Windows:**
```bash
START-SERVER.bat
```

**Mac/Linux:**
```bash
chmod +x START-SERVER.sh
./START-SERVER.sh
```

**Manual:**
```bash
python START-SERVER.py
```

3. **Open in browser**
- Server will auto-open: http://localhost:8000
- Or manually navigate to: http://localhost:8000

## 📂 Project Structure

```
tokenforge-final/
├── index.html                      # Main platform interface
├── vanity-generator.html           # Batch vanity generator ⭐
├── vanity-generator-simple.html    # Single vanity generator
├── START-SERVER.py                 # Python server script
├── START-SERVER.bat                # Windows launcher
├── START-SERVER.sh                 # Mac/Linux launcher
├── css/
│   ├── main.css                    # Base styles
│   ├── components.css              # UI components
│   └── features.css                # Feature-specific styles
└── js/
    ├── wallet.js                   # Wallet connection logic
    ├── wallet-generator.js         # Wallet generation
    ├── multisender.js              # Multi-sender (placeholder)
    └── config.js                   # Chain configurations
```

## 🎯 Feature Guide

### Wallet Connection

1. Click "Connect Wallet" button
2. Choose from available wallets:
   - 🦊 MetaMask
   - 👻 Phantom
   - 🔵 Coinbase Wallet
   - ⭐ Trust Wallet
   - 🛡️ SafePal
   - And more...
3. Approve connection in wallet popup
4. Your address appears in the status bar

### Basic Wallet Generator

Located in the "Wallet Generator" tab:

1. Select blockchain (Ethereum/Solana/Sui)
2. Choose number of wallets (1-10)
3. Click "Generate"
4. Copy or export wallets

Each wallet includes:
- ✅ Public address
- ✅ Private key
- ✅ 12-word seed phrase

### Vanity Generator - Single Mode

Access: Click "Open Single Generator" in Vanity Tools tab

**Features:**
- Find one perfect vanity address
- Prefix, suffix, or contains pattern
- Real-time progress and statistics
- Case sensitive option

**Example:**
```
Pattern: cafe
Type: Prefix
Result: 0xCAFE1234567890abcdef...
```

### Vanity Generator - Batch Mode ⭐

Access: Click "Open Batch Generator" in Vanity Tools tab

**Two Modes:**

#### 🎲 Random Batch Mode
Generate multiple random wallets instantly:
- Select blockchain
- Set count (1-50)
- Generate in seconds
- All wallets include seed phrases

**Use Case:** Need 20 test wallets for development

#### ✨ Vanity Batch Mode
Find multiple vanity addresses:
- Set pattern (e.g., "cafe")
- Choose type (prefix/suffix/contains)
- Set count (1-10)
- Watch as each wallet is found
- Stop anytime and keep what's found

**Use Case:** Create 5 team wallets all starting with "Team"

## 🔤 Supported Patterns

### Ethereum & Sui
**Character Set:** Hex (0-9, a-f)

**Examples:**
- `cafe` → 0xCAFE1234...
- `dead` → ...5678DEAD
- `1234` → 0x1234567890...
- `abc` → 0xABC1234567...

### Solana
**Character Set:** Base58 (A-Z, a-z, 1-9, excluding 0OIl)

**Examples:**
- `Alice` → Alice7hG9xKm2...
- `Pump` → Pump5nG7xHy2...
- `Moon` → Moon9sK4mP6...
- `Bob` → Bob3yH5mNp9...

## ⏱️ Generation Time Estimates

| Pattern Length | Ethereum/Sui | Solana |
|---------------|--------------|---------|
| 3 characters  | < 1 second   | 1-3 seconds |
| 4 characters  | 1-10 seconds | 10-30 seconds |
| 5 characters  | 10-60 seconds | 1-5 minutes |
| 6 characters  | 2-30 minutes | 10-60 minutes |
| 7+ characters | Hours | Hours to days |

**Why Solana is slower:** Base58 has 58 possible characters per position vs hex's 16, resulting in exponentially more combinations to check.

## 💾 CSV Export Format

When exporting wallets, you'll get a CSV file with:

```csv
Number,Type,Blockchain,Address,PrivateKey,SeedPhrase
1,Random,ethereum,"0x1234...","0xabcd...","abandon ability able..."
2,Vanity,ethereum,"0xcafe...","0x5678...","acquire across act..."
3,Random,solana,"Abc123...","1a2b3c...","adapt add addict..."
```

**Opens in:**
- Microsoft Excel
- Google Sheets
- LibreOffice Calc
- Any CSV reader

## 🔐 Security Notes

### ⚠️ CRITICAL - READ CAREFULLY

1. **Private Keys = Full Control**
   - Anyone with your private key owns your wallet
   - Never share private keys with anyone
   - Never upload to cloud unencrypted

2. **Seed Phrases = Master Key**
   - 12 words can restore your entire wallet
   - Write them down on paper
   - Store in multiple secure locations
   - Never store digitally unencrypted

3. **CSV Files Contain Everything**
   - Exported CSVs have private keys AND seed phrases
   - Encrypt CSV files before storing
   - Use password-protected archives
   - Never email or share unencrypted

4. **Local Generation Only**
   - All generation happens in YOUR browser
   - No data sent to any server
   - Uses cryptographically secure randomness
   - You can disconnect from internet while generating

5. **Test Before Using**
   - Generate test wallets first
   - Send small amounts initially
   - Verify you can import seed phrases
   - Confirm private keys work

## 💡 Usage Examples

### Example 1: Development Testing
```
Goal: Need 10 test wallets for dApp testing

Solution: Batch Random Generator
1. Open vanity-generator.html
2. Select "Random Batch" mode
3. Choose Ethereum
4. Set count: 10
5. Click Generate
6. Export CSV
7. Import seed phrases to MetaMask

Time: < 5 seconds
```

### Example 2: Personalized Wallet
```
Goal: Want address starting with "cafe"

Solution: Single Vanity Generator
1. Open vanity-generator-simple.html
2. Select Ethereum
3. Pattern: cafe
4. Type: Prefix
5. Click Generate
6. Wait ~5 seconds
7. Get: 0xCAFE1234567890...

Time: 5-10 seconds
```

### Example 3: Team Wallets
```
Goal: Create 5 wallets for team, all with "Team" prefix

Solution: Batch Vanity Generator
1. Open vanity-generator.html
2. Select "Vanity Batch" mode
3. Choose Solana
4. Pattern: Team
5. Type: Prefix
6. Count: 5
7. Click Generate
8. Wait as each is found
9. Export all to CSV

Time: 2-5 minutes
Result: Team1abc..., Team2def..., Team3ghi..., etc.
```

### Example 4: Airdrop Farming
```
Goal: Create 20 wallets for airdrops

Solution: Batch Random Generator
1. Open vanity-generator.html
2. Select "Random Batch" mode
3. Choose desired chain
4. Set count: 20
5. Generate instantly
6. Export CSV
7. Use for airdrop campaigns

Time: < 5 seconds
```

## 🐛 Troubleshooting

### Wallet Not Detected

**Problem:** "No wallet detected" message

**Solutions:**
1. Install MetaMask or Phantom extension
2. Check extension is enabled: chrome://extensions
3. Unlock your wallet (enter password)
4. Refresh the page (F5)
5. Must use http://localhost, NOT file://
6. If in incognito: Enable extension for incognito mode

### Vanity Generator Not Starting

**Problem:** Click "Generate" but nothing happens

**Solutions:**
1. Check browser console (F12) for errors
2. Verify pattern uses correct characters:
   - Ethereum/Sui: 0-9, a-f only
   - Solana: A-Z, a-z, 1-9 (no 0OIl)
3. Try shorter pattern (3-4 chars)
4. Refresh page and try again

### Server Won't Start

**Problem:** START-SERVER script fails

**Solutions:**
1. Install Python: https://python.org
2. During install: CHECK "Add Python to PATH"
3. Restart terminal/command prompt
4. Try manual: `python -m http.server 8000`
5. If port 8000 busy, try: `python -m http.server 3000`

### CSV Won't Export

**Problem:** Export button does nothing

**Solutions:**
1. Check browser's download settings
2. Allow pop-ups for localhost
3. Check downloads folder
4. Try different browser
5. Some browsers auto-download to ~/Downloads

## 🔄 Updates & Maintenance

### Checking for Updates
Visit the original distribution source for updates.

### Backup Your Wallets
- Export CSVs after generating wallets
- Store encrypted backups in multiple locations
- Test restore process periodically

### Browser Compatibility
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Brave
- ⚠️ Safari (limited extension support)

## 📞 Support

### Resources
- README files in each directory
- Inline help text in the interface
- Console logs (F12) for debugging

### Best Practices
1. Always test with small amounts first
2. Use hardware wallets for large amounts
3. Keep software updated
4. Regular security audits of your wallets
5. Never trust, always verify

## 🎓 Educational Notes

### What is a Vanity Address?
A vanity address is a cryptocurrency wallet address that contains a specific pattern chosen by the user. Instead of a random string like `0x7a3f2...`, you can have `0xCAFE...` or `Alice...`.

### How Does Generation Work?
1. Generator creates random private key
2. Derives public address from private key
3. Checks if address matches your pattern
4. If match: Success! If not: Try again
5. Repeats until match found

### Why Does It Take Time?
- Each character position has 16 (hex) or 58 (Base58) possibilities
- Pattern "cafe" (4 chars) = 16^4 = 65,536 average attempts
- Pattern "cafes" (5 chars) = 16^5 = 1,048,576 average attempts
- Each additional character makes it ~16x harder

### Is It Secure?
Yes! The private keys are generated using cryptographically secure random number generation. The vanity pattern doesn't make the wallet less secure - it's just a cosmetic feature of the address.

## 📋 Feature Roadmap

### Working Now ✅
- Wallet connection (multi-wallet support)
- Basic wallet generator
- Single vanity generator
- Batch vanity generator (random + vanity)
- CSV export
- Seed phrase generation

### Planned Features 🚧
- Token creator (ERC20, SPL, Sui tokens)
- Multi-sender (batch token distribution)
- Multi-buyer (simultaneous purchases)
- Batch collector (collect from many wallets)
- Multi-swap (batch token swaps)
- Token cloner
- Fair launch tools

## 📄 License

This is a development tool. Use at your own risk. Always verify generated wallets work correctly before using with real funds.

## 🎉 Thank You!

Thank you for using TokenForge Pro! We hope these tools make your blockchain development and wallet management easier.

**Remember:** 
- 🔐 Keep your private keys safe
- 💾 Backup your seed phrases  
- 🧪 Test before using with real funds
- 🎯 Start small and scale up

Happy generating! ⚒️✨

---

**TokenForge Pro** | Multi-Chain Wallet & Token Platform | 2025
