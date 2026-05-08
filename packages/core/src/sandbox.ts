import { z } from 'zod';

export const SandboxTypeSchema = z.enum(['docker', 'vm', 'process', 'web']);
export type SandboxType = z.infer<typeof SandboxTypeSchema>;

export const SandboxConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: SandboxTypeSchema,
  image: z.string().optional(),
  cpu_limit: z.number().default(2),
  memory_limit: z.string().default('2g'),
  disk_limit: z.string().default('10g'),
  network_enabled: z.boolean().default(false),
  timeout: z.number().default(300),
  environment: z.record(z.string()).default({})
});
export type SandboxConfig = z.infer<typeof SandboxConfigSchema>;

export const SandboxSessionSchema = z.object({
  id: z.string(),
  config: SandboxConfigSchema,
  status: z.enum(['pending', 'creating', 'running', 'paused', 'stopped', 'error']),
  created_at: z.string(),
  started_at: z.string().optional(),
  ended_at: z.string().optional()
});
export type SandboxSession = z.infer<typeof SandboxSessionSchema>;

export const SandboxResultSchema = z.object({
  session_id: z.string(),
  success: z.boolean(),
  stdout: z.string().default(''),
  stderr: z.string().default(''),
  exit_code: z.number(),
  execution_time_ms: z.number()
});
export type SandboxResult = z.infer<typeof SandboxResultSchema>;

export class Sandbox {
  private config: SandboxConfig;
  private sessions: Map<string, SandboxSession> = new Map();

  constructor(config: SandboxConfig) {
    this.config = config;
  }

  async create(): Promise<SandboxSession> {
    const session: SandboxSession = {
      id: `sandbox_${Date.now()}`,
      config: this.config,
      status: 'creating',
      created_at: new Date().toISOString()
    };

    this.sessions.set(session.id, session);
    
    setTimeout(() => {
      session.status = 'running';
      session.started_at = new Date().toISOString();
    }, 100);

    return session;
  }

  async execute(session_id: string, command: string): Promise<SandboxResult> {
    const session = this.sessions.get(session_id);
    if (!session || session.status !== 'running') {
      return {
        session_id,
        success: false,
        stdout: '',
        stderr: 'Session not found or not running',
        exit_code: 1,
        execution_time_ms: 0
      };
    }

    const startTime = Date.now();

    return {
      session_id,
      success: true,
      stdout: `[Sandbox] Executed: ${command}`,
      stderr: '',
      exit_code: 0,
      execution_time_ms: Date.now() - startTime
    };
  }

  async stop(session_id: string): Promise<boolean> {
    const session = this.sessions.get(session_id);
    if (!session) return false;

    session.status = 'stopped';
    session.ended_at = new Date().toISOString();
    return true;
  }

  async delete(session_id: string): Promise<boolean> {
    return this.sessions.delete(session_id);
  }

  get_session(session_id: string): SandboxSession | undefined {
    return this.sessions.get(session_id);
  }

  list_sessions(): SandboxSession[] {
    return Array.from(this.sessions.values());
  }
}

export class SandboxPool {
  private pool: Sandbox[] = [];
  private max_size: number;
  private available: Sandbox[] = [];

  constructor(max_size: number = 5) {
    this.max_size = max_size;
  }

  async acquire(config: SandboxConfig): Promise<Sandbox> {
    let sandbox: Sandbox;

    if (this.available.length > 0) {
      sandbox = this.available.pop()!;
    } else if (this.pool.length < this.max_size) {
      sandbox = new Sandbox(config);
      this.pool.push(sandbox);
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return this.acquire(config);
    }

    await sandbox.create();
    return sandbox;
  }

  release(sandbox: Sandbox): void {
    this.available.push(sandbox);
  }
}

export function createSandboxPool(max_size: number = 5): SandboxPool {
  return new SandboxPool(max_size);
}
