// Batch Collector Module
const BatchCollector = {
    init() {
        const content = document.getElementById('batchCollectorContent');
        content.innerHTML = `
            <div class="form-container">
                <h2 class="section-title">📥 Batch Collector</h2>
                <div class="info-box">
                    Collect tokens from multiple wallets into one central address. Perfect for consolidating holdings or managing airdrops.
                </div>
                <div class="form-group">
                    <label>Destination Address</label>
                    <input type="text" placeholder="Address to collect all tokens to">
                </div>
            </div>
        `;
    }
};
