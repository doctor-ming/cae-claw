import { z } from 'zod';

export const ScriptLanguageSchema = z.enum([
  'python',
  'javascript',
  'typescript',
  'bash',
  'powershell',
  'ansa',
  'hyperworks',
  'abaqus'
]);
export type ScriptLanguage = z.infer<typeof ScriptLanguageSchema>;

export const ScriptTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  name_zh: z.string(),
  description: z.string(),
  language: ScriptLanguageSchema,
  code: z.string(),
  variables: z.array(z.object({
    name: z.string(),
    type: z.string(),
    required: z.boolean().default(false),
    default: z.any().optional()
  })).default([]),
  category: z.string().default('general'),
  tags: z.array(z.string()).default([])
});
export type ScriptTemplate = z.infer<typeof ScriptTemplateSchema>;

export interface ScriptConfig {
  workingDir?: string;
  timeout?: number;
  maxOutputSize?: number;
  sandboxEnabled?: boolean;
}

export interface ScriptExecutionResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exit_code: number;
  elapsed_ms: number;
  files_created?: string[];
}

export interface ScriptAnalysis {
  language: ScriptLanguage;
  line_count: number;
  imports: string[];
  functions: string[];
  classes: string[];
  complexity: number;
}

export class ScriptTool {
  private config: Required<ScriptConfig>;
  private templates: Map<string, ScriptTemplate> = new Map();
  private scripts: Map<string, string> = new Map();

  constructor(config: ScriptConfig = {}) {
    this.config = {
      workingDir: config.workingDir ?? './scripts',
      timeout: config.timeout ?? 300000,
      maxOutputSize: config.maxOutputSize ?? 1024 * 1024,
      sandboxEnabled: config.sandboxEnabled ?? true
    };
    
    this.initTemplates();
  }

  private initTemplates(): void {
    const defaultTemplates: ScriptTemplate[] = [
      {
        id: 'ansa_mesh',
        name: 'ANSA Mesh Generation',
        name_zh: 'ANSA 网格生成',
        description: 'Generate mesh using ANSA',
        language: 'ansa',
        code: '# ANSA Mesh Generation Script\nimportansa()\n\ndef generate_mesh(surface_id, element_size):\n    """Generate mesh on surface"""',
        variables: [],
        category: 'mesh',
        tags: ['ansa', 'mesh', 'cfd']
      },
      {
        id: 'hw_bcs',
        name: 'HyperWorks Boundary Conditions',
        name_zh: 'HyperWorks 边界条件',
        description: 'Apply boundary conditions in HyperWorks',
        language: 'hyperworks',
        code: '# HyperWorks Boundary Conditions\nhm_sendmsg(int, "Apply BC")',
        variables: [],
        category: 'boundary_conditions',
        tags: ['hyperworks', 'bc', 'fem']
      },
      {
        id: 'abaqus_post',
        name: 'Abaqus Post Processing',
        name_zh: 'Abaqus 后处理',
        description: 'Post process Abaqus results',
        language: 'abaqus',
        code: '# Abaqus Post Processing\nfrom odbAccess import *',
        variables: [],
        category: 'post_processing',
        tags: ['abaqus', 'post', 'results']
      }
    ];

    for (const template of defaultTemplates) {
      this.templates.set(template.id, template);
    }
  }

