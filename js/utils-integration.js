// =========================================
// TokenForge Pro - Utilities Integration
// =========================================
//
// This script imports and integrates all utility modules
// Include this in all HTML files after the utilities are defined
//

console.log('🔧 Initializing TokenForge Pro Utilities...');

// Import utilities
import { Validator } from './validation.js';
import { ErrorHandler } from './error-handler.js';
import { LoadingManager } from './loading-manager.js';
import { SecurityModal } from './security-modal.js';
import { DeploymentConfig } from './deployment-config.js';

// Make utilities globally available
window.Validator = Validator;
window.ErrorHandler = ErrorHandler;
window.LoadingManager = LoadingManager;
window.SecurityModal = SecurityModal;
window.DeploymentConfig = DeploymentConfig;

console.log('✅ Utilities loaded successfully');

// Validate deployment configuration on startup
DeploymentConfig.validate();

// Enhanced wallet generation with security modal
window.generateWalletSecure = async function(blockchain, count = 1) {
    try {
        // Show security warning first
        const accepted = await SecurityModal.showWalletWarning();
        if (!accepted) {
            console.log('User cancelled wallet generation');
            return null;
        }

        // Show loading
        LoadingManager.show(`Generating ${count} wallet(s)...`, {
            showProgress: true
        });

        // Call original generation function (needs to be implemented)
        const wallets = await window.originalGenerateWallet(blockchain, count);

        // Update progress
        LoadingManager.updateProgress(100);
        
        // Hide loading after short delay
        setTimeout(() => LoadingManager.hide(), 500);

        return wallets;

    } catch (error) {
        LoadingManager.hide();
        ErrorHandler.show(error, { blockchain });
        return null;
    }
};

// Enhanced CSV export with security modal
window.exportWalletsToCSVSecure = async function(wallets) {
    try {
        // Show CSV export warning
        const accepted = await SecurityModal.showCSVExportWarning();
        if (!accepted) {
            console.log('User cancelled CSV export');
            return;
        }

        // Show loading
        LoadingManager.show('Preparing CSV export...');

        // Call original export function (needs to be implemented)
        await window.originalExportToCSV(wallets);

        LoadingManager.hide();

        // Show success message with reminder
        showNotification('✅ CSV exported! Remember to encrypt the file immediately and delete the unencrypted copy.', 'warning', 8000);

    } catch (error) {
        LoadingManager.hide();
        ErrorHandler.show(error);
    }
};

