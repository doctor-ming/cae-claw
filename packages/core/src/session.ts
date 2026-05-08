import { z } from 'zod';

export const MessageRoleSchema = z.enum(['user', 'assistant', 'system', 'tool']);
export type MessageRole = z.infer<typeof MessageRoleSchema>;

export const MessageSchema = z.object({
  id: z.string(),
  role: MessageRoleSchema,
  content: z.string(),
  metadata: z.record(z.any()).default({}),
  created_at: z.string().default(() => new Date().toISOString())
});
export type Message = z.infer<typeof MessageSchema>;

export const SessionStateSchema = z.object({
  agent: z.record(z.any()).default({}),
  skill: z.record(z.any()).default({}),
  tool: z.record(z.any()).default({}),
  custom: z.record(z.any()).default({})
});
export type SessionState = z.infer<typeof SessionStateSchema>;

export const SessionSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  title: z.string().default('新会话'),
  
  messages: z.array(MessageSchema).default([]),
  state: SessionStateSchema.default({}),
  
  context: z.object({
    skills: z.array(z.string()).default([]),
    tools: z.array(z.string()).default([]),
    llm: z.string().optional(),
    parameters: z.record(z.any()).default({})
  }).default({}),
  
  status: z.enum(['active', 'archived', 'deleted']).default('active'),
  
  created_at: z.string().default(() => new Date().toISOString()),
  updated_at: z.string().default(() => new Date().toISOString()),
  last_message_at: z.string().default(() => new Date().toISOString())
});
export type Session = z.infer<typeof SessionSchema>;

export interface StorageBackend {
  get(id: string): Promise<Session | null>;
  set(session: Session): Promise<void>;
  delete(id: string): Promise<void>;
  list(userId: string, options?: ListOptions): Promise<Session[]>;
  exists(id: string): Promise<boolean>;
}

export interface ListOptions {
  status?: Session['status'];
  limit?: number;
  offset?: number;
  search?: string;
}

export interface SessionStoreConfig {
  backend: StorageBackend;
  maxHistory?: number;
  sessionTimeout?: number;
}

export class SessionStore {
  private backend: StorageBackend;
  private maxHistory: number;
  private sessionTimeout: number;

  constructor(config: SessionStoreConfig) {
    this.backend = config.backend;
    this.maxHistory = config.maxHistory ?? 100;
    this.sessionTimeout = config.sessionTimeout ?? 7 * 24 * 60 * 60 * 1000;
  }

  async create(userId: string, title?: string): Promise<Session> {
    const session: Session = {
      id: this.generateId(),
      user_id: userId,
      title: title || '新会话',
      messages: [],
      state: {
        agent: {},
        skill: {},
        tool: {},
        custom: {}
      },
      context: {
        skills: [],
        tools: [],
        parameters: {}
      },
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_message_at: new Date().toISOString()
    };
    await this.backend.set(session);
    return session;
  }

  async get(id: string): Promise<Session | null> {
    return this.backend.get(id);
  }

  async update(session: Session): Promise<Session> {
    session.updated_at = new Date().toISOString();
    await this.backend.set(session);
    return session;
  }

  async delete(id: string): Promise<void> {
    await this.backend.delete(id);
  }

  async list(userId: string, options?: ListOptions): Promise<Session[]> {
    return this.backend.list(userId, options);
  }

  async addMessage(sessionId: string, message: Omit<Message, 'id' | 'created_at'>): Promise<Message> {
    const session = await this.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    const newMessage: Message = {
      id: this.generateId(),
      ...message,
      created_at: new Date().toISOString()
    };

    session.messages.push(newMessage);
    session.last_message_at = newMessage.created_at;

    if (session.messages.length > this.maxHistory) {
      session.messages = session.messages.slice(-this.maxHistory);
    }

    await this.update(session);
    return newMessage;
  }

  async getMessages(sessionId: string, limit?: number): Promise<Message[]> {
    const session = await this.get(sessionId);
    if (!session) {
      return [];
    }
    if (limit) {
      return session.messages.slice(-limit);
    }
    return session.messages;
  }

