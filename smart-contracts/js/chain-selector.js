// TokenForge Shared Chain Selector
// Include this in all tools for consistent chain management

// Global chain state
let currentChain = localStorage.getItem('tokenforge_chain') || 'ethereum';

// Comprehensive chain configuration (33 chains)
const CHAIN_NAMES = {
    // Layer 1 EVM
    ethereum: 'Ethereum',
    bsc: 'BNB Smart Chain',
    avalanche: 'Avalanche C-Chain',
    fantom: 'Fantom',
    cronos: 'Cronos',
    
    // Layer 2 / Ethereum Scaling
    polygon: 'Polygon',
    arbitrum: 'Arbitrum One',
    optimism: 'Optimism',
    base: 'Base',
    zksync: 'zkSync Era',
    polygonzk: 'Polygon zkEVM',
    scroll: 'Scroll',
    linea: 'Linea',
    mantle: 'Mantle',
    blast: 'Blast',
    
    // Other EVM Chains
    gnosis: 'Gnosis Chain',
    celo: 'Celo',
    moonbeam: 'Moonbeam',
    moonriver: 'Moonriver',
    kava: 'Kava EVM',
    metis: 'Metis Andromeda',
    aurora: 'Aurora',
    harmony: 'Harmony',
    canto: 'Canto',
    evmos: 'Evmos',
    opbnb: 'opBNB',
    klaytn: 'Klaytn',
    fuse: 'Fuse',
    telos: 'Telos EVM',
    thundercore: 'ThunderCore',
    monad: 'Monad',
    berachain: 'Berachain',
    
    // Non-EVM
    solana: 'Solana',
    sui: 'Sui',
    aptos: 'Aptos',
    
    // Testnets
    sepolia: 'Sepolia Testnet',
    amoy: 'Polygon Amoy Testnet',
    bsctest: 'BSC Testnet',
    arbitrumsepolia: 'Arbitrum Sepolia',
    basesepolia: 'Base Sepolia',
    optimismsepolia: 'Optimism Sepolia'
};

const CHAIN_SYMBOLS = {
    ethereum: 'ETH', bsc: 'BNB', avalanche: 'AVAX', fantom: 'FTM', cronos: 'CRO',
    polygon: 'MATIC', arbitrum: 'ETH', optimism: 'ETH', base: 'ETH', zksync: 'ETH',
    polygonzk: 'ETH', scroll: 'ETH', linea: 'ETH', mantle: 'MNT', blast: 'ETH',
    gnosis: 'xDAI', celo: 'CELO', moonbeam: 'GLMR', moonriver: 'MOVR', kava: 'KAVA',
    metis: 'METIS', aurora: 'ETH', harmony: 'ONE', canto: 'CANTO', evmos: 'EVMOS',
    opbnb: 'BNB', klaytn: 'KLAY', fuse: 'FUSE', telos: 'TLOS', thundercore: 'TT',
    monad: 'MONAD', berachain: 'BERA',
    solana: 'SOL', sui: 'SUI', aptos: 'APT',
    // Testnets
    sepolia: 'SepoliaETH', amoy: 'POL', bsctest: 'tBNB', 
    arbitrumsepolia: 'ETH', basesepolia: 'ETH', optimismsepolia: 'ETH'
};

const CHAIN_CATEGORIES = {
    'Layer 1 EVM': ['ethereum', 'bsc', 'avalanche', 'fantom', 'cronos'],
    'Layer 2 / Ethereum Scaling': ['polygon', 'arbitrum', 'optimism', 'base', 'zksync', 'polygonzk', 'scroll', 'linea', 'mantle', 'blast'],
    'Other EVM Chains': ['gnosis', 'celo', 'moonbeam', 'moonriver', 'kava', 'metis', 'aurora', 'harmony', 'canto', 'evmos', 'opbnb', 'klaytn', 'fuse', 'telos', 'thundercore', 'monad', 'berachain'],
    'Testnets': ['sepolia', 'amoy', 'bsctest', 'arbitrumsepolia', 'basesepolia', 'optimismsepolia'],
    'Non-EVM': ['solana', 'sui', 'aptos']
};

