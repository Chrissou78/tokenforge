// Multi Buyer Module
const MultiBuyer = {
    init() {
        const content = document.getElementById('multiBuyerContent');
        content.innerHTML = `
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🛒</div>
                    <div class="feature-title">Simultaneous Buying</div>
                    <div class="feature-desc">Buy tokens from multiple wallets simultaneously for instant market activity</div>
                    <div class="feature-fee"><span>Fee:</span> <span>0.002 ETH + 0.0002/wallet</span></div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🔒</div>
                    <div class="feature-title">MEV Protection</div>
                    <div class="feature-desc">Built-in protection against front-running and sandwich attacks</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">⚡</div>
                    <div class="feature-title">JITO Bundling</div>
                    <div class="feature-desc">Solana transactions bundled via JITO for guaranteed execution</div>
                </div>
            </div>
        `;
    }
};
