import { z } from 'zod';

export const HookTypeSchema = z.enum([
  'before_skill_execute',
  'after_skill_execute',
  'before_agent_run',
  'after_agent_run',
  'on_error',
  'on_tool_call',
  'on_tool_result',
  'on_skill_register',
  'on_workflow_start',
  'on_workflow_complete',
  'on_session_start',
  'on_session_end',
  'on_knowledge_search',
  'on_knowledge_add',
  'on_sandbox_create',
  'on_sandbox_execute'
]);
export type HookType = z.infer<typeof HookTypeSchema>;

export const HookConditionSchema = z.object({
  skill_id: z.string().optional(),
  skill_category: z.string().optional(),
  user_id: z.string().optional(),
  error_type: z.string().optional()
});
export type HookCondition = z.infer<typeof HookConditionSchema>;

export const HookConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: HookTypeSchema,
  enabled: z.boolean().default(true),
  async: z.boolean().default(false),
  timeout: z.number().default(30000),
  conditions: HookConditionSchema.optional(),
  priority: z.number().default(0)
});
export type HookConfig = z.infer<typeof HookConfigSchema>;

export interface HookContext {
  event: HookType;
  timestamp: string;
  execution_id: string;
  skill_id?: string;
  user_id?: string;
  session_id?: string;
  metadata: Record<string, any>;
}

export interface HookResult {
  success: boolean;
  output?: any;
  error?: string;
  execution_time_ms: number;
}

export type HookHandler = (context: HookContext) => Promise<HookResult> | HookResult;

export class Hook {
  readonly id: string;
  readonly name: string;
  readonly type: HookType;
  readonly enabled: boolean;
  readonly async: boolean;
  readonly timeout: number;
  readonly priority: number;
  readonly conditions?: HookCondition;
  private handler: HookHandler;

  constructor(config: HookConfig & { handler: HookHandler }) {
    this.id = config.id;
    this.name = config.name;
    this.type = config.type;
    this.enabled = config.enabled;
    this.async = config.async;
    this.timeout = config.timeout;
    this.priority = config.priority;
    this.conditions = config.conditions;
    this.handler = config.handler;
  }

  async execute(context: HookContext): Promise<HookResult> {
    if (!this.enabled) {
      return { success: true, execution_time_ms: 0 };
    }

    if (this.conditions && !this.matchesConditions(context)) {
      return { success: true, execution_time_ms: 0 };
    }

    const startTime = Date.now();

    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Hook timeout')), this.timeout);
      });

      const result = await Promise.race([
        Promise.resolve(this.handler(context)),
        timeoutPromise
      ]) as HookResult;

      return {
        success: true,
        output: result,
        execution_time_ms: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        execution_time_ms: Date.now() - startTime
      };
    }
  }

  private matchesConditions(context: HookContext): boolean {
    if (!this.conditions) return true;

    const { skill_id, skill_category, user_id } = this.conditions;

    if (skill_id && context.skill_id !== skill_id) return false;
    if (skill_category && context.metadata?.category !== skill_category) return false;
    if (user_id && context.user_id !== user_id) return false;

    return true;
  }
}

export class HookRegistry {
  private hooks: Map<HookType, Hook[]> = new Map();
  private globalHooks: Hook[] = [];

  register(config: HookConfig & { handler: HookHandler }): void {
    const hook = new Hook(config);

    if (config.type === 'before_agent_run' && !config.type) {
      this.globalHooks.push(hook);
    } else {
      const hooks = this.hooks.get(config.type) || [];
      hooks.push(hook);
      hooks.sort((a, b) => b.priority - a.priority);
      this.hooks.set(config.type, hooks);
    }
  }

  unregister(hookId: string): boolean {
    for (const [, hooks] of this.hooks.entries()) {
      const index = hooks.findIndex(h => h.id === hookId);
      if (index !== -1) {
        hooks.splice(index, 1);
        return true;
      }
    }

    const globalIndex = this.globalHooks.findIndex(h => h.id === hookId);
    if (globalIndex !== -1) {
      this.globalHooks.splice(globalIndex, 1);
      return true;
    }

    return false;
  }

  async trigger(event: HookType, context: HookContext): Promise<HookResult[]> {
    const results: HookResult[] = [];
    const hooks = this.hooks.get(event) || [];

    const allHooks = [...this.globalHooks, ...hooks].sort((a, b) => b.priority - a.priority);

    for (const hook of allHooks) {
      const result = await hook.execute(context);
      results.push(result);
    }

    return results;
  }

  getHooks(type?: HookType): Hook[] {
    if (type) {
      return [...(this.hooks.get(type) || []), ...this.globalHooks];
    }
    return [...this.globalHooks];
  }

  listByEvent(): Map<HookType, number> {
    const result = new Map<HookType, number>();
    for (const type of this.hooks.keys()) {
      result.set(type, (this.hooks.get(type) || []).length);
    }
    return result;
  }

  clear(): void {
    this.hooks.clear();
    this.globalHooks = [];
  }
}

export function createHookRegistry(): HookRegistry {
  return new HookRegistry();
}

export const DEFAULT_HOOKS: Partial<HookConfig>[] = [
  {
    id: 'hook_logging',
    name: 'Execution Logging',
    type: 'after_skill_execute',
    enabled: true,
    async: false,
    priority: 0
  },
  {
    id: 'hook_metrics',
    name: 'Metrics Collection',
    type: 'after_agent_run',
    enabled: true,
    async: true,
    priority: 0
  },
  {
    id: 'hook_error_notify',
    name: 'Error Notification',
    type: 'on_error',
    enabled: true,
    async: true,
    priority: 1
  }
];
