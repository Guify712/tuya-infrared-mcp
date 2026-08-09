# Tuya Infrared MCP Server

English | [中文](README_CN.md)

A Model Context Protocol (MCP) server that allows AI assistants to control devices through Tuya infrared remote control.

## Features

- 🎮 Control devices via Tuya infrared remote control
- 🔌 MCP protocol support (Streamable HTTP)
- 🌐 RESTful API with health check endpoint
- ⚙️ Easy configuration via environment variables
- 🔒 Secure credential management

## Prerequisites

- Node.js >= 14.0.0
- Tuya IoT Platform account
- Tuya infrared remote control device
- Learned IR codes for your target device

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
TUYA_BASE_URL=https://openapi.tuyacn.com
TUYA_ACCESS_ID=your_access_id_here
TUYA_ACCESS_SECRET=your_access_secret_here
TUYA_DEVICE_ID=your_device_id_here
TUYA_REMOTE_ID=your_remote_id_here
TUYA_CATEGORY_ID=13
KEY_SWITCH=your_switch_key_here
KEY_MODE_15MIN=your_mode_key_here
PORT=3036
```

### 3. Run Server

```bash
npm start
```

Server will run on `http://localhost:3036`

## How to Get Tuya Credentials

### Step 1: Create Tuya IoT Platform Account

1. Go to [Tuya IoT Platform](https://iot.tuya.com/)
2. Register and create a new project
3. Choose "Custom Development"
4. Select data center (e.g., China)

### Step 2: Get API Credentials

1. Go to your project dashboard
2. Navigate to "Overview" → "Authorization Key"
3. Copy `Access ID` and `Access Secret`

### Step 3: Enable Infrared API Service

1. Go to "Service API" tab
2. Search for "Infrared Remote Control" (万能红外开放能力)
3. Enable the service

### Step 4: Link Your Device

1. Add your Tuya infrared remote to Tuya Smart App
2. Go to project "Devices" tab
3. Click "Link Tuya App Account"
4. Link your Tuya Smart App account
5. Your device will appear in the device list

### Step 5: Get Device Information

Use the test script to get device info:

```javascript
const { TuyaContext } = require('@tuya/tuya-connector-nodejs');

const context = new TuyaContext({
  baseUrl: 'https://openapi.tuyacn.com',
  accessKey: 'your_access_id',
  secretKey: 'your_access_secret'
});

// Get device list
const devices = await context.request({
  path: '/v1.0/devices',
  method: 'GET'
});

console.log(devices);
```

### Step 6: Learn IR Codes

1. Use Tuya Smart App to learn IR codes from your device's remote
2. Use API to get learned keys:

```javascript
// Get remote list
const remotes = await context.request({
  path: `/v1.0/infrareds/${DEVICE_ID}/remotes`,
  method: 'GET'
});

// Get learned keys for a remote
const keys = await context.request({
  path: `/v1.0/infrareds/${DEVICE_ID}/remotes/${REMOTE_ID}/keys`,
  method: 'GET'
});

console.log(keys);
```

## MCP Configuration

### For Claude Desktop / Claude Code

Add to your MCP configuration file:

```json
{
  "mcpServers": {
    "tuya-infrared": {
      "transport": {
        "type": "streamable-http",
        "url": "http://localhost:3036/mcp"
      }
    }
  }
}
```

### For Remote Access

If running on a server:

```json
{
  "mcpServers": {
    "tuya-infrared": {
      "transport": {
        "type": "streamable-http",
        "url": "http://your-server-ip:3036/mcp"
      }
    }
  }
}
```

**Note**: Make sure to open port 3036 in your firewall.

## API Endpoints

### Health Check

```bash
GET /health
```

Response:
```json
{
  "status": "ok",
  "service": "tuya-infrared-mcp"
}
```

### MCP Endpoint

```bash
POST /mcp
Content-Type: application/json
```

## Available MCP Tools

### send_infrared

Send infrared signal to control your device.

**Parameters:**
- `action` (string): Action type
  - `switch`: Toggle power switch
  - `mode_15min`: Change to 15-minute mode

**Example:**

```javascript
// In AI assistant
send_infrared({ action: "switch" })
send_infrared({ action: "mode_15min" })
```

## Limitations

- Infrared signal requires line-of-sight
- Distance limitation (typically 1-3 meters)
- Remote control must be powered on
- Cannot work through walls or obstacles

## Troubleshooting

### "Sign Invalid" Error

- Check if your Access Secret is correct
- Make sure you linked your Tuya Smart App account to the project

### "API Not Subscribed" Error

- Enable "Infrared Remote Control" service in your project

### Connection Timeout

- Check if port 3036 is open
- Verify server is running
- Check firewall settings

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Built with [Tuya IoT Platform](https://iot.tuya.com/)
- Based on [Model Context Protocol](https://modelcontextprotocol.io/)
