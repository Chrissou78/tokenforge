// Main Application Initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('TokenForge Pro initialized');
    
    // Initialize first tab
    if (window.TokenCreator) {
        TokenCreator.init();
    }
});
