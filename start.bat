@echo off
title Xanthorox Agent - Quick Start
color 0a
cls

echo [Xanthorox Agent] Quick Start Launcher
echo [+] This will automatically install dependencies and launch the Web UI
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Node.js is not installed or not in PATH
    echo [!] Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Run the setup and launch script
echo [+] Starting automated setup and Web UI...
echo.
node setup-and-launch.js

if %errorlevel% neq 0 (
    echo.
    echo [!] Failed to start Web UI
    pause
    exit /b 1
)

pause