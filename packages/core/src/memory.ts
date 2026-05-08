import { z } from 'zod';

export const MemoryTypeSchema = z.enum(['episodic', 'semantic', 'working']);
export type MemoryType = z.infer<typeof MemoryTypeSchema>;

export const MemoryImportanceSchema = z.enum(['critical', 'high', 'medium', 'low']);
export type MemoryImportance = z.infer<typeof MemoryImportanceSchema>;

export const MemorySchema = z.object({
  id: z.string(),
  session_id: z.string(),
  type: MemoryTypeSchema,
  
  content: z.string(),
  embedding: z.array(z.number()).optional(),
  
  importance: MemoryImportanceSchema.default('medium'),
  access_count: z.number().default(0),
  last_accessed: z.string().optional(),
  
  expires_at: z.string().optional(),
  created_at: z.string().default(() => new Date().toISOString())
});
export type Memory = z.infer<typeof MemorySchema>;

export const SemanticMemorySchema = z.object({
  id: z.string(),
  key: z.string(),
  value: z.any(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  confidence: z.number().min(0).max(1).default(1.0),
  source: z.string().optional(),
  created_at: z.string().default(() => new Date().toISOString()),
  updated_at: z.string().default(() => new Date().toISOString())
});
export type SemanticMemory = z.infer<typeof SemanticMemorySchema>;

export interface MemoryConfig {
  maxEpisodic?: number;
  maxWorking?: number;
  episodicTTL?: number;
  summarizationThreshold?: number;
  importanceWeights?: {
    recent?: number;
    frequency?: number;
    importance?: number;
  };
}

export class MemoryStore {
  private episodic: Map<string, Memory[]> = new Map();
  private semantic: Map<string, SemanticMemory[]> = new Map();
  private working: Map<string, Memory[]> = new Map();
  
  private config: Required<MemoryConfig>;

  constructor(config: MemoryConfig = {}) {
    this.config = {
      maxEpisodic: config.maxEpisodic ?? 100,
      maxWorking: config.maxWorking ?? 10,
      episodicTTL: config.episodicTTL ?? 7 * 24 * 60 * 60 * 1000,
      summarizationThreshold: config.summarizationThreshold ?? 50,
      importanceWeights: {
        recent: config.importanceWeights?.recent ?? 0.4,
        frequency: config.importanceWeights?.frequency ?? 0.3,
        importance: config.importanceWeights?.importance ?? 0.3
      }
    };
  }

  async addMemory(sessionId: string, memory: Omit<Memory, 'id' | 'created_at' | 'access_count'>): Promise<Memory> {
    const newMemory: Memory = {
      id: this.generateId(),
      ...memory,
      access_count: 0,
      created_at: new Date().toISOString()
    };

    const memories = this.getMemoryStore(memory.type);
    if (!memories.has(sessionId)) {
      memories.set(sessionId, []);
    }
    
    memories.get(sessionId)!.push(newMemory);
    this.enforceLimits(sessionId, memory.type);
    
    return newMemory;
  }

  async getMemory(sessionId: string, memoryId: string): Promise<Memory | null> {
    for (const type of ['episodic', 'semantic', 'working'] as MemoryType[]) {
      const memories = this.getMemoryStore(type).get(sessionId) || [];
      const memory = memories.find(m => m.id === memoryId);
      if (memory) {
        memory.access_count++;
        memory.last_accessed = new Date().toISOString();
        return memory;
      }
    }
    return null;
  }

  async getMemories(sessionId: string, type?: MemoryType, limit?: number): Promise<Memory[]> {
    const store = type ? this.getMemoryStore(type).get(sessionId) || [] 
      : [...this.episodic.get(sessionId) || [], ...this.working.get(sessionId) || []];
    
    let sorted = store.sort((a, b) => {
      const scoreA = this.calculateRelevance(a);
      const scoreB = this.calculateRelevance(b);
      return scoreB - scoreA;
    });

    if (limit) {
      sorted = sorted.slice(0, limit);
    }
    return sorted;
  }

  async searchMemories(sessionId: string, query: string, limit = 10): Promise<Memory[]> {
    const memories = await this.getMemories(sessionId);
    const queryLower = query.toLowerCase();
    
    return memories
      .filter(m => m.content.toLowerCase().includes(queryLower))
      .sort((a, b) => this.calculateRelevance(b) - this.calculateRelevance(a))
      .slice(0, limit);
  }

  async updateMemory(sessionId: string, memoryId: string, updates: Partial<Memory>): Promise<Memory | null> {
    for (const type of ['episodic', 'semantic', 'working'] as MemoryType[]) {
      const memories = this.getMemoryStore(type).get(sessionId) || [];
      const index = memories.findIndex(m => m.id === memoryId);
      
      if (index !== -1) {
        memories[index] = { ...memories[index], ...updates };
        return memories[index];
      }
    }
    return null;
  }

  async deleteMemory(sessionId: string, memoryId: string): Promise<boolean> {
    for (const type of ['episodic', 'semantic', 'working'] as MemoryType[]) {
      const memories = this.getMemoryStore(type).get(sessionId) || [];
      const index = memories.findIndex(m => m.id === memoryId);
      
      if (index !== -1) {
        memories.splice(index, 1);
        return true;
      }
    }
    return false;
  }

  async addSemanticMemory(sessionId: string, memory: Omit<SemanticMemory, 'id' | 'created_at' | 'updated_at'>): Promise<SemanticMemory> {
    const newMemory: SemanticMemory = {
      id: this.generateId(),
      ...memory,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (!this.semantic.has(sessionId)) {
      this.semantic.set(sessionId, []);
    }
    this.semantic.get(sessionId)!.push(newMemory);
    
    return newMemory;
  }

  async getSemanticMemories(sessionId: string, category?: string): Promise<SemanticMemory[]> {
    const memories = this.semantic.get(sessionId) || [];
    if (category) {
      return memories.filter(m => m.category === category);
    }
    return memories;
  }

  async updateSemanticMemory(sessionId: string, memoryId: string, updates: Partial<SemanticMemory>): Promise<SemanticMemory | null> {
    const memories = this.semantic.get(sessionId) || [];
    const index = memories.findIndex(m => m.id === memoryId);
    
    if (index !== -1) {
      memories[index] = { 
        ...memories[index], 
        ...updates, 
        updated_at: new Date().toISOString() 
      };
      return memories[index];
    }
    return null;
  }

  async compressEpisodic(sessionId: string): Promise<string> {
    const memories = this.episodic.get(sessionId) || [];
    if (memories.length < this.config.summarizationThreshold) {
      return '';
    }

    const toCompress = memories.slice(0, Math.floor(memories.length / 2));
    const summary = this.generateSummary(toCompress);
    
    const summaryMemory: Memory = {
      id: this.generateId(),
      session_id: sessionId,
      type: 'episodic',
      content: `[摘要] ${summary}`,
      importance: 'high',
      access_count: 0,
      created_at: new Date().toISOString()
    };

    this.episodic.set(sessionId, [summaryMemory, ...memories.slice(Math.floor(memories.length / 2))]);
    
    return summary;
  }

  async clearSession(sessionId: string, type?: MemoryType): Promise<void> {
    if (type) {
      this.getMemoryStore(type).delete(sessionId);
    } else {
      this.episodic.delete(sessionId);
      this.semantic.delete(sessionId);
      this.working.delete(sessionId);
    }
  }

  async getContext(sessionId: string, maxTokens = 4000): Promise<string> {
    const workingMemories = await this.getMemories(sessionId, 'working');
    const recentEpisodic = await this.getMemories(sessionId, 'episodic', 20);
    const semanticMemories = await this.getSemanticMemories(sessionId);

    const parts: string[] = [];
    
    if (workingMemories.length > 0) {
      parts.push('## Working Memory\n' + workingMemories.map(m => m.content).join('\n'));
    }
    
    if (recentEpisodic.length > 0) {
      parts.push('## Recent Episodes\n' + recentEpisodic.map(m => m.content).join('\n'));
    }
    
    if (semanticMemories.length > 0) {
      parts.push('## Semantic Knowledge\n' + semanticMemories.map(m => `${m.key}: ${JSON.stringify(m.value)}`).join('\n'));
    }

    let context = parts.join('\n\n');
    if (context.length > maxTokens * 4) {
      context = context.slice(0, maxTokens * 4) + '\n\n[内容已截断]';
    }

    return context;
  }

  async consolidate(sessionId: string): Promise<number> {
    const episodic = this.episodic.get(sessionId) || [];
    let consolidated = 0;

    const importanceScores = new Map<string, number>();
    for (const memory of episodic) {
      const score = this.calculateRelevance(memory);
      importanceScores.set(memory.id, score);
    }

    const sorted = [...episodic].sort((a, b) => 
      (importanceScores.get(b.id) || 0) - (importanceScores.get(a.id) || 0)
    );

    const toKeep = sorted.slice(0, this.config.maxEpisodic);
    const toDiscard = sorted.slice(this.config.maxEpisodic);

    for (const memory of toDiscard) {
      const summary = memory.content.slice(0, 100);
      if (!toKeep.some(m => m.content.includes(summary))) {
        consolidated++;
      }
    }

    this.episodic.set(sessionId, toKeep);
    return consolidated;
  }

  private getMemoryStore(type: MemoryType): Map<string, Memory[]> {
    switch (type) {
      case 'episodic': return this.episodic;
      case 'semantic': return this.episodic;
      case 'working': return this.working;
    }
  }

  private enforceLimits(sessionId: string, type: MemoryType): void {
    const memories = this.getMemoryStore(type).get(sessionId) || [];
    const max = type === 'working' ? this.config.maxWorking : this.config.maxEpisodic;
    
    if (memories.length > max) {
      const sorted = memories.sort((a, b) => 
        this.calculateRelevance(b) - this.calculateRelevance(a)
      );
      this.getMemoryStore(type).set(sessionId, sorted.slice(0, max));
    }
  }

  private calculateRelevance(memory: Memory): number {
    const weights = this.config.importanceWeights;
    let score = 0;

    const importanceScore = { critical: 1.0, high: 0.8, medium: 0.5, low: 0.2 };
    score += (importanceScore[memory.importance] || 0.5) * (weights.importance ?? 0.3);

    score += memory.access_count * 0.1 * (weights.frequency ?? 0.3);

    const ageMs = Date.now() - new Date(memory.created_at).getTime();
    const ageDays = ageMs / (24 * 60 * 60 * 1000);
    const recencyScore = Math.max(0, 1 - ageDays / 30);
    score += recencyScore * (weights.recent ?? 0.4);

    return score;
  }

  private generateSummary(memories: Memory[]): string {
    const content = memories.map(m => m.content).join(' ');
    const sentences = content.split(/[.!?]+/).filter(s => s.trim());
    const uniqueSentences = [...new Set(sentences)];
    
    if (uniqueSentences.length <= 5) {
      return uniqueSentences.join('. ') + '.';
    }

    const summarySentences = uniqueSentences.slice(0, 5);
    return summarySentences.join('. ') + '.';
  }

  private generateId(): string {
    return `mem_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }
}
