import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Grid3X3, 
  List,
  Plus,
  Download,
  Star,
  TrendingUp,
  Clock,
  ArrowRight,
  Filter,
  Sparkles,
  Zap,
  Box,
  Layers,
  Cpu,
  Database,
  Settings,
  Code2,
  GitBranch
} from 'lucide-react';

const categories = [
  { id: 'all', label: '全部', icon: Sparkles, count: 24 },
  { id: 'mesh', label: '网格处理', icon: Box, count: 8, color: '#3B82F6' },
  { id: 'bc', label: '边界条件', icon: Settings, count: 5, color: '#F97316' },
  { id: 'solver', label: '求解分析', icon: Cpu, count: 4, color: '#8B5CF6' },
  { id: 'post', label: '后处理', icon: TrendingUp, count: 3, color: '#10B981' },
  { id: 'workflow', label: '工作流', icon: GitBranch, count: 6, color: '#EC4899' },
];

const skills = [
  {
    id: 'static_analysis',
    name: '静力学分析',
    nameEn: 'Static Analysis',
    description: '完整的线性静力学分析工作流，包括几何导入、网格划分、边界条件施加和结果提取',
    category: 'workflow',
    icon: '📊',
    color: '#6366F1',
    author: 'CAE Claw',
    downloads: 1250,
    rating: 4.8,
    isWorkflow: true,
    nodes: 8,
    featured: true
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
    isWorkflow: false,
    featured: true
  },
  {
    id: 'topology_optimization',
    name: '拓扑优化',
    nameEn: 'Topology Optimization',
    description: '基于密度法的拓扑优化，实现轻量化设计目标',
    category: 'workflow',
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
    icon: '📈',
    color: '#8B5CF6',
    author: 'CAE Claw',
    downloads: 720,
    rating: 4.5,
    isWorkflow: true,
    nodes: 5
  },
  {
    id: 'apply_bc',
    name: '边界条件智能施加',
    nameEn: 'Smart BC Application',
    description: '智能识别几何特征，自动施加约束和载荷',
    category: 'bc',
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
    name: '智能结果提取',
    nameEn: 'Smart Results Extraction',
    description: '从结果文件中提取关键数据，生成可视化图表',
    category: 'post',
    icon: '📉',
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

  const featuredSkills = skills.filter(s => s.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">技能市场</h1>
              <p className="text-slate-500 mt-2">浏览和发现强大的 CAE 自动化技能</p>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all">
              <Plus className="w-5 h-5" />
              创建技能
            </button>
          </div>

          {/* Search */}
          <div className="mt-8 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索技能、工作流..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-100 rounded-xl border-2 border-transparent focus:border-violet-500 focus:bg-white outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-violet-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{cat.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedCategory === cat.id ? 'bg-white/20' : 'bg-slate-100'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
          
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-xl transition-colors ${viewMode === 'grid' ? 'bg-violet-100 text-violet-600' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-xl transition-colors ${viewMode === 'list' ? 'bg-violet-100 text-violet-600' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Featured */}
        {selectedCategory === 'all' && !searchQuery && (
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              精选技能
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredSkills.map((skill) => (
                <Link
                  key={skill.id}
                  to={`/skills/${skill.id}`}
                  className="group relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-indigo-500" />
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                        style={{ backgroundColor: `${skill.color}15` }}
                      >
                        {skill.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors">{skill.name}</h3>
                          {skill.isWorkflow && (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-violet-100 to-indigo-100 text-violet-700 text-xs font-medium rounded-full">
                              工作流
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500">{skill.nameEn}</p>
                      </div>
                    </div>
                    
                    <p className="mt-4 text-slate-600 leading-relaxed">{skill.description}</p>
                    
                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <Download className="w-4 h-4" />
                          {skill.downloads.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          {skill.rating}
                        </div>
                        {skill.nodes && (
                          <div className="flex items-center gap-1 text-sm text-slate-500">
                            <Layers className="w-4 h-4" />
                            {skill.nodes} 步
                          </div>
                        )}
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Skills Grid/List */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            {selectedCategory === 'all' ? '所有技能' : categories.find(c => c.id === selectedCategory)?.label}
            <span className="ml-2 text-sm font-normal text-slate-400">({filteredSkills.length})</span>
          </h2>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredSkills.map((skill) => (
                <Link
                  key={skill.id}
                  to={`/skills/${skill.id}`}
                  className="group bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${skill.color}15` }}
                    >
                      {skill.icon}
                    </div>
                    {skill.isWorkflow && (
                      <span className="px-2 py-1 bg-gradient-to-r from-violet-100 to-pink-100 text-violet-700 text-xs font-medium rounded-lg">
                        工作流
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-violet-600 transition-colors">
                    {skill.name}
                  </h3>
                  <p className="text-xs text-slate-400 mb-3">{skill.nameEn}</p>
                  
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                    {skill.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Download className="w-3.5 h-3.5" />
                        {skill.downloads}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        {skill.rating}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
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
                  className="flex items-center gap-4 bg-white border border-slate-200/80 rounded-xl p-4 hover:border-violet-300 hover:shadow-lg transition-all"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: `${skill.color}15` }}
                  >
                    {skill.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-slate-900">{skill.name}</h3>
                      {skill.isWorkflow && (
                        <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs rounded-full">工作流</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 truncate">{skill.description}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500 flex-shrink-0">
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {skill.downloads}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      {skill.rating}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400" />
                </Link>
              ))}
            </div>
          )}

          {filteredSkills.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">没有找到匹配的技能</h3>
              <p className="text-slate-500">尝试调整搜索条件或浏览所有类别</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
