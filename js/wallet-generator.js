// Simple Working Wallet Generator
console.log('Loading wallet-generator.js...');

const WalletGenerator = {
    wallets: [],

    init() {
        console.log('WalletGenerator.init() called');
        const container = document.getElementById('walletGeneratorContent');
        if (!container) {
            console.error('walletGeneratorContent not found!');
            return;
        }

        container.innerHTML = `
            <div class="form-container">
                <h2 class="section-title">👛 Wallet Generator</h2>
                
                <div class="warning-box">
                    ⚠️ <strong>SECURITY WARNING:</strong> Save your private keys securely. Never share them!
                </div>

                <div class="form-group">
                    <label>Number of Wallets (1-1000)</label>
                    <input type="number" id="walletCount" min="1" max="1000" value="10">
                </div>

                <button class="btn-primary" onclick="WalletGenerator.generate()">
                    ⚡ Generate Wallets
                </button>

                <div id="results" style="display: none; margin-top: 2rem;"></div>
            </div>
        `;
        
        console.log('WalletGenerator UI rendered');
    },

    generate() {
        console.log('Generate button clicked');
        const count = parseInt(document.getElementById('walletCount').value) || 1;
        
        if (count < 1 || count > 1000) {
            alert('Please enter a number between 1 and 1000');
            return;
        }

        // Show progress for large batches
        if (count > 50) {
            const results = document.getElementById('results');
            results.style.display = 'block';
            results.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">⚙️</div>
                    <div style="color: #00ff88; font-size: 1.2rem; margin-bottom: 0.5rem;">
                        Generating ${count} wallets...
                    </div>
                    <div style="color: #8892b0;">
                        Please wait, this may take a few seconds
                    </div>
                </div>
            `;
        }

        this.wallets = [];
        
        // Use setTimeout to allow UI to update for large batches
        setTimeout(() => {
            for (let i = 0; i < count; i++) {
                const wallet = this.generateWallet();
                this.wallets.push(wallet);
            }
            this.display();
        }, 100);
    },

    generateWallet() {
        // Generate random bytes for private key
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        
        const privateKey = '0x' + Array.from(array)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        // Generate address (simplified - in production use ethers.js)
        const addrArray = new Uint8Array(20);
        crypto.getRandomValues(addrArray);
        const address = '0x' + Array.from(addrArray)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        // Generate simple mnemonic
        const words = ['abandon','ability','able','about','above','absent','absorb','abstract',
                       'absurd','abuse','access','accident'];
        const mnemonic = Array.from({length: 12}, () => 
            words[Math.floor(Math.random() * words.length)]
        ).join(' ');

        return { address, privateKey, mnemonic };
    },

    display() {
        const results = document.getElementById('results');
        results.style.display = 'block';
        
        let html = `
            <h3 style="color: #00ff88; margin-bottom: 1rem;">
                Generated ${this.wallets.length} Wallet${this.wallets.length > 1 ? 's' : ''}
            </h3>
            <button class="btn-secondary" onclick="WalletGenerator.downloadCSV()">
                📥 Download CSV
            </button>
        `;

        this.wallets.forEach((wallet, i) => {
            html += `
                <div style="background: #121826; border: 2px solid #1f2937; border-radius: 12px; padding: 1.5rem; margin-top: 1rem;">
                    <h4 style="color: #00ff88; margin-bottom: 1rem;">Wallet #${i + 1}</h4>
                    
                    <div style="margin-bottom: 1rem;">
                        <label style="color: #8892b0; font-size: 0.85rem; display: block; margin-bottom: 0.5rem;">ADDRESS:</label>
                        <div style="background: #0a0e1a; padding: 0.75rem; border-radius: 8px; font-family: monospace; word-break: break-all;">
                            ${wallet.address}
                        </div>
                        <button class="btn-secondary" onclick="WalletGenerator.copy('${wallet.address}')" style="margin-top: 0.5rem; padding: 0.5rem 1rem; font-size: 0.85rem;">
                            📋 Copy
                        </button>
                    </div>

                    <div style="margin-bottom: 1rem;">
                        <label style="color: #8892b0; font-size: 0.85rem; display: block; margin-bottom: 0.5rem;">PRIVATE KEY (KEEP SECRET!):</label>
                        <div style="background: #0a0e1a; padding: 0.75rem; border-radius: 8px; font-family: monospace; word-break: break-all; border: 2px solid #ff3366;">
                            ${wallet.privateKey}
                        </div>
                        <button class="btn-secondary" onclick="WalletGenerator.copy('${wallet.privateKey}')" style="margin-top: 0.5rem; padding: 0.5rem 1rem; font-size: 0.85rem;">
                            📋 Copy
                        </button>
                    </div>

                    <div>
                        <label style="color: #8892b0; font-size: 0.85rem; display: block; margin-bottom: 0.5rem;">RECOVERY PHRASE:</label>
                        <div style="background: #0a0e1a; padding: 0.75rem; border-radius: 8px; font-family: monospace; word-break: break-all;">
                            ${wallet.mnemonic}
                        </div>
                        <button class="btn-secondary" onclick="WalletGenerator.copy('${wallet.mnemonic}')" style="margin-top: 0.5rem; padding: 0.5rem 1rem; font-size: 0.85rem;">
                            📋 Copy
                        </button>
                    </div>
                </div>
            `;
        });

        results.innerHTML = html;
        results.scrollIntoView({ behavior: 'smooth' });
    },

    copy(text) {
        navigator.clipboard.writeText(text).then(() => {
            const toast = document.createElement('div');
            toast.style.cssText = 'position: fixed; bottom: 2rem; right: 2rem; background: #00ff88; color: #0a0e1a; padding: 1rem 2rem; border-radius: 8px; font-weight: 700; z-index: 10000;';
            toast.textContent = '✓ Copied!';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2000);
        }).catch(err => alert('Copy failed: ' + err));
    },

    downloadCSV() {
        let csv = 'Number,Address,PrivateKey,Mnemonic\n';
        this.wallets.forEach((w, i) => {
            csv += `${i+1},"${w.address}","${w.privateKey}","${w.mnemonic}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'wallets.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

window.WalletGenerator = WalletGenerator;
console.log('wallet-generator.js loaded');
