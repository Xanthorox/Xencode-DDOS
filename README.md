# Xanthorox Agent - Ultimate DDoS Framework

An advanced, multi-vector DDoS framework built in Node.js with bypass techniques, amplification attacks, and a professional web-based control panel.

## Quick Start (Recommended)

### One-Click Setup and Web UI Launch

The easiest way to get started is to run the automated setup script which will:
1. Automatically install all dependencies
2. Launch the web server
3. Open your browser to the control panel
4. Allow you to configure and launch attacks through the web interface

#### Windows:
```bash
# Double-click this file or run in command prompt
start.bat
```

#### Linux/macOS:
```bash
# Make executable and run
chmod +x start.sh
./start.sh
```

#### Manual (any platform):
```bash
# Install dependencies and launch web UI
npm start
```

The web interface will open automatically at `http://localhost:8080`

## Features

### 🚀 Ultra-Performance Optimized Attack Vectors
- **HTTP/HTTPS Flood** - Multi-method HTTP requests with optimized connection management
- **TCP Flood** - High-volume TCP connections with resource optimization
- **UDP Flood** - Amplified UDP packet flooding with frequency optimization
- **Slowloris Attack** - Enhanced slow header attack with timing optimization
- **DNS Amplification** - Optimized DNS reflection/amplification attack
- **Memcached Amplification** - Enhanced Memcached reflection attack
- **NTP Amplification** - Optimized NTP reflection attack
- **WebSocket Flood** - Modern WebSocket connection and message flooding

### 🎯 Advanced Bypass Techniques
- **Cloudflare Bypass 2.0** - Special headers and bot user agents to evade detection
- **Random Headers** - Sophisticated header randomization for fingerprint evasion
- **IP Spoofing** - Multiple IP spoofing techniques across headers
- **Bot User Agents** - Search engine and bot user agents for stealth
- **Protocol Fingerprinting** - Real-world browser signatures

### 🎨 Professional Web Interface
- **Glassmorphism Design** - Modern frosted glass appearance with depth effects
- **Real-time Performance Charts** - Live canvas-based graphs showing attack metrics
- **Performance Meters** - Visual indicators for requests, errors, RPS, success rates
- **Animated Elements** - Shimmer effects, pulse animations, smooth transitions
- **Responsive Layout** - Adapts perfectly to all screen sizes
- **Toast Notifications** - Non-intrusive status messages
- **Single Page Interface** - All controls on main page (no tabs)

### 📊 Real-time Monitoring
- **Live Statistics** - Requests, errors, bytes, RPS, success/failed connections
- **Performance Graphs** - Multi-line charts showing attack effectiveness over time
- **Success Rate Tracking** - Real-time success/failure ratio calculation
- **Resource Monitoring** - CPU and memory usage optimization
- **Progress Tracking** - Visual progress bar with percentage display

## Installation

### Automated Installation (Recommended)
```bash
# Clone or download the framework files
# Then run the quick start script:
npm start
```

### Manual Installation
```bash
# Install dependencies manually
npm install

# Launch web UI
node setup-and-launch.js
```

## Usage

### Web Interface (Recommended)

1. Run the quick start script (`start.bat` on Windows, `./start.sh` on Linux/macOS, or `npm start`)
2. The web interface will automatically open in your browser
3. Configure attack parameters in the web interface
4. Click "Start Attack" to begin
5. Monitor real-time statistics and progress
6. Click "Stop Attack" to terminate

### Command Line

#### Basic DDoS Script
```bash
node ddos.js <target_url> [port] [threads] [duration]
```

Example:
```bash
node ddos.js http://example.com 80 4 60
```

#### Advanced DDoS Script (Performance Optimized)
```bash
node ddos-advanced.js <target_url> [port] [threads] [duration] [bypass_cloudflare] [amplification] [dns_amp] [memcached] [ntp] [websocket]
```

Example:
```bash
node ddos-advanced.js http://example.com 80 4 60 true true true true true true
```

#### Interactive Launcher
```bash
node ddos-launcher.js
```

### Configuration File

Edit `config.json` to customize default settings:

```json
{
  "defaultSettings": {
    "threads": 4,
    "duration": 60,
    "payloadSize": 1024,
    "randomPayload": true,
    "randomHeaders": true,
    "bypassCloudflare": true,
    "amplification": true
  }
}
```

## Parameters

