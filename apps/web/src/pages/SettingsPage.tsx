import React, { useState } from 'react';
import { 
  Settings,
  Key,
  Globe,
  Database,
  Terminal,
  Bot,
  Shield,
  Bell,
  Moon,
  Sun,
  Plus,
  Trash2,
  TestTube,
  Check,
  AlertCircle
} from 'lucide-react';

const tabs = [
  { id: 'model', label: '模型配置', icon: Bot },
  { id: 'connection', label: '连接管理', icon: Terminal },
  { id: 'knowledge', label: '知识库', icon: Database },
  { id: 'hooks', label: 'Hook配置', icon: Settings },
  { id: 'general', label: '通用设置', icon: Globe },
];

const llmProviders = [
  { id: 'openai', name: 'OpenAI', models: ['gpt-4o', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'] },
  { id: 'anthropic', name: 'Anthropic Claude', models: ['claude-3-5-sonnet', 'claude-3-opus', 'claude-3-sonnet'] },
  { id: 'deepseek', name: 'DeepSeek', models: ['deepseek-chat', 'deepseek-coder'] },
  { id: 'ollama', name: 'Ollama (本地)', models: ['llama3', 'codellama', 'mistral'] },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('model');
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [apiKey, setApiKey] = useState('');
  const [connections, setConnections] = useState([
    { id: '1', name: 'ANSA Server', host: '192.168.1.100', port: 9988, status: 'connected' },
    { id: '2', name: 'HPC Cluster', host: 'hpc.example.com', port: 22, status: 'disconnected' },
  ]);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">设置</h1>
        <p className="text-gray-500 mt-1">配置 CAE Claw 的各项功能</p>
      </div>

      <div className="flex gap-6">
        {/* Tabs */}
        <div className="w-56 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-6">
          {activeTab === 'model' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">模型配置</h2>
                <p className="text-sm text-gray-500 mb-6">选择 AI 模型并配置 API 密钥</p>
              </div>

              {/* Provider Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">AI 提供商</label>
                <div className="grid grid-cols-2 gap-3">
                  {llmProviders.map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => setSelectedProvider(provider.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedProvider === provider.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{provider.name}</span>
                        {selectedProvider === provider.id && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{provider.models.length} 个模型可用</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Model Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">模型</label>
                <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                  {llmProviders.find(p => p.id === selectedProvider)?.models.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              {/* API Key */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API 密钥</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="输入你的 API 密钥"
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Test Button */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                  <TestTube className="w-4 h-4" />
                  测试连接
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                  <Check className="w-4 h-4" />
                  保存配置
                </button>
              </div>
            </div>
          )}

          {activeTab === 'connection' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">连接管理</h2>
                  <p className="text-sm text-gray-500">管理 ANSA 服务器和远程连接</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                  <Plus className="w-4 h-4" />
                  添加连接
                </button>
              </div>

              <div className="space-y-3">
                {connections.map((conn) => (
                  <div key={conn.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${conn.status === 'connected' ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <div>
                        <p className="font-medium text-gray-900">{conn.name}</p>
                        <p className="text-sm text-gray-500">{conn.host}:{conn.port}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'knowledge' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">知识库配置</h2>
                <p className="text-sm text-gray-500">配置 CAE 知识库的索引和检索设置</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-gray-900">156</p>
                  <p className="text-sm text-gray-500">文档数量</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-gray-900">2,340</p>
                  <p className="text-sm text-gray-500">索引条目</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">知识库类型</label>
                <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                  <option>向量数据库 (语义搜索)</option>
                  <option>关键词搜索</option>
                  <option>混合搜索</option>
                </select>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                <Database className="w-4 h-4" />
                重新索引知识库
              </button>
            </div>
          )}

          {activeTab === 'hooks' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Hook 配置</h2>
                <p className="text-sm text-gray-500">配置事件钩子以扩展系统功能</p>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'on_tool_call', desc: '工具调用时执行', enabled: true },
                  { name: 'on_skill_execute', desc: 'Skill 执行时执行', enabled: true },
                  { name: 'on_error', desc: '发生错误时执行', enabled: true },
                  { name: 'on_workflow_complete', desc: '工作流完成时执行', enabled: false },
                ].map((hook) => (
                  <div key={hook.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${hook.enabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <div>
                        <p className="font-medium text-gray-900">{hook.name}</p>
                        <p className="text-sm text-gray-500">{hook.desc}</p>
                      </div>
                    </div>
                    <button className={`px-3 py-1 rounded-full text-xs font-medium ${
                      hook.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {hook.enabled ? '已启用' : '已禁用'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">通用设置</h2>
                <p className="text-sm text-gray-500">配置应用程序的通用选项</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    {darkMode ? <Moon className="w-5 h-5 text-gray-700" /> : <Sun className="w-5 h-5 text-gray-700" />}
                    <div>
                      <p className="font-medium text-gray-900">深色模式</p>
                      <p className="text-sm text-gray-500">切换深色/浅色主题</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-blue-500' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-gray-700" />
                    <div>
                      <p className="font-medium text-gray-900">通知</p>
                      <p className="text-sm text-gray-500">接收任务完成和错误通知</p>
                    </div>
                  </div>
                  <button className="w-12 h-6 bg-blue-500 rounded-full">
                    <div className="w-5 h-5 bg-white rounded-full shadow translate-x-6" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-700" />
                    <div>
                      <p className="font-medium text-gray-900">沙箱模式</p>
                      <p className="text-sm text-gray-500">在隔离环境中执行代码</p>
                    </div>
                  </div>
                  <button className="w-12 h-6 bg-blue-500 rounded-full">
                    <div className="w-5 h-5 bg-white rounded-full shadow translate-x-6" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
