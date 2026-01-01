// =========================================
// TokenForge Pro - Security Warning Modal
// =========================================
//
// Shows security warnings before sensitive operations
// like wallet generation or private key export
//

/**
 * Security Warning Modal Manager
 * @namespace SecurityModal
 */
export const SecurityModal = {
    modalElement: null,
    acceptCallback: null,
    cancelCallback: null,

    /**
     * Show security warning before wallet generation
     * @param {Object} options - Modal options
     * @param {string} options.title - Modal title
     * @param {string} options.type - Warning type: 'wallet_generation', 'key_export', 'csv_export'
     * @param {Function} options.onAccept - Called when user accepts
     * @param {Function} options.onCancel - Called when user cancels
     * @returns {Promise<boolean>} Resolves to true if accepted, false if cancelled
     */
    async show(options = {}) {
        const {
            title = '⚠️ Important Security Warning',
            type = 'wallet_generation',
            onAccept = null,
            onCancel = null
        } = options;

        return new Promise((resolve) => {
            // Remove existing modal
            this.hide();

            // Get warning content based on type
            const content = this.getWarningContent(type);

            // Create modal
            this.modalElement = document.createElement('div');
            this.modalElement.className = 'security-modal-overlay';
            this.modalElement.innerHTML = `
                <div class="security-modal">
                    <div class="security-modal-header">
                        <h2>${title}</h2>
                    </div>
                    <div class="security-modal-body">
                        ${content}
                        <div class="security-modal-acceptance">
                            <label class="security-checkbox-label">
                                <input type="checkbox" id="security-accept-checkbox" class="security-checkbox">
                                <span>I understand and accept these risks. I am solely responsible for securing my private keys.</span>
                            </label>
                        </div>
                    </div>
                    <div class="security-modal-footer">
                        <button class="security-btn security-btn-cancel" id="security-cancel-btn">
                            Cancel
                        </button>
                        <button class="security-btn security-btn-accept" id="security-accept-btn" disabled>
                            I Understand, Continue
                        </button>
                    </div>
                </div>
            `;

            // Add styles
            this.addStyles();

            // Add to DOM
            document.body.appendChild(this.modalElement);

            // Setup checkbox listener
            const checkbox = this.modalElement.querySelector('#security-accept-checkbox');
            const acceptBtn = this.modalElement.querySelector('#security-accept-btn');
            
            checkbox.addEventListener('change', (e) => {
                acceptBtn.disabled = !e.target.checked;
            });

            // Setup button listeners
            const cancelBtn = this.modalElement.querySelector('#security-cancel-btn');
            
            acceptBtn.addEventListener('click', () => {
                this.hide();
                if (onAccept) onAccept();
                resolve(true);
            });

            cancelBtn.addEventListener('click', () => {
                this.hide();
                if (onCancel) onCancel();
                resolve(false);
            });

            // Close on overlay click
            this.modalElement.addEventListener('click', (e) => {
                if (e.target === this.modalElement) {
                    cancelBtn.click();
                }
            });

            // Close on Escape key
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    cancelBtn.click();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        });
    },

    /**
     * Get warning content based on type
     * @param {string} type - Warning type
     * @returns {string} HTML content
     */
    getWarningContent(type) {
        const contents = {
            wallet_generation: `
                <div class="security-warning-content">
                    <div class="security-warning-item">
                        <span class="security-icon">🔑</span>
                        <div>
                            <strong>Private Keys = Full Control</strong>
                            <p>Anyone with your private key has complete access to your funds. There is NO recovery if lost or stolen.</p>
                        </div>
                    </div>
                    
                    <div class="security-warning-item">
                        <span class="security-icon">📝</span>
                        <div>
                            <strong>Seed Phrases Are Permanent</strong>
                            <p>Write your 12-24 word seed phrase on paper and store it in multiple secure physical locations. Never store digitally unless encrypted.</p>
                        </div>
                    </div>
                    
                    <div class="security-warning-item">
                        <span class="security-icon">🚫</span>
                        <div>
                            <strong>Never Share Your Keys</strong>
                            <p>No legitimate service will EVER ask for your private keys or seed phrase. TokenForge team will never ask for them.</p>
                        </div>
                    </div>
                    
                    <div class="security-warning-item">
                        <span class="security-icon">💻</span>
                        <div>
                            <strong>Local Generation Only</strong>
                            <p>Keys are generated locally in YOUR browser. No data is sent to any server. You are 100% responsible for security.</p>
                        </div>
                    </div>
                    
                    <div class="security-warning-item">
                        <span class="security-icon">⚠️</span>
                        <div>
                            <strong>Test First!</strong>
                            <p>Always test with small amounts first. Verify you can import the seed phrase and access the wallet before sending large amounts.</p>
                        </div>
                    </div>
                </div>
            `,
            
            key_export: `
                <div class="security-warning-content">
                    <div class="security-warning-item">
                        <span class="security-icon">⚠️</span>
                        <div>
                            <strong>Extreme Caution Required</strong>
                            <p>You are about to view or copy a private key. This is the most sensitive operation possible.</p>
                        </div>
                    </div>
                    
                    <div class="security-warning-item">
                        <span class="security-icon">👀</span>
                        <div>
                            <strong>Check Your Environment</strong>
                            <p>Ensure no one can see your screen. Beware of screen recording software, cameras, and shoulder surfers.</p>
                        </div>
                    </div>
                    
                    <div class="security-warning-item">
                        <span class="security-icon">📋</span>
                        <div>
                            <strong>Clear Clipboard Immediately</strong>
                            <p>After copying, the private key remains in your clipboard. Clear it or copy something else immediately.</p>
                        </div>
                    </div>
                    
                    <div class="security-warning-item">
                        <span class="security-icon">🔒</span>
                        <div>
                            <strong>Secure Storage Only</strong>
                            <p>Only store private keys in password-protected, encrypted files. Never in plain text, screenshots, or cloud storage.</p>
                        </div>
                    </div>
                </div>
            `,
            
            csv_export: `
                <div class="security-warning-content">
                    <div class="security-warning-item">
                        <span class="security-icon">📄</span>
                        <div>
                            <strong>CSV Contains Everything</strong>
                            <p>The exported CSV file contains BOTH private keys AND seed phrases for all wallets. This is extremely sensitive data.</p>
                        </div>
                    </div>
                    
                    <div class="security-warning-item">
                        <span class="security-icon">🔐</span>
                        <div>
                            <strong>Encrypt Immediately</strong>
                            <p>You MUST encrypt the CSV file immediately after downloading. Use password-protected ZIP, 7-Zip, or encryption software.</p>
                        </div>
                    </div>
                    
                    <div class="security-warning-item">
                        <span class="security-icon">🗑️</span>
                        <div>
                            <strong>Delete After Backup</strong>
                            <p>Once you have securely backed up the file, delete the original unencrypted CSV from your downloads folder.</p>
                        </div>
                    </div>
                    
                    <div class="security-warning-item">
                        <span class="security-icon">🚫</span>
                        <div>
                            <strong>Never Share Unencrypted</strong>
                            <p>NEVER email, upload to cloud, or share unencrypted CSV files. Treat them like cash - anyone with access can steal your funds.</p>
                        </div>
                    </div>
                    
                    <div class="security-warning-item">
                        <span class="security-icon">💾</span>
                        <div>
                            <strong>Multiple Encrypted Backups</strong>
                            <p>Store encrypted copies in multiple secure physical locations. If you lose access, the funds are gone forever.</p>
                        </div>
                    </div>
                </div>
            `
        };

        return contents[type] || contents.wallet_generation;
    },

    /**
     * Hide and remove modal
     */
    hide() {
        if (this.modalElement) {
            this.modalElement.remove();
            this.modalElement = null;
        }
    },

    /**
     * Quick show for wallet generation (most common use case)
     * @returns {Promise<boolean>} True if accepted
     */
    async showWalletWarning() {
        return this.show({
            title: '⚠️ Security Warning: Wallet Generation',
            type: 'wallet_generation'
        });
    },

    /**
     * Quick show for key export
     * @returns {Promise<boolean>} True if accepted
     */
    async showKeyExportWarning() {
        return this.show({
            title: '⚠️ Extreme Caution: Private Key Export',
            type: 'key_export'
        });
    },

    /**
     * Quick show for CSV export
     * @returns {Promise<boolean>} True if accepted
     */
    async showCSVExportWarning() {
        return this.show({
            title: '⚠️ Critical: CSV Export Contains Private Keys',
            type: 'csv_export'
        });
    },

    /**
     * Add CSS styles
     */
    addStyles() {
        if (document.getElementById('security-modal-styles')) return;

        const style = document.createElement('style');
        style.id = 'security-modal-styles';
        style.textContent = `
            .security-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000000;
                padding: 1rem;
                animation: fadeIn 0.2s ease-in;
            }

            .security-modal {
                background: #121826;
                border: 3px solid #ff6b35;
                border-radius: 16px;
                max-width: 700px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
                animation: slideUp 0.3s ease-out;
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .security-modal-header {
                padding: 2rem;
                border-bottom: 2px solid #1f2937;
                background: linear-gradient(135deg, #ff6b35, #ff8c42);
            }

            .security-modal-header h2 {
                margin: 0;
                color: white;
                font-size: 1.5rem;
                text-align: center;
            }

            .security-modal-body {
                padding: 2rem;
                color: #e0e0e0;
            }

            .security-warning-content {
                margin-bottom: 2rem;
            }

            .security-warning-item {
                display: flex;
                gap: 1rem;
                margin-bottom: 1.5rem;
                padding: 1rem;
                background: #0a0e1a;
                border-radius: 8px;
                border-left: 4px solid #ff6b35;
            }

            .security-icon {
                font-size: 2rem;
                flex-shrink: 0;
            }

            .security-warning-item strong {
                display: block;
                color: #ff8c42;
                margin-bottom: 0.5rem;
                font-size: 1.1rem;
            }

            .security-warning-item p {
                margin: 0;
                line-height: 1.6;
                color: #b0b0b0;
            }

            .security-modal-acceptance {
                background: #1a1f2e;
                border: 2px solid #ff6b35;
                border-radius: 8px;
                padding: 1.5rem;
                margin-top: 2rem;
            }

            .security-checkbox-label {
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                cursor: pointer;
                user-select: none;
            }

            .security-checkbox {
                width: 20px;
                height: 20px;
                margin-top: 2px;
                cursor: pointer;
                flex-shrink: 0;
            }

            .security-checkbox-label span {
                line-height: 1.6;
                color: #ffffff;
                font-weight: 500;
            }

            .security-modal-footer {
                padding: 1.5rem 2rem;
                border-top: 2px solid #1f2937;
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
            }

            .security-btn {
                padding: 0.875rem 2rem;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
            }

            .security-btn-cancel {
                background: #2d3748;
                color: white;
            }

            .security-btn-cancel:hover {
                background: #4a5568;
            }

            .security-btn-accept {
                background: #48bb78;
                color: white;
            }

            .security-btn-accept:hover:not(:disabled) {
                background: #38a169;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
            }

            .security-btn-accept:disabled {
                background: #2d3748;
                color: #718096;
                cursor: not-allowed;
                opacity: 0.5;
            }

            @media (max-width: 768px) {
                .security-modal {
                    max-width: 100%;
                    margin: 1rem;
                }

                .security-modal-footer {
                    flex-direction: column;
                }

                .security-btn {
                    width: 100%;
                }
            }
        `;

        document.head.appendChild(style);
    }
};

// Auto-add styles when module loads
if (typeof document !== 'undefined') {
    SecurityModal.addStyles();
}

// For CommonJS environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SecurityModal };
}