// Enhanced form validation helper
window.validateTokenForm = function(formData) {
    const {name, symbol, supply, decimals, taxRate, reflectionFee} = formData;
    const errors = {};

    // Validate name
    const nameCheck = Validator.isValidTokenName(name);
    if (!nameCheck.valid) {
        errors.name = nameCheck.error;
    }

    // Validate symbol
    const symbolCheck = Validator.isValidTokenSymbol(symbol);
    if (!symbolCheck.valid) {
        errors.symbol = symbolCheck.error;
    }

    // Validate supply
    const supplyCheck = Validator.isValidSupply(supply, decimals);
    if (!supplyCheck.valid) {
        errors.supply = supplyCheck.error;
    }

    // Validate decimals
    if (decimals !== undefined) {
        const decimalsCheck = Validator.isValidDecimals(decimals);
        if (!decimalsCheck.valid) {
            errors.decimals = decimalsCheck.error;
        }
    }

    // Validate tax rate if provided
    if (taxRate !== undefined && taxRate !== '') {
        const taxCheck = Validator.isValidTaxRate(taxRate);
        if (!taxCheck.valid) {
            errors.taxRate = taxCheck.error;
        }
    }

    // Validate reflection fee if provided
    if (reflectionFee !== undefined && reflectionFee !== '') {
        const reflectionCheck = Validator.isValidReflectionFee(reflectionFee);
        if (!reflectionCheck.valid) {
            errors.reflectionFee = reflectionCheck.error;
        }
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
};

// Enhanced notification system
window.showNotification = function(message, type = 'info', duration = 5000) {
    // Remove existing notifications
    const existing = document.querySelectorAll('.toast-notification');
    existing.forEach(n => n.remove());

    // Create notification
    const notification = document.createElement('div');
    notification.className = `toast-notification toast-${type}`;
    notification.textContent = message;

    // Add styles if not already added
    if (!document.getElementById('toast-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-notification-styles';
        style.textContent = `
            .toast-notification {
                position: fixed;
                top: 2rem;
                right: 2rem;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 999999;
                animation: slideInRight 0.3s ease-out;
                max-width: 400px;
                word-wrap: break-word;
            }

            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            .toast-success { background: #48bb78; }
            .toast-error { background: #f56565; }
            .toast-warning { background: #ed8936; }
            .toast-info { background: #4299e1; }

            @media (max-width: 768px) {
                .toast-notification {
                    top: 1rem;
                    right: 1rem;
                    left: 1rem;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Add to page
    document.body.appendChild(notification);

    // Auto remove
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, duration);
};

// Clear all sensitive data helper
window.clearAllSensitiveData = function() {
    if (confirm('⚠️ This will permanently delete all generated wallets from memory. This action cannot be undone.\n\nAre you sure you want to continue?')) {
        try {
            // Clear any wallet arrays (these need to be defined in the actual implementation)
            if (window.generatedWallets) window.generatedWallets = [];
            if (window.vanityWallets) window.vanityWallets = [];
            if (window.walletsList) window.walletsList = [];

            // Clear displayed wallet data
            const walletContainers = document.querySelectorAll('.wallet-card, .wallet-item, .generated-wallet');
            walletContainers.forEach(el => el.remove());

            // Clear clipboard if possible
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText('').catch(() => {});
            }

            // Clear session storage
            sessionStorage.clear();

            // Clear any input fields with sensitive data
            document.querySelectorAll('input[type="password"], input.sensitive-data').forEach(input => {
                input.value = '';
            });

            showNotification('✅ All sensitive data has been cleared from memory', 'success');
            console.log('🗑️ Sensitive data cleared');

        } catch (error) {
            ErrorHandler.show(error);
        }
    }
};

// Add "Clear Data" button to pages with sensitive data
window.addClearDataButton = function() {
    // Check if button already exists
    if (document.getElementById('clear-data-btn')) return;

    // Create button
    const button = document.createElement('button');
    button.id = 'clear-data-btn';
    button.className = 'clear-data-button';
    button.innerHTML = '🗑️ Clear All Data';
    button.onclick = clearAllSensitiveData;

    // Add styles
    if (!document.getElementById('clear-data-btn-styles')) {
        const style = document.createElement('style');
        style.id = 'clear-data-btn-styles';
        style.textContent = `
            .clear-data-button {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                padding: 1rem 1.5rem;
                background: #ff6b6b;
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 999;
                transition: all 0.3s;
            }

            .clear-data-button:hover {
                background: #ff5252;
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(0,0,0,0.4);
            }

            @media (max-width: 768px) {
                .clear-data-button {
                    bottom: 1rem;
                    right: 1rem;
                    padding: 0.75rem 1rem;
                    font-size: 0.9rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Add to page
    document.body.appendChild(button);
};

// Helper to validate all form fields and show errors
window.validateAndShowErrors = function(formData, errorContainerId) {
    const validation = validateTokenForm(formData);
    const errorContainer = document.getElementById(errorContainerId);

    if (!validation.valid) {
        // Show errors
        const errorList = Object.values(validation.errors).map(err => `<li>${err}</li>`).join('');
        errorContainer.innerHTML = `
            <div class="validation-errors">
                <strong>⚠️ Please fix the following errors:</strong>
                <ul>${errorList}</ul>
            </div>
        `;
        errorContainer.style.display = 'block';
        return false;
    }

    // Clear errors
    errorContainer.innerHTML = '';
    errorContainer.style.display = 'none';
    return true;
};

// Initialize auto-clear timer for sensitive pages
let sensitiveDataTimer = null;
window.startAutoeClearTimer = function(minutes = 30) {
    clearTimeout(sensitiveDataTimer);
    
    console.log(`⏰ Auto-clear timer set for ${minutes} minutes`);
    
    sensitiveDataTimer = setTimeout(() => {
        if (confirm(`⚠️ Security timeout: ${minutes} minutes of inactivity detected.\n\nWould you like to clear all sensitive data for security?`)) {
            clearAllSensitiveData();
        } else {
            // Restart timer
            startAutoClearTimer(minutes);
        }
    }, minutes * 60 * 1000);
};

// Reset timer on user activity
if (typeof document !== 'undefined') {
    ['click', 'keydown', 'mousemove', 'scroll'].forEach(event => {
        document.addEventListener(event, () => {
            if (sensitiveDataTimer && DeploymentConfig.SECURITY.AUTO_CLEAR_TIMEOUT > 0) {
                startAutoClearTimer(DeploymentConfig.SECURITY.AUTO_CLEAR_TIMEOUT);
            }
        }, { passive: true });
    });
}

console.log('🎉 TokenForge Pro initialization complete!');

// Export for use in other modules
export {
    Validator,
    ErrorHandler,
    LoadingManager,
    SecurityModal,
    DeploymentConfig
};
