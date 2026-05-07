import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Grid, List, ArrowRight, Tag } from 'lucide-react';
import clsx from 'clsx';

interface Skill {
  id: string;
  name: string;
  name_zh: string;
  description: string;
  atomic: boolean;
  category: string;
  icon: string;
  color: string;
  rating: number;
  usage_count: number;
  tags: string[];
}

const CATEGORIES = [
  { id: 'all', name: '全部', icon: '📦' },
  { id: 'data_io', name: '数据处理', icon: '📥' },
  { id: 'mesh', name: '网格处理', icon: '🔲' },
  { id: 'boundary_conditions', name: '边界条件', icon: '⚡' },
  { id: 'solver', name: '求解分析', icon: '🚀' },
  { id: 'post_processing', name: '后处理', icon: '📊' },
  { id: 'optimization', name: '优化', icon: '🎯' },
];

const MOCK_SKILLS: Skill[] = [
  {
    id: 'import_geometry',
    name: 'Import Geometry',
    name_zh: '导入几何',
    description: 'Import geometry models from various CAD formats',
    atomic: true,
    category: 'data_io',
    icon: '📥',
    color: '#10B981',
    rating: 4.8,
    usage_count: 234,
    tags: ['import', 'cad', 'step']
  },
  {
    id: 'generate_mesh',
    name: 'Generate Mesh',
    name_zh: '生成网格',
    description: 'Generate mesh from geometry with configurable parameters',
    atomic: true,
    category: 'mesh',
    icon: '🔲',
    color: '#3B82F6',
    rating: 4.6,
    usage_count: 189,
    tags: ['mesh', 'tet4']
  },
  {
    id: 'static_analysis',
    name: 'Static Analysis',
    name_zh: '静力学分析',
    description: 'Complete workflow for linear static analysis',
    atomic: false,
    category: 'solver',
    icon: '📋',
    color: '#6366F1',
    rating: 4.9,
    usage_count: 567,
    tags: ['workflow', 'static']
  },
  {
    id: 'check_quality',
    name: 'Mesh Quality Check',
    name_zh: '网格质量检查',
    description: 'Check mesh quality and generate quality report',
    atomic: true,
    category: 'mesh',
    icon: '✅',
    color: '#8B5CF6',
    rating: 4.7,
    usage_count: 156,
    tags: ['quality', 'check']
  },
  {
    id: 'topology_optimization',
    name: 'Topology Optimization',
    name_zh: '拓扑优化',
    description: 'Complete workflow for topology optimization',
    atomic: false,
    category: 'optimization',
    icon: '📋',
    color: '#F97316',
    rating: 4.8,
    usage_count: 234,
    tags: ['workflow', 'topology']
  },
  {
    id: 'apply_load',
    name: 'Apply Load',
    name_zh: '施加载荷',
    description: 'Apply loads to mesh elements',
    atomic: true,
    category: 'boundary_conditions',
    icon: '⚡',
    color: '#F59E0B',
    rating: 4.5,
    usage_count: 143,
    tags: ['load', 'force']
  },
];

export function SkillsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAtomic, setShowAtomic] = useState<boolean | null>(null);

  const filteredSkills = MOCK_SKILLS.filter(skill => {
    const matchesSearch = 
      skill.name.toLowerCase().includes(search.toLowerCase()) ||
      skill.name_zh.includes(search) ||
      skill.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = 
      activeCategory === 'all' || skill.category === activeCategory;
    
    const matchesType = 
      showAtomic === null || skill.atomic === showAtomic;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">技能市场</h1>
        <p className="text-gray-500 mt-1">浏览和搜索 CAE 技能与编排工作流</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索技能..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Type filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowAtomic(null)}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                showAtomic === null 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              全部
            </button>
            <button
              onClick={() => setShowAtomic(true)}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                showAtomic === true 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              🔧 原子技能
            </button>
            <button
              onClick={() => setShowAtomic(false)}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                showAtomic === false 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              📋 编排技能
            </button>
          </div>

          {/* View mode */}
          <div className="flex gap-1 border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={clsx(
                'p-2 rounded',
                viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'
              )}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={clsx(
                'p-2 rounded',
                viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'
              )}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={clsx(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <Link
              key={skill.id}
              to={`/skills/${skill.id}`}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div 
                className="h-2"
                style={{ backgroundColor: skill.color }}
              />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${skill.color}20` }}
                  >
                    {skill.icon}
                  </div>
                  <span className={clsx(
                    'px-2 py-1 rounded text-xs font-medium',
                    skill.atomic 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-purple-100 text-purple-700'
                  )}>
                    {skill.atomic ? '🔧 原子' : '📋 编排'}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-1">{skill.name_zh}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{skill.description}</p>

                {/* Workflow nodes preview */}
                {!skill.atomic && (
                  <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded">导入</span>
                    <ArrowRight className="w-3 h-3" />
                    <span className="px-2 py-1 bg-gray-100 rounded">网格</span>
                    <ArrowRight className="w-3 h-3" />
                    <span className="px-2 py-1 bg-gray-100 rounded">求解</span>
                    <ArrowRight className="w-3 h-3" />
                    <span className="px-2 py-1 bg-gray-100 rounded">...</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-medium text-gray-900">{skill.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">{skill.usage_count} 次使用</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {filteredSkills.map((skill) => (
            <Link
              key={skill.id}
              to={`/skills/${skill.id}`}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${skill.color}20` }}
              >
                {skill.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">{skill.name_zh}</h3>
                  <span className={clsx(
                    'px-2 py-0.5 rounded text-xs font-medium',
                    skill.atomic 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-purple-100 text-purple-700'
                  )}>
                    {skill.atomic ? '原子' : '编排'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">{skill.description}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">⭐ {skill.rating}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">{skill.usage_count} 次</div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {filteredSkills.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">未找到匹配的技能</h3>
          <p className="text-gray-500">尝试调整搜索条件或筛选器</p>
        </div>
      )}
    </div>
  );
}
