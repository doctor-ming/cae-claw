import { Skill } from '@cae-claw/core';

export const TOOL_CATEGORIES = {
  ansa: { name: 'ANSA 工具', icon: '🔧', color: '#3B82F6' },
  ssh: { name: 'SSH 工具', icon: '🖥️', color: '#10B981' },
  hyperworks: { name: 'HyperWorks 工具', icon: '⚙️', color: '#F59E0B' },
  post_processing: { name: '后处理工具', icon: '📊', color: '#EC4899' },
  workflow: { name: '工作流工具', icon: '🔄', color: '#8B5CF6' },
  system: { name: '系统工具', icon: '💻', color: '#6B7280' }
};

export const SKILL_CATEGORIES = {
  data_io: { name: '数据处理', icon: '📥', color: '#10B981' },
  mesh: { name: '网格处理', icon: '🔲', color: '#3B82F6' },
  boundary_conditions: { name: '边界条件', icon: '⚡', color: '#F59E0B' },
  solver: { name: '求解分析', icon: '🚀', color: '#EC4899' },
  post_processing: { name: '后处理', icon: '📊', color: '#06B6D4' },
  optimization: { name: '优化', icon: '🎯', color: '#F97316' },
  remote_command: { name: '远程命令', icon: '🖥️', color: '#10B981' },
  workflow: { name: '工作流', icon: '🔄', color: '#8B5CF6' }
};

export const DEFAULT_SKILLS: Partial<Skill>[] = [
  {
    id: 'import_geometry',
    name: 'Import Geometry',
    name_zh: '导入几何',
    description: 'Import geometry models from various CAD formats',
    description_zh: '从各种 CAD 格式导入几何模型',
    atomic: true,
    category: 'data_io',
    tool_category: 'ansa',
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
    tool_category: 'ansa',
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
    tool_category: 'ansa',
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
    tool_category: 'ansa',
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
    tool_category: 'ansa',
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
    tool_category: 'ansa',
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
    tool_category: 'post_processing',
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
    tool_category: 'post_processing',
    icon: '📄',
    color: '#84CC16',
    author: 'CAE Claw',
    tags: ['report', 'pdf', 'generate']
  },
  {
    id: 'ssh_execute',
    name: 'SSH Execute',
    name_zh: '远程执行命令',
    description: 'Execute command on remote server via SSH',
    description_zh: '通过 SSH 在远程服务器执行命令',
    atomic: true,
    category: 'remote_command',
    tool_category: 'ssh',
    icon: '🖥️',
    color: '#10B981',
    author: 'CAE Claw',
    tags: ['ssh', 'remote', 'execute', 'command']
  },
  {
    id: 'ssh_upload',
    name: 'SSH Upload',
    name_zh: '上传文件到远程',
    description: 'Upload files to remote server via SSH/SFTP',
    description_zh: '通过 SSH/SFTP 上传文件到远程服务器',
    atomic: true,
    category: 'remote_command',
    tool_category: 'ssh',
    icon: '📤',
    color: '#10B981',
    author: 'CAE Claw',
    tags: ['ssh', 'upload', 'sftp', 'file']
  },
  {
    id: 'ssh_download',
    name: 'SSH Download',
    name_zh: '下载远程文件',
    description: 'Download files from remote server via SSH/SFTP',
    description_zh: '通过 SSH/SFTP 从远程服务器下载文件',
    atomic: true,
    category: 'remote_command',
    tool_category: 'ssh',
    icon: '📥',
    color: '#10B981',
    author: 'CAE Claw',
    tags: ['ssh', 'download', 'sftp', 'file']
  },
  {
    id: 'cmd_execute',
    name: 'Command Execute',
    name_zh: '执行本地命令',
    description: 'Execute local shell command',
    description_zh: '执行本地 Shell 命令',
    atomic: true,
    category: 'remote_command',
    tool_category: 'system',
    icon: '⌨️',
    color: '#6B7280',
    author: 'CAE Claw',
    tags: ['command', 'shell', 'execute', 'local']
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
    tool_category: 'ansa',
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
    tool_category: 'ansa',
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
    tool_category: 'ansa',
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
  },
  {
    id: 'remote_batch_process',
    name: 'Remote Batch Process Workflow',
    name_zh: '远程批量处理工作流',
    description: 'Batch process files on remote server via SSH',
    description_zh: '通过 SSH 在远程服务器批量处理文件',
    atomic: false,
    category: 'remote_command',
    tool_category: 'ssh',
    icon: '📋',
    color: '#10B981',
    author: 'CAE Claw',
    tags: ['ssh', 'batch', 'remote', 'workflow'],
    nodes: [
      { id: 'upload', skill_id: 'ssh_upload', name: '上传文件', depends_on: [], inputs: {}, config: {} },
      { id: 'execute', skill_id: 'ssh_execute', name: '执行命令', depends_on: ['upload'], inputs: {}, config: {} },
      { id: 'download', skill_id: 'ssh_download', name: '下载结果', depends_on: ['execute'], inputs: {}, config: {} }
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
