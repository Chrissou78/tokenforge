# 📤 Multi-Chain Bulk Sender - Complete Guide

## Overview

The Multi-Chain Bulk Sender allows you to send native coins or tokens to unlimited recipients across multiple blockchains with automatic batch splitting.

## Key Features

✅ **Unlimited Recipients** - No hard limits, auto-splits into batches
✅ **6 Blockchains** - Ethereum, Polygon, BSC, Arbitrum, Solana, Sui
✅ **Native & Tokens** - Send coins (ETH, BNB, SOL) or tokens (ERC20, SPL)
✅ **CSV Import** - Upload large recipient lists easily
✅ **Progress Tracking** - Real-time status for each transaction
✅ **Batch Processing** - Automatic splitting with delays between batches
✅ **Results Export** - CSV with all transaction hashes

## Platform Fee

**Fee Structure:**
- **Rate:** 0.5% of total transfer amount
- **Minimum:** 0.001 native tokens
- **Collection:** Before transfers begin (first transaction)
- **Purpose:** Platform development and maintenance

**Fee Examples:**
```
Transfer 10 ETH → Fee: 0.05 ETH
Transfer 100 MATIC → Fee: 0.5 MATIC  
Transfer 0.1 SOL → Fee: 0.001 SOL (minimum)
```

## How It Works

### Step 1: Connect Wallet
- Click "Connect Wallet"
- Choose MetaMask (EVM) or Phantom (Solana)
- Approve connection

### Step 2: Configure Transfer
- Select blockchain
- Choose transfer type:
  - **Native:** ETH, BNB, MATIC, SOL, SUI
  - **Token:** Enter contract address
- Native automatically selected

### Step 3: Add Recipients

**Option A: Manual Entry**
```
0x1234567890123456789012345678901234567890, 0.1
0xabcdefabcdefabcdefabcdefabcdefabcdefabcd, 0.2
0x9876543210987654321098765432109876543210, 0.15
```

**Option B: CSV Upload**
```csv
address,amount
0x1234567890123456789012345678901234567890,0.1
0xabcdefabcdefabcdefabcdefabcdefabcdefabcd,0.2
0x9876543210987654321098765432109876543210,0.15
```

### Step 4: Validate
- Click "Validate Recipients"
- System checks:
  - Address format (correct for selected chain)
  - Amount validity (positive numbers)
  - Batch count (if splitting needed)
- Shows confirmation with batch info

### Step 5: Review
**You'll see:**
- Total recipients
- Total amount
- **Platform fee (0.5%)**
- Estimated gas
- List of all recipients

**Payment Breakdown Example:**
```
Recipients Total: 10 ETH
Platform Fee (0.5%): 0.05 ETH
Gas Fees (est.): ~$25
Total Required: 10.05 ETH + Gas
```

### Step 6: Execute
**Processing Order:**
1. **Platform fee collected** (first transaction)
2. Batch 1 processed (e.g., 50 recipients)
3. 3-second delay
4. Batch 2 processed (next 50)
5. Continues until all complete

**Progress Display:**
```
Processing Batch 2/5 (50 recipients)

Completed: 85 / 250
Failed: 2
Remaining: 163

[████████████░░░░░░] 34%
```

### Step 7: Results
- Summary stats (successful/failed/total)
- Complete transaction list with links
- Export to CSV with all details

## Batch Processing

### Automatic Splitting

**Small (1-50 recipients):**
- No splitting needed
- Direct processing
- Time: ~2-5 minutes

**Medium (51-200 recipients):**
- Split into 2-4 batches
- Auto-configured
- Time: ~10-20 minutes

**Large (201-1000 recipients):**
- Split into 5-20 batches
- 3-second delays between batches
- Time: ~45-90 minutes

**Extra Large (1000+ recipients):**
- Split into 20+ batches
- Keep browser tab open
- Time: 2-5 hours depending on size

### Batch Sizes by Chain

| Chain | Batch Size | Gas Cost |
|-------|-----------|----------|
| Ethereum | 50 | High |
| Polygon | 100 | Very Low |
| BSC | 100 | Low |
| Arbitrum | 100 | Medium |
| Solana | 100 | Very Low |
| Sui | 100 | Low |

**Why Different Sizes?**
- Ethereum has higher gas costs → smaller batches
- L2s and alts have low fees → larger batches

## CSV Format

### Template Structure
```csv
address,amount
0x1234567890123456789012345678901234567890,0.1
0xabcdefabcdefabcdefabcdefabcdefabcdefabcd,0.2
```

### Rules
1. **First line:** Must be `address,amount`
2. **Subsequent lines:** One recipient per line
3. **Address:** Full address for selected chain
4. **Amount:** Decimal number (e.g., 0.1, 1.5, 100)
5. **Separator:** Comma (no spaces around it)

### Download Template
Click "Download CSV Template" button to get a pre-formatted file.

## Address Formats

