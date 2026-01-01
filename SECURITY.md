# Security Policy

## 🔐 Security Overview

TokenForge Pro is a client-side web application for creating tokens and managing wallets across multiple blockchains. Security is our top priority, but users must understand the inherent risks when dealing with private keys and cryptocurrency.

---

## ⚠️ Critical Security Warnings

### For Users

**NEVER share your private keys or seed phrases with anyone, including TokenForge team members.**

1. **Private Keys = Full Control**
   - Anyone with your private key has complete access to your funds
   - Private keys cannot be recovered if lost
   - Store multiple encrypted backups in secure locations

2. **Seed Phrases = Master Key**
   - 12-24 word seed phrases can restore your entire wallet
   - Write them down on paper (never digital unless encrypted)
   - Store in multiple secure physical locations
   - Never take photos or store in cloud services unencrypted

3. **CSV Exports Contain Everything**
   - Exported CSV files contain private keys AND seed phrases
   - Always encrypt CSV files before storing (use password-protected archives)
   - Delete CSV files after securely backing up
   - Never email, upload, or share unencrypted CSV files

4. **Browser Security**
   - All generation happens locally in YOUR browser
   - Clear browser cache after generating sensitive data
   - Use incognito/private mode for extra privacy
   - Disable unnecessary browser extensions
   - Keep your browser and OS updated

5. **Testnet First**
   - Always test on testnet before mainnet deployment
   - Start with small amounts when testing on mainnet
   - Verify all parameters before deploying tokens

---

## 🛡️ Supported Versions

| Version | Supported          | Status |
| ------- | ------------------ | ------ |
| 1.x     | :white_check_mark: | Active |
| < 1.0   | :x:                | Deprecated |

---

## 🚨 Reporting a Vulnerability

**DO NOT open public issues for security vulnerabilities.**

### How to Report

1. **Email:** security@tokenforge.pro (or create private security advisory on GitHub)
2. **Include:**
   - Detailed description of the vulnerability
   - Steps to reproduce
   - Potential impact assessment
   - Affected versions
   - Suggested fix (if any)
   - Your contact information for follow-up

### What to Expect

- **Within 48 hours:** Initial response confirming receipt
- **Within 7 days:** Assessment and severity classification
- **Within 30 days:** Fix or mitigation plan
- **Disclosure:** Coordinated disclosure after fix is released

### Severity Classification

- **Critical:** Immediate risk to user funds or private keys
- **High:** Security bypass or privilege escalation
- **Medium:** Limited information disclosure
- **Low:** Minor security concerns

---

## 🔍 Known Limitations & Risks

### Application Limitations

1. **Client-Side Generation**
   - All key generation happens in browser JavaScript
   - If device is compromised, keys may be intercepted
   - Malicious browser extensions could access data
   - Memory dumps could expose private keys

2. **Price Oracle Dependency**
   - Relies on CoinGecko API for fee calculations
   - Price data may be delayed or unavailable
   - Fallback values are estimates only
   - Always verify fees manually

3. **No Backend**
   - No server-side validation or backup
   - No password recovery mechanism
   - User is 100% responsible for backups
   - Lost keys = lost access (no recovery possible)

4. **Smart Contract Risks**
   - Contracts are pre-compiled and immutable
   - Cannot be upgraded after deployment
   - User responsible for parameter validation
   - Deployment cannot be reversed

### Blockchain-Specific Risks

1. **Transaction Risks**
   - Gas price volatility
   - Network congestion delays
   - Failed transactions (gas fees still charged)
   - Irreversible transactions

2. **Contract Deployment**
   - Wrong parameters = permanent issues
   - Incorrect addresses = lost funds
   - Typos in token name/symbol = cannot fix
   - Wrong network = deployment on wrong chain

---

## ✅ Security Best Practices

### For Users

#### Before Using TokenForge Pro

- [ ] Update your browser to latest version
- [ ] Update your operating system
- [ ] Disable unnecessary browser extensions
- [ ] Use hardware wallet for large amounts
- [ ] Have a secure backup strategy ready

#### During Wallet Generation

- [ ] Use a secure, private computer
- [ ] Disconnect from internet (optional but recommended)
- [ ] Use incognito/private browsing mode
- [ ] Clear clipboard after copying keys
- [ ] Don't take screenshots of keys

