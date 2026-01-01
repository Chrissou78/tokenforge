// =========================================
// TokenForge Pro - Deployment Configuration
// =========================================
//
// ⚠️ CRITICAL: CHANGE THESE VALUES BEFORE DEPLOYING TO PRODUCTION!
//

/**
 * Deployment Configuration
 * @namespace DeploymentConfig
 */
export const DeploymentConfig = {
    /**
     * Fee Recipient Address
     * ⚠️ MUST CHANGE THIS BEFORE PRODUCTION DEPLOYMENT!
     * 
     * This address receives all platform fees from:
     * - Token creation fees
     * - Multi-sender fees  
     * - Multi-buyer fees
     * - Any other platform fees
     */
    FEE_RECIPIENT: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', // ⚠️ CHANGE THIS!

    /**
     * Fee amounts in USD
     */
    FEES: {
        // Token Creation (USD)
        TOKEN_CREATION: 500,
        TOKEN_CREATION_TESTNET: 0.001, // Minimal fee for testing
        
        // Multi Sender (USD)
        MULTI_SENDER_BASE: 10,
        MULTI_SENDER_PER_ADDRESS: 0.5,
        
        // Multi Buyer (USD)
        MULTI_BUYER_BASE: 20,
        MULTI_BUYER_PER_WALLET: 1,
        
        // Batch Collector (USD)
        BATCH_COLLECTOR: 15,
        
        // Vanity Generator (free)
        VANITY_GENERATOR: 0,
    },

    /**
     * Environment Settings
     */
    ENVIRONMENT: {
        // Set to true for development/testing
        IS_TESTNET: false,
        
        // Debug mode (shows console logs)
        DEBUG_MODE: false,
        
        // Show warnings if using default config
        SHOW_CONFIG_WARNINGS: true,
    },

    /**
     * Security Settings
     */
    SECURITY: {
        // Auto-clear sensitive data after this many minutes
        AUTO_CLEAR_TIMEOUT: 30,
        
        // Require confirmation before clearing data
        CONFIRM_CLEAR: true,
        
        // Show security warnings before wallet generation
        SHOW_SECURITY_WARNINGS: true,
        
        // Require checkbox acceptance of risks
        REQUIRE_RISK_ACCEPTANCE: true,
    },

    /**
     * API Configuration
     */
    API: {
        // CoinGecko API
        COINGECKO_BASE_URL: 'https://api.coingecko.com/api/v3',
        COINGECKO_API_KEY: '', // Optional: Pro API key
        
        // Rate limiting
        API_RATE_LIMIT_MS: 1000, // Min time between API calls
        API_TIMEOUT_MS: 10000, // Request timeout
        
        // Retry settings
        MAX_RETRIES: 3,
        RETRY_DELAY_MS: 2000,
    },

    /**
     * Validate configuration on startup
     * Shows warnings if using default values
     */
    validate() {
        const warnings = [];
        const errors = [];

        // Check if using default fee recipient
        const DEFAULT_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
        if (this.FEE_RECIPIENT === DEFAULT_ADDRESS) {
            warnings.push('⚠️ WARNING: Using default fee recipient address!');
            warnings.push('⚠️ Change DeploymentConfig.FEE_RECIPIENT before production use!');
            warnings.push(`⚠️ Current: ${this.FEE_RECIPIENT}`);
        }

        // Validate address format
        if (!/^0x[a-fA-F0-9]{40}$/.test(this.FEE_RECIPIENT)) {
            errors.push('❌ ERROR: Invalid fee recipient address format!');
            errors.push(`❌ Current: ${this.FEE_RECIPIENT}`);
        }

        // Check if on testnet
        if (this.ENVIRONMENT.IS_TESTNET && this.ENVIRONMENT.SHOW_CONFIG_WARNINGS) {
            warnings.push('ℹ️ INFO: Running in TESTNET mode');
            warnings.push(`ℹ️ Token creation fee: $${this.FEES.TOKEN_CREATION_TESTNET} USD`);
        }

        // Display warnings and errors
        if (warnings.length > 0 || errors.length > 0) {
            console.group('🔧 Configuration Check');
            
            warnings.forEach(warning => console.warn(warning));
            errors.forEach(error => console.error(error));
            
            if (errors.length > 0) {
                console.error('');
                console.error('❌ CRITICAL: Configuration has errors!');
                console.error('❌ Please fix errors in config/deployment.js');
            }
            
            console.groupEnd();
        }

        // Show banner in UI if using default config
        if (this.FEE_RECIPIENT === DEFAULT_ADDRESS && this.ENVIRONMENT.SHOW_CONFIG_WARNINGS) {
            this.showWarningBanner();
        }

        return errors.length === 0;
    },

    /**
     * Show warning banner in UI
     */
    showWarningBanner() {
        // Only show in development
        if (typeof window === 'undefined') return;

        const banner = document.createElement('div');
        banner.id = 'config-warning-banner';
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #ff6b35;
            color: white;
            padding: 1rem;
            text-align: center;
            z-index: 99999;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        banner.innerHTML = `
            ⚠️ WARNING: Using default configuration! Change FEE_RECIPIENT in config/deployment.js before production use!
            <button onclick="this.parentElement.remove()" style="margin-left: 1rem; padding: 0.5rem 1rem; background: white; color: #ff6b35; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
                Dismiss
            </button>
        `;
        
        // Add to page when DOM is ready
        if (document.body) {
            document.body.insertBefore(banner, document.body.firstChild);
        } else {
            window.addEventListener('DOMContentLoaded', () => {
                document.body.insertBefore(banner, document.body.firstChild);
            });
        }
    },

    /**
     * Get fee amount based on service and network
     */
    getFee(service, isTestnet = false) {
        if (isTestnet && service === 'TOKEN_CREATION') {
            return this.FEES.TOKEN_CREATION_TESTNET;
        }
        return this.FEES[service] || 0;
    },

    /**
     * Check if address is the default (needs changing)
     */
    isUsingDefaultAddress() {
        return this.FEE_RECIPIENT === '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
    }
};

// Validate on module load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        DeploymentConfig.validate();
    });
}

// For CommonJS environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DeploymentConfig };
}
