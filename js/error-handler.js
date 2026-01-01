// =========================================
// TokenForge Pro - Error Handler Utility
// =========================================
// 
// User-friendly error messages and handling
// Converts technical errors to understandable messages
//

/**
 * Error Handler for TokenForge Pro
 * @namespace ErrorHandler
 */
export const ErrorHandler = {
    /**
     * User-friendly error message templates
     */
    messages: {
        // Wallet connection errors
        'no_ethereum': '🦊 No Ethereum wallet detected. Please install MetaMask, Coinbase Wallet, or another Web3 wallet.',
        'no_solana': '👻 No Solana wallet detected. Please install Phantom wallet.',
        'wallet_locked': '🔒 Your wallet is locked. Please unlock it and try again.',
        'user_rejected': '❌ Transaction cancelled. You can try again when ready.',
        'user_rejected_request': '❌ Connection request cancelled. Click "Connect Wallet" to try again.',
        'wrong_network': '🌐 You\'re on the wrong network. Please switch to {network} in your wallet.',
        'network_not_supported': '🌐 This network is not supported. Please switch to a supported network.',
        'already_processing': '⏳ A request is already being processed. Please wait.',
        
        // Transaction errors
        'insufficient_funds': '💰 Insufficient funds. You need at least {amount} {currency} but only have {balance}.',
        'insufficient_gas': '⛽ Insufficient gas. You need {gasNeeded} but only have {gasAvailable}.',
        'gas_too_high': '⛽ Gas price is unusually high right now ({gasPrice} Gwei). Consider waiting for lower fees or adjusting your slippage tolerance.',
        'transaction_failed': '❌ Transaction failed. Please check the transaction on the block explorer for details.',
        'transaction_reverted': '🔄 Transaction reverted. This usually means a smart contract check failed.',
        'nonce_too_low': '🔢 Transaction nonce error. Please reset your wallet transaction history.',
        'replacement_underpriced': '💵 Replacement transaction fee is too low. Increase the gas price and try again.',
        
        // API errors
        'api_timeout': '⏱️ Request timed out. Please check your internet connection and try again.',
        'api_error': '🌐 API error. The service might be temporarily unavailable. Please try again later.',
        'api_limit': '🚦 Rate limit exceeded. Please wait a moment and try again.',
        'coingecko_error': '💹 Unable to fetch current price data. Using fallback values. Fees may be slightly inaccurate.',
        'coingecko_limit': '💹 CoinGecko rate limit reached. Please wait a minute before trying again.',
        'network_error': '🌐 Network error. Please check your internet connection.',
        
        // Validation errors
        'invalid_address': '📍 Invalid address format. Please check and try again.',
        'invalid_amount': '💵 Invalid amount. Please enter a valid positive number.',
        'invalid_name': '📝 Invalid token name. Use only letters, numbers, and spaces (2-50 characters).',
        'invalid_symbol': '🔤 Invalid token symbol. Use only uppercase letters and numbers (2-10 characters).',
        'invalid_supply': '📊 Invalid supply. Must be a positive number less than 1 quadrillion.',
        'invalid_decimals': '🔢 Invalid decimals. Must be between 0 and 18.',
        'invalid_tax_rate': '💰 Invalid tax rate. Must be between 0 and 100.',
        'invalid_pattern': '🎯 Invalid vanity pattern. Check that you\'re using valid characters for the selected blockchain.',
        
        // Contract deployment errors
        'deployment_failed': '📜 Contract deployment failed. Please check your parameters and try again.',
        'bytecode_not_found': '🔍 Contract bytecode not found. Please select a valid contract template.',
        'constructor_error': '⚙️ Error encoding constructor parameters. Please check your input values.',
        
        // General errors
        'unknown_error': '⚠️ An unexpected error occurred. Please try again or contact support if the issue persists.',
        'not_implemented': '🚧 This feature is not yet implemented. Check back soon!',
        'permission_denied': '🚫 Permission denied. Please grant the necessary permissions in your wallet.',
    },

    /**
     * Error pattern matching for common error strings
     */
    patterns: [
        { regex: /user rejected/i, key: 'user_rejected' },
        { regex: /user denied/i, key: 'user_rejected' },
        { regex: /insufficient funds/i, key: 'insufficient_funds' },
        { regex: /insufficient balance/i, key: 'insufficient_funds' },
        { regex: /gas required exceeds/i, key: 'insufficient_gas' },
        { regex: /nonce too low/i, key: 'nonce_too_low' },
        { regex: /replacement transaction underpriced/i, key: 'replacement_underpriced' },
        { regex: /transaction reverted/i, key: 'transaction_reverted' },
        { regex: /execution reverted/i, key: 'transaction_reverted' },
        { regex: /network error/i, key: 'network_error' },
        { regex: /timeout/i, key: 'api_timeout' },
        { regex: /rate limit/i, key: 'api_limit' },
        { regex: /429/i, key: 'api_limit' },
        { regex: /wrong network/i, key: 'wrong_network' },
        { regex: /unsupported network/i, key: 'network_not_supported' },
        { regex: /invalid address/i, key: 'invalid_address' },
        { regex: /not implemented/i, key: 'not_implemented' },
    ],

    /**
     * Get user-friendly error message
     * @param {Error|string} error - The error object or message
     * @param {Object} [context={}] - Additional context for message interpolation
     * @returns {string} User-friendly error message
     */
    format(error, context = {}) {
        let errorString = '';
        
        // Extract error message
        if (typeof error === 'string') {
            errorString = error;
        } else if (error && error.message) {
            errorString = error.message;
        } else if (error && error.toString) {
            errorString = error.toString();
        }
        
        // Try to match error patterns
        const lowerError = errorString.toLowerCase();
        
        for (const pattern of this.patterns) {
            if (pattern.regex.test(errorString)) {
                return this.interpolate(this.messages[pattern.key], context);
            }
        }
        
        // Try exact key match
        for (const [key, message] of Object.entries(this.messages)) {
            if (lowerError.includes(key.replace(/_/g, ' '))) {
                return this.interpolate(message, context);
            }
        }
        
        // Log unknown errors for debugging
        if (errorString && errorString !== 'unknown error') {
            console.error('Unhandled error:', error);
        }
        
        // Return generic error message
        return this.messages.unknown_error;
    },

    /**
     * Interpolate context variables into message template
     * @param {string} message - Message template with {variable} placeholders
     * @param {Object} context - Context object with variable values
     * @returns {string} Interpolated message
     */
    interpolate(message, context) {
        let result = message;
        
        for (const [key, value] of Object.entries(context)) {
            result = result.replace(new RegExp(`{${key}}`, 'g'), value);
        }
        
        return result;
    },

    /**
     * Show error notification to user
     * @param {Error|string} error - The error to display
     * @param {Object} [context={}] - Additional context
     * @param {number} [duration=5000] - How long to show the notification (ms)
     */
    show(error, context = {}, duration = 5000) {
        const message = this.format(error, context);
        
        // Use existing notification system if available
        if (typeof window !== 'undefined' && window.showNotification) {
            window.showNotification(message, 'error', duration);
        } else {
            // Fallback: console error
            console.error('Error:', message);
            alert(message);
        }
    },

    /**
     * Log error for debugging (only in development)
     * @param {Error|string} error - The error to log
     * @param {Object} [additionalInfo={}] - Additional debugging information
     */
    log(error, additionalInfo = {}) {
        const isDevelopment = 
            (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') ||
            (typeof window !== 'undefined' && window.location.hostname === 'localhost');
        
        if (isDevelopment) {
            console.group('🔴 Error Details');
            console.error('Error:', error);
            if (error && error.stack) {
                console.error('Stack:', error.stack);
            }
            if (Object.keys(additionalInfo).length > 0) {
                console.table(additionalInfo);
            }
            console.groupEnd();
        }
    },

    /**
     * Handle async errors with automatic logging and notification
     * @param {Function} asyncFn - Async function to execute
     * @param {Object} [context={}] - Context for error messages
     * @returns {Promise<any>} Result of the async function or null on error
     */
    async handle(asyncFn, context = {}) {
        try {
            return await asyncFn();
        } catch (error) {
            this.log(error, context);
            this.show(error, context);
            return null;
        }
    },

    /**
     * Wrap a function with error handling
     * @param {Function} fn - Function to wrap
     * @param {Object} [context={}] - Context for error messages
     * @returns {Function} Wrapped function
     */
    wrap(fn, context = {}) {
        return async (...args) => {
            try {
                return await fn(...args);
            } catch (error) {
                this.log(error, { ...context, args });
                this.show(error, context);
                throw error; // Re-throw so caller can handle if needed
            }
        };
    },

    /**
     * Create a custom error with additional context
     * @param {string} message - Error message
     * @param {string} [code] - Error code
     * @param {Object} [context={}] - Additional context
     * @returns {Error} Custom error object
     */
    createError(message, code, context = {}) {
        const error = new Error(message);
        error.code = code;
        error.context = context;
        error.timestamp = new Date().toISOString();
        return error;
    },

    /**
     * Check if error is a specific type
     * @param {Error} error - Error to check
     * @param {string} type - Error type key
     * @returns {boolean} True if error matches type
     */
    isErrorType(error, type) {
        const errorString = error?.message || error?.toString() || '';
        const lowerError = errorString.toLowerCase();
        const typeKey = type.toLowerCase().replace(/_/g, ' ');
        return lowerError.includes(typeKey);
    },

    /**
     * Get error severity level
     * @param {Error|string} error - The error to analyze
     * @returns {string} Severity level: 'critical', 'high', 'medium', 'low'
     */
    getSeverity(error) {
        const errorString = typeof error === 'string' ? error : error?.message || '';
        const lower = errorString.toLowerCase();
        
        // Critical errors
        if (lower.includes('funds') || lower.includes('balance') || lower.includes('security')) {
            return 'critical';
        }
        
        // High priority errors
        if (lower.includes('transaction') || lower.includes('deployment') || lower.includes('gas')) {
            return 'high';
        }
        
        // Medium priority errors
        if (lower.includes('validation') || lower.includes('invalid') || lower.includes('api')) {
            return 'medium';
        }
        
        // Low priority errors
        return 'low';
    }
};

/**
 * Global error handler for uncaught errors
 */
if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
        console.error('Uncaught error:', event.error);
        ErrorHandler.show(event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        ErrorHandler.show(event.reason);
    });
}

// For use in Node.js/CommonJS environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ErrorHandler };
}
