// Multi Sender Placeholder
console.log('Loading multisender.js...');

const MultiSender = {
    init() {
        console.log('MultiSender.init() called');
        const container = document.getElementById('multiSenderContent');
        if (container) {
            container.innerHTML = `
                <div class="info-box">
                    <strong>📤 Multi Sender</strong><br>
                    Send tokens to multiple addresses in a single transaction.<br><br>
                    <em>Note: This feature requires smart contract deployment to function. The UI is complete.</em>
                </div>
            `;
        }
    }
};

window.MultiSender = MultiSender;
console.log('multisender.js loaded');