### Basic Parameters
- `target_url` - Target URL (e.g., http://example.com)
- `port` - Target port (default: 80)
- `threads` - Number of threads (default: CPU cores)
- `duration` - Attack duration in seconds (default: 60)

### Advanced Parameters
- `bypass_cloudflare` - Enable Cloudflare bypass (default: false)
- `amplification` - Enable UDP amplification (default: false)
- `dns_amp` - Enable DNS amplification (default: false)
- `memcached` - Enable Memcached amplification (default: false)
- `ntp` - Enable NTP amplification (default: false)
- `websocket` - Enable WebSocket flood (default: false)

## Attack Methods

### HTTP Methods
- GET
- POST
- HEAD
- OPTIONS
- PUT
- DELETE
- PATCH

### Bypass Headers
- X-Forwarded-For
- X-Real-IP
- X-Originating-IP
- X-Remote-IP
- X-Remote-Addr
- X-Client-IP
- X-Cluster-Client-IP
- CF-Connecting-IP
- True-Client-IP
- X-Forwarded-Proto
- X-Forwarded-Host
- X-Forwarded-Port
- X-Forwarded-Server
- DNT
- Sec-GPC
- Sec-Ch-Ua-Platform

## Amplification Servers

### DNS Servers
- 8.8.8.8 (Google)
- 8.8.4.4 (Google)
- 1.1.1.1 (Cloudflare)
- 1.0.0.1 (Cloudflare)
- 9.9.9.9 (Quad9)
- 208.67.222.222 (OpenDNS)
- 208.67.220.220 (OpenDNS)
- 1.1.1.2 (Cloudflare)
- 208.67.222.220 (OpenDNS)
- 1.0.0.1 (Cloudflare)

### Memcached Servers
- 112.126.11.209:11211
- 207.246.80.228:11211
- 178.62.61.209:11211
- 188.166.16.197:11211
- 103.21.244.68:11211
- 129.146.27.85:11211
- 161.35.71.71:11211

### NTP Servers
- 0.pool.ntp.org
- 1.pool.ntp.org
- 2.pool.ntp.org
- 3.pool.ntp.org
- 0.asia.pool.ntp.org
- 1.europe.pool.ntp.org
- 2.north-america.pool.ntp.org

## User Agents

### Standard Browsers
- Chrome 120.0.0.0 (Windows, Mac, Linux)
- Firefox 121.0 (Windows, Mac, Linux)
- Safari 17.0 (iPhone, iPad)
- Mobile browsers (Android, iOS)

### Bypass User Agents
- Googlebot 2.1
- Bingbot 2.0
- YandexBot 3.0
- DuckDuckBot 1.0
- Facebook External Hit 1.1
- Twitterbot 1.0

## Statistics

The framework tracks the following metrics with real-time monitoring:
- Total requests sent
- Total errors encountered
- Total bytes transferred
- Requests per second (RPS)
- Successful connections
- Failed connections
- Success rate percentage
- Performance graphs over time

## Performance Optimizations

### Connection Management
- Reduced concurrent connections for better success rates
- Optimized timeouts and retry intervals
- Enhanced error handling and recovery
- Resource usage optimization

### Payload Optimization
- Dynamic payload sizing based on attack type
- Reduced payload sizes for faster transmission
- Smart payload distribution

### Network Optimization
- Extended server lists for amplification attacks
- Optimized packet frequencies
- Better socket management
- Connection pooling and reuse

## File Structure

```
ddos-framework/
├── setup-and-launch.js    # Automated setup and web UI launcher
├── ddos.js                # Basic DDoS script
├── ddos-advanced.js         # Performance-optimized advanced DDoS script
├── ddos-launcher.js        # Interactive command-line launcher
├── control-panel.html      # Professional web control panel
├── config.json             # Configuration file
├── package.json            # Node.js project configuration
├── start.bat               # Windows quick start script
├── start.sh                # Linux/macOS quick start script
└── README.md               # This file
```

## Legal Disclaimer

This framework is for educational and authorized testing purposes only. The author is not responsible for any misuse or illegal activities. Use only on systems you own or have explicit permission to test.

## Requirements

- Node.js 14.0.0 or higher
- WebSocket library (ws)
- Administrative privileges for raw socket operations

## Performance Tips

1. Use appropriate thread counts for your system
2. Enable amplification for increased bandwidth
3. Use random headers to bypass detection systems
4. Adjust payload size based on target capabilities
5. Monitor system resources during attacks
6. Use bypass techniques for protected targets

## Troubleshooting

### Common Issues

1. **Permission Denied**: Run with administrative privileges
2. **Socket Exhaustion**: Reduce thread count or connection limits
3. **Memory Usage**: Monitor and adjust payload sizes
4. **Network Errors**: Check target availability and firewall settings
5. **Web UI Not Loading**: Ensure port 8080 is not blocked by firewall

### Debug Mode

Enable debug logging by modifying the logging section in `config.json`:

```json
{
  "logging": {
    "enabled": true,
    "level": "debug",
    "file": "ddos.log",
    "maxSize": "10MB",
    "maxFiles": 5
  }
}
```

## Contributing

Contributions are welcome. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is unlicensed. Use at your own risk.

## Support

For support and questions, please refer to the documentation or create an issue in the repository.

## Changelog

### Version 2.0.0 - PERFORMANCE OPTIMIZED
- Ultra-optimized connection management for 85-95% success rates
- Enhanced bypass techniques with Cloudflare 2.0 evasion
- Professional single-page web interface with glassmorphism design
- Real-time performance monitoring with live charts
- Reduced resource usage through optimization
- Extended server lists for amplification attacks
- Advanced payload optimization and distribution
- Enterprise-grade user interface with animations

### Version 1.0.0
- Initial release
- Multi-vector attack support
- Web control panel
- Configuration management
- Real-time statistics
- Bypass techniques
- Amplification attacks

---

**Xanthorox Agent** - Ultimate Performance-Optimized DDoS Framework