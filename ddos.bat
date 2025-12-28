@echo off
title Xanthorox Agent - DDoS Framework
color 0a
cls

echo [Xanthorox Agent] DDoS Framework Launcher
echo [+] Version: 1.0.0
echo [+] Author: Xanthorox Agent
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

:: Check if required files exist
if not exist "ddos.js" (
    echo [!] ddos.js not found
    echo [!] Please ensure all framework files are in the same directory
    echo.
    pause
    exit /b 1
)

if not exist "ddos-advanced.js" (
    echo [!] ddos-advanced.js not found
    echo [!] Please ensure all framework files are in the same directory
    echo.
    pause
    exit /b 1
)

if not exist "ddos-launcher.js" (
    echo [!] ddos-launcher.js not found
    echo [!] Please ensure all framework files are in the same directory
    echo.
    pause
    exit /b 1
)

:: Check if dependencies are installed
if not exist "node_modules" (
    echo [!] Dependencies not found, installing...
    echo.
    call npm install
    echo.
    if %errorlevel% neq 0 (
        echo [!] Failed to install dependencies
        echo.
        pause
        exit /b 1
    )
    echo [+] Dependencies installed successfully
    echo.
)

:: Launch the framework
echo [+] Starting DDoS Framework...
echo.
node ddos-launcher.js

if %errorlevel% neq 0 (
    echo.
    echo [!] Framework exited with error
    pause
    exit /b 1
)

pause