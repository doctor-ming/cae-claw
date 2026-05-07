import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  Heart, 
  Code, 
  Copy,
  ChevronRight,
  Clock,
  User,
  Star
} from 'lucide-react';
import clsx from 'clsx';

const MOCK_SKILL = {
  id: 'static_analysis',
  name: 'Static Analysis Workflow',
  name_zh: '静力学分析工作流',
  description: '完整的线性静力学分析工作流，从几何导入到生成分析报告，适用于中小型模型的快速验证分析。',
  atomic: false,
  category: 'solver',
  icon: '📋',
  color: '#6366F1',
  author: 'CAE Team',
  version: '1.2.0',
  rating: 4.9,
  downloads: 567,
  tags: ['静力学', '结构分析', 'NASTRAN', '完整流程'],
  nodes: [
    { id: 'import', skill_id: 'import_geometry', name: '导入几何', depends_on: [] },
    { id: 'mesh', skill_id: 'generate_mesh', name: '生成网格', depends_on: ['import'] },
    { id: 'quality', skill_id: 'check_quality', name: '质量检查', depends_on: ['mesh'] },
    { id: 'load', skill_id: 'apply_load', name: '载荷', depends_on: ['quality'] },
    { id: 'constraint', skill_id: 'apply_constraint', name: '约束', depends_on: ['load'] },
    { id: 'solve', skill_id: 'run_solver', name: '求解', depends_on: ['constraint'] },
    { id: 'results', skill_id: 'extract_results', name: '提取结果', depends_on: ['solve'] },
  ],
  input_schema: {
    geometry_file: {
      type: 'file',
      required: true,
      extensions: ['.step', '.iges', '.stl'],
      description: '输入几何文件'
    },
    mesh_size: {
      type: 'number',
      required: false,
      default: 5.0,
      unit: 'mm'
    },
    material: {
      type: 'object',
      required: false,
      default: { name: 'Steel', E: 210000, nu: 0.3 }
    }
  }
};

const SKILL_ICONS: Record<string, { icon: string; color: string }> = {
  import_geometry: { icon: '📥', color: '#10B981' },
  generate_mesh: { icon: '🔲', color: '#3B82F6' },
  check_quality: { icon: '✅', color: '#8B5CF6' },
  apply_load: { icon: '⚡', color: '#F59E0B' },
  apply_constraint: { icon: '🔒', color: '#EF4444' },
  run_solver: { icon: '🚀', color: '#EC4899' },
  extract_results: { icon: '📊', color: '#06B6D4' },
};

export function SkillDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);
  const [params, setParams] = useState<Record<string, any>>({});

  const skill = MOCK_SKILL;

  const handleParamChange = (key: string, value: any) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          to="/skills"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{skill.name_zh}</h1>
            <span className={clsx(
              'px-2 py-1 rounded text-xs font-medium',
              skill.atomic 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-purple-100 text-purple-700'
            )}>
              {skill.atomic ? '🔧 原子技能' : '📋 编排技能'}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {skill.author}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              v{skill.version}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              {skill.rating}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={clsx(
              'p-2 rounded-lg transition-colors',
              isFavorite 
                ? 'bg-red-100 text-red-600' 
                : 'hover:bg-gray-100 text-gray-500'
            )}
          >
            <Heart className={clsx('w-5 h-5', isFavorite && 'fill-current')} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Copy className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {['overview', 'parameters', 'code'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                'py-3 px-1 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              {tab === 'overview' && '概览'}
              {tab === 'parameters' && '参数'}
              {tab === 'code' && '源码'}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* DAG Visualization */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">流程可视化</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  {skill.nodes.map((node, idx) => {
                    const nodeInfo = SKILL_ICONS[node.skill_id] || { icon: '📦', color: '#3B82F6' };
                    return (
                      <React.Fragment key={node.id}>
                        <div className="flex flex-col items-center">
                          <div 
                            className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl border-2"
                            style={{ 
                              borderColor: nodeInfo.color,
                              backgroundColor: `${nodeInfo.color}10`
                            }}
                          >
                            {nodeInfo.icon}
                          </div>
                          <span className="text-xs text-gray-600 mt-1">{node.name}</span>
                        </div>
                        {idx < skill.nodes.length - 1 && (
                          <ChevronRight className="w-5 h-5 text-gray-300" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">描述</h2>
                <p className="text-gray-600">{skill.description}</p>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">标签</h2>
                <div className="flex flex-wrap gap-2">
                  {skill.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'parameters' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">参数配置</h2>
              
              {Object.entries(skill.input_schema).map(([key, schema]: [string, any]) => (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {schema.description || key}
                    {schema.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {schema.type === 'file' && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                      <div className="text-4xl mb-2">📁</div>
                      <div className="text-sm text-gray-600">
                        拖拽文件或点击选择
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        支持: {schema.extensions?.join(', ')}
                      </div>
                    </div>
                  )}
                  
                  {schema.type === 'number' && (
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        value={params[key] ?? schema.default}
                        onChange={(e) => handleParamChange(key, parseFloat(e.target.value))}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-500">{schema.unit}</span>
                    </div>
                  )}

                  {schema.type === 'object' && (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      {Object.entries(schema.default || {}).map(([k, v]) => (
                        <div key={k} className="flex items-center gap-4">
                          <span className="w-20 text-sm text-gray-600">{k}</span>
                          <input
                            type="text"
                            defaultValue={v as string}
                            className="flex-1 px-3 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'code' && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">skill.yaml</span>
                <button className="text-sm text-blue-600 hover:text-blue-700">复制</button>
              </div>
              <pre className="p-4 text-sm text-gray-700 overflow-x-auto">
{`name: static_analysis
version: 1.2.0
type: workflow
category: solver

nodes:
  - id: import
    skill: import_geometry
    name: 导入几何
  
  - id: mesh
    skill: generate_mesh
    name: 生成网格
    depends_on: [import]
  
  - id: quality
    skill: check_quality
    name: 质量检查
    depends_on: [mesh]
  
  - id: load
    skill: apply_load
    name: 载荷
    depends_on: [quality]
  
  - id: constraint
    skill: apply_constraint
    name: 约束
    depends_on: [load]
  
  - id: solve
    skill: run_solver
    name: 求解
    depends_on: [constraint]
  
  - id: results
    skill: extract_results
    name: 提取结果
    depends_on: [solve]

execution:
  mode: sequential
  timeout: 3600`}
              </pre>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Execute button */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
              <Play className="w-5 h-5" />
              立即使用
            </button>
            <p className="text-xs text-gray-500 text-center mt-3">
              预计执行时间: 5-15 分钟
            </p>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">统计信息</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">下载次数</span>
                <span className="font-medium">{skill.downloads}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">评分</span>
                <span className="font-medium">⭐ {skill.rating}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">版本</span>
                <span className="font-medium">v{skill.version}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">包含节点</span>
                <span className="font-medium">{skill.nodes.length} 个</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
