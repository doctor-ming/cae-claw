import { Skill, SkillSchema, SkillNode, ExecutionContext, ExecutionResult } from '@cae-claw/core';

export class SkillRegistry {
  private skills: Map<string, Skill> = new Map();
  private implementations: Map<string, Function> = new Map();

  register(skill: Skill, implementation?: Function): void {
    this.skills.set(skill.id, skill);
    if (implementation) {
      this.implementations.set(skill.id, implementation);
    }
  }

  get(id: string): Skill | undefined {
    return this.skills.get(id);
  }

  list(category?: string): Skill[] {
    const all = Array.from(this.skills.values());
    if (category) {
      return all.filter(s => s.category === category);
    }
    return all;
  }

  search(query: string): Skill[] {
    const q = query.toLowerCase();
    return Array.from(this.skills.values()).filter(skill =>
      skill.name.toLowerCase().includes(q) ||
      skill.name_zh.includes(q) ||
      skill.description.toLowerCase().includes(q) ||
      skill.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }

  get_by_category(): Record<string, Skill[]> {
    const result: Record<string, Skill[]> = {};
    for (const skill of this.skills.values()) {
      if (!result[skill.category]) {
        result[skill.category] = [];
      }
      result[skill.category].push(skill);
    }
    return result;
  }

  update(skill: Skill): void {
    this.skills.set(skill.id, {
      ...skill,
      updated_at: new Date().toISOString()
    });
  }

  delete(id: string): boolean {
    this.implementations.delete(id);
    return this.skills.delete(id);
  }

  async execute(skill_id: string, context: ExecutionContext): Promise<ExecutionResult> {
    const skill = this.skills.get(skill_id);
    if (!skill) {
      return {
        execution_id: context.execution_id,
        skill_id,
        status: 'failed',
        success: false,
        error: {
          code: 'SKILL_NOT_FOUND',
          message: `Skill not found: ${skill_id}`
        },
        started_at: context.started_at,
        completed_at: new Date().toISOString()
      };
    }

    const startTime = Date.now();

    try {
      const implementation = this.implementations.get(skill_id);
      
      if (!implementation) {
        return {
          execution_id: context.execution_id,
          skill_id,
          status: 'failed',
          success: false,
          error: {
            code: 'NO_IMPLEMENTATION',
            message: `No implementation for skill: ${skill_id}`
          },
          started_at: context.started_at,
          completed_at: new Date().toISOString(),
          elapsed_ms: Date.now() - startTime
        };
      }

      const result = await implementation(context.parameters);

      return {
        execution_id: context.execution_id,
        skill_id,
        status: 'completed',
        success: true,
        output: result,
        started_at: context.started_at,
        completed_at: new Date().toISOString(),
        elapsed_ms: Date.now() - startTime
      };
    } catch (error) {
      return {
        execution_id: context.execution_id,
        skill_id,
        status: 'failed',
        success: false,
        error: {
          code: 'EXECUTION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        },
        started_at: context.started_at,
        completed_at: new Date().toISOString(),
        elapsed_ms: Date.now() - startTime
      };
    }
  }

  count(): number {
    return this.skills.size;
  }

  get_all(): Skill[] {
    return Array.from(this.skills.values());
  }
}

export function createSkillRegistry(): SkillRegistry {
  return new SkillRegistry();
}