### Ethereum/EVM Chains
- Format: `0x` + 40 hexadecimal characters
- Example: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`
- Length: 42 characters total

### Solana
- Format: Base58 encoded (A-Z, a-z, 1-9, no 0OIl)
- Example: `DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK`
- Length: 32-44 characters

### Sui
- Format: `0x` + 64 hexadecimal characters
- Example: `0xc2b5625c221264078310a084df0a3137956d20ee56b8b7b1f855691bab556d5d`
- Length: 66 characters total

## Gas Fee Estimates

### Ethereum Mainnet
```
50 recipients × $0.50/tx = ~$25
100 recipients × $0.50/tx = ~$50
500 recipients × $0.50/tx = ~$250
```

### Polygon/BSC
```
100 recipients × $0.01/tx = ~$1
500 recipients × $0.01/tx = ~$5
1000 recipients × $0.01/tx = ~$10
```

### Solana
```
100 recipients × $0.00025/tx = ~$0.025
1000 recipients × $0.00025/tx = ~$0.25
5000 recipients × $0.00025/tx = ~$1.25
```

### Tips for Gas Management
- Check current gas prices before large batches
- Use Polygon/BSC for large distributions (much cheaper)
- Keep 20% extra native tokens for gas buffer
- Monitor network congestion

## Results Export

### CSV Contents
```csv
Type,Batch,Address,Amount,Status,Transaction Hash,Error
Platform Fee,0,"0x742d...bEb",0.05,success,"0xabc...def",""
Transfer,1,"0x1234...5678",0.1,success,"0x123...789",""
Transfer,1,"0xabcd...efgh",0.2,success,"0x456...abc",""
Transfer,2,"0x9876...5432",0.15,error,"","Insufficient gas"
```

### Fields Explained
- **Type:** Platform Fee or Transfer
- **Batch:** Batch number (0 for fee, 1+ for transfers)
- **Address:** Recipient address
- **Amount:** Amount sent
- **Status:** success or error
- **Transaction Hash:** Blockchain TX hash (view on explorer)
- **Error:** Error message (if failed)

### Using Results
- **Record Keeping:** Permanent record of all transactions
- **Verification:** Check which recipients received funds
- **Troubleshooting:** Identify failed transactions
- **Accounting:** Track platform fees and amounts sent

## Common Use Cases

### 1. Token Airdrop
```
Recipients: 500 community members
Amount: 1000 tokens each
Chain: Polygon (low fees)
Platform Fee: 5,000 tokens
Gas: ~$5
Time: ~25 minutes
```

### 2. Team Payroll
```
Recipients: 25 employees
Amount: Varies per person
Chain: Ethereum
Platform Fee: 0.5% of total
Gas: ~$15
Time: ~3 minutes
```

### 3. NFT Mint Refunds
```
Recipients: 300 failed mints
Amount: 0.08 ETH each = 24 ETH
Chain: Ethereum
Platform Fee: 0.12 ETH
Gas: ~$150
Time: ~30 minutes
```

### 4. Contest Winners
```
Recipients: 50 winners
Amount: Prize pool split
Chain: BSC
Platform Fee: 0.5% of pool
Gas: ~$0.50
Time: ~3 minutes
```

## Troubleshooting

### "No wallet detected"
**Solution:**
- Install MetaMask or Phantom
- Enable extension in chrome://extensions
- Unlock wallet (enter password)
- Refresh page

### "Transaction failed: Insufficient funds"
**Solutions:**
- Check you have enough tokens for all recipients
- Check you have enough for platform fee (0.5%)
- Keep extra native tokens for gas fees
- Try smaller batch first

### "Invalid address format"
**Solutions:**
- Verify address matches selected chain
- EVM: Must start with 0x and be 42 chars
- Solana: Must be 32-44 Base58 characters
- No spaces or special characters

### "CSV upload not working"
**Solutions:**
- Verify format: `address,amount`
- Check file extension is .csv
- No extra columns or data
- Download and use provided template

### "Transaction stuck/pending"
**Solutions:**
- Check network status on block explorer
- May need to wait during congestion
- For EVM: Can speed up with higher gas
- Be patient - especially on Ethereum

## Security Notes

### ⚠️ Critical Reminders

1. **Verify All Addresses**
   - Wrong address = permanent loss
   - Double-check before confirming
   - Test with small amount first

2. **Review Platform Fee**
   - Clearly shown before confirmation
   - 0.5% of total amount
   - Minimum 0.001 tokens
   - Collected before transfers

3. **Gas Fee Management**
   - Keep extra native tokens
   - Monitor network congestion
   - Consider L2s for large batches

4. **Private Key Safety**
   - Never share private keys
   - Use hardware wallet for large amounts
   - Secure your wallet password

5. **Test First**
   - Always start with 2-3 test recipients
   - Use small amounts initially
   - Verify transactions complete
   - Then scale up

## Best Practices

### Before Starting
- [ ] Wallet connected and unlocked
- [ ] Correct chain selected
- [ ] Sufficient balance (amount + fee + gas)
- [ ] Addresses verified
- [ ] CSV format validated (if using)

### During Processing
- [ ] Keep browser tab open
- [ ] Don't close or refresh
- [ ] Monitor progress stats
- [ ] Check failed transactions

### After Completion
- [ ] Export results CSV
- [ ] Verify all successful transactions
- [ ] Check failed items (if any)
- [ ] Keep records for accounting

### For Large Batches (500+)
- [ ] Use low-fee chains (Polygon/BSC)
- [ ] Ensure stable internet
- [ ] Keep device powered/charged
- [ ] Allow sufficient time (2-4 hours)
- [ ] Export results immediately

## Support

### Getting Help
- Check this README first
- Review error messages
- Export results for analysis
- Check blockchain explorer for TX status

### Transaction Failed?
- View TX on block explorer
- Check error message in results
- Verify gas/balance sufficient
- Try with smaller batch
- Contact support with TX hash

## Summary

The Multi-Chain Bulk Sender is a powerful tool for distributing tokens or coins to multiple recipients. With unlimited recipient support, automatic batch splitting, and comprehensive tracking, it handles distributions of any scale.

**Key Takeaways:**
- 0.5% platform fee (min 0.001 tokens)
- Unlimited recipients with auto-batching
- CSV import for easy bulk upload
- Complete transaction tracking
- Multi-chain support
- Export results for records

**Ready to start?** Connect your wallet and begin distributing!

---

**TokenForge Pro Multi-Sender** | Efficient Multi-Chain Bulk Transfers
