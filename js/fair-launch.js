// Fair Launch Module
const FairLaunch = {
    init() {
        const content = document.getElementById('fairLaunchContent');
        content.innerHTML = `
            <div class="platform-selector">
                ${this.renderPlatforms()}
            </div>
        `;
    },
    
    renderPlatforms() {
        let html = '<h2 class="section-title">🚀 Select Launch Platform</h2><div class="platform-selector">';
        
        for (const [chain, platforms] of Object.entries(CONFIG.launchPlatforms)) {
            platforms.forEach(platform => {
                html += `
                    <div class="platform-card">
                        <div class="platform-logo">${platform.icon}</div>
                        <div class="platform-name">${platform.name}</div>
                        <div class="platform-chain">${CONFIG.chains[chain].name}</div>
                        <div style="margin-top: 0.5rem; color: var(--accent-tertiary);">
                            ${platform.fee} ${CONFIG.chains[chain].nativeCurrency}
                        </div>
                    </div>
                `;
            });
        }
        
        html += '</div>';
        return html;
    }
};
