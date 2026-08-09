const express = require('express');
const { TuyaContext } = require('@tuya/tuya-connector-nodejs');
require('dotenv').config();

const app = express();
app.use(express.json());

// 涂鸦配置（从环境变量读取）
const TUYA_CONFIG = {
  baseUrl: process.env.TUYA_BASE_URL || 'https://openapi.tuyacn.com',
  accessKey: process.env.TUYA_ACCESS_ID,
  secretKey: process.env.TUYA_ACCESS_SECRET
};

const DEVICE_ID = process.env.TUYA_DEVICE_ID;
const REMOTE_ID = process.env.TUYA_REMOTE_ID;
const CATEGORY_ID = parseInt(process.env.TUYA_CATEGORY_ID || '13');

// 学习的按键（从环境变量读取）
const KEYS = {
  switch: process.env.KEY_SWITCH,
  mode_15min: process.env.KEY_MODE_15MIN
};

// 创建涂鸦上下文
const tuyaContext = new TuyaContext(TUYA_CONFIG);

// 发送红外信号
async function sendInfraredSignal(key) {
  const result = await tuyaContext.request({
    path: `/v2.0/infrareds/${DEVICE_ID}/remotes/${REMOTE_ID}/raw/command`,
    method: 'POST',
    body: {
      category_id: CATEGORY_ID,
      key: key
    }
  });

  return result.success;
}

// MCP endpoint
app.post('/mcp', async (req, res) => {
  const { jsonrpc, id, method, params } = req.body;

  // 检查 JSON-RPC 2.0 格式
  if (jsonrpc !== '2.0') {
    return res.json({
      jsonrpc: '2.0',
      id: id || null,
      error: { code: -32600, message: 'Invalid Request' }
    });
  }

  // 处理 initialize
  if (method === 'initialize') {
    return res.json({
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: {
          name: 'tuya-infrared-mcp',
          version: '1.0.0'
        }
      }
    });
  }

  // 处理 ping
  if (method === 'ping') {
    return res.json({
      jsonrpc: '2.0',
      id,
      result: {}
    });
  }

  // 处理 tools/list
  if (method === 'tools/list') {
    return res.json({
      jsonrpc: '2.0',
      id,
      result: {
        tools: [
          {
            name: 'send_infrared',
            description: 'Send infrared signal via Tuya remote control',
            inputSchema: {
              type: 'object',
              properties: {
                action: {
                  type: 'string',
                  description: 'Action type',
                  enum: ['switch', 'mode_15min'],
                  default: 'switch'
                }
              }
            }
          }
        ]
      }
    });
  }

  // 处理 tools/call
  if (method === 'tools/call') {
    const { name, arguments: args } = params;

    if (name === 'send_infrared') {
      const action = args?.action || 'switch';
      const key = KEYS[action];

      if (!key) {
        return res.json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: `❌ Unknown action: ${action}` }],
            isError: true
          }
        });
      }

      try {
        const success = await sendInfraredSignal(key);

        if (success) {
          const actionName = action === 'switch' ? 'Toggled switch' : 'Changed mode to 15min';
          return res.json({
            jsonrpc: '2.0',
            id,
            result: {
              content: [{ type: 'text', text: `✅ ${actionName}` }],
              isError: false
            }
          });
        } else {
          return res.json({
            jsonrpc: '2.0',
            id,
            result: {
              content: [{ type: 'text', text: '❌ Failed to send signal' }],
              isError: true
            }
          });
        }
      } catch (error) {
        return res.json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: `❌ Error: ${error.message}` }],
            isError: true
          }
        });
      }
    }

    return res.json({
      jsonrpc: '2.0',
      id,
      result: {
        content: [{ type: 'text', text: `❌ Unknown tool: ${name}` }],
        isError: true
      }
    });
  }

  // 未知方法
  res.json({
    jsonrpc: '2.0',
    id: id || null,
    error: { code: -32601, message: 'Method not found' }
  });
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'tuya-infrared-mcp' });
});

const PORT = process.env.PORT || 3036;
app.listen(PORT, () => {
  console.log(`Tuya Infrared MCP server running on http://localhost:${PORT}`);
});
