#!/usr/bin/env python3
"""
TokenForge Pro - Local Server
Run this to test wallet connections properly
"""

import http.server
import socketserver
import webbrowser
import os
from pathlib import Path

# Configuration
PORT = 8000
DIRECTORY = Path(__file__).parent

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)
    
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def main():
    print("\n" + "="*60)
    print("🔨 TokenForge Pro - Local Development Server")
    print("="*60)
    print(f"\n📂 Serving from: {DIRECTORY}")
    print(f"🌐 Server running at: http://localhost:{PORT}")
    print("\n⚡ Opening browser automatically...\n")
    print("="*60)
    print("\n💡 TIPS:")
    print("  • Make sure MetaMask/Phantom extensions are enabled")
    print("  • Check extension icon is visible in Chrome toolbar")
    print("  • Click the extension icon to unlock wallet if needed")
    print("  • Press Ctrl+C to stop the server\n")
    print("="*60 + "\n")
    
    # Start server
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        # Open browser
        try:
            webbrowser.open(f'http://localhost:{PORT}/index.html')
        except:
            print("⚠️  Could not open browser automatically")
            print(f"   Please open: http://localhost:{PORT}/index.html\n")
        
        print("✅ Server started! Waiting for requests...\n")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 Server stopped. Goodbye!\n")
            pass

if __name__ == "__main__":
    main()
