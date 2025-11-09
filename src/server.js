import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { mastra } from './mastra/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));

/**
 * 健康检查接口
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '猫咪护理 AI 服务运行中 🐱' });
});

/**
 * 获取可用的 agents 列表
 */
app.get('/api/agents', (req, res) => {
  const agentsList = [
    {
      id: 'catCareConsultation',
      name: '综合咨询助手',
      description: '全能的猫咪护理顾问，可回答所有类型的问题',
      icon: '🐱'
    },
    {
      id: 'breedIdentification',
      name: '品种识别专家',
      description: '识别猫咪品种并提供详细特征信息',
      icon: '🔍'
    },
    {
      id: 'healthConsultation',
      name: '健康咨询顾问',
      description: '评估健康状态，提供初步诊断建议',
      icon: '🏥'
    },
    {
      id: 'nutritionAdvisor',
      name: '营养师',
      description: '制定科学喂养方案和营养建议',
      icon: '🍽️'
    },
    {
      id: 'behaviorAnalysis',
      name: '行为学专家',
      description: '分析行为问题，提供训练方案',
      icon: '🎯'
    }
  ];

  res.json({ agents: agentsList });
});

/**
 * 聊天接口 - 与指定 agent 对话（支持图片）
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { message, image, agentId = 'catCareConsultation', conversationHistory = [] } = req.body;

    if (!message && !image) {
      return res.status(400).json({ error: '消息内容不能为空' });
    }

    // 获取指定的 agent
    const agent = mastra.getAgent(agentId);

    if (!agent) {
      return res.status(404).json({ error: '找不到指定的 agent' });
    }

    // 构建消息历史
    const messages = [
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // 构建当前用户消息
    let userMessage;
    if (image) {
      // 如果有图片，使用多模态消息格式
      userMessage = {
        role: 'user',
        content: [
          {
            type: 'image',
            image: image,
            mimeType: 'image/jpeg'
          },
          {
            type: 'text',
            text: message || '请分析这张猫咪照片。'
          }
        ]
      };
    } else {
      // 纯文本消息
      userMessage = {
        role: 'user',
        content: message
      };
    }

    messages.push(userMessage);

    // 调用 agent 生成回复
    const response = await agent.generate(messages);

    res.json({
      success: true,
      data: {
        message: response.text,
        agentId: agentId,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('聊天错误:', error);
    res.status(500).json({
      error: '处理消息时出错',
      details: error.message
    });
  }
});

/**
 * 流式聊天接口 - 支持实时响应
 */
app.post('/api/chat/stream', async (req, res) => {
  try {
    const { message, agentId = 'catCareConsultation', conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: '消息内容不能为空' });
    }

    const agent = mastra.getAgent(agentId);

    if (!agent) {
      return res.status(404).json({ error: '找不到指定的 agent' });
    }

    // 设置 SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const messages = [
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // 使用流式响应
    const stream = await agent.stream(messages);

    for await (const chunk of stream) {
      if (chunk.type === 'text-delta') {
        res.write(`data: ${JSON.stringify({ type: 'text', content: chunk.textDelta })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();

  } catch (error) {
    console.error('流式聊天错误:', error);
    res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
    res.end();
  }
});

/**
 * 图片分析接口 - 支持图片上传分析
 */
app.post('/api/analyze-image', async (req, res) => {
  try {
    const { imageUrl, imageBase64, question, agentId = 'catCareConsultation' } = req.body;

    if (!imageUrl && !imageBase64) {
      return res.status(400).json({ error: '请提供图片URL或Base64数据' });
    }

    const agent = mastra.getAgent(agentId);

    if (!agent) {
      return res.status(404).json({ error: '找不到指定的 agent' });
    }

    // 构建包含图片的消息
    const imageData = imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : imageUrl;

    const messages = [{
      role: 'user',
      content: [
        {
          type: 'image',
          image: imageData,
          mimeType: 'image/jpeg'
        },
        {
          type: 'text',
          text: question || '请分析这张猫咪照片，告诉我关于这只猫的信息。'
        }
      ]
    }];

    const response = await agent.generate(messages);

    res.json({
      success: true,
      data: {
        analysis: response.text,
        agentId: agentId,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('图片分析错误:', error);
    res.status(500).json({
      error: '分析图片时出错',
      details: error.message
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   🐱 猫咪护理 AI 服务已启动               ║
║                                            ║
║   端口: ${PORT}                            ║
║   环境: ${process.env.NODE_ENV || 'development'}                      ║
║                                            ║
║   API 端点:                                ║
║   - GET  /api/health                       ║
║   - GET  /api/agents                       ║
║   - POST /api/chat                         ║
║   - POST /api/chat/stream                  ║
║   - POST /api/analyze-image                ║
║                                            ║
║   准备就绪！🚀                            ║
╚════════════════════════════════════════════╝
  `);
});

export default app;
