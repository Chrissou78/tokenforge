// Global Chain Helper - Include this in all TokenForge tools
// This script syncs with the main platform's chain selection

(function() {
    // Get chain from localStorage (set by main platform)
    window.TokenForgeChain = {
        get: function() {
            return localStorage.getItem('tokenforge_chain') || 'ethereum';
        },
        
        set: function(chain) {
            localStorage.setItem('tokenforge_chain', chain);
            window.dispatchEvent(new CustomEvent('chainChanged', { detail: { chain } }));
        },
        
        listen: function(callback) {
            window.addEventListener('chainChanged', function(e) {
                callback(e.detail.chain);
            });
        },
        
        names: {
            ethereum: 'Ethereum',
            polygon: 'Polygon',
            bsc: 'Binance Smart Chain',
            arbitrum: 'Arbitrum',
            solana: 'Solana',
            sui: 'Sui'
        },
        
        symbols: {
            ethereum: 'ETH',
            polygon: 'MATIC',
            bsc: 'BNB',
            arbitrum: 'ETH',
            solana: 'SOL',
            sui: 'SUI'
        },
        
        icons: {
            ethereum: '⟠',
            polygon: '⬡',
            bsc: '◆',
            arbitrum: '◢',
            solana: '◎',
            sui: '~'
        },
        
        // Create chain selector UI
        createSelector: function(containerId, onChange) {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            const currentChain = this.get();
            
            container.innerHTML = `
                <div style="background: #0a0e1a; border: 2px solid #1f2937; border-radius: 8px; padding: 1rem; margin: 1rem 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                        <div style="color: #8892b0; font-size: 0.85rem;">
                            Active Chain: <span style="color: #00ff88; font-weight: bold;" id="chainDisplay">${this.names[currentChain]}</span>
                        </div>
                        <button onclick="TokenForgeChain.openChainModal()" style="padding: 0.5rem 1rem; background: #00ff88; color: #0a0e1a; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                            Change Chain
                        </button>
                    </div>
                </div>
            `;
            
            // Listen for changes
            this.listen(function(chain) {
                const display = document.getElementById('chainDisplay');
                if (display) {
                    display.textContent = TokenForgeChain.names[chain];
                }
                if (onChange) onChange(chain);
            });
        },
        
        // Open chain selection modal
        openChainModal: function() {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            `;
            
            const currentChain = this.get();
            const chains = ['ethereum', 'polygon', 'bsc', 'arbitrum', 'solana', 'sui'];
            
            modal.innerHTML = `
                <div style="background: #121826; border: 2px solid #1f2937; border-radius: 12px; padding: 2rem; max-width: 600px; width: 90%;">
                    <h3 style="color: #00ff88; margin-bottom: 1.5rem;">Select Blockchain</h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                        ${chains.map(chain => `
                            <button class="modal-chain-btn" data-chain="${chain}" style="
                                padding: 1.5rem;
                                background: ${chain === currentChain ? 'rgba(0, 255, 136, 0.1)' : '#0a0e1a'};
                                border: 2px solid ${chain === currentChain ? '#00ff88' : '#1f2937'};
                                border-radius: 8px;
                                color: white;
                                cursor: pointer;
                                font-weight: bold;
                                transition: all 0.3s;
                                text-align: center;
                            ">
                                <div style="font-size: 2rem; margin-bottom: 0.5rem;">${this.icons[chain]}</div>
                                <div>${this.names[chain]}</div>
                                <div style="color: #8892b0; font-size: 0.85rem; margin-top: 0.3rem;">${this.symbols[chain]}</div>
                            </button>
                        `).join('')}
                    </div>
                    <button onclick="this.closest('div').parentElement.remove()" style="
                        width: 100%;
                        margin-top: 1.5rem;
                        padding: 1rem;
                        background: #1f2937;
                        border: none;
                        border-radius: 8px;
                        color: white;
                        cursor: pointer;
                        font-weight: bold;
                    ">Cancel</button>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Add click handlers
            modal.querySelectorAll('.modal-chain-btn').forEach(btn => {
                btn.addEventListener('mouseover', function() {
                    if (this.dataset.chain !== currentChain) {
                        this.style.borderColor = '#00ff88';
                    }
                });
                btn.addEventListener('mouseout', function() {
                    if (this.dataset.chain !== currentChain) {
                        this.style.borderColor = '#1f2937';
                    }
                });
                btn.addEventListener('click', function() {
                    TokenForgeChain.set(this.dataset.chain);
                    modal.remove();
                    location.reload(); // Reload to apply chain
                });
            });
            
            // Close on background click
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        }
    };
    
    console.log('✅ TokenForge Chain Helper loaded. Current chain:', window.TokenForgeChain.get());
})();
