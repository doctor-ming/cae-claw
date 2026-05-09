import { z } from 'zod';
export declare const DocumentTypeSchema: z.ZodEnum<["article", "tutorial", "api_doc", "faq", "example", "manual"]>;
export type DocumentType = z.infer<typeof DocumentTypeSchema>;
export declare const DocumentSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    title_zh: z.ZodString;
    content: z.ZodString;
    type: z.ZodEnum<["article", "tutorial", "api_doc", "faq", "example", "manual"]>;
    category: z.ZodString;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodAny>>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
    created_by: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "article" | "tutorial" | "api_doc" | "faq" | "example" | "manual";
    id: string;
    title: string;
    title_zh: string;
    content: string;
    category: string;
    tags: string[];
    metadata: Record<string, any>;
    created_at: string;
    updated_at: string;
    created_by: string;
}, {
    type: "article" | "tutorial" | "api_doc" | "faq" | "example" | "manual";
    id: string;
    title: string;
    title_zh: string;
    content: string;
    category: string;
    created_at: string;
    updated_at: string;
    tags?: string[] | undefined;
    metadata?: Record<string, any> | undefined;
    created_by?: string | undefined;
}>;
export type Document = z.infer<typeof DocumentSchema>;
export declare const ChunkSchema: z.ZodObject<{
    id: z.ZodString;
    document_id: z.ZodString;
    content: z.ZodString;
    chunk_index: z.ZodNumber;
    embedding: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
    metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    content: string;
    metadata: Record<string, any>;
    document_id: string;
    chunk_index: number;
    embedding?: number[] | undefined;
}, {
    id: string;
    content: string;
    document_id: string;
    chunk_index: number;
    metadata?: Record<string, any> | undefined;
    embedding?: number[] | undefined;
}>;
export type Chunk = z.infer<typeof ChunkSchema>;
export declare const KnowledgeBaseConfigSchema: z.ZodObject<{
    embedding_model: z.ZodDefault<z.ZodString>;
    chunk_size: z.ZodDefault<z.ZodNumber>;
    chunk_overlap: z.ZodDefault<z.ZodNumber>;
    max_results: z.ZodDefault<z.ZodNumber>;
    similarity_threshold: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    embedding_model: string;
    chunk_size: number;
    chunk_overlap: number;
    max_results: number;
    similarity_threshold: number;
}, {
    embedding_model?: string | undefined;
    chunk_size?: number | undefined;
    chunk_overlap?: number | undefined;
    max_results?: number | undefined;
    similarity_threshold?: number | undefined;
}>;
export type KnowledgeBaseConfig = z.infer<typeof KnowledgeBaseConfigSchema>;
export interface SearchResult {
    document: Document;
    chunk: Chunk;
    score: number;
    highlight: string;
}
export declare class KnowledgeBase {
    private documents;
    private chunks;
    private config;
    constructor(config?: Partial<KnowledgeBaseConfig>);
    add_document(document: Document): Promise<string>;
    private chunk_text;
    search(query: string, limit?: number): Promise<SearchResult[]>;
    private calculate_similarity;
    private extract_highlight;
    get_document(id: string): Document | undefined;
    list_documents(category?: string): Document[];
    delete_document(id: string): boolean;
    get_config(): KnowledgeBaseConfig;
    update_config(config: Partial<KnowledgeBaseConfig>): void;
}
export declare function createKnowledgeBase(config?: KnowledgeBaseConfig): KnowledgeBase;
export declare const CAE_KNOWLEDGE_BASE: ({
    id: string;
    title: string;
    title_zh: string;
    content: string;
    type: "article";
    category: string;
    tags: string[];
} | {
    id: string;
    title: string;
    title_zh: string;
    content: string;
    type: "tutorial";
    category: string;
    tags: string[];
})[];
//# sourceMappingURL=knowledge.d.ts.map