#### After Generation

- [ ] Immediately back up seed phrases offline
- [ ] Store backups in multiple secure locations
- [ ] Test wallet import with seed phrase
- [ ] Clear browser cache and history
- [ ] Delete any unencrypted CSV files

#### When Deploying Tokens

- [ ] Test all parameters on testnet first
- [ ] Double-check all addresses
- [ ] Verify token name, symbol, and supply
- [ ] Start with small amounts
- [ ] Save contract address immediately

---

## 🔒 Security Features

### What We Do

1. **Local Generation**
   - All cryptographic operations in your browser
   - No data transmitted to any server
   - Uses Web Crypto API (cryptographically secure)

2. **No Data Collection**
   - No analytics on sensitive pages
   - No logging of private keys or addresses
   - No cookies for tracking

3. **Open Source**
   - All code is publicly auditable
   - Community can verify security
   - No hidden functionality

4. **Input Validation**
   - All inputs validated before processing
   - XSS protection on user inputs
   - Address format verification

### What We Don't Do

- ❌ We never ask for private keys
- ❌ We never transmit private keys anywhere
- ❌ We never store private keys on servers
- ❌ We never request seed phrases
- ❌ We don't have "support" access to wallets

---

## 🧪 Security Testing

### Automated Testing

- Input validation tests
- XSS injection tests
- CSRF protection tests
- Dependency vulnerability scanning

### Manual Review

- Code review process for all PRs
- Security-sensitive changes require 2+ reviews
- Regular security audits

### Third-Party Audits

- **Smart Contracts:** [Audit report link - Coming soon]
- **Web Application:** [Audit report link - Coming soon]
- **Last Updated:** 2026-01-01

---

## 🔐 Cryptographic Details

### Key Generation

- **Algorithm:** secp256k1 (Ethereum), ed25519 (Solana)
- **Random Source:** Web Crypto API `crypto.getRandomValues()`
- **Entropy:** 256 bits minimum
- **Libraries:** 
  - ethers.js (Ethereum)
  - @solana/web3.js (Solana)
  - @mysten/sui.js (Sui)

### Seed Phrases

- **Standard:** BIP39 mnemonic
- **Word List:** English (2048 words)
- **Lengths:** 12, 15, 18, 21, or 24 words
- **Derivation:** BIP44 hierarchical deterministic

---

## 🚫 Disclaimer

### Legal Notice

**USE AT YOUR OWN RISK**

This software is provided "AS IS" without warranty of any kind, either expressed or implied, including but not limited to warranties of merchantability and fitness for a particular purpose.

### No Liability

The developers and contributors of TokenForge Pro shall not be liable for:
- Loss of funds due to user error
- Security breaches on user's device
- Incorrect token parameters
- Failed deployments
- Network issues
- Smart contract bugs
- Any other damages arising from use

### User Responsibility

By using TokenForge Pro, you acknowledge that:
- You understand cryptocurrency and blockchain technology
- You accept all risks associated with crypto transactions
- You are solely responsible for securing your private keys
- You will not hold the developers liable for any losses
- You will comply with all applicable laws and regulations

---

## 📚 Security Resources

### Learn More

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web3 Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [Hardware Wallet Guide](https://www.ledger.com/academy)
- [Seed Phrase Security](https://blog.trezor.io/seed-phrase-keep-it-safe-4de9303c1f4e)

### Recommended Tools

- Hardware Wallets: Ledger, Trezor, SafePal
- Password Managers: 1Password, Bitwarden, KeePassXC
- 2FA Apps: Authy, Google Authenticator
- VPN Services: For additional privacy

---

## 📞 Contact

- **Security Issues:** security@tokenforge.pro
- **General Questions:** support@tokenforge.pro
- **GitHub:** [Issues](https://github.com/YOUR_USERNAME/tokenforge-pro/issues) (non-security only)

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-01 | Initial security policy created |

---

**Last Updated:** 2026-01-01  
**Next Review:** 2026-04-01

---

## ⚖️ Responsible Disclosure

We appreciate the security community's efforts to improve TokenForge Pro's security. We are committed to working with security researchers and will acknowledge contributions in our security advisories (with permission).

Thank you for helping keep TokenForge Pro and its users safe! 🛡️
