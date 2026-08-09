# Tuya 红外 MCP 服务器

[English](README.md) | 中文

一个模型上下文协议（MCP）服务器，允许 AI 助手通过涂鸦红外遥控器控制设备。

## 功能特性

- 🎮 通过涂鸦红外遥控器控制设备
- 🔌 支持 MCP 协议（Streamable HTTP）
- 🌐 RESTful API，带健康检查端点
- ⚙️ 通过环境变量轻松配置
- 🔒 安全的凭证管理

## 前置要求

- Node.js >= 14.0.0
- 涂鸦 IoT 平台账号
- 涂鸦红外遥控器设备
- 已学习的红外码

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填入你的凭证：

```bash
cp .env.example .env
```

编辑 `.env`：

```env
TUYA_BASE_URL=https://openapi.tuyacn.com
TUYA_ACCESS_ID=你的_access_id
TUYA_ACCESS_SECRET=你的_access_secret
TUYA_DEVICE_ID=你的设备id
TUYA_REMOTE_ID=你的遥控器id
TUYA_CATEGORY_ID=13
KEY_SWITCH=你的开关按键
KEY_MODE_15MIN=你的模式按键
PORT=3036
```

### 3. 运行服务器

```bash
npm start
```

服务器将运行在 `http://localhost:3036`

## 如何获取涂鸦凭证

### 第一步：创建涂鸦 IoT 平台账号

1. 访问 [涂鸦 IoT 平台](https://iot.tuya.com/)
2. 注册并创建新项目
3. 选择"自定义开发"
4. 选择数据中心（例如：中国）

### 第二步：获取 API 凭证

1. 进入项目控制台
2. 导航到"概览"→"授权密钥"
3. 复制 `Access ID` 和 `Access Secret`

### 第三步：开通红外 API 服务

1. 进入"服务 API"标签页
2. 搜索"万能红外开放能力"
3. 开通该服务

### 第四步：关联设备

1. 在涂鸦智能 App 中添加红外遥控器
2. 进入项目"设备"标签页
3. 点击"关联涂鸦 App 账号"
4. 关联你的涂鸦智能 App 账号
5. 设备将出现在设备列表中

### 第五步：获取设备信息

使用测试脚本获取设备信息：

```javascript
const { TuyaContext } = require('@tuya/tuya-connector-nodejs');

const context = new TuyaContext({
  baseUrl: 'https://openapi.tuyacn.com',
  accessKey: '你的_access_id',
  secretKey: '你的_access_secret'
});

// 获取设备列表
const devices = await context.request({
  path: '/v1.0/devices',
  method: 'GET'
});

console.log(devices);
```

### 第六步：学习红外码

1. 使用涂鸦智能 App 学习设备遥控器的红外码
2. 使用 API 获取已学习的按键：

```javascript
// 获取遥控器列表
const remotes = await context.request({
  path: `/v1.0/infrareds/${DEVICE_ID}/remotes`,
  method: 'GET'
});

// 获取遥控器的已学习按键
const keys = await context.request({
  path: `/v1.0/infrareds/${DEVICE_ID}/remotes/${REMOTE_ID}/keys`,
  method: 'GET'
});

console.log(keys);
```

## MCP 配置

### 对于 Claude Desktop / Claude Code

在你的 MCP 配置文件中添加：

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

### 远程访问

如果运行在服务器上：

```json
{
  "mcpServers": {
    "tuya-infrared": {
      "transport": {
        "type": "streamable-http",
        "url": "http://你的服务器IP:3036/mcp"
      }
    }
  }
}
```

**注意**：确保在防火墙中开放 3036 端口。

## API 端点

### 健康检查

```bash
GET /health
```

响应：
```json
{
  "status": "ok",
  "service": "tuya-infrared-mcp"
}
```

### MCP 端点

```bash
POST /mcp
Content-Type: application/json
```

## 可用的 MCP 工具

### send_infrared

发送红外信号控制设备。

**参数：**
- `action` (string)：动作类型
  - `switch`：切换电源开关
  - `mode_15min`：切换到 15 分钟模式

**示例：**

```javascript
// 在 AI 助手中
send_infrared({ action: "switch" })
send_infrared({ action: "mode_15min" })
```

## 使用限制

- 红外信号需要视线可见
- 距离限制（通常为 1-3 米）
- 遥控器必须通电
- 不能穿过墙壁或障碍物

## 故障排除

### "Sign Invalid" 错误

- 检查 Access Secret 是否正确
- 确保已将涂鸦智能 App 账号关联到项目

### "API Not Subscribed" 错误

- 在项目中开通"万能红外开放能力"服务

### 连接超时

- 检查 3036 端口是否开放
- 验证服务器是否运行
- 检查防火墙设置

## 开源协议

MIT

## 贡献

欢迎贡献！请随时提交 Pull Request。

## 致谢

- 基于 [涂鸦 IoT 平台](https://iot.tuya.com/)
- 使用 [模型上下文协议](https://modelcontextprotocol.io/)
