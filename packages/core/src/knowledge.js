import { z } from 'zod';
export const DocumentTypeSchema = z.enum(['article', 'tutorial', 'api_doc', 'faq', 'example', 'manual']);
export const DocumentSchema = z.object({
    id: z.string(),
    title: z.string(),
    title_zh: z.string(),
    content: z.string(),
    type: DocumentTypeSchema,
    category: z.string(),
    tags: z.array(z.string()).default([]),
    metadata: z.record(z.any()).default({}),
    created_at: z.string(),
    updated_at: z.string(),
    created_by: z.string().default('system')
});
export const ChunkSchema = z.object({
    id: z.string(),
    document_id: z.string(),
    content: z.string(),
    chunk_index: z.number(),
    embedding: z.array(z.number()).optional(),
    metadata: z.record(z.any()).default({})
});
export const KnowledgeBaseConfigSchema = z.object({
    embedding_model: z.string().default('text-embedding-ada-002'),
    chunk_size: z.number().default(1000),
    chunk_overlap: z.number().default(200),
    max_results: z.number().default(5),
    similarity_threshold: z.number().default(0.7)
});
export class KnowledgeBase {
    documents = new Map();
    chunks = new Map();
    config;
    constructor(config = {}) {
        this.config = {
            embedding_model: config.embedding_model ?? 'text-embedding-ada-002',
            chunk_size: config.chunk_size ?? 1000,
            chunk_overlap: config.chunk_overlap ?? 200,
            max_results: config.max_results ?? 5,
            similarity_threshold: config.similarity_threshold ?? 0.7
        };
    }
    async add_document(document) {
        this.documents.set(document.id, document);
        const chunks = this.chunk_text(document.content, document.id);
        this.chunks.set(document.id, chunks);
        return document.id;
    }
    chunk_text(text, document_id) {
        const chunks = [];
        const chunk_size = this.config.chunk_size;
        const overlap = this.config.chunk_overlap;
        let start = 0;
        let index = 0;
        while (start < text.length) {
            const end = Math.min(start + chunk_size, text.length);
            const content = text.slice(start, end);
            chunks.push({
                id: `${document_id}_chunk_${index}`,
                document_id,
                content,
                chunk_index: index,
                metadata: {}
            });
            start = end - overlap;
            index++;
        }
        return chunks;
    }
    async search(query, limit = 5) {
        const query_lower = query.toLowerCase();
        const results = [];
        for (const [docId, docChunks] of this.chunks.entries()) {
            const document = this.documents.get(docId);
            if (!document)
                continue;
            for (const chunk of docChunks) {
                const score = this.calculate_similarity(query_lower, chunk.content.toLowerCase());
                if (score >= this.config.similarity_threshold) {
                    results.push({
                        document,
                        chunk,
                        score,
                        highlight: this.extract_highlight(chunk.content, query_lower)
                    });
                }
            }
        }
        results.sort((a, b) => b.score - a.score);
        return results.slice(0, limit);
    }
    calculate_similarity(query, text) {
        const query_words = query.split(/\s+/).filter(w => w.length > 2);
        const text_lower = text.toLowerCase();
        let matches = 0;
        for (const word of query_words) {
            if (text_lower.includes(word)) {
                matches++;
            }
        }
        return matches / query_words.length;
    }
    extract_highlight(text, query) {
        const query_words = query.split(/\s+/);
        const first_word = query_words[0];
        const index = text.toLowerCase().indexOf(first_word);
        if (index === -1) {
            return text.slice(0, 200) + (text.length > 200 ? '...' : '');
        }
        const start = Math.max(0, index - 50);
        const end = Math.min(text.length, index + 150);
        let highlight = text.slice(start, end);
        if (start > 0)
            highlight = '...' + highlight;
        if (end < text.length)
            highlight = highlight + '...';
        return highlight;
    }
    get_document(id) {
        return this.documents.get(id);
    }
    list_documents(category) {
        const docs = Array.from(this.documents.values());
        if (category) {
            return docs.filter(d => d.category === category);
        }
        return docs;
    }
    delete_document(id) {
        this.chunks.delete(id);
        return this.documents.delete(id);
    }
    get_config() {
        return { ...this.config };
    }
    update_config(config) {
        this.config = { ...this.config, ...config };
    }
}
export function createKnowledgeBase(config) {
    return new KnowledgeBase(config);
}
export const CAE_KNOWLEDGE_BASE = [
    {
        id: 'kb_mesh_001',
        title: 'Mesh Quality Criteria',
        title_zh: '网格质量标准',
        content: '网格质量标准包括：1) Skewness（歪斜度）：0-1，值越小越好，理想值为0，建议值>0.4；2) Aspect Ratio（长宽比）：应<5；3) Jacobian：应>0.6；4) Warpage（翘曲）：应<15度。',
        type: 'article',
        category: 'mesh',
        tags: ['mesh', 'quality', 'skewness', 'criteria']
    },
    {
        id: 'kb_solver_001',
        title: 'NASTRAN Linear Static Analysis',
        title_zh: 'NASTRAN 线性静力学分析',
        content: 'NASTRAN 线性静力学分析流程：1) 定义网格（GRID 点）；2) 定义单元（CTRIA3, CQUAD4, CHEXA, CPENTA）；3) 定义材料（MAT1）；4) 定义边界条件（SPC, SPC1）；5) 定义载荷（FORCE, PLOAD2）；6) 执行分析（SOL 101）；7) 提取结果（DISPL, STRESS）。',
        type: 'tutorial',
        category: 'solver',
        tags: ['nastran', 'static', 'linear', 'solver']
    },
    {
        id: 'kb_bc_001',
        title: 'Boundary Conditions Best Practices',
        title_zh: '边界条件最佳实践',
        content: '边界条件设置原则：1) 确保模型有足够的约束防止刚体运动；2) 避免过度约束；3) 使用对称边界条件减小模型规模；4) 载荷应施加在实际工作位置；5) 单位制必须统一（mm-MPa 或 m-N）。',
        type: 'article',
        category: 'boundary_conditions',
        tags: ['boundary', 'constraint', 'load', 'best_practices']
    },
    {
        id: 'kb_mesh_002',
        title: 'Mesh Size Guidelines',
        title_zh: '网格尺寸指南',
        content: '网格尺寸设置建议：1) 应力集中区域：网格应加密，通常为全局尺寸的20-50%；2) 过渡区域：使用渐进式过渡避免网格突变；3) 薄壁结构：至少3层网格；4) 接触区域：网格需匹配；5) 全局尺寸设置应基于几何特征尺寸。',
        type: 'article',
        category: 'mesh',
        tags: ['mesh', 'size', 'guideline', 'local_refinement']
    },
    {
        id: 'kb_post_001',
        title: 'Result Interpretation Guide',
        title_zh: '结果解读指南',
        content: '结果解读要点：1) von Mises 应力用于判断材料屈服；2) 位移结果需检查合理性；3) 应力奇异通常发生在边界条件附近；4) 查看结果应同时关注最大值和分布；5) 响应应力应<屈服强度的90%。',
        type: 'tutorial',
        category: 'post_processing',
        tags: ['post', 'results', 'stress', 'displacement', 'interpretation']
    }
];
//# sourceMappingURL=knowledge.js.map