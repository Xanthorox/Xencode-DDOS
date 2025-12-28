#!/bin/bash

# Xanthorox Agent - DDoS Framework Launcher
# Version: 1.0.0
# Author: Xanthorox Agent

# Set colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Clear screen
clear

echo -e "${BLUE}[Xanthorox Agent] DDoS Framework Launcher${NC}"
echo -e "${GREEN}[+] Version: 1.0.0${NC}"
echo -e "${GREEN}[+] Author: Xanthorox Agent${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}[!] Node.js is not installed${NC}"
    echo -e "${RED}[!] Please install Node.js from https://nodejs.org/${NC}"
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

# Check if required files exist
if [ ! -f "ddos.js" ]; then
    echo -e "${RED}[!] ddos.js not found${NC}"
    echo -e "${RED}[!] Please ensure all framework files are in the same directory${NC}"
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

if [ ! -f "ddos-advanced.js" ]; then
    echo -e "${RED}[!] ddos-advanced.js not found${NC}"
    echo -e "${RED}[!] Please ensure all framework files are in the same directory${NC}"
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

if [ ! -f "ddos-launcher.js" ]; then
    echo -e "${RED}[!] ddos-launcher.js not found${NC}"
    echo -e "${RED}[!] Please ensure all framework files are in the same directory${NC}"
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}[!] Dependencies not found, installing...${NC}"
    echo ""
    npm install
    echo ""
    if [ $? -ne 0 ]; then
        echo -e "${RED}[!] Failed to install dependencies${NC}"
        echo ""
        read -p "Press Enter to exit..."
        exit 1
    fi
    echo -e "${GREEN}[+] Dependencies installed successfully${NC}"
    echo ""
fi

# Make script executable
chmod +x ddos.sh 2>/dev/null

# Launch the framework
echo -e "${GREEN}[+] Starting DDoS Framework...${NC}"
echo ""
node ddos-launcher.js

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}[!] Framework exited with error${NC}"
    read -p "Press Enter to exit..."
    exit 1
fi

echo ""
read -p "Press Enter to exit..."