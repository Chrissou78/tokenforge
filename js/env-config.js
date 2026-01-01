// =========================================
// TokenForge Pro - Environment Loader
// =========================================
//
// Loads environment variables from .env file or defaults
// Use this instead of hardcoded values
//

/**
 * Environment Configuration Loader
 * @namespace EnvConfig
 */
export const EnvConfig = {
    // Store loaded config
    config: {},
    loaded: false,

    /**
     * Get environment variable with fallback
     * @param {string} key - Environment variable key
     * @param {any} defaultValue - Default value if not found
     * @returns {any} Environment variable value
     */
    get(key, defaultValue = null) {
        // Check loaded config first
        if (this.config[key] !== undefined) {
            return this.config[key];
        }

        // Check process.env (Node.js environment)
        if (typeof process !== 'undefined' && process.env && process.env[key] !== undefined) {
            return process.env[key];
        }

        // Check window (browser with build system)
        if (typeof window !== 'undefined' && window.ENV && window.ENV[key] !== undefined) {
            return window.ENV[key];
        }

        // Return default
        return defaultValue;
    },

    /**
     * Get boolean environment variable
     * @param {string} key - Environment variable key
     * @param {boolean} defaultValue - Default value
     * @returns {boolean} Boolean value
     */
    getBool(key, defaultValue = false) {
        const value = this.get(key, defaultValue);
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') {
            return value.toLowerCase() === 'true' || value === '1';
        }
        return Boolean(value);
    },

    /**
     * Get number environment variable
     * @param {string} key - Environment variable key
     * @param {number} defaultValue - Default value
     * @returns {number} Number value
     */
    getNumber(key, defaultValue = 0) {
        const value = this.get(key, defaultValue);
        const num = parseFloat(value);
        return isNaN(num) ? defaultValue : num;
    },

    /**
     * Load configuration from inline script or defaults
     * Call this on app initialization
     */
    load() {
        if (this.loaded) return;

        // Default configuration
        const defaults = {
            // Critical
            FEE_RECIPIENT_ADDRESS: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',

            // Environment
            NODE_ENV: 'development',
            TESTNET_MODE: false,
            DEBUG_MODE: false,
            SHOW_CONFIG_WARNINGS: true,

            // Fees (USD)
            FEE_TOKEN_CREATION: 500,
            FEE_TOKEN_CREATION_TESTNET: 0.001,
            FEE_MULTI_SENDER_BASE: 10,
            FEE_MULTI_SENDER_PER_ADDRESS: 0.5,
            FEE_MULTI_BUYER_BASE: 20,
            FEE_MULTI_BUYER_PER_WALLET: 1,
            FEE_BATCH_COLLECTOR: 15,
            FEE_VANITY_GENERATOR: 0,

            // Security
            AUTO_CLEAR_TIMEOUT: 30,
            CONFIRM_CLEAR: true,
            SHOW_SECURITY_WARNINGS: true,
            REQUIRE_RISK_ACCEPTANCE: true,

            // API
            COINGECKO_API_URL: 'https://api.coingecko.com/api/v3',
            COINGECKO_API_KEY: '',
            API_RATE_LIMIT_MS: 1000,
            API_TIMEOUT_MS: 10000,
            API_MAX_RETRIES: 3,
            API_RETRY_DELAY_MS: 2000,
        };

        // Merge defaults with any loaded values
        this.config = { ...defaults };

        // Try to load from window.ENV (set by build system)
        if (typeof window !== 'undefined' && window.ENV) {
            this.config = { ...this.config, ...window.ENV };
        }

        this.loaded = true;
        this.validate();
    },

    /**
     * Validate critical configuration
     */
    validate() {
        const warnings = [];
        const errors = [];

        // Check fee recipient
        const feeRecipient = this.get('FEE_RECIPIENT_ADDRESS');
        const defaultAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

        if (feeRecipient === defaultAddress) {
            warnings.push('⚠️ Using default FEE_RECIPIENT_ADDRESS');
            warnings.push('⚠️ Update this in your .env file before production!');
        }

        // Validate address format
        if (!/^0x[a-fA-F0-9]{40}$/.test(feeRecipient)) {
            errors.push('❌ Invalid FEE_RECIPIENT_ADDRESS format');
        }

        // Show warnings if enabled
        if (this.getBool('SHOW_CONFIG_WARNINGS') && (warnings.length > 0 || errors.length > 0)) {
            console.group('🔧 Environment Configuration');
            warnings.forEach(w => console.warn(w));
            errors.forEach(e => console.error(e));
            console.groupEnd();

            // Show banner for default address
            if (feeRecipient === defaultAddress && typeof window !== 'undefined') {
                this.showWarningBanner();
            }
        }

        return errors.length === 0;
    },

    /**
     * Show warning banner in UI
     */
    showWarningBanner() {
        if (typeof document === 'undefined') return;

        // Check if already shown
        if (document.getElementById('env-config-warning')) return;

        const banner = document.createElement('div');
        banner.id = 'env-config-warning';
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #ff6b35;
            color: white;
            padding: 1rem;
            text-align: center;
            z-index: 999999;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        banner.innerHTML = `
            ⚠️ CONFIGURATION WARNING: Using default FEE_RECIPIENT_ADDRESS! 
            Update your .env file before production deployment!
            <button onclick="this.parentElement.remove()" style="margin-left: 1rem; padding: 0.5rem 1rem; background: white; color: #ff6b35; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
                Dismiss
            </button>
        `;

        if (document.body) {
            document.body.insertBefore(banner, document.body.firstChild);
        } else {
            window.addEventListener('DOMContentLoaded', () => {
                document.body.insertBefore(banner, document.body.firstChild);
            });
        }
    },

    /**
     * Get all fee settings
     * @returns {Object} Fee configuration
     */
    getFees() {
        const isTestnet = this.getBool('TESTNET_MODE');
        return {
            tokenCreation: isTestnet 
                ? this.getNumber('FEE_TOKEN_CREATION_TESTNET') 
                : this.getNumber('FEE_TOKEN_CREATION'),
            multiSenderBase: this.getNumber('FEE_MULTI_SENDER_BASE'),
            multiSenderPerAddress: this.getNumber('FEE_MULTI_SENDER_PER_ADDRESS'),
            multiBuyerBase: this.getNumber('FEE_MULTI_BUYER_BASE'),
            multiBuyerPerWallet: this.getNumber('FEE_MULTI_BUYER_PER_WALLET'),
            batchCollector: this.getNumber('FEE_BATCH_COLLECTOR'),
            vanityGenerator: this.getNumber('FEE_VANITY_GENERATOR'),
        };
    },

    /**
     * Get security settings
     * @returns {Object} Security configuration
     */
    getSecurity() {
        return {
            autoClearTimeout: this.getNumber('AUTO_CLEAR_TIMEOUT'),
            confirmClear: this.getBool('CONFIRM_CLEAR'),
            showSecurityWarnings: this.getBool('SHOW_SECURITY_WARNINGS'),
            requireRiskAcceptance: this.getBool('REQUIRE_RISK_ACCEPTANCE'),
        };
    },

    /**
     * Get API settings
     * @returns {Object} API configuration
     */
    getAPI() {
        return {
            coingeckoUrl: this.get('COINGECKO_API_URL'),
            coingeckoKey: this.get('COINGECKO_API_KEY'),
            rateLimitMs: this.getNumber('API_RATE_LIMIT_MS'),
            timeoutMs: this.getNumber('API_TIMEOUT_MS'),
            maxRetries: this.getNumber('API_MAX_RETRIES'),
            retryDelayMs: this.getNumber('API_RETRY_DELAY_MS'),
        };
    },

    /**
     * Check if using default address
     * @returns {boolean} True if using default
     */
    isUsingDefaultAddress() {
        return this.get('FEE_RECIPIENT_ADDRESS') === '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
    },

    /**
     * Get environment name
     * @returns {string} Environment name
     */
    getEnvironment() {
        return this.get('NODE_ENV', 'development');
    },

    /**
     * Check if in production
     * @returns {boolean} True if production
     */
    isProduction() {
        return this.getEnvironment() === 'production';
    },

    /**
     * Check if in development
     * @returns {boolean} True if development
     */
    isDevelopment() {
        return this.getEnvironment() === 'development';
    },

    /**
     * Check if in testnet mode
     * @returns {boolean} True if testnet
     */
    isTestnet() {
        return this.getBool('TESTNET_MODE');
    },

    /**
     * Get debug mode
     * @returns {boolean} True if debug enabled
     */
    isDebug() {
        return this.getBool('DEBUG_MODE');
    }
};

// Auto-load on import
EnvConfig.load();

// Make available globally
if (typeof window !== 'undefined') {
    window.EnvConfig = EnvConfig;
}

// Export for ES6 modules
export default EnvConfig;

// For CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnvConfig;
}
