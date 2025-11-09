# 🐱 猫咪护理 AI Agent

基于 Mastra 框架的智能猫咪护理助手，提供品种识别、健康咨询、营养建议、行为分析等专业服务。

## ✨ 功能特性

- **品种识别专家** 🔍 - 识别猫咪品种并提供详细特征信息
- **健康咨询顾问** 🏥 - 评估健康状态，提供初步诊断建议
- **营养师** 🍽️ - 制定科学喂养方案和营养建议
- **行为学专家** 🎯 - 分析行为问题，提供训练方案
- **综合咨询助手** 🐱 - 全能的猫咪护理顾问

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env` 并填入你的 OpenAI API Key:

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
```

### 3. 启动服务

```bash
# 开发模式（支持热重载）
npm run dev

# 生产模式
npm start
```

服务将在 `http://localhost:3001` 启动。

## 📡 API 接口

### 健康检查

```bash
GET /api/health
```

### 获取可用 Agents

```bash
GET /api/agents
```

### 聊天接口

```bash
POST /api/chat

{
  "message": "我的猫最近不爱吃东西，怎么办？",
  "agentId": "catCareConsultation",
  "conversationHistory": []
}
```

### 流式聊天

```bash
POST /api/chat/stream

{
  "message": "请帮我识别这只猫的品种",
  "agentId": "breedIdentification"
}
```

### 图片分析

```bash
POST /api/analyze-image

{
  "imageUrl": "https://example.com/cat.jpg",
  "question": "这只猫是什么品种？",
  "agentId": "breedIdentification"
}
```

## 🤖 可用的 Agents

| Agent ID | 名称 | 描述 |
|----------|------|------|
| `catCareConsultation` | 综合咨询助手 | 全能顾问，可回答所有类型问题 |
| `breedIdentification` | 品种识别专家 | 识别猫咪品种 |
| `healthConsultation` | 健康咨询顾问 | 健康评估和诊断建议 |
| `nutritionAdvisor` | 营养师 | 喂养方案和营养建议 |
| `behaviorAnalysis` | 行为学专家 | 行为问题分析和训练 |

## 🏗️ 项目结构

```
cat-agent/
├── src/
│   ├── mastra/
│   │   ├── agents/           # AI Agents
│   │   │   ├── breed-agent.js
│   │   │   ├── health-agent.js
│   │   │   ├── nutrition-agent.js
│   │   │   ├── behavior-agent.js
│   │   │   ├── consultation-agent.js
│   │   │   └── index.js
│   │   └── index.js          # Mastra 实例
│   └── server.js             # Express API 服务器
├── .env                      # 环境变量
├── .env.example              # 环境变量示例
├── package.json
└── README.md
```

## 💡 使用示例

### 品种识别

```javascript
const response = await fetch('http://localhost:3001/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: '蓝灰色短毛，圆脸，橙色眼睛，这是什么品种？',
    agentId: 'breedIdentification'
  })
});

const data = await response.json();
console.log(data.data.message);
```

### 健康咨询

```javascript
const response = await fetch('http://localhost:3001/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: '我的猫3天没吃东西了，总是躲在角落，怎么办？',
    agentId: 'healthConsultation'
  })
});
```

### 营养建议

```javascript
const response = await fetch('http://localhost:3001/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: '我的猫2岁，4.5kg，已绝育，每天应该喂多少猫粮？',
    agentId: 'nutritionAdvisor'
  })
});
```

## 🛠️ 技术栈

- **框架**: [Mastra](https://mastra.ai) - AI Agent 框架
- **LLM**: OpenAI GPT-4o-mini / GPT-4o
- **服务器**: Express.js
- **语言**: JavaScript (ES Modules)

## ⚠️ 注意事项

1. 本服务提供的建议仅供参考，不能替代专业兽医诊断
2. 严重健康问题请立即就医
3. 确保妥善保管 OpenAI API Key，不要提交到版本控制

## 📝 许可证

ISC

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

Made with ❤️ for cat lovers 🐾
