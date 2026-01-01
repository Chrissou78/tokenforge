// TokenForge Pro Configuration
const CONFIG = {
    // Supported chains with their configurations
    chains: {
        ethereum: {
            name: 'Ethereum',
            chainId: 1,
            rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/',
            nativeCurrency: 'ETH',
            explorer: 'https://etherscan.io',
            type: 'evm'
        },
        polygon: {
            name: 'Polygon',
            chainId: 137,
            rpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2/',
            nativeCurrency: 'MATIC',
            explorer: 'https://polygonscan.com',
            type: 'evm'
        },
        bsc: {
            name: 'BSC',
            chainId: 56,
            rpcUrl: 'https://bsc-dataseed.binance.org',
            nativeCurrency: 'BNB',
            explorer: 'https://bscscan.com',
            type: 'evm'
        },
        arbitrum: {
            name: 'Arbitrum',
            chainId: 42161,
            rpcUrl: 'https://arb-mainnet.g.alchemy.com/v2/',
            nativeCurrency: 'ETH',
            explorer: 'https://arbiscan.io',
            type: 'evm'
        },
        solana: {
            name: 'Solana',
            network: 'mainnet-beta',
            rpcUrl: 'https://api.mainnet-beta.solana.com',
            nativeCurrency: 'SOL',
            explorer: 'https://solscan.io',
            type: 'solana'
        },
        sui: {
            name: 'Sui',
            network: 'mainnet',
            rpcUrl: 'https://fullnode.mainnet.sui.io',
            nativeCurrency: 'SUI',
            explorer: 'https://suiscan.xyz',
            type: 'sui'
        }
    },

    // Platform fees (in native currency)
    fees: {
        // Token Creator fees
        tokenCreation: {
            ethereum: { standard: 0.05, tax: 0.08, advanced: 0.12 },
            polygon: { standard: 25, tax: 40, advanced: 60 },
            bsc: { standard: 0.02, tax: 0.035, advanced: 0.05 },
            arbitrum: { standard: 0.01, tax: 0.018, advanced: 0.025 },
            solana: { standard: 0.5, tax: 0.8, advanced: 1.2 },
            sui: { standard: 5, tax: 8, advanced: 12 }
        },

        // Multi Sender fees
        multiSender: {
            baseFee: {
                ethereum: 0.001,
                polygon: 0.5,
                bsc: 0.0005,
                arbitrum: 0.0003,
                solana: 0.001,
                sui: 0.05
            },
            perAddress: {
                ethereum: 0.0001,
                polygon: 0.05,
                bsc: 0.00005,
                arbitrum: 0.00003,
                solana: 0.00001,
                sui: 0.005
            }
        },

        // Multi Buyer fees
        multiBuyer: {
            baseFee: {
                ethereum: 0.002,
                polygon: 1,
                bsc: 0.001,
                arbitrum: 0.0006,
                solana: 0.002,
                sui: 0.1
            },
            perWallet: {
                ethereum: 0.0002,
                polygon: 0.1,
                bsc: 0.0001,
                arbitrum: 0.00006,
                solana: 0.0002,
                sui: 0.01
            }
        },

        // Batch Collector fee
        batchCollector: {
            ethereum: 0.003,
            polygon: 1.5,
            bsc: 0.0015,
            arbitrum: 0.001,
            solana: 0.003,
            sui: 0.15
        },

        // Multi Swap fee
        multiSwap: {
            ethereum: 0.005,
            polygon: 2.5,
            bsc: 0.0025,
            arbitrum: 0.0015,
            solana: 0.005,
            sui: 0.25
        },

        // Vanity Address Generator
        vanityAddress: {
            perAttempt: {
                ethereum: 0.0001,
                polygon: 0.05,
                bsc: 0.00005,
                arbitrum: 0.00003,
                solana: 0.0001,
                sui: 0.005
            }
        },

        // Wallet Generator
        walletGenerator: {
            standard: 0.001, // Free for basic, fee for vanity
            vanity: {
                ethereum: 0.01,
                polygon: 5,
                bsc: 0.005,
                arbitrum: 0.003,
                solana: 0.01,
                sui: 0.5
            }
        },

        // Token Clone
        tokenClone: {
            ethereum: 0.03,
            polygon: 15,
            bsc: 0.015,
            arbitrum: 0.01,
            solana: 0.3,
            sui: 3
        },

        // Fair Launch Platform Integration
        fairLaunch: {
            pumpfun: 0.02, // SOL
            bonk: 100000, // BONK tokens
            raydium: 0.5, // SOL
            meteora: 0.3, // SOL
            turbos: 5, // SUI
            cetus: 5 // SUI
        }
    },

    // Launch platforms configuration
    launchPlatforms: {
        solana: [
            {
                id: 'pumpfun',
                name: 'Pump.fun',
                icon: '🚀',
                description: 'Fair launch with bonding curve',
                fee: 0.02
            },
            {
                id: 'raydium',
                name: 'Raydium',
                icon: '⚡',
                description: 'AMM liquidity pools',
                fee: 0.5
            },
            {
                id: 'meteora',
                name: 'Meteora',
                icon: '☄️',
                description: 'Dynamic liquidity pools',
                fee: 0.3
            }
        ],
        sui: [
            {
                id: 'turbos',
                name: 'Turbos Finance',
                icon: '💨',
                description: 'Concentrated liquidity AMM',
                fee: 5
            },
            {
                id: 'cetus',
                name: 'Cetus Protocol',
                icon: '🐋',
                description: 'DEX and liquidity protocol',
                fee: 5
            }
        ],
        ethereum: [
            {
                id: 'uniswap',
                name: 'Uniswap V3',
                icon: '🦄',
                description: 'Leading DEX on Ethereum',
                fee: 0.1
            }
        ],
        polygon: [
            {
                id: 'quickswap',
                name: 'QuickSwap',
                icon: '⚡',
                description: 'Polygon native DEX',
                fee: 50
            }
        ],
        bsc: [
            {
                id: 'pancakeswap',
                name: 'PancakeSwap',
                icon: '🥞',
                description: 'BSC leading DEX',
                fee: 0.05
            }
        ],
        arbitrum: [
            {
                id: 'camelot',
                name: 'Camelot',
                icon: '⚔️',
                description: 'Arbitrum native DEX',
                fee: 0.02
            }
        ]
    },

    // Feature limits
    limits: {
        multiSender: {
            maxAddresses: 1000,
            maxPerTx: 100
        },
        multiBuyer: {
            maxWallets: 50,
            maxPerWallet: 1000000
        },
        batchCollector: {
            maxWallets: 500
        },
        multiSwap: {
            maxTokens: 20,
            maxWallets: 50
        },
        vanityAddress: {
            maxLength: 8,
            timeout: 300000 // 5 minutes
        }
    },

    // API endpoints (configure based on your backend)
    api: {
        baseUrl: 'http://localhost:3000/api/v1',
        endpoints: {
            createToken: '/tokens/create',
            multiSend: '/multisender/send',
            multiBuy: '/multibuyer/execute',
            batchCollect: '/collector/collect',
            multiSwap: '/multiswap/execute',
            generateVanity: '/vanity/generate',
            generateWallet: '/wallet/generate',
            cloneToken: '/clone/execute',
            fairLaunch: '/launch/create'
        }
    },

    // Feature flags
    features: {
        enabledChains: ['ethereum', 'polygon', 'bsc', 'arbitrum', 'solana', 'sui'],
        enabledFeatures: [
            'tokenCreator',
            'multiSender',
            'multiBuyer',
            'batchCollector',
            'multiSwap',
            'vanityTools',
            'walletGenerator',
            'tokenClone',
            'fairLaunch'
        ]
    }
};

// Fee calculation helpers
const FeeCalculator = {
    calculateTokenCreationFee(chain, tokenType) {
        const fees = CONFIG.fees.tokenCreation[chain];
        return fees ? fees[tokenType] || fees.standard : 0;
    },

    calculateMultiSenderFee(chain, addressCount) {
        const fees = CONFIG.fees.multiSender;
        const baseFee = fees.baseFee[chain] || 0;
        const perAddress = fees.perAddress[chain] || 0;
        return baseFee + (perAddress * addressCount);
    },

    calculateMultiBuyerFee(chain, walletCount) {
        const fees = CONFIG.fees.multiBuyer;
        const baseFee = fees.baseFee[chain] || 0;
        const perWallet = fees.perWallet[chain] || 0;
        return baseFee + (perWallet * walletCount);
    },

    formatFee(amount, currency) {
        if (amount >= 1000) {
            return `${(amount / 1000).toFixed(2)}K ${currency}`;
        }
        return `${amount.toFixed(4)} ${currency}`;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, FeeCalculator };
}
