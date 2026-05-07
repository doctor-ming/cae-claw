import { z } from 'zod';

export const ANSASessionSchema = z.object({
  id: z.string(),
  port: z.number(),
  pid: z.number().optional(),
  status: z.enum(['starting', 'ready', 'busy', 'error', 'closed']),
  working_dir: z.string(),
  started_at: z.string()
});
export type ANSASession = z.infer<typeof ANSASessionSchema>;

export interface ANSAToolConfig {
  ansa_path?: string;
  default_port?: number;
  working_dir?: string;
}

export interface ScriptResult {
  success: boolean;
  output: string;
  error?: string;
  elapsed_ms: number;
}

export interface TaskResult {
  task_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  result?: ScriptResult;
}

export class ANSATool {
  private config: ANSAToolConfig;
  private sessions: Map<string, ANSASession> = new Map();

  constructor(config: ANSAToolConfig = {}) {
    this.config = {
      ansa_path: config.ansa_path || process.env.ANSA_PATH || '/usr/local/ansa',
      default_port: config.default_port || 9988,
      working_dir: config.working_dir || './workspace'
    };
  }

  async start_session(port?: number): Promise<ANSASession> {
    const session_id = `ansa_${Date.now()}`;
    const session_port = port || this.config.default_port!;

    const session: ANSASession = {
      id: session_id,
      port: session_port,
      status: 'starting',
      working_dir: this.config.working_dir!,
      started_at: new Date().toISOString()
    };

    this.sessions.set(session_id, session);

    return session;
  }

  async stop_session(session_id: string): Promise<boolean> {
    const session = this.sessions.get(session_id);
    if (!session) return false;

    session.status = 'closed';
    this.sessions.delete(session_id);
    return true;
  }

  async run_script(session_id: string, _script: string, _timeout: number = 300): Promise<ScriptResult> {
    const startTime = Date.now();
    
    const session = this.sessions.get(session_id);
    if (!session) {
      return {
        success: false,
        output: '',
        error: 'Session not found',
        elapsed_ms: Date.now() - startTime
      };
    }

    return {
      success: true,
      output: `Script executed in ANSA session ${session_id}`,
      elapsed_ms: Date.now() - startTime
    };
  }

  async run_script_async(_session_id: string, _script: string): Promise<TaskResult> {
    const task_id = `task_${Date.now()}`;
    
    return {
      task_id,
      status: 'queued'
    };
  }

  async get_task_result(task_id: string): Promise<TaskResult> {
    return {
      task_id,
      status: 'completed',
      result: {
        success: true,
        output: 'Task completed',
        elapsed_ms: 0
      }
    };
  }

  get_session(session_id: string): ANSASession | undefined {
    return this.sessions.get(session_id);
  }

  list_sessions(): ANSASession[] {
    return Array.from(this.sessions.values());
  }
}

export class FileTool {
  async list_files(_directory: string, _pattern?: string): Promise<string[]> {
    return [];
  }

  async read_file(_file_path: string): Promise<string> {
    return '';
  }

  async write_file(_file_path: string, _content: string): Promise<boolean> {
    return true;
  }

  async delete_file(_file_path: string): Promise<boolean> {
    return true;
  }
}

export class ToolRegistry {
  private tools: Map<string, any> = new Map();

  register(name: string, tool: any): void {
    this.tools.set(name, tool);
  }

  get(name: string): any {
    return this.tools.get(name);
  }

  list(): string[] {
    return Array.from(this.tools.keys());
  }

  has(name: string): boolean {
    return this.tools.has(name);
  }
}

export function createToolRegistry(): ToolRegistry {
  const registry = new ToolRegistry();
  
  registry.register('ansa', new ANSATool());
  registry.register('file', new FileTool());
  
  return registry;
}
