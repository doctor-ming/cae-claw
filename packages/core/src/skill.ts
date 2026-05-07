import { z } from 'zod';

export const SkillCategorySchema = z.enum([
  'data_io',
  'mesh',
  'boundary_conditions',
  'solver',
  'post_processing',
  'optimization'
]);
export type SkillCategory = z.infer<typeof SkillCategorySchema>;

export const SkillNodeSchema = z.object({
  id: z.string(),
  skill_id: z.string(),
  name: z.string(),
  inputs: z.record(z.any()).default({}),
  depends_on: z.array(z.string()).default([]),
  position: z.object({
    x: z.number().default(0),
    y: z.number().default(0)
  }).optional(),
  config: z.record(z.any()).default({})
});
export type SkillNode = z.infer<typeof SkillNodeSchema>;

export const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  name_zh: z.string(),
  description: z.string(),
  description_zh: z.string(),
  
  atomic: z.boolean().default(true),
  category: SkillCategorySchema,
  
  icon: z.string().default('📦'),
  color: z.string().default('#3B82F6'),
  
  author: z.string(),
  version: z.string().default('1.0.0'),
  tags: z.array(z.string()).default([]),
  
  downloads: z.number().default(0),
  rating: z.number().default(0.0),
  usage_count: z.number().default(0),
  
  input_schema: z.record(z.any()).default({}),
  output_schema: z.record(z.any()).default({}),
  
  implementation: z.object({
    language: z.string().default('python'),
    entry_point: z.string().optional(),
    dependencies: z.array(z.string()).default([])
  }).optional(),
  
  cae_tools: z.array(z.string()).default([]),
  script_template: z.string().optional(),
  
  nodes: z.array(SkillNodeSchema).default([]),
  execution_mode: z.enum(['sequential', 'parallel', 'conditional']).default('sequential'),
  timeout: z.number().default(3600),
  
  permissions: z.object({
    filesystem: z.enum(['none', 'read', 'read_write']).default('read'),
    process: z.boolean().default(false),
    network: z.boolean().default(false)
  }).default({}),
  
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  
  created_at: z.string().default(() => new Date().toISOString()),
  updated_at: z.string().default(() => new Date().toISOString())
});
export type Skill = z.infer<typeof SkillSchema>;

export const ExecutionContextSchema = z.object({
  execution_id: z.string(),
  skill_id: z.string(),
  user_id: z.string().optional(),
  session_id: z.string().optional(),
  parameters: z.record(z.any()),
  started_at: z.string(),
  metadata: z.record(z.any()).default({})
});
export type ExecutionContext = z.infer<typeof ExecutionContextSchema>;

export const ExecutionResultSchema = z.object({
  execution_id: z.string(),
  skill_id: z.string(),
  status: z.enum(['pending', 'running', 'completed', 'failed', 'cancelled']),
  success: z.boolean(),
  
  output: z.record(z.any()).optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
    stack: z.string().optional()
  }).optional(),
  
  started_at: z.string(),
  completed_at: z.string().optional(),
  elapsed_ms: z.number().optional()
});
export type ExecutionResult = z.infer<typeof ExecutionResultSchema>;

export const LLMSchema = z.object({
  id: z.string(),
  provider: z.enum(['openai', 'anthropic', 'gemini', 'deepseek', 'ollama', 'custom']),
  model: z.string(),
  api_key: z.string().optional(),
  base_url: z.string().optional(),
  max_tokens: z.number().default(4096),
  temperature: z.number().default(0.7),
  context_window: z.number().default(128000)
});
export type LLM = z.infer<typeof LLMSchema>;

export const CAESessionSchema = z.object({
  id: z.string(),
  software: z.enum(['ansa', 'hyperworks', 'abaqus', 'custom']),
  port: z.number(),
  pid: z.number().optional(),
  status: z.enum(['starting', 'ready', 'busy', 'error', 'closed']),
  working_dir: z.string(),
  started_at: z.string()
});
export type CAESession = z.infer<typeof CAESessionSchema>;

export const SkillExecutionLogSchema = z.object({
  id: z.string(),
  execution_id: z.string(),
  skill_id: z.string(),
  user_id: z.string().optional(),
  
  status: z.enum(['success', 'failed', 'partial']),
  
  input_params: z.record(z.any()),
  output_result: z.record(z.any()).optional(),
  error_message: z.string().optional(),
  
  execution_time_ms: z.number(),
  
  created_at: z.string()
});
export type SkillExecutionLog = z.infer<typeof SkillExecutionLogSchema>;
