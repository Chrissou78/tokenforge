// =========================================
// TokenForge Pro - Input Validation Utility
// =========================================
// 
// Comprehensive validation for all user inputs
// Prevents invalid data and security issues
// 

/**
 * Input Validator for TokenForge Pro
 * @namespace Validator
 */
export const Validator = {
    /**
     * Validate Ethereum address format
     * @param {string} address - The address to validate
     * @returns {{valid: boolean, error?: string}} Validation result
     */
    isValidEthereumAddress(address) {
        if (!address) {
            return { valid: false, error: 'Address is required' };
        }
        if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
            return { valid: false, error: 'Invalid Ethereum address format. Must be 0x followed by 40 hex characters.' };
        }
        // Optional: Add checksum validation
        return { valid: true };
    },

    /**
     * Validate Solana address format
     * @param {string} address - The address to validate
     * @returns {{valid: boolean, error?: string}} Validation result
     */
    isValidSolanaAddress(address) {
        if (!address) {
            return { valid: false, error: 'Address is required' };
        }
        if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
            return { valid: false, error: 'Invalid Solana address format. Must be 32-44 Base58 characters.' };
        }
        return { valid: true };
    },

    /**
     * Validate Sui address format
     * @param {string} address - The address to validate
     * @returns {{valid: boolean, error?: string}} Validation result
     */
    isValidSuiAddress(address) {
        if (!address) {
            return { valid: false, error: 'Address is required' };
        }
        if (!/^0x[a-fA-F0-9]{64}$/.test(address)) {
            return { valid: false, error: 'Invalid Sui address format. Must be 0x followed by 64 hex characters.' };
        }
        return { valid: true };
    },

    /**
     * Validate address for any blockchain
     * @param {string} address - The address to validate
     * @param {string} blockchain - The blockchain type ('ethereum', 'solana', 'sui')
     * @returns {{valid: boolean, error?: string}} Validation result
     */
    isValidAddress(address, blockchain) {
        switch (blockchain.toLowerCase()) {
            case 'ethereum':
            case 'polygon':
            case 'bsc':
            case 'arbitrum':
            case 'optimism':
            case 'base':
            case 'avalanche':
                return this.isValidEthereumAddress(address);
            case 'solana':
                return this.isValidSolanaAddress(address);
            case 'sui':
                return this.isValidSuiAddress(address);
            default:
                return { valid: false, error: `Unsupported blockchain: ${blockchain}` };
        }
    },

    /**
     * Validate token name
     * @param {string} name - The token name
     * @returns {{valid: boolean, error?: string}} Validation result
     */
    isValidTokenName(name) {
        if (!name || name.trim().length === 0) {
            return { valid: false, error: 'Token name is required' };
        }
        if (name.length > 50) {
            return { valid: false, error: 'Token name must be 50 characters or less' };
        }
        if (name.length < 2) {
            return { valid: false, error: 'Token name must be at least 2 characters' };
        }
        // Allow letters, numbers, spaces, and common punctuation
        if (!/^[a-zA-Z0-9\s\-_.']+$/.test(name)) {
            return { valid: false, error: 'Token name contains invalid characters. Use only letters, numbers, spaces, and -_.\'' };
        }
        return { valid: true };
    },

    /**
     * Validate token symbol
     * @param {string} symbol - The token symbol
     * @returns {{valid: boolean, error?: string}} Validation result
     */
    isValidTokenSymbol(symbol) {
        if (!symbol || symbol.trim().length === 0) {
            return { valid: false, error: 'Token symbol is required' };
        }
        if (symbol.length > 10) {
            return { valid: false, error: 'Token symbol must be 10 characters or less' };
        }
        if (symbol.length < 2) {
            return { valid: false, error: 'Token symbol must be at least 2 characters' };
        }
        // Symbols should be uppercase letters and numbers only
        if (!/^[A-Z0-9]+$/.test(symbol)) {
            return { valid: false, error: 'Token symbol must be uppercase letters and numbers only (e.g., BTC, ETH, USDT)' };
        }
        return { valid: true };
    },

    /**
     * Validate token supply
     * @param {string|number} supply - The token supply
     * @param {number} decimals - Number of decimals (default: 18)
     * @returns {{valid: boolean, error?: string}} Validation result
     */
    isValidSupply(supply, decimals = 18) {
        const num = parseFloat(supply);
        
        if (isNaN(num)) {
            return { valid: false, error: 'Supply must be a valid number' };
        }
        if (num <= 0) {
            return { valid: false, error: 'Supply must be greater than zero' };
        }
        if (num > 1e15) {
            return { valid: false, error: 'Supply is too large (max: 1 quadrillion)' };
        }
        
        // Check decimal places don't exceed specified decimals
        const decimalPlaces = (supply.toString().split('.')[1] || '').length;
        if (decimalPlaces > decimals) {
            return { valid: false, error: `Supply has too many decimal places (max: ${decimals})` };
        }
        
        return { valid: true };
    },

    /**
     * Validate decimals value
     * @param {number} decimals - Number of decimals
     * @returns {{valid: boolean, error?: string}} Validation result
     */
    isValidDecimals(decimals) {
        const num = parseInt(decimals);
        
        if (isNaN(num)) {
            return { valid: false, error: 'Decimals must be a number' };
        }
        if (num < 0 || num > 18) {
            return { valid: false, error: 'Decimals must be between 0 and 18' };
        }
        
        return { valid: true };
    },

    /**
     * Validate tax rate (percentage)
     * @param {string|number} rate - Tax rate percentage
     * @returns {{valid: boolean, error?: string}} Validation result
     */
    isValidTaxRate(rate) {
        const num = parseFloat(rate);
        
        if (isNaN(num)) {
            return { valid: false, error: 'Tax rate must be a number' };
        }
        if (num < 0 || num > 100) {
            return { valid: false, error: 'Tax rate must be between 0 and 100' };
        }
        
        return { valid: true };
    },

    /**
     * Validate reflection fee (percentage)
     * @param {string|number} fee - Reflection fee percentage
     * @returns {{valid: boolean, error?: string}} Validation result
     */
    isValidReflectionFee(fee) {
        return this.isValidTaxRate(fee); // Same validation rules
    },

    /**
     * Validate private key format
     * @param {string} privateKey - The private key to validate
     * @returns {{valid: boolean, error?: string}} Validation result
     */
    isValidPrivateKey(privateKey) {
        if (!privateKey) {
            return { valid: false, error: 'Private key is required' };
        }
        
        // Remove 0x prefix if present
        const cleanKey = privateKey.replace(/^0x/, '');
        
        if (!/^[a-fA-F0-9]{64}$/.test(cleanKey)) {
            return { valid: false, error: 'Invalid private key format. Must be 64 hex characters.' };
        }
        
        return { valid: true };
    },

    /**
     * Validate seed phrase (mnemonic)
     * @param {string} seedPhrase - The seed phrase to validate
     * @returns {{valid: boolean, error?: string}} Validation result
     */
    isValidSeedPhrase(seedPhrase) {
        if (!seedPhrase) {
            return { valid: false, error: 'Seed phrase is required' };
        }
        
        const words = seedPhrase.trim().split(/\s+/);
        
        // Standard BIP39 word counts
        const validCounts = [12, 15, 18, 21, 24];
        if (!validCounts.includes(words.length)) {
            return { valid: false, error: `Seed phrase must have ${validCounts.join(', ')} words (found ${words.length})` };
        }
        
        // Check for invalid characters
        if (!/^[a-z\s]+$/.test(seedPhrase.toLowerCase())) {
            return { valid: false, error: 'Seed phrase should only contain lowercase letters and spaces' };
        }
        
        return { valid: true };
    },

    /**
     * Validate vanity pattern
     * @param {string} pattern - The vanity pattern
     * @param {string} blockchain - The blockchain type
     * @returns {{valid: boolean, error?: string}} Validation result
     */
    isValidVanityPattern(pattern, blockchain) {
        if (!pattern || pattern.length === 0) {
            return { valid: false, error: 'Pattern is required' };
        }
        
        if (pattern.length > 10) {
            return { valid: false, error: 'Pattern is too long (max: 10 characters). Longer patterns may take hours or days.' };
        }
        
        switch (blockchain.toLowerCase()) {
            case 'ethereum':
            case 'polygon':
            case 'bsc':
            case 'sui':
                // Hex characters only
                if (!/^[a-fA-F0-9]+$/.test(pattern)) {
                    return { valid: false, error: 'Pattern must contain only hex characters (0-9, a-f)' };
                }
                break;
                
            case 'solana':
                // Base58 characters (no 0, O, I, l)
                if (!/^[1-9A-HJ-NP-Za-km-z]+$/.test(pattern)) {
                    return { valid: false, error: 'Pattern must contain only Base58 characters (excludes 0, O, I, l)' };
                }
                break;
                
            default:
                return { valid: false, error: `Unsupported blockchain: ${blockchain}` };
        }
        
        return { valid: true };
    },

    /**
     * Validate email format
     * @param {string} email - The email address
     * @returns {{valid: boolean, error?: string}} Validation result
     */
    isValidEmail(email) {
        if (!email) {
            return { valid: false, error: 'Email is required' };
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { valid: false, error: 'Invalid email format' };
        }
        
        return { valid: true };
    },

    /**
     * Validate URL format
     * @param {string} url - The URL to validate
     * @returns {{valid: boolean, error?: string}} Validation result
     */
    isValidUrl(url) {
        if (!url) {
            return { valid: false, error: 'URL is required' };
        }
        
        try {
            new URL(url);
            return { valid: true };
        } catch (e) {
            return { valid: false, error: 'Invalid URL format' };
        }
    },

    /**
     * Sanitize user input to prevent XSS
     * @param {string} input - The input to sanitize
     * @returns {string} Sanitized input
     */
    sanitize(input) {
        if (typeof input !== 'string') return input;
        
        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    },

    /**
     * Validate multiple fields at once
     * @param {Object} fields - Object with field names and values
     * @param {Object} rules - Validation rules for each field
     * @returns {{valid: boolean, errors: Object}} Validation results
     * 
     * @example
     * const result = Validator.validateFields(
     *   { name: 'My Token', symbol: 'MTK', supply: '1000000' },
     *   { 
     *     name: 'isValidTokenName', 
     *     symbol: 'isValidTokenSymbol', 
     *     supply: 'isValidSupply' 
     *   }
     * );
     */
    validateFields(fields, rules) {
        const errors = {};
        let isValid = true;

        for (const [fieldName, ruleName] of Object.entries(rules)) {
            const value = fields[fieldName];
            
            if (typeof this[ruleName] === 'function') {
                const result = this[ruleName](value);
                if (!result.valid) {
                    errors[fieldName] = result.error;
                    isValid = false;
                }
            }
        }

        return { valid: isValid, errors };
    }
};

// For use in Node.js/CommonJS environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Validator };
}
