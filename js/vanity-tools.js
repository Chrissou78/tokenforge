// Vanity Tools Module
const VanityTools = {
    init() {
        const content = document.getElementById('vanityToolsContent');
        content.innerHTML = `
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">✨</div>
                    <div class="feature-title">Custom Addresses</div>
                    <div class="feature-desc">Generate contract addresses with custom prefixes or suffixes</div>
                    <div class="feature-fee"><span>Fee:</span> <span>0.0001 - 0.005 per attempt</span></div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🔐</div>
                    <div class="feature-title">Secure Generation</div>
                    <div class="feature-desc">All computation done locally in your browser</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">⚡</div>
                    <div class="feature-title">Fast Processing</div>
                    <div class="feature-desc">Optimized algorithms for quick vanity address generation</div>
                </div>
            </div>
        `;
    }
};
