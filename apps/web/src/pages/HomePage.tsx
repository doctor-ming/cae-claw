import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Box, 
  TrendingUp, 
  Clock,
  ArrowRight,
  Zap,
  Shield,
  Globe
} from 'lucide-react';

const stats = [
  { label: '技能总数', value: '24', icon: Box, color: 'text-blue-600' },
  { label: '今日执行', value: '156', icon: Play, color: 'text-green-600' },
  { label: '成功率', value: '98.5%', icon: TrendingUp, color: 'text-purple-600' },
  { label: '运行中任务', value: '3', icon: Clock, color: 'text-orange-600' },
];

const recentSkills = [
  { 
    id: 'static_analysis', 
    name: '静力学分析', 
    type: 'workflow',
    executions: 45,
    icon: '📋',
    color: '#6366F1'
  },
  { 
    id: 'generate_mesh', 
    name: '生成网格', 
    type: 'skill',
    executions: 89,
    icon: '🔲',
    color: '#3B82F6'
  },
  { 
    id: 'topology_optimization', 
    name: '拓扑优化', 
    type: 'workflow',
    executions: 23,
    icon: '📋',
    color: '#F97316'
  },
];

export function HomePage() {
  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">欢迎使用 CAE Claw</h1>
        <p className="text-blue-100 mb-6">
          AI 驱动的 CAE 分析平台，让仿真工作更智能、更高效
        </p>
        <Link
          to="/skills"
          className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
        >
          探索技能市场
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className={`inline-flex p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">智能编排</h3>
          <p className="text-gray-500 text-sm">
            可视化 DAG 编辑器，拖拽式构建复杂 CAE 工作流
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">CAE 集成</h3>
          <p className="text-gray-500 text-sm">
            无缝连接 ANSA、HyperWorks 等主流 CAE 软件
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
            <Globe className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">多模型支持</h3>
          <p className="text-gray-500 text-sm">
            支持 OpenAI、Claude、本地 Ollama 等多种大模型
          </p>
        </div>
      </div>

      {/* Recent */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">最近使用</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {recentSkills.map((skill) => (
            <Link
              key={skill.id}
              to={`/skills/${skill.id}`}
              className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${skill.color}20` }}
              >
                {skill.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{skill.name}</div>
                <div className="text-sm text-gray-500">
                  {skill.type === 'workflow' ? '编排技能' : '原子技能'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{skill.executions}</div>
                <div className="text-xs text-gray-500">执行次数</div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
