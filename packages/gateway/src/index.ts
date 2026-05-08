import express, { Express } from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import { CAEAgentEngine } from '@cae-claw/agent';
import { SkillRegistry, initializeDefaultSkills } from '@cae-claw/skills';
import type { ExecutionContext } from '@cae-claw/core';

const app: Express = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const skillRegistry = new SkillRegistry();
const agentEngine = new CAEAgentEngine();

initializeDefaultSkills(skillRegistry);

for (const skill of skillRegistry.get_all()) {
  agentEngine.register_skill(skill);
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const sessions = new Map<string, ChatMessage[]>();

app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    version: '1.0.0',
    skills: skillRegistry.count()
  });
});

app.get('/api/skills', (req, res) => {
  const category = req.query.category as string | undefined;
  const skills = skillRegistry.list(category);
  res.json({ skills });
});

app.get('/api/skills/categories', (_req, res) => {
  const byCategory = skillRegistry.get_by_category();
  res.json({ categories: byCategory });
});

app.get('/api/skills/:id', (req, res) => {
  const skill = skillRegistry.get(req.params.id);
  if (!skill) {
    return res.status(404).json({ error: 'Skill not found' });
  }
  res.json({ skill });
});

app.post('/api/skills/:id/execute', async (req, res) => {
  const skill = skillRegistry.get(req.params.id);
  if (!skill) {
    return res.status(404).json({ error: 'Skill not found' });
  }

  const execution_id = `exec_${Date.now()}`;
  const context: ExecutionContext = {
    execution_id,
    skill_id: skill.id,
    parameters: req.body.parameters || {},
    started_at: new Date().toISOString(),
    metadata: {}
  };

  try {
    const result = await skillRegistry.execute(skill.id, context);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Execution failed' 
    });
  }
});

app.post('/api/chat', async (req, res) => {
  const { message, session_id } = req.body as { message: string; session_id?: string };
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const sid = session_id || `session_${Date.now()}`;
  if (!sessions.has(sid)) {
    sessions.set(sid, []);
  }
  
  const messages = sessions.get(sid)!;
  messages.push({
    id: `msg_${Date.now()}`,
    role: 'user',
    content: message,
    timestamp: new Date().toISOString()
  });

  try {
    const context: ExecutionContext = {
      execution_id: `chat_${Date.now()}`,
      skill_id: 'agent',
      session_id: sid,
      parameters: { message },
      started_at: new Date().toISOString(),
      metadata: {}
    };

    const result = await agentEngine.run(message, context);
    
    const response: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: JSON.stringify(result.output || result.error?.message || 'Task completed'),
      timestamp: new Date().toISOString()
    };
    
    messages.push(response);
    
    res.json({ 
      response,
      session_id: sid,
      result 
    });
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Chat failed' 
    });
  }
});

app.get('/api/sessions/:id', (req, res) => {
  const messages = sessions.get(req.params.id);
  if (!messages) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json({ messages });
});

const httpServer = createServer(app);

const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

wss.on('connection', (ws: WebSocket) => {
  console.log('WebSocket client connected');

  ws.on('message', (data: Buffer) => {
    try {
      const message = JSON.parse(data.toString());
      
      if (message.type === 'chat') {
        const context: ExecutionContext = {
          execution_id: `ws_${Date.now()}`,
          skill_id: 'agent',
          parameters: { message: message.content },
          started_at: new Date().toISOString(),
          metadata: {}
        };

        agentEngine.run(message.content, context).then((result) => {
          ws.send(JSON.stringify({
            type: 'response',
            content: JSON.stringify(result.output || result.error),
            success: result.success
          }));
        });
      }
    } catch (error) {
      ws.send(JSON.stringify({ 
        type: 'error', 
        error: error instanceof Error ? error.message : 'Invalid message' 
      }));
    }
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

httpServer.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🦀 CAE Claw Gateway                                 ║
║                                                       ║
║   HTTP Server:  http://localhost:${PORT}                 ║
║   WebSocket:    ws://localhost:${PORT}/ws               ║
║   Health:       http://localhost:${PORT}/api/health     ║
║                                                       ║
║   Skills loaded: ${skillRegistry.count()}                          ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

export { app, httpServer };
