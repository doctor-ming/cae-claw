import { z } from 'zod';
import { ScriptTool } from './script.js';
import { CAEScriptTool } from './cae_script.js';

export const ToolCategorySchema = z.enum([
  'ansa',
  'ssh',
  'hyperworks',
  'post_processing',
  'workflow',
  'system',
  'script',
  'coding'
]);
export type ToolCategory = z.infer<typeof ToolCategorySchema>;

export const SSHConfigSchema = z.object({
  name: z.string().optional(),
  host: z.string(),
  port: z.number().default(22),
  username: z.string(),
  auth_type: z.enum(['password', 'key', 'agent']).default('password'),
  password: z.string().optional(),
  private_key_path: z.string().optional(),
  passphrase: z.string().optional(),
  proxy_enabled: z.boolean().default(false),
  proxy_host: z.string().optional(),
  proxy_port: z.number().optional(),
  proxy_username: z.string().optional(),
  proxy_password: z.string().optional()
});
export type SSHConfig = z.infer<typeof SSHConfigSchema>;

export interface CommandResult {
  stdout: string;
  stderr: string;
  exit_code: number;
  elapsed_ms: number;
}

export interface SSHSession {
  id: string;
  config: SSHConfig;
  connected: boolean;
  created_at: string;
}

export class SSHTool {
  private sessions: Map<string, SSHSession> = new Map();

  async connect(config: SSHConfig): Promise<SSHSession> {
    const session_id = `ssh_${Date.now()}`;
    
    const session: SSHSession = {
      id: session_id,
      config,
      connected: true,
      created_at: new Date().toISOString()
    };

    this.sessions.set(session_id, session);
    return session;
  }

  async disconnect(session_id: string): Promise<boolean> {
    const session = this.sessions.get(session_id);
    if (!session) return false;

    session.connected = false;
    this.sessions.delete(session_id);
    return true;
  }

  async execute(session_id: string, command: string): Promise<CommandResult> {
    const startTime = Date.now();
    const session = this.sessions.get(session_id);
    
    if (!session) {
      return {
        stdout: '',
        stderr: 'Session not found',
        exit_code: 1,
        elapsed_ms: Date.now() - startTime
      };
    }

    return {
      stdout: `[Mock] Executed on ${session.config.host}: ${command}`,
      stderr: '',
      exit_code: 0,
      elapsed_ms: Date.now() - startTime
    };
  }

  async upload(_session_id: string, _localPath: string, _remotePath: string): Promise<boolean> {
    return true;
  }

  async download(_session_id: string, _remotePath: string, _localPath: string): Promise<boolean> {
    return true;
  }

  async sftp(session_id: string, command: string): Promise<CommandResult> {
    return this.execute(session_id, `sftp> ${command}`);
  }

  get_session(session_id: string): SSHSession | undefined {
    return this.sessions.get(session_id);
  }

  list_sessions(): SSHSession[] {
    return Array.from(this.sessions.values());
  }
}

export class CommandTool {
  async execute(command: string): Promise<CommandResult> {
    const startTime = Date.now();

    return {
      stdout: `[Mock] Command executed: ${command}`,
      stderr: '',
      exit_code: 0,
      elapsed_ms: Date.now() - startTime
    };
  }

  async execute_script(scriptPath: string, args: string[] = []): Promise<CommandResult> {
    const startTime = Date.now();
    const argStr = args.join(' ');

    return {
      stdout: `[Mock] Script executed: ${scriptPath} ${argStr}`,
      stderr: '',
      exit_code: 0,
      elapsed_ms: Date.now() - startTime
    };
  }

  async check_command(command: string): Promise<boolean> {
    return command.length > 0;
  }

  get_system_info(): { os: string; arch: string; cpus: number; memory: number } {
    return {
      os: process.platform,
      arch: process.arch,
      cpus: require('os').cpus().length,
      memory: require('os').totalmem()
    };
  }
}

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
  private sessions: Map<string, any> = new Map();

  constructor(config: ANSAToolConfig = {}) {
    this.config = {
      ansa_path: config.ansa_path || process.env.ANSA_PATH || '/usr/local/ansa',
      default_port: config.default_port || 9988,
      working_dir: config.working_dir || './workspace'
    };
  }

  async start_session(port?: number): Promise<any> {
    const session_id = `ansa_${Date.now()}`;
    const session_port = port || this.config.default_port!;

    const session = {
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

  async run_script(session_id: string, _script: string): Promise<ScriptResult> {
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
    return { task_id, status: 'queued' };
  }

  async get_task_result(task_id: string): Promise<TaskResult> {
    return {
      task_id,
      status: 'completed',
      result: { success: true, output: 'Task completed', elapsed_ms: 0 }
    };
  }

  get_session(session_id: string): any {
    return this.sessions.get(session_id);
  }

  list_sessions(): any[] {
    return Array.from(this.sessions.values());
  }
}

export class ToolRegistry {
  private tools: Map<string, any> = new Map();
  private categories: Map<string, Set<string>> = new Map();

  register(name: string, tool: any, category: ToolCategory = 'system'): void {
    this.tools.set(name, tool);
    
    if (!this.categories.has(category)) {
      this.categories.set(category, new Set());
    }
    this.categories.get(category)!.add(name);
  }

  get(name: string): any {
    return this.tools.get(name);
  }

  list(): string[] {
    return Array.from(this.tools.keys());
  }

  list_by_category(category: ToolCategory): string[] {
    return Array.from(this.categories.get(category) || []);
  }

  get_categories(): ToolCategory[] {
    return Array.from(this.categories.keys()) as ToolCategory[];
  }

  has(name: string): boolean {
    return this.tools.has(name);
  }
}

export function createToolRegistry(): ToolRegistry {
  const registry = new ToolRegistry();
  
  registry.register('ansa', new ANSATool(), 'ansa');
  registry.register('ssh', new SSHTool(), 'ssh');
  registry.register('cmd', new CommandTool(), 'ssh');
  registry.register('script', new ScriptTool(), 'coding');
  registry.register('cae_script', new CAEScriptTool(), 'coding');
  
  return registry;
}
