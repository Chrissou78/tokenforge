// ============================================================================
// PERFECT FEATURE MATRIX - 23 USEFUL CONTRACTS (NO USELESS FEATURES)
// ============================================================================

const FEATURE_CONFIG = {
    // STANDARD TOKENS (6 variants) - NO CAPPED OPTION!
    standard: {
        name: 'Standard Token',
        features: [
            { id: 'ownable', name: 'Ownable', desc: 'Owner can control the contract', type: 'checkbox' },
            { id: 'pausable', name: 'Pausable', desc: 'Owner can pause/unpause transfers', type: 'checkbox', requires: ['ownable'] },
            { id: 'burnable', name: 'Burnable', desc: 'Anyone can burn their tokens', type: 'checkbox' }
            // REMOVED: Capped (useless without minting function)
        ],
        variants: {
            '': 'Standard_Basic',
            'ownable': 'Standard_Ownable',
            'ownable,pausable': 'Standard_Pausable',
            'burnable': 'Standard_Burnable',
            'burnable,ownable': 'Standard_Ownable_Burnable',
            'burnable,ownable,pausable': 'Standard_Pausable_Burnable'
            // REMOVED: 'capped,ownable': 'Standard_Capped'
        }
    },
    
    // MINTABLE TOKENS (5 variants) - CAPPED IS USEFUL HERE!
    mintable: {
        name: 'Mintable Token',
        features: [
            { id: 'owner_mint', name: 'Owner-Only Minting', desc: 'Only owner can mint new tokens', type: 'radio', group: 'mintType', default: true },
            { id: 'public_mint', name: 'Public Minting', desc: 'Anyone can mint new tokens', type: 'radio', group: 'mintType' },
            { id: 'pausable', name: 'Pausable', desc: 'Owner can pause minting and transfers', type: 'checkbox' },
            { id: 'burnable', name: 'Burnable', desc: 'Burn tokens permanently', type: 'checkbox' },
            { id: 'capped', name: 'Capped Supply', desc: 'Maximum supply limit (prevents minting beyond cap)', type: 'checkbox', extraInput: 'cap' }
            // Capped KEPT - has mint() function, cap is enforced!
        ],
        variants: {
            'owner_mint': 'Mintable_OwnerOnly',
            'public_mint': 'Mintable_Public',
            'capped,owner_mint': 'Mintable_Capped',
            'owner_mint,pausable': 'Mintable_Pausable',
            'burnable,capped,owner_mint,pausable': 'Mintable_Full'
        }
    },
    
    // BURNABLE TOKENS - REMOVED (duplicates of Standard)
    
    // TAX TOKENS (4 variants)
    tax: {
        name: 'Tax Token',
        features: [
            { id: 'basic_tax', name: 'Fixed Tax Rate', desc: 'Tax rate set at deployment', type: 'radio', group: 'taxType', default: true },
            { id: 'adjustable_tax', name: 'Adjustable Tax Rate', desc: 'Owner can change tax rate', type: 'radio', group: 'taxType' },
            { id: 'pausable', name: 'Pausable', desc: 'Owner can pause transfers', type: 'checkbox' },
            { id: 'burnable', name: 'Burnable', desc: 'Burn tokens permanently', type: 'checkbox' }
        ],
        extraInputs: [
            { id: 'taxRate', name: 'Tax Rate (basis points)', desc: '100 = 1%, 1000 = 10%', type: 'number', default: 100, min: 0, max: 10000 },
            { id: 'taxRecipient', name: 'Tax Recipient Address', desc: 'Leave empty for deployer', type: 'text', placeholder: '0x...' }
        ],
        variants: {
            'basic_tax': 'Tax_Basic',
            'adjustable_tax': 'Tax_Adjustable',
            'basic_tax,pausable': 'Tax_Pausable',
            'adjustable_tax,pausable': 'Tax_Pausable',
            'basic_tax,burnable': 'Tax_Burnable',
            'adjustable_tax,burnable': 'Tax_Burnable'
        }
    },
    
    // REFLECTION TOKENS (3 variants)
    reflection: {
        name: 'Reflection Token',
        features: [
            { id: 'basic_reflection', name: 'Basic Reflection', desc: 'Automatic holder rewards', type: 'radio', group: 'reflectionType', default: true },
            { id: 'excludable', name: 'Excludable from Rewards', desc: 'Owner can exclude addresses', type: 'radio', group: 'reflectionType' },
            { id: 'pausable', name: 'Pausable', desc: 'Owner can pause transfers', type: 'checkbox' }
        ],
        extraInputs: [
            { id: 'reflectionRate', name: 'Reflection Rate (basis points)', desc: '100 = 1%, 1000 = 10%', type: 'number', default: 100, min: 0, max: 10000 }
        ],
        variants: {
            'basic_reflection': 'Reflection_Basic',
            'excludable': 'Reflection_Excludable',
            'basic_reflection,pausable': 'Reflection_Pausable',
            'excludable,pausable': 'Reflection_Pausable'
        }
    },
    
    // ADVANCED TOKENS (5 variants) - CAPPED IS USEFUL IN FULL!
    advanced: {
        name: 'Advanced Token',
        features: [
            { id: 'full', name: 'Full Featured', desc: 'All features: Ownable, Pausable, Mintable, Burnable, Capped (has mint function!)', type: 'radio', group: 'advType', default: true, extraInput: 'cap' },
            { id: 'defi', name: 'DeFi Optimized', desc: 'Pausable, Mintable, Burnable, Blacklist (has mint function!)', type: 'radio', group: 'advType' },
            { id: 'governance', name: 'Governance', desc: 'Voting power and delegation', type: 'radio', group: 'advType' },
            { id: 'vesting', name: 'Vesting Schedule', desc: 'Built-in token vesting', type: 'radio', group: 'advType', extraInput: 'vestingDuration' },
            { id: 'snapshot', name: 'Balance Snapshots', desc: 'Snapshots for governance/dividends', type: 'radio', group: 'advType' }
        ],
        variants: {
            'full': 'Advanced_Full',
            'defi': 'Advanced_DeFi',
            'governance': 'Advanced_Governance',
            'vesting': 'Advanced_Vesting',
            'snapshot': 'Advanced_Snapshot'
        }
    }
};

// ============================================================================
// TEMPLATE LIST (5 templates, not 6!)
// ============================================================================

const TEMPLATES = ['standard', 'mintable', 'tax', 'reflection', 'advanced'];
// REMOVED: 'burnable' (duplicates Standard variants)

// ============================================================================
// CONTRACT COUNT VERIFICATION
// ============================================================================

/*
Standard: 6 variants (removed Capped)
Mintable: 5 variants (kept Capped - has mint!)
Tax: 4 variants
Reflection: 3 variants
Advanced: 5 variants (kept Capped in Full - has mint!)

TOTAL: 23 UNIQUE & USEFUL CONTRACTS
*/