function getChainIcon(chain) {
    const icons = {
        ethereum: '⟠', bsc: '◆', avalanche: '🔺', fantom: '👻', cronos: '⚡',
        polygon: '⬡', arbitrum: '◢', optimism: '🔴', base: '🔵', zksync: '⚡',
        polygonzk: '⬢', scroll: '📜', linea: '▬', mantle: '◭', blast: '💥',
        gnosis: '◈', celo: '🌿', moonbeam: '🌙', moonriver: '🌙', kava: '◆',
        metis: '◈', aurora: '🌅', harmony: '◈', canto: '♪', evmos: '⚛',
        opbnb: '◇', klaytn: '▣', fuse: '⚡', telos: '◆', thundercore: '⚡',
        monad: '🔷', berachain: '🐻',
        solana: '◎', sui: '~', aptos: '◉',
        // Testnets
        sepolia: '🧪', amoy: '🧪', bsctest: '🧪',
        arbitrumsepolia: '🧪', basesepolia: '🧪', optimismsepolia: '🧪'
    };
    return icons[chain] || '●';
}

function updateChainDisplay() {
    const displayElement = document.getElementById('activeChainDisplay');
    if (displayElement && CHAIN_NAMES[currentChain]) {
        displayElement.textContent = CHAIN_NAMES[currentChain];
    }
}

function openChainModal() {
    // Remove existing modal if any
    const existingModal = document.querySelector('.chain-modal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.className = 'chain-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0, 0, 0, 0.9); display: flex; align-items: center;
        justify-content: center; z-index: 10000; padding: 1rem;
    `;
    
    let categoriesHTML = '';
    for (const [category, chains] of Object.entries(CHAIN_CATEGORIES)) {
        categoriesHTML += `
            <div style="margin: 1.5rem 0;">
                <h4 style="color: #00d4ff; margin-bottom: 1rem; font-size: 0.9rem;">${category}</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 0.8rem;">
                    ${chains.map(chain => `
                        <button onclick="selectChainFromModal('${chain}')" style="
                            padding: 1rem;
                            background: ${chain === currentChain ? 'rgba(0, 212, 255, 0.1)' : '#0a0e1a'};
                            border: 2px solid ${chain === currentChain ? '#00d4ff' : '#1f2937'};
                            border-radius: 8px; color: white; cursor: pointer;
                            font-weight: bold; transition: all 0.3s; text-align: center;
                        " onmouseover="this.style.borderColor='#00d4ff'" onmouseout="this.style.borderColor='${chain === currentChain ? '#00d4ff' : '#1f2937'}'">
                            <div style="font-size: 1.5rem; margin-bottom: 0.3rem;">${getChainIcon(chain)}</div>
                            <div style="font-size: 0.75rem;">${CHAIN_NAMES[chain]}</div>
                            <div style="color: #8892b0; font-size: 0.65rem; margin-top: 0.2rem;">${CHAIN_SYMBOLS[chain]}</div>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    modal.innerHTML = `
        <div style="background: #121826; border: 2px solid #1f2937; border-radius: 12px;
            padding: 2rem; max-width: 900px; width: 100%; max-height: 90vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3 style="color: #00d4ff; margin: 0;">Select Blockchain (41 Chains)</h3>
                <button onclick="closeChainModal()" style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer;">✕</button>
            </div>
            ${categoriesHTML}
            <button onclick="closeChainModal()" style="width: 100%; margin-top: 1.5rem; padding: 1rem; background: #1f2937; border: none; border-radius: 8px; color: white; cursor: pointer; font-weight: bold;">
                Cancel
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeChainModal();
    });
}

function closeChainModal() {
    const modal = document.querySelector('.chain-modal');
    if (modal) modal.remove();
}

function selectChainFromModal(chain) {
    currentChain = chain;
    localStorage.setItem('tokenforge_chain', chain);
    updateChainDisplay();
    closeChainModal();
    
    // Show notification
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed; top: 2rem; right: 2rem; background: #121826;
        border: 2px solid #00d4ff; border-radius: 8px; padding: 1rem 1.5rem;
        color: white; z-index: 10001;
    `;
    notif.textContent = `✓ Switched to ${CHAIN_NAMES[chain]}`;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2000);
    
    // Call tool-specific handler if exists
    if (typeof onChainChanged === 'function') {
        onChainChanged(chain);
    }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', updateChainDisplay);

// Listen for changes from other tabs/windows
window.addEventListener('storage', function(e) {
    if (e.key === 'tokenforge_chain') {
        currentChain = e.newValue;
        updateChainDisplay();
        if (typeof onChainChanged === 'function') {
            onChainChanged(currentChain);
        }
    }
});

console.log('✅ TokenForge Chain Selector loaded - Current chain:', currentChain);
