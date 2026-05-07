import { BaseMessage, HumanMessage } from '@langchain/core/messages';
import type { Skill, ExecutionResult, ExecutionContext } from '@cae-claw/core';

interface AgentState {
  messages: BaseMessage[];
  current_task: string;
  plan: string[];
  executed_steps: string[];
  results: Record<string, any>;
  skills_to_use: string[];
  error: string | null;
  context: ExecutionContext;
}

export class CAEAgentEngine {
  private skills: Map<string, Skill> = new Map();
  private tools: Map<string, any> = new Map();

  register_skill(skill: Skill): void {
    this.skills.set(skill.id, skill);
  }

  register_tool(name: string, tool: any): void {
    this.tools.set(name, tool);
  }

  private async understandTask(state: AgentState): Promise<Partial<AgentState>> {
    const lastMessage = state.messages[state.messages.length - 1];
    
    return {
      current_task: String((lastMessage as HumanMessage).content),
      error: null
    };
  }

  private async createPlan(state: AgentState): Promise<Partial<AgentState>> {
    const task = state.current_task;
    const plan = [task];
    
    return { plan };
  }

  private async selectSkills(state: AgentState): Promise<Partial<AgentState>> {
    const plan = state.plan;
    const skills_to_use: string[] = [];

    for (const step of plan) {
      const matchedSkill = this.findMatchingSkill(step);
      if (matchedSkill) {
        skills_to_use.push(matchedSkill.id);
      }
    }

    return { skills_to_use };
  }

  private findMatchingSkill(task: string): Skill | undefined {
    const task_lower = task.toLowerCase();
    
    for (const skill of this.skills.values()) {
      if (task_lower.includes(skill.name.toLowerCase()) ||
          skill.tags.some(tag => task_lower.includes(tag.toLowerCase()))) {
        return skill;
      }
    }
    
    return undefined;
  }

  private async executeSkills(state: AgentState): Promise<Partial<AgentState>> {
    const results: Record<string, any> = {};
    const executed_steps: string[] = [];

    for (const skill_id of state.skills_to_use) {
      const skill = this.skills.get(skill_id);
      if (!skill) continue;

      try {
        const result = await this.execute_skill(skill, state.context);
        results[skill_id] = result;
        executed_steps.push(skill_id);
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : 'Unknown error',
          results
        };
      }
    }

    return { executed_steps, results };
  }

  private async execute_skill(skill: Skill, context: ExecutionContext): Promise<any> {
    if (skill.atomic) {
      return this.executeAtomicSkill(skill, context);
    } else {
      return this.executeCompositeSkill(skill, context);
    }
  }

  private async executeAtomicSkill(skill: Skill, _context: ExecutionContext): Promise<any> {
    const tool = this.tools.get(skill.id);
    if (tool) {
      return await tool.execute({});
    }
    return { skill_id: skill.id, status: 'mock_executed' };
  }

  private async executeCompositeSkill(skill: Skill, context: ExecutionContext): Promise<any> {
    const results: Record<string, any> = {};

    for (const node of skill.nodes) {
      const nodeSkill = this.skills.get(node.skill_id);
      if (!nodeSkill) continue;

      const nodeContext: ExecutionContext = {
        ...context,
        parameters: this.resolveNodeInputs(node, results)
      };

      results[node.id] = await this.execute_skill(nodeSkill, nodeContext);
    }

    return results;
  }

  private resolveNodeInputs(node: any, results: Record<string, any>): Record<string, any> {
    const resolved: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(node.inputs || {})) {
      if (typeof value === 'string' && value.startsWith('${') && value.endsWith('}')) {
        const ref = value.slice(2, -1);
        const [sourceNode, field] = ref.split('.');
        resolved[key] = results[sourceNode]?.[field];
      } else {
        resolved[key] = value;
      }
    }
    
    return resolved;
  }

  private async reviewResults(state: AgentState): Promise<Partial<AgentState>> {
    if (state.error) {
      return { error: state.error };
    }
    return { error: null };
  }

  async run(task: string, context: ExecutionContext): Promise<ExecutionResult> {
    const startTime = Date.now();
    
    try {
      let state: AgentState = {
        messages: [new HumanMessage(task)],
        current_task: '',
        plan: [],
        executed_steps: [],
        results: {},
        skills_to_use: [],
        error: null,
        context
      };

      state = { ...state, ...(await this.understandTask(state)) };
      state = { ...state, ...(await this.createPlan(state)) };
      state = { ...state, ...(await this.selectSkills(state)) };
      state = { ...state, ...(await this.executeSkills(state)) };
      state = { ...state, ...(await this.reviewResults(state)) };

      return {
        execution_id: context.execution_id,
        skill_id: 'agent',
        status: state.error ? 'failed' : 'completed',
        success: !state.error,
        output: state.results,
        started_at: context.started_at,
        completed_at: new Date().toISOString(),
        elapsed_ms: Date.now() - startTime
      };
    } catch (error) {
      return {
        execution_id: context.execution_id,
        skill_id: 'agent',
        status: 'failed',
        success: false,
        error: {
          code: 'EXECUTION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error'
        },
        started_at: context.started_at,
        completed_at: new Date().toISOString(),
        elapsed_ms: Date.now() - startTime
      };
    }
  }
}

export const createCAEAgent = () => new CAEAgentEngine();
