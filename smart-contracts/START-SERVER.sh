#!/bin/bash

echo "========================================"
echo "  TokenForge Pro - Starting Server"
echo "========================================"
echo ""
echo "Opening http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo "========================================"
echo ""

# Try python3 first, then python
if command -v python3 &> /dev/null; then
    python3 START-SERVER.py
elif command -v python &> /dev/null; then
    python START-SERVER.py
else
    echo "❌ Error: Python not found!"
    echo "Please install Python from python.org"
    exit 1
fi