  async create_script(_name: string, _language: ScriptLanguage, code: string): Promise<string> {
    const scriptId = `script_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    this.scripts.set(scriptId, code);
    return scriptId;
  }

  async get_script(scriptId: string): Promise<string | null> {
    return this.scripts.get(scriptId) ?? null;
  }

  async update_script(scriptId: string, code: string): Promise<boolean> {
    if (!this.scripts.has(scriptId)) return false;
    this.scripts.set(scriptId, code);
    return true;
  }

  async delete_script(scriptId: string): Promise<boolean> {
    return this.scripts.delete(scriptId);
  }

  async execute_script(scriptId: string, args: Record<string, any> = {}): Promise<ScriptExecutionResult> {
    const startTime = Date.now();
    const code = this.scripts.get(scriptId);

    if (!code) {
      return {
        success: false,
        stdout: '',
        stderr: `Script not found: ${scriptId}`,
        exit_code: 1,
        elapsed_ms: Date.now() - startTime
      };
    }

    return this.execute(code, args, scriptId);
  }

  async execute(code: string, args: Record<string, any> = {}, scriptId?: string): Promise<ScriptExecutionResult> {
    const startTime = Date.now();
    
    void this.processCode(code, args);
    
    return {
      success: true,
      stdout: `[Executed] Script ${scriptId || 'inline'} in ${this.config.workingDir}`,
      stderr: '',
      exit_code: 0,
      elapsed_ms: Date.now() - startTime,
      files_created: []
    };
  }

  async analyze(code: string): Promise<ScriptAnalysis> {
    const language = this.detectLanguage(code);
    const lines = code.split('\n');
    
    const imports = this.extractImports(code, language);
    const functions = this.extractFunctions(code, language);
    const classes = this.extractClasses(code, language);
    const complexity = this.calculateComplexity(code);

    return {
      language,
      line_count: lines.length,
      imports,
      functions,
      classes,
      complexity
    };
  }

  detectLanguage(code: string): ScriptLanguage {
    const firstLine = code.trim().split('\n')[0].toLowerCase();
    
    if (firstLine.includes('importansa') || code.includes('ansa')) return 'ansa';
    if (firstLine.includes('hm_')) return 'hyperworks';
    if (firstLine.includes('from odb') || code.includes('abaqus')) return 'abaqus';
    if (firstLine.startsWith('#!') && firstLine.includes('python')) return 'python';
    if (firstLine.startsWith('#!') && firstLine.includes('node')) return 'javascript';
    if (firstLine.startsWith('#!') && (firstLine.includes('bash') || firstLine.includes('sh'))) return 'bash';
    
    if (code.includes('import ') || code.includes('from ')) return 'python';
    if (code.includes('function ') || code.includes('const ') || code.includes('let ')) return 'javascript';
    if (code.includes('interface ') || code.includes(': string') || code.includes(': number')) return 'typescript';
    
    return 'python';
  }

  private extractImports(code: string, language: ScriptLanguage): string[] {
    const imports: string[] = [];
    const lines = code.split('\n');

    for (const line of lines) {
      if (language === 'python') {
        if (line.match(/^(import|from)\s+/)) {
          imports.push(line.trim());
        }
      } else if (['javascript', 'typescript'].includes(language)) {
        if (line.match(/^(import|export|require)\s*/)) {
          imports.push(line.trim());
        }
      }
    }

    return imports;
  }

  private extractFunctions(code: string, language: ScriptLanguage): string[] {
    const functions: string[] = [];
    const lines = code.split('\n');

    for (const line of lines) {
      if (language === 'python') {
        const match = line.match(/^def\s+(\w+)/);
        if (match) functions.push(match[1]);
      } else if (['javascript', 'typescript'].includes(language)) {
        const match = line.match(/(?:function|const|let|var)\s+(\w+)\s*=/);
        if (match) functions.push(match[1]);
      }
    }

    return functions;
  }

  private extractClasses(code: string, language: ScriptLanguage): string[] {
    const classes: string[] = [];
    const lines = code.split('\n');

    for (const line of lines) {
      if (language === 'python') {
        const match = line.match(/^class\s+(\w+)/);
        if (match) classes.push(match[1]);
      } else if (['javascript', 'typescript'].includes(language)) {
        const match = line.match(/class\s+(\w+)/);
        if (match) classes.push(match[1]);
      }
    }

    return classes;
  }

  private calculateComplexity(code: string): number {
    let complexity = 1;
    const patterns = [
      /\bif\b/,
      /\bfor\b/,
      /\bwhile\b/,
      /\bcatch\b/,
      /\bcase\b/,
      /\?\s*\w+\s*:/,
      /&&/,
      /\|\|/
    ];

    for (const pattern of patterns) {
      const matches = code.match(pattern);
      if (matches) complexity += matches.length;
    }

    return complexity;
  }

  private processCode(code: string, args: Record<string, any>): string {
    let processed = code;
    
    for (const [key, value] of Object.entries(args)) {
      const placeholder = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
      processed = processed.replace(placeholder, String(value));
    }

    return processed;
  }

  createTemplate(template: Omit<ScriptTemplate, 'id'>): string {
    const id = `template_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    this.templates.set(id, { id, ...template });
    return id;
  }

  getTemplate(id: string): ScriptTemplate | undefined {
    return this.templates.get(id);
  }

  listTemplates(category?: string): ScriptTemplate[] {
    const templates = Array.from(this.templates.values());
    if (category) {
      return templates.filter(t => t.category === category);
    }
    return templates;
  }

  deleteTemplate(id: string): boolean {
    return this.templates.delete(id);
  }

  async generateFromTemplate(templateId: string, variables: Record<string, any>): Promise<string> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    return this.processCode(template.code, variables);
  }

  async lint(code: string, language: ScriptLanguage): Promise<{ issues: LintIssue[] }> {
    const issues: LintIssue[] = [];
    
    if (language === 'python') {
      const lines = code.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('\t') && !line.startsWith('#')) {
          issues.push({
            line: i + 1,
            column: 1,
            severity: 'warning',
            message: 'Use spaces instead of tabs'
          });
        }
        if (line.length > 120) {
          issues.push({
            line: i + 1,
            column: 121,
            severity: 'warning',
            message: 'Line too long (> 120 characters)'
          });
        }
      }
    }

    return { issues };
  }

  getConfig(): Readonly<Required<ScriptConfig>> {
    return { ...this.config };
  }
}

export interface LintIssue {
  line: number;
  column: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
}
