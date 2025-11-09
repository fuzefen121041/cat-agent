# 🚀 Cat Agent 部署指南 - Render

## 📋 前提条件

- GitHub 账号
- Render 账号（免费注册：https://render.com）
- OpenAI 或 DeepSeek API Key

## 🎯 部署步骤

### 1️⃣ 准备 GitHub 仓库

你的代码已经推送到：
```
https://github.com/fuzefen121041/cat-agent.git
```

### 2️⃣ 在 Render 创建服务

1. **登录 Render**
   - 访问 https://render.com
   - 使用 GitHub 账号登录

2. **创建新的 Web Service**
   - 点击 "New +" 按钮
   - 选择 "Web Service"

3. **连接 GitHub 仓库**
   - 选择 "Connect a repository"
   - 找到并选择 `fuzefen121041/cat-agent`
   - 点击 "Connect"

4. **配置服务**
   Render 会自动检测到 `render.yaml` 配置，你也可以手动设置：

   ```
   Name: cat-agent (或你想要的名字)
   Region: Singapore (选择离你近的区域)
   Branch: main
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free
   ```

5. **配置环境变量** ⚠️ 重要！

   在 "Environment" 标签页添加以下变量：

   ```
   NODE_ENV=production
   PORT=3001

   # 选择一个 API Provider 并配置对应的 Key
   OPENAI_API_KEY=你的OpenAI密钥
   # 或
   DEEPSEEK_API_KEY=你的DeepSeek密钥
   DEEPSEEK_BASE_URL=https://api.deepseek.com
   ```

6. **部署**
   - 点击 "Create Web Service"
   - Render 会自动开始构建和部署
   - 等待 5-10 分钟完成首次部署

### 3️⃣ 获取服务 URL

部署成功后，Render 会提供一个 URL，类似：
```
https://cat-agent.onrender.com
```

### 4️⃣ 更新前端配置

修改 `cat-chat` 项目中的 API 地址：

**cat-chat/.env.local**
```env
NEXT_PUBLIC_API_URL=https://cat-agent.onrender.com
```

或者直接修改前端代码中的 API 地址：
**cat-chat/components/ChatInterface.tsx**
```typescript
const response = await fetch('https://cat-agent.onrender.com/api/chat', {
  // ...
})
```

## 🔧 验证部署

### 测试 API
```bash
# 健康检查
curl https://cat-agent.onrender.com/api/health

# 获取 agents 列表
curl https://cat-agent.onrender.com/api/agents

# 测试聊天
curl -X POST https://cat-agent.onrender.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "你好", "agentId": "catCareConsultation"}'
```

## 📝 注意事项

### ⚠️ Render 免费套餐限制

1. **自动休眠**：
   - 15 分钟无请求后自动休眠
   - 下次请求需要 30-60 秒冷启动
   - 解决方案：使用 UptimeRobot 等服务定时 ping

2. **每月限制**：
   - 750 小时运行时间（够用一个月）
   - 带宽限制：100GB/月

3. **性能**：
   - 免费套餐 512MB RAM
   - 0.1 CPU
   - 对于 AI 应用可能较慢

### 🔐 安全建议

1. **保护 API Key**
   - 不要在代码中硬编码
   - 使用 Render 的环境变量
   - 定期轮换密钥

2. **添加速率限制**
   - 考虑添加 express-rate-limit
   - 防止滥用和过高费用

3. **CORS 配置**
   - 在生产环境限制允许的域名
   - 修改 server.js 的 cors 配置

## 🔄 自动部署

Render 已配置自动部署：
- 每次推送到 `main` 分支
- Render 会自动检测并重新部署
- 无需手动操作

## 📊 监控日志

在 Render Dashboard：
1. 选择你的服务
2. 点击 "Logs" 标签
3. 查看实时日志和错误信息

## 🆙 升级到付费套餐

如果需要更好的性能：
- **Starter ($7/月)**：不会休眠，更快的响应
- **Standard ($25/月)**：更多资源，更好的性能

## 🐛 常见问题

### 1. 部署失败
```bash
# 检查日志
# 确认 package.json 的 start 脚本正确
# 确认所有依赖都在 package.json 中
```

### 2. API 调用失败
- 检查环境变量是否正确设置
- 确认 API Key 有效
- 查看 Render 日志了解错误

### 3. 冷启动太慢
- 考虑升级套餐
- 或使用 UptimeRobot 保持活跃

## 📚 相关链接

- Render 文档：https://render.com/docs
- GitHub 仓库：https://github.com/fuzefen121041/cat-agent
- OpenAI API：https://platform.openai.com
- DeepSeek API：https://platform.deepseek.com

---

✅ 部署完成后，你的猫咪 AI 助手就可以在线使用了！🐱
