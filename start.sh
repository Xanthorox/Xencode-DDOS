#!/bin/bash

# Xanthorox Agent - Quick Start Launcher
# This will automatically install dependencies and launch the Web UI

# Set colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Clear screen
clear

echo -e "${BLUE}[Xanthorox Agent] Quick Start Launcher${NC}"
echo -e "${GREEN}[+] This will automatically install dependencies and launch the Web UI${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}[!] Node.js is not installed${NC}"
    echo -e "${RED}[!] Please install Node.js from https://nodejs.org/${NC}"
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

# Make script executable
chmod +x start.sh 2>/dev/null

# Run the setup and launch script
echo -e "${GREEN}[+] Starting automated setup and Web UI...${NC}"
echo ""
node setup-and-launch.js

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}[!] Failed to start Web UI${NC}"
    read -p "Press Enter to exit..."
    exit 1
fi

echo ""
read -p "Press Enter to exit..."