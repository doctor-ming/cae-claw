import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Grid3X3, 
  List,
  Filter,
  Plus,
  Download,
  Star,
  Zap,
  Code2,
  Database,
  Terminal,
  Box,
  Layers,
  Cpu,
  Settings,
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';

const categories = [
  { id: 'all', label: '全部', icon: Grid3X3, count: 24 },
  { id: 'mesh', label: '网格处理', icon: Box, count: 8, color: 'blue' },
  { id: 'boundary_conditions', label: '边界条件', icon: Settings, count: 5, color: 'orange' },
  { id: 'solver', label: '求解分析', icon: Cpu, count: 4, color: 'purple' },
  { id: 'post_processing', label: '后处理', icon: TrendingUp, count: 3, color: 'green' },
  { id: 'data_io', label: '数据处理', icon: Database, count: 2, color: 'cyan' },
  { id: 'workflow', label: '工作流', icon: Layers, count: 4, color: 'pink' },
];

const skills = [
  {
    id: 'static_analysis',
    name: '静力学分析',
    nameEn: 'Static Analysis',
    description: '完整的线性静力学分析工作流，包括几何导入、网格划分、边界条件施加和结果提取',
    category: 'workflow',
    icon: '📋',
    color: '#6366F1',
    author: 'CAE Claw',
    downloads: 1250,
    rating: 4.8,
    isWorkflow: true,
    nodes: 8
  },
  {
    id: 'generate_mesh',
    name: '智能网格生成',
    nameEn: 'Smart Mesh Generation',
    description: '基于几何特征自动识别和网格划分，支持多种单元类型和尺寸控制',
    category: 'mesh',
    icon: '🔲',
    color: '#3B82F6',
    author: 'CAE Claw',
    downloads: 2100,
    rating: 4.9,
    isWorkflow: false
  },
  {
    id: 'topology_optimization',
    name: '拓扑优化',
    nameEn: 'Topology Optimization',
    description: '基于密度法的拓扑优化，实现轻量化设计目标',
    category: 'optimization',
    icon: '🎯',
    color: '#F97316',
    author: 'CAE Claw',
    downloads: 890,
    rating: 4.7,
    isWorkflow: true,
    nodes: 7
  },
  {
    id: 'check_quality',
    name: '网格质量检查',
    nameEn: 'Mesh Quality Check',
    description: '自动检查网格质量指标，包括歪斜度、长宽比、雅可比等',
    category: 'mesh',
    icon: '✅',
    color: '#10B981',
    author: 'CAE Claw',
    downloads: 1580,
    rating: 4.6,
    isWorkflow: false
  },
  {
    id: 'modal_analysis',
    name: '模态分析',
    nameEn: 'Modal Analysis',
    description: '提取结构固有频率和振型，用于振动特性评估',
    category: 'workflow',
    icon: '📊',
    color: '#8B5CF6',
    author: 'CAE Claw',
    downloads: 720,
    rating: 4.5,
    isWorkflow: true,
    nodes: 5
  },
  {
    id: 'apply_bc',
    name: '边界条件施加',
    nameEn: 'Apply Boundary Conditions',
    description: '智能识别几何特征，自动施加约束和载荷',
    category: 'boundary_conditions',
    icon: '⚡',
    color: '#EF4444',
    author: 'CAE Claw',
    downloads: 1340,
    rating: 4.7,
    isWorkflow: false
  },
  {
    id: 'ssh_batch',
    name: '远程批量处理',
    nameEn: 'Remote Batch Process',
    description: '通过 SSH 在远程服务器批量执行 CAE 任务',
    category: 'workflow',
    icon: '🖥️',
    color: '#06B6D4',
    author: 'CAE Claw',
    downloads: 560,
    rating: 4.4,
    isWorkflow: true,
    nodes: 3
  },
  {
    id: 'extract_results',
    name: '结果提取',
    nameEn: 'Extract Results',
    description: '从结果文件中提取关键数据，生成可视化图表',
    category: 'post_processing',
    icon: '📈',
    color: '#84CC16',
    author: 'CAE Claw',
    downloads: 980,
    rating: 4.6,
    isWorkflow: false
  },
];

export function SkillsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSkills = skills.filter(skill => {
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">技能市场</h1>
          <p className="text-gray-500 mt-1">浏览和管理你的 CAE 技能库</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all">
          <Plus className="w-4 h-4" />
          创建技能
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索技能..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2.5 rounded-xl transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
          >
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2.5 rounded-xl transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{cat.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                selectedCategory === cat.id ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Skills Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSkills.map((skill) => (
            <Link
              key={skill.id}
              to={`/skills/${skill.id}`}
              className="group bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                  style={{ backgroundColor: `${skill.color}15` }}
                >
                  {skill.icon}
                </div>
                {skill.isWorkflow && (
                  <span className="px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-medium rounded-lg">
                    工作流
                  </span>
                )}
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {skill.name}
              </h3>
              <p className="text-xs text-gray-400 mb-3">{skill.nameEn}</p>
              
              <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                {skill.description}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Download className="w-3.5 h-3.5" />
                    {skill.downloads}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Star className="w-3.5 h-3.5 text-yellow-500" />
                    {skill.rating}
                  </div>
                  {skill.nodes && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Layers className="w-3.5 h-3.5" />
                      {skill.nodes} 步
                    </div>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSkills.map((skill) => (
            <Link
              key={skill.id}
              to={`/skills/${skill.id}`}
              className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: `${skill.color}15` }}
              >
                {skill.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">{skill.name}</h3>
                  {skill.isWorkflow && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                      工作流
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate">{skill.description}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  {skill.downloads}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  {skill.rating}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </Link>
          ))}
        </div>
      )}

      {filteredSkills.length === 0 && (
        <div className="text-center py-12">
          <Box className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到匹配的技能</h3>
          <p className="text-gray-500">尝试调整搜索条件或浏览所有类别</p>
        </div>
      )}
    </div>
  );
}
