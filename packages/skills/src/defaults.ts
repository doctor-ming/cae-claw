import { Skill } from '@cae-claw/core';

export const DEFAULT_SKILLS: Partial<Skill>[] = [
  {
    id: 'import_geometry',
    name: 'Import Geometry',
    name_zh: '导入几何',
    description: 'Import geometry models from various CAD formats',
    description_zh: '从各种 CAD 格式导入几何模型',
    atomic: true,
    category: 'data_io',
    icon: '📥',
    color: '#10B981',
    author: 'CAE Claw',
    tags: ['import', 'geometry', 'cad', 'step', 'iges']
  },
  {
    id: 'generate_mesh',
    name: 'Generate Mesh',
    name_zh: '生成网格',
    description: 'Generate mesh from geometry with configurable parameters',
    description_zh: '根据几何模型生成网格，支持参数配置',
    atomic: true,
    category: 'mesh',
    icon: '🔲',
    color: '#3B82F6',
    author: 'CAE Claw',
    tags: ['mesh', 'tet4', 'tetrahedral', 'grid']
  },
  {
    id: 'check_quality',
    name: 'Mesh Quality Check',
    name_zh: '网格质量检查',
    description: 'Check mesh quality and generate quality report',
    description_zh: '检查网格质量并生成质量报告',
    atomic: true,
    category: 'mesh',
    icon: '✅',
    color: '#8B5CF6',
    author: 'CAE Claw',
    tags: ['quality', 'mesh', 'check', 'skewness']
  },
  {
    id: 'apply_load',
    name: 'Apply Load',
    name_zh: '施加载荷',
    description: 'Apply loads to mesh elements',
    description_zh: '向网格单元施加载荷',
    atomic: true,
    category: 'boundary_conditions',
    icon: '⚡',
    color: '#F59E0B',
    author: 'CAE Claw',
    tags: ['load', 'force', 'pressure', 'boundary']
  },
  {
    id: 'apply_constraint',
    name: 'Apply Constraint',
    name_zh: '施加约束',
    description: 'Apply constraints to mesh elements',
    description_zh: '向网格单元施加约束条件',
    atomic: true,
    category: 'boundary_conditions',
    icon: '🔒',
    color: '#EF4444',
    author: 'CAE Claw',
    tags: ['constraint', 'boundary', 'fix', 'displacement']
  },
  {
    id: 'run_solver',
    name: 'Run Solver',
    name_zh: '运行求解器',
    description: 'Run CAE solver for analysis',
    description_zh: '运行 CAE 求解器进行分析',
    atomic: true,
    category: 'solver',
    icon: '🚀',
    color: '#EC4899',
    author: 'CAE Claw',
    tags: ['solver', 'nastran', 'run', 'analysis']
  },
  {
    id: 'extract_results',
    name: 'Extract Results',
    name_zh: '提取结果',
    description: 'Extract analysis results',
    description_zh: '提取分析结果数据',
    atomic: true,
    category: 'post_processing',
    icon: '📊',
    color: '#06B6D4',
    author: 'CAE Claw',
    tags: ['results', 'extract', 'stress', 'displacement']
  },
  {
    id: 'generate_report',
    name: 'Generate Report',
    name_zh: '生成报告',
    description: 'Generate analysis report',
    description_zh: '生成分析报告',
    atomic: true,
    category: 'post_processing',
    icon: '📄',
    color: '#84CC16',
    author: 'CAE Claw',
    tags: ['report', 'pdf', 'generate']
  }
];

