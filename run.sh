#!/bin/bash

# VCI Magic Browser - Build Script for macOS/Linux

echo ""
echo "========================================"
echo " VCI Magic Browser - Build System"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "[1] Install Dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies!"
    exit 1
fi

echo ""
echo "[2] Build Process..."
echo ""
echo "Options:"
echo "  1. Build Portable Executable"
echo "  2. Build Installer"
echo "  3. Build Both Versions"
echo "  4. Run Development Version"
echo ""

read -p "Select option (1-4): " choice

case $choice in
    1)
        echo ""
        echo "Building Portable Version..."
        npm run build:portable
        echo ""
        echo "Portable files created in: dist/"
        ;;
    2)
        echo ""
        echo "Building Installer Version..."
        npm run build
        echo ""
        echo "Installer files created in: dist/"
        ;;
    3)
        echo ""
        echo "Building All Versions..."
        npm run build
        echo ""
        echo "All build files created in: dist/"
        ;;
    4)
        echo ""
        echo "Starting Development Version..."
        npm run dev
        ;;
    *)
        echo "Invalid option!"
        exit 1
        ;;
esac