  async updateState(sessionId: string, key: keyof SessionState, data: Record<string, any>): Promise<Session> {
    const session = await this.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }
    session.state[key] = { ...session.state[key], ...data };
    return this.update(session);
  }

  async getState(sessionId: string): Promise<SessionState | null> {
    const session = await this.get(sessionId);
    return session?.state ?? null;
  }

  async archive(sessionId: string): Promise<Session> {
    const session = await this.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }
    session.status = 'archived';
    return this.update(session);
  }

  async restore(sessionId: string): Promise<Session> {
    const session = await this.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }
    session.status = 'active';
    return this.update(session);
  }

  async clearHistory(sessionId: string): Promise<Session> {
    const session = await this.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }
    session.messages = [];
    return this.update(session);
  }

  async cleanup(timeout?: number): Promise<number> {
    const timeoutMs = timeout ?? this.sessionTimeout;
    const cutoff = Date.now() - timeoutMs;
    const sessions = await this.backend.list('', { status: 'active' });
    let count = 0;

    for (const session of sessions) {
      const lastActivity = new Date(session.last_message_at).getTime();
      if (lastActivity < cutoff) {
        await this.archive(session.id);
        count++;
      }
    }

    return count;
  }

  private generateId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }
}

export class InMemoryStorage implements StorageBackend {
  private store: Map<string, Session> = new Map();

  async get(id: string): Promise<Session | null> {
    return this.store.get(id) ?? null;
  }

  async set(session: Session): Promise<void> {
    this.store.set(session.id, session);
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }

  async list(userId: string, options?: ListOptions): Promise<Session[]> {
    let sessions = Array.from(this.store.values())
      .filter(s => s.user_id === userId);

    if (options?.status) {
      sessions = sessions.filter(s => s.status === options.status);
    }

    if (options?.search) {
      const search = options.search.toLowerCase();
      sessions = sessions.filter(s => 
        s.title.toLowerCase().includes(search) ||
        s.messages.some(m => m.content.toLowerCase().includes(search))
      );
    }

    sessions.sort((a, b) => 
      new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
    );

    const offset = options?.offset ?? 0;
    const limit = options?.limit ?? 50;
    return sessions.slice(offset, offset + limit);
  }

  async exists(id: string): Promise<boolean> {
    return this.store.has(id);
  }
}

export class FileStorage implements StorageBackend {
  private basePath: string;
  private cache: Map<string, Session> = new Map();
  private fs: typeof import('fs');
  private path: typeof import('path');

  constructor(basePath: string) {
    this.basePath = basePath;
    this.fs = require('fs');
    this.path = require('path');
  }

  private getFilePath(id: string): string {
    return this.path.join(this.basePath, `${id}.json`);
  }

  async get(id: string): Promise<Session | null> {
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }

    const filePath = this.getFilePath(id);
    if (!this.fs.existsSync(filePath)) {
      return null;
    }

    try {
      const data = this.fs.readFileSync(filePath, 'utf-8');
      const session = JSON.parse(data) as Session;
      this.cache.set(id, session);
      return session;
    } catch {
      return null;
    }
  }

  async set(session: Session): Promise<void> {
    if (!this.fs.existsSync(this.basePath)) {
      this.fs.mkdirSync(this.basePath, { recursive: true });
    }

    const filePath = this.getFilePath(session.id);
    this.fs.writeFileSync(filePath, JSON.stringify(session, null, 2));
    this.cache.set(session.id, session);
  }

  async delete(id: string): Promise<void> {
    const filePath = this.getFilePath(id);
    if (this.fs.existsSync(filePath)) {
      this.fs.unlinkSync(filePath);
    }
    this.cache.delete(id);
  }

  async list(userId: string, options?: ListOptions): Promise<Session[]> {
    if (!this.fs.existsSync(this.basePath)) {
      return [];
    }

    const files = this.fs.readdirSync(this.basePath)
      .filter(f => f.endsWith('.json'));

    const sessions: Session[] = [];
    for (const file of files) {
      try {
        const data = this.fs.readFileSync(this.path.join(this.basePath, file), 'utf-8');
        const session = JSON.parse(data) as Session;
        if (session.user_id === userId) {
          sessions.push(session);
        }
      } catch {
        continue;
      }
    }

    if (options?.status) {
      sessions.filter(s => s.status === options.status);
    }

    if (options?.search) {
      const search = options.search.toLowerCase();
      sessions.filter(s => 
        s.title.toLowerCase().includes(search) ||
        s.messages.some(m => m.content.toLowerCase().includes(search))
      );
    }

    sessions.sort((a, b) => 
      new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
    );

    const offset = options?.offset ?? 0;
    const limit = options?.limit ?? 50;
    return sessions.slice(offset, offset + limit);
  }

  async exists(id: string): Promise<boolean> {
    if (this.cache.has(id)) return true;
    return this.fs.existsSync(this.getFilePath(id));
  }
}
