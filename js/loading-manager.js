// =========================================
// TokenForge Pro - Loading Manager Utility
// =========================================
//
// Provides loading states and progress indicators
// for long-running operations
//

/**
 * Loading Manager for TokenForge Pro
 * @namespace LoadingManager
 */
export const LoadingManager = {
    overlay: null,
    progressBar: null,
    currentOperation: null,

    /**
     * Show loading overlay with message
     * @param {string} message - Loading message to display
     * @param {Object} options - Additional options
     * @param {boolean} options.showProgress - Show progress bar
     * @param {boolean} options.cancellable - Show cancel button
     * @param {Function} options.onCancel - Cancel callback
     */
    show(message = 'Loading...', options = {}) {
        const { showProgress = false, cancellable = false, onCancel = null } = options;

        // Remove existing overlay if any
        this.hide();

        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'loading-overlay';
        this.overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p class="loading-message">${message}</p>
                ${showProgress ? '<div class="loading-progress-container"><div class="loading-progress-bar"></div></div>' : ''}
                ${cancellable ? '<button class="loading-cancel-btn">Cancel</button>' : ''}
            </div>
        `;

        // Add styles if not already added
        this.addStyles();

        // Add cancel functionality
        if (cancellable && onCancel) {
            const cancelBtn = this.overlay.querySelector('.loading-cancel-btn');
            cancelBtn.onclick = () => {
                onCancel();
                this.hide();
            };
        }

        // Add to DOM
        document.body.appendChild(this.overlay);

        // Store progress bar reference
        if (showProgress) {
            this.progressBar = this.overlay.querySelector('.loading-progress-bar');
        }

        this.currentOperation = message;
    },

    /**
     * Update loading message
     * @param {string} message - New message to display
     */
    updateMessage(message) {
        if (!this.overlay) return;

        const messageEl = this.overlay.querySelector('.loading-message');
        if (messageEl) {
            messageEl.textContent = message;
            this.currentOperation = message;
        }
    },

    /**
     * Update progress bar
     * @param {number} percent - Progress percentage (0-100)
     */
    updateProgress(percent) {
        if (!this.progressBar) return;

        const clampedPercent = Math.max(0, Math.min(100, percent));
        this.progressBar.style.width = `${clampedPercent}%`;
        
        // Update aria label for accessibility
        this.progressBar.setAttribute('aria-valuenow', clampedPercent);
    },

    /**
     * Hide loading overlay
     */
    hide() {
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
            this.progressBar = null;
            this.currentOperation = null;
        }
    },

    /**
     * Show inline loading spinner (for smaller components)
     * @param {HTMLElement} element - Element to show loading in
     * @param {string} size - Size: 'small', 'medium', 'large'
     */
    showInline(element, size = 'medium') {
        if (!element) return;

        const spinner = document.createElement('div');
        spinner.className = `loading-spinner-inline loading-spinner-${size}`;
        spinner.dataset.loadingSpinner = 'true';
        
        element.appendChild(spinner);
    },

    /**
     * Hide inline loading spinner
     * @param {HTMLElement} element - Element containing the spinner
     */
    hideInline(element) {
        if (!element) return;

        const spinner = element.querySelector('[data-loading-spinner="true"]');
        if (spinner) {
            spinner.remove();
        }
    },

    /**
     * Show loading state on button
     * @param {HTMLElement} button - Button element
     * @param {string} loadingText - Text to show while loading
     */
    showButtonLoading(button, loadingText = 'Loading...') {
        if (!button) return;

        // Store original state
        button.dataset.originalText = button.textContent;
        button.dataset.originalDisabled = button.disabled;

        // Update button
        button.disabled = true;
        button.classList.add('btn-loading');
        button.innerHTML = `
            <span class="btn-spinner"></span>
            <span>${loadingText}</span>
        `;
    },

    /**
     * Hide loading state on button
     * @param {HTMLElement} button - Button element
     */
    hideButtonLoading(button) {
        if (!button) return;

        // Restore original state
        button.disabled = button.dataset.originalDisabled === 'true';
        button.classList.remove('btn-loading');
        button.textContent = button.dataset.originalText || button.textContent;

        // Cleanup
        delete button.dataset.originalText;
        delete button.dataset.originalDisabled;
    },

    /**
     * Wrap async function with loading indicator
     * @param {Function} fn - Async function to wrap
     * @param {string} message - Loading message
     * @param {Object} options - Loading options
     * @returns {Function} Wrapped function
     */
    wrap(fn, message, options = {}) {
        return async (...args) => {
            this.show(message, options);
            try {
                const result = await fn(...args);
                this.hide();
                return result;
            } catch (error) {
                this.hide();
                throw error;
            }
        };
    },

    /**
     * Add CSS styles for loading indicators
     */
    addStyles() {
        // Check if styles already exist
        if (document.getElementById('loading-manager-styles')) return;

        const style = document.createElement('style');
        style.id = 'loading-manager-styles';
        style.textContent = `
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.85);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;
                animation: fadeIn 0.2s ease-in;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .loading-content {
                background: #121826;
                border: 2px solid #1f2937;
                border-radius: 16px;
                padding: 3rem;
                text-align: center;
                min-width: 300px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            }

            .loading-spinner {
                border: 4px solid #1f2937;
                border-top: 4px solid #00d4ff;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                animation: spin 1s linear infinite;
                margin: 0 auto 1.5rem;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .loading-message {
                color: #8892b0;
                font-size: 1.1rem;
                margin: 0;
                line-height: 1.5;
            }

            .loading-progress-container {
                width: 100%;
                height: 8px;
                background: #1f2937;
                border-radius: 4px;
                margin-top: 1.5rem;
                overflow: hidden;
            }

            .loading-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #00d4ff, #0099cc);
                border-radius: 4px;
                width: 0%;
                transition: width 0.3s ease;
                position: relative;
            }

            .loading-progress-bar::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                animation: shimmer 1.5s infinite;
            }

            @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }

            .loading-cancel-btn {
                margin-top: 1.5rem;
                padding: 0.75rem 1.5rem;
                background: #ff6b6b;
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
            }

            .loading-cancel-btn:hover {
                background: #ff5252;
                transform: translateY(-2px);
            }

            /* Inline spinners */
            .loading-spinner-inline {
                border: 2px solid #1f2937;
                border-top: 2px solid #00d4ff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                display: inline-block;
                vertical-align: middle;
            }

            .loading-spinner-small {
                width: 16px;
                height: 16px;
            }

            .loading-spinner-medium {
                width: 24px;
                height: 24px;
            }

            .loading-spinner-large {
                width: 32px;
                height: 32px;
            }

            /* Button loading state */
            .btn-loading {
                position: relative;
                pointer-events: none;
            }

            .btn-spinner {
                display: inline-block;
                width: 14px;
                height: 14px;
                border: 2px solid rgba(255,255,255,0.3);
                border-top-color: white;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
                margin-right: 0.5rem;
                vertical-align: middle;
            }
        `;

        document.head.appendChild(style);
    }
};

// Auto-add styles when module loads
if (typeof document !== 'undefined') {
    LoadingManager.addStyles();
}

// For CommonJS environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LoadingManager };
}
