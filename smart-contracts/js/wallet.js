// Ultra-Comprehensive Wallet Manager - Checks Everything!
console.log('🔄 Loading Enhanced Wallet Manager...');

const walletManager = {
    connected: false,
    address: null,
    chainId: null,
    walletType: null,
    provider: null,
    detectionAttempts: 0,
    maxAttempts: 10,

    async init() {
        console.log('🚀 Initializing Enhanced Wallet Manager...');
        
        // Try multiple times with increasing delays
        await this.detectWithRetry();
        
        // Setup connect button
        const btn = document.getElementById('connectWallet');
        if (btn) {
            btn.onclick = () => this.showWalletSelector();
            console.log('✅ Connect button configured');
        }
    },

    async detectWithRetry() {
        const delays = [0, 100, 300, 500, 1000, 2000, 3000, 4000, 5000, 6000];
        
        for (let i = 0; i < this.maxAttempts; i++) {
            this.detectionAttempts = i + 1;
            console.log(`🔍 Detection attempt ${this.detectionAttempts}/${this.maxAttempts}...`);
            
            const detected = await this.detectWallets();
            
            if (detected.length > 0) {
                console.log(`✅ Found ${detected.length} wallet(s) on attempt ${this.detectionAttempts}`);
                break;
            }
            
            if (i < this.maxAttempts - 1) {
                console.log(`⏳ Waiting ${delays[i + 1]}ms before next attempt...`);
                await new Promise(resolve => setTimeout(resolve, delays[i + 1]));
            }
        }
    },

    async detectWallets() {
        console.log('🔍 Scanning for wallet providers...');
        console.log('Current window properties:');
        console.log('  window.ethereum:', typeof window.ethereum);
        console.log('  window.solana:', typeof window.solana);
        console.log('  window.phantom:', typeof window.phantom);
        console.log('  window.web3:', typeof window.web3);
        
        const detected = [];

        // Method 1: Check window.ethereum
        if (typeof window.ethereum !== 'undefined') {
            console.log('✅ window.ethereum exists!');
            console.log('  isMetaMask:', window.ethereum.isMetaMask);
            console.log('  isCoinbaseWallet:', window.ethereum.isCoinbaseWallet);
            console.log('  isTrust:', window.ethereum.isTrust);
            console.log('  isPhantom:', window.ethereum.isPhantom);
            console.log('  isBraveWallet:', window.ethereum.isBraveWallet);
            
            if (window.ethereum.isMetaMask) detected.push('metamask');
            if (window.ethereum.isCoinbaseWallet) detected.push('coinbase');
            if (window.ethereum.isTrust) detected.push('trust');
            if (window.ethereum.isPhantom && !window.solana) detected.push('phantom-eth');
            if (window.ethereum.isBraveWallet) detected.push('brave');
        } else {
            console.log('❌ window.ethereum NOT found');
        }

        // Method 2: Check window.solana
        if (typeof window.solana !== 'undefined') {
            console.log('✅ window.solana exists!');
            console.log('  isPhantom:', window.solana.isPhantom);
            if (window.solana.isPhantom) detected.push('phantom');
        } else {
            console.log('❌ window.solana NOT found');
        }

        // Method 3: Check window.phantom
        if (typeof window.phantom !== 'undefined') {
            console.log('✅ window.phantom exists!');
            if (window.phantom.solana) detected.push('phantom');
            if (window.phantom.ethereum) detected.push('phantom-eth');
        } else {
            console.log('❌ window.phantom NOT found');
        }

        // Method 4: Check specific providers
        if (typeof window.safepalProvider !== 'undefined') {
            console.log('✅ SafePal detected');
            detected.push('safepal');
        }

        if (typeof window.okxwallet !== 'undefined') {
            console.log('✅ OKX Wallet detected');
            detected.push('okx');
        }

        if (typeof window.BinanceChain !== 'undefined') {
            console.log('✅ Binance Wallet detected');
            detected.push('binance');
        }

        // Method 5: Check window.web3 (legacy)
        if (typeof window.web3 !== 'undefined') {
            console.log('✅ window.web3 exists (legacy)');
            if (!detected.includes('metamask')) {
                detected.push('web3-legacy');
            }
        }

        console.log(`📊 Detection Summary: Found ${detected.length} wallet(s):`, detected);
        return detected;
    },

    showWalletSelector() {
        console.log('💼 Opening wallet selector...');
        
        // Force a fresh detection
        const wallets = this.getAvailableWallets();
        
        console.log('Available wallets:', wallets);
        
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.id = 'walletSelectorModal';
        
        let content = `
            <div class="modal-content" style="max-width: 600px;">
                <h2 class="modal-title">Connect Wallet</h2>
        `;

        if (wallets.available.length === 0) {
            // No wallets detected - show helpful troubleshooting
            content += `
                <div class="warning-box" style="margin: 1rem 0;">
                    <strong>⚠️ No Wallet Extensions Detected</strong>
                </div>
                
                <div style="background: #0a0e1a; padding: 1.5rem; border-radius: 8px; margin: 1rem 0; text-align: left;">
                    <h3 style="color: #ffaa00; margin-bottom: 1rem;">🔧 Troubleshooting Steps:</h3>
                    
                    <div style="margin-bottom: 1rem;">
                        <strong style="color: #00ff88;">1. Check Extensions Are Installed</strong>
                        <ul style="margin: 0.5rem 0 0 1.5rem; color: #8892b0;">
                            <li>Open: <code>chrome://extensions</code></li>
                            <li>Look for MetaMask, Phantom, etc.</li>
                            <li>Make sure they're <strong>enabled</strong> (toggle ON)</li>
                        </ul>
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <strong style="color: #00ff88;">2. Unlock Your Wallet</strong>
                        <ul style="margin: 0.5rem 0 0 1.5rem; color: #8892b0;">
                            <li>Click the extension icon in Chrome toolbar</li>
                            <li>Enter your password</li>
                            <li>Then refresh this page</li>
                        </ul>
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <strong style="color: #00ff88;">3. Refresh the Page</strong>
                        <ul style="margin: 0.5rem 0 0 1.5rem; color: #8892b0;">
                            <li>Press F5 or Ctrl+R</li>
                            <li>Wallets may need a fresh page load</li>
                        </ul>
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <strong style="color: #00ff88;">4. Check Incognito Mode</strong>
                        <ul style="margin: 0.5rem 0 0 1.5rem; color: #8892b0;">
                            <li>Extensions disabled in incognito by default</li>
                            <li>Go to chrome://extensions</li>
                            <li>Enable "Allow in incognito" for your wallet</li>
                        </ul>
                    </div>
                </div>
                
                <div style="margin-top: 1.5rem;">
                    <h3 style="color: #00ff88; margin-bottom: 1rem;">📥 Install a Wallet:</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                        <a href="https://metamask.io/download/" target="_blank" class="btn-secondary" style="text-decoration: none; display: block; padding: 1rem;">
                            🦊 Get MetaMask
                        </a>
                        <a href="https://phantom.app/download" target="_blank" class="btn-secondary" style="text-decoration: none; display: block; padding: 1rem;">
                            👻 Get Phantom
                        </a>
                        <a href="https://www.coinbase.com/wallet" target="_blank" class="btn-secondary" style="text-decoration: none; display: block; padding: 1rem;">
                            🔵 Get Coinbase
                        </a>
                        <a href="https://trustwallet.com/download" target="_blank" class="btn-secondary" style="text-decoration: none; display: block; padding: 1rem;">
                            ⭐ Get Trust Wallet
                        </a>
                    </div>
                </div>
                
                <button class="btn-primary" onclick="window.location.reload()" style="width: 100%; margin-top: 1rem;">
                    🔄 Refresh Page & Check Again
                </button>
            `;
        } else {
            // Show detected wallets
            content += `
                <p style="color: #8892b0; margin-bottom: 1.5rem;">
                    Choose your wallet to connect
                </p>
                
                <div style="margin-bottom: 1.5rem;">
                    <h3 style="color: #00ff88; margin-bottom: 1rem; font-size: 1rem;">✅ Available Wallets</h3>
            `;
            
            wallets.available.forEach(wallet => {
                content += `
                    <button class="btn-primary" onclick="walletManager.connectSpecificWallet('${wallet.key}')" 
                        style="width: 100%; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 1rem; justify-content: flex-start; padding: 1rem 1.5rem;">
                        <span style="font-size: 1.5rem;">${wallet.icon}</span>
                        <div style="text-align: left;">
                            <div style="font-weight: 700;">${wallet.name}</div>
                            <div style="font-size: 0.8rem; opacity: 0.7;">${wallet.description}</div>
                        </div>
                    </button>
                `;
            });
            
            content += '</div>';
        }
        
        content += `
                <button class="btn-secondary" onclick="document.getElementById('walletSelectorModal').remove()" 
                    style="width: 100%; margin-top: 1rem;">
                    Cancel
                </button>
            </div>
        `;
        
        modal.innerHTML = content;
        document.body.appendChild(modal);
    },

    getAvailableWallets() {
        const available = [];
        const notInstalled = [];

        // Define all wallets we support
        const walletConfigs = {
            metamask: {
                name: 'MetaMask',
                icon: '🦊',
                description: 'Most popular Ethereum wallet',
                check: () => window.ethereum?.isMetaMask,
                provider: () => window.ethereum,
                installUrl: 'https://metamask.io/download/'
            },
            phantom: {
                name: 'Phantom',
                icon: '👻',
                description: 'Solana & Ethereum wallet',
                check: () => window.solana?.isPhantom || window.phantom?.solana,
                provider: () => window.solana || window.phantom?.solana,
                installUrl: 'https://phantom.app/download'
            },
            coinbase: {
                name: 'Coinbase Wallet',
                icon: '🔵',
                description: 'Coinbase exchange wallet',
                check: () => window.ethereum?.isCoinbaseWallet,
                provider: () => window.ethereum,
                installUrl: 'https://www.coinbase.com/wallet'
            },
            trust: {
                name: 'Trust Wallet',
                icon: '⭐',
                description: 'Multi-chain mobile wallet',
                check: () => window.ethereum?.isTrust,
                provider: () => window.ethereum,
                installUrl: 'https://trustwallet.com/download'
            },
            brave: {
                name: 'Brave Wallet',
                icon: '🦁',
                description: 'Built into Brave browser',
                check: () => window.ethereum?.isBraveWallet,
                provider: () => window.ethereum,
                installUrl: 'https://brave.com/wallet/'
            },
            safepal: {
                name: 'SafePal',
                icon: '🛡️',
                description: 'Hardware + software wallet',
                check: () => window.safepalProvider || window.ethereum?.isSafePal,
                provider: () => window.safepalProvider || window.ethereum,
                installUrl: 'https://www.safepal.com/download'
            }
        };

        // Check each wallet
        for (const [key, config] of Object.entries(walletConfigs)) {
            try {
                if (config.check()) {
                    available.push({ key, ...config });
                    console.log(`✅ ${config.name} is available`);
                } else {
                    notInstalled.push({ key, ...config });
                }
            } catch (e) {
                console.log(`⚠️ Error checking ${config.name}:`, e.message);
                notInstalled.push({ key, ...config });
            }
        }

        return { available, notInstalled };
    },

    async connectSpecificWallet(walletKey) {
        console.log(`🔌 Connecting to ${walletKey}...`);
        
        // Close modal
        document.getElementById('walletSelectorModal')?.remove();
        
        try {
            if (walletKey === 'phantom') {
                await this.connectPhantom();
            } else {
                await this.connectEVM(walletKey);
            }
        } catch (error) {
            console.error('Connection error:', error);
            this.showError(walletKey, error);
        }
    },

    async connectEVM(walletKey) {
        let provider = window.ethereum;
        
        if (walletKey === 'safepal' && window.safepalProvider) {
            provider = window.safepalProvider;
        }
        
        if (!provider) {
            throw new Error('Provider not found');
        }

        console.log('Requesting accounts...');
        const accounts = await provider.request({
            method: 'eth_requestAccounts'
        });

        console.log('Got accounts:', accounts);

        this.connected = true;
        this.address = accounts[0];
        this.provider = provider;
        this.walletType = walletKey;

        const chainId = await provider.request({ method: 'eth_chainId' });
        this.chainId = parseInt(chainId, 16);

        // Setup listeners
        provider.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
                this.disconnect();
            } else {
                this.address = accounts[0];
                this.updateUI();
            }
        });

        provider.on('chainChanged', () => {
            window.location.reload();
        });

        console.log('✅ Connected successfully!');
        this.updateUI();
        this.showSuccess(walletKey);
    },

    async connectPhantom() {
        const provider = window.solana || window.phantom?.solana;
        
        if (!provider) {
            throw new Error('Phantom not found');
        }

        console.log('Connecting to Phantom...');
        const resp = await provider.connect();

        this.connected = true;
        this.address = resp.publicKey.toString();
        this.provider = provider;
        this.walletType = 'phantom';
        this.chainId = 'solana';

        provider.on('disconnect', () => {
            this.disconnect();
        });

        console.log('✅ Phantom connected!');
        this.updateUI();
        this.showSuccess('phantom');
    },

    disconnect() {
        this.connected = false;
        this.address = null;
        this.chainId = null;
        this.walletType = null;
        this.provider = null;
        this.updateUI();
        this.showToast('Disconnected', '🔌', '#ff3366');
    },

    updateUI() {
        const status = document.getElementById('walletStatus');
        const btn = document.getElementById('connectWallet');
        
        if (!status || !btn) return;
        
        if (this.connected && this.address) {
            const short = `${this.address.substring(0,6)}...${this.address.substring(this.address.length - 4)}`;
            
            const walletIcons = {
                metamask: '🦊',
                phantom: '👻',
                coinbase: '🔵',
                trust: '⭐',
                brave: '🦁',
                safepal: '🛡️'
            };
            
            const icon = walletIcons[this.walletType] || '👛';
            
            status.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; gap: 0.75rem; flex-wrap: wrap;">
                    <span style="font-size: 1.2rem;">${icon}</span>
                    <span style="color: #00ff88; font-weight: 700;">${short}</span>
                </div>
            `;
            
            btn.textContent = 'Disconnect';
            btn.onclick = () => this.disconnect();
        } else {
            status.textContent = 'Connect your wallet to get started';
            btn.textContent = 'Connect Wallet';
            btn.onclick = () => this.showWalletSelector();
        }
    },

    showSuccess(walletKey) {
        const names = {
            metamask: 'MetaMask',
            phantom: 'Phantom',
            coinbase: 'Coinbase Wallet',
            trust: 'Trust Wallet',
            brave: 'Brave Wallet',
            safepal: 'SafePal'
        };
        
        this.showToast(`Connected to ${names[walletKey]}!`, '✅', '#00ff88', 
            `Address: ${this.address.substring(0,10)}...`);
    },

    showError(walletKey, error) {
        let message = error.message || 'Unknown error';
        
        if (error.code === 4001) {
            message = 'You rejected the connection';
        } else if (error.code === -32002) {
            message = 'Request pending - check wallet';
        }
        
        this.showToast('Connection Failed', '❌', '#ff3366', message);
    },

    showToast(title, icon, color, subtitle = '') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: ${color};
            color: ${color === '#00ff88' ? '#0a0e1a' : 'white'};
            padding: 1.5rem;
            border-radius: 12px;
            font-weight: 700;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
        `;
        
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="font-size: 1.5rem;">${icon}</span>
                <div>
                    <div>${title}</div>
                    ${subtitle ? `<div style="font-size: 0.85rem; opacity: 0.9; margin-top: 0.25rem;">${subtitle}</div>` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }
};

// Initialize
window.walletManager = walletManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => walletManager.init());
} else {
    walletManager.init();
}

console.log('✅ Enhanced Wallet Manager loaded');