export const DEFAULT_WORKFLOWS: Partial<Skill>[] = [
  {
    id: 'static_analysis',
    name: 'Static Analysis Workflow',
    name_zh: '静力学分析工作流',
    description: 'Complete workflow for linear static analysis',
    description_zh: '完整的线性静力学分析工作流',
    atomic: false,
    category: 'solver',
    icon: '📋',
    color: '#6366F1',
    author: 'CAE Claw',
    tags: ['static', 'linear', 'workflow', 'complete'],
    nodes: [
      { id: 'import', skill_id: 'import_geometry', name: '导入几何', depends_on: [], inputs: {}, config: {} },
      { id: 'mesh', skill_id: 'generate_mesh', name: '生成网格', depends_on: ['import'], inputs: {}, config: {} },
      { id: 'quality', skill_id: 'check_quality', name: '质量检查', depends_on: ['mesh'], inputs: {}, config: {} },
      { id: 'load', skill_id: 'apply_load', name: '载荷', depends_on: ['quality'], inputs: {}, config: {} },
      { id: 'constraint', skill_id: 'apply_constraint', name: '约束', depends_on: ['load'], inputs: {}, config: {} },
      { id: 'solve', skill_id: 'run_solver', name: '求解', depends_on: ['constraint'], inputs: {}, config: {} },
      { id: 'results', skill_id: 'extract_results', name: '提取结果', depends_on: ['solve'], inputs: {}, config: {} },
      { id: 'report', skill_id: 'generate_report', name: '报告', depends_on: ['results'], inputs: {}, config: {} }
    ],
    execution_mode: 'sequential'
  },
  {
    id: 'modal_analysis',
    name: 'Modal Analysis Workflow',
    name_zh: '模态分析工作流',
    description: 'Complete workflow for modal analysis',
    description_zh: '完整的模态分析工作流',
    atomic: false,
    category: 'solver',
    icon: '📋',
    color: '#8B5CF6',
    author: 'CAE Claw',
    tags: ['modal', 'frequency', 'workflow', 'vibration'],
    nodes: [
      { id: 'import', skill_id: 'import_geometry', name: '导入几何', depends_on: [], inputs: {}, config: {} },
      { id: 'mesh', skill_id: 'generate_mesh', name: '生成网格', depends_on: ['import'], inputs: {}, config: {} },
      { id: 'constraint', skill_id: 'apply_constraint', name: '约束', depends_on: ['mesh'], inputs: {}, config: {} },
      { id: 'solve', skill_id: 'run_solver', name: '求解', depends_on: ['constraint'], inputs: {}, config: {} },
      { id: 'results', skill_id: 'extract_results', name: '提取结果', depends_on: ['solve'], inputs: {}, config: {} }
    ],
    execution_mode: 'sequential'
  },
  {
    id: 'topology_optimization',
    name: 'Topology Optimization Workflow',
    name_zh: '拓扑优化工作流',
    description: 'Complete workflow for topology optimization',
    description_zh: '完整的拓扑优化工作流',
    atomic: false,
    category: 'optimization',
    icon: '📋',
    color: '#F97316',
    author: 'CAE Claw',
    tags: ['topology', 'optimization', 'workflow', 'density'],
    nodes: [
      { id: 'import', skill_id: 'import_geometry', name: '导入几何', depends_on: [], inputs: {}, config: {} },
      { id: 'mesh', skill_id: 'generate_mesh', name: '生成网格', depends_on: ['import'], inputs: {}, config: {} },
      { id: 'quality', skill_id: 'check_quality', name: '质量检查', depends_on: ['mesh'], inputs: {}, config: {} },
      { id: 'load', skill_id: 'apply_load', name: '载荷', depends_on: ['quality'], inputs: {}, config: {} },
      { id: 'constraint', skill_id: 'apply_constraint', name: '约束', depends_on: ['load'], inputs: {}, config: {} },
      { id: 'solve', skill_id: 'run_solver', name: '优化求解', depends_on: ['constraint'], inputs: {}, config: {} },
      { id: 'results', skill_id: 'extract_results', name: '提取结果', depends_on: ['solve'], inputs: {}, config: {} }
    ],
    execution_mode: 'sequential'
  }
];

export function initializeDefaultSkills(registry: any): void {
  for (const skillData of DEFAULT_SKILLS) {
    registry.register(skillData as any);
  }
  
  for (const workflowData of DEFAULT_WORKFLOWS) {
    registry.register(workflowData as any);
  }
}
