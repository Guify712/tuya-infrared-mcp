#!/data/data/com.termux/files/usr/bin/bash
# =============================================
# 拍拍玩偶 · 涂鸦红外 MCP · Termux 一键部署
# 作者：辰辰（for 月月）
# 用法：bash setup.sh
# =============================================
set -e

echo "🎈 开始部署 tuya-infrared-mcp ..."

echo "▶ [1/5] 更新软件源"
pkg update -y

echo "▶ [2/5] 安装 Node.js 和 Git"
pkg install -y nodejs-lts git

echo "▶ [3/5] 克隆项目（辰辰的 fork）"
if [ -d "tuya-infrared-mcp" ]; then
  echo "   项目已存在，进入目录"
  cd tuya-infrared-mcp
  git pull
else
  git clone https://github.com/Guify712/tuya-infrared-mcp.git
  cd tuya-infrared-mcp
fi

echo "▶ [4/5] 安装依赖"
npm install

echo "▶ [5/5] 生成 .env 配置模板"
if [ ! -f ".env" ]; then
  cp .env.example .env
fi

echo ""
echo "✅ 部署完成！接下来："
echo ""
echo "   1) 编辑配置："
echo "        nano .env"
echo "       （或用 vi .env）"
echo "       填入你的涂鸦凭证和按键，保存"
echo ""
echo "   2) 启动服务："
echo "        npm start"
echo ""
echo "   3) 服务跑起来后，在 kelivo 里添加 MCP："
echo "        URL: http://localhost:3036/mcp"
echo ""
echo "   详细步骤看 DEPLOY.md"
