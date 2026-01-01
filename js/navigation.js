// Navigation Module
const Navigation = {
    init() {
        this.setupTabNavigation();
    },

    setupTabNavigation() {
        const tabs = document.querySelectorAll('.nav-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab.dataset.tab);
            });
        });
    },

    switchTab(tabId) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Remove active class from all tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show selected tab content
        const selectedContent = document.getElementById(tabId);
        if (selectedContent) {
            selectedContent.classList.add('active');
        }

        // Add active class to selected tab
        const selectedTab = document.querySelector(`[data-tab="${tabId}"]`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }

        // Initialize the module for the selected tab
        this.initializeTabModule(tabId);
    },

    initializeTabModule(tabId) {
        const moduleMap = {
            'token-creator': 'TokenCreator',
            'multisender': 'MultiSender',
            'multibuyer': 'MultiBuyer',
            'batch-collector': 'BatchCollector',
            'multiswap': 'MultiSwap',
            'vanity-tools': 'VanityTools',
            'wallet-generator': 'WalletGenerator',
            'token-clone': 'TokenClone',
            'fair-launch': 'FairLaunch'
        };

        const moduleName = moduleMap[tabId];
        if (moduleName && window[moduleName] && typeof window[moduleName].init === 'function') {
            window[moduleName].init();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Navigation.init();
});
