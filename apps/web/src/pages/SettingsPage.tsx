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
  AlertCircle,
  ChevronRight,
  Zap,
  Server,
  Brain,
  Code2,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';

const tabs = [
  { id: 'model', label: 'AI 模型', icon: Brain, description: '配置语言模型' },
  { id: 'connection', label: '连接管理', icon: Server, description: '服务器和远程连接' },
  { id: 'knowledge', label: '知识库', icon: Database, description: '知识库配置' },
  { id: 'hooks', label: 'Hook 配置', icon: Zap, description: '事件钩子' },
  { id: 'general', label: '通用设置', icon: Settings, description: '应用偏好' },
];

const llmProviders = [
  { id: 'openai', name: 'OpenAI', models: ['gpt-4o', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'], logo: '🤖' },
  { id: 'anthropic', name: 'Anthropic Claude', models: ['claude-3-5-sonnet', 'claude-3-opus', 'claude-3-sonnet'], logo: '🧠' },
  { id: 'deepseek', name: 'DeepSeek', models: ['deepseek-chat', 'deepseek-coder'], logo: '🔮' },
  { id: 'ollama', name: 'Ollama (本地)', models: ['llama3', 'codellama', 'mistral'], logo: '🏠' },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('model');
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [connections, setConnections] = useState([
    { id: '1', name: 'ANSA Server', host: '192.168.1.100', port: 9988, status: 'connected', type: 'ansa' },
    { id: '2', name: 'HPC Cluster', host: 'hpc.example.com', port: 22, status: 'disconnected', type: 'ssh' },
  ]);
  const [darkMode, setDarkMode] = useState(false);

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult('success');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <h1 className="text-3xl font-bold text-slate-900">设置</h1>
          <p className="text-slate-500 mt-2">配置 CAE Claw 的各项功能和参数</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex gap-8">
          {/* Tabs */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div>
                      <span className="font-medium block">{tab.label}</span>
                      {activeTab !== tab.id && (
                        <span className="text-xs opacity-60">{tab.description}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {activeTab === 'model' && (
              <div className="p-8">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">AI 模型配置</h2>
                  <p className="text-slate-500">选择 AI 提供商并配置 API 密钥</p>
                </div>

                {/* Provider Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-slate-700 mb-4">选择 AI 提供商</label>
                  <div className="grid grid-cols-2 gap-4">
                    {llmProviders.map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => setSelectedProvider(provider.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          selectedProvider === provider.id
                            ? 'border-violet-500 bg-violet-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{provider.logo}</span>
                          {selectedProvider === provider.id && (
                            <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        <p className="font-semibold text-slate-900">{provider.name}</p>
                        <p className="text-xs text-slate-500 mt-1">{provider.models.length} 个模型</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Model Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-slate-700 mb-2">选择模型</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500">
                    {llmProviders.find(p => p.id === selectedProvider)?.models.map((model) => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>

                {/* API Key */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-slate-700 mb-2">API 密钥</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-..."
                      className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Test */}
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleTestConnection}
                    disabled={isTesting || !apiKey}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                  >
                    {isTesting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <TestTube className="w-5 h-5" />
                    )}
                    测试连接
                  </button>
                  {testResult === 'success' && (
                    <span className="flex items-center gap-2 text-green-600 text-sm">
                      <Check className="w-4 h-4" />
                      连接成功
                    </span>
                  )}
                  {testResult === 'error' && (
                    <span className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      连接失败
                    </span>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'connection' && (
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 mb-2">连接管理</h2>
                    <p className="text-slate-500">管理 ANSA 服务器和远程连接</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all text-sm font-medium">
                    <Plus className="w-4 h-4" />
                    添加连接
                  </button>
                </div>

                <div className="space-y-4">
                  {connections.map((conn) => (
                    <div key={conn.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${conn.status === 'connected' ? 'bg-green-500' : 'bg-slate-400'}`} />
                        <div>
                          <p className="font-semibold text-slate-900">{conn.name}</p>
                          <p className="text-sm text-slate-500">{conn.host}:{conn.port}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          conn.status === 'connected' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          {conn.status === 'connected' ? '已连接' : '未连接'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-500 hover:bg-white rounded-lg transition-colors">
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
              <div className="p-8">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">知识库配置</h2>
                  <p className="text-slate-500">配置 CAE 知识库的索引和检索设置</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <p className="text-3xl font-bold text-slate-900">156</p>
                    <p className="text-sm text-slate-600 mt-1">文档数量</p>
                  </div>
                  <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <p className="text-3xl font-bold text-slate-900">2,340</p>
                    <p className="text-sm text-slate-600 mt-1">索引条目</p>
                  </div>
                  <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                    <p className="text-3xl font-bold text-slate-900">99.2%</p>
                    <p className="text-sm text-slate-600 mt-1">检索准确率</p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">检索模式</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500">
                    <option>混合搜索 (语义 + 关键词)</option>
                    <option>语义搜索 (向量数据库)</option>
                    <option>关键词搜索</option>
                  </select>
                </div>

                <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all text-sm font-medium">
                  <Database className="w-4 h-4" />
                  重新索引知识库
                </button>
              </div>
            )}

            {activeTab === 'hooks' && (
              <div className="p-8">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">Hook 配置</h2>
                  <p className="text-slate-500">配置事件钩子以扩展系统功能</p>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'on_tool_call', desc: '工具调用时执行', enabled: true, icon: Terminal },
                    { name: 'on_skill_execute', desc: 'Skill 执行时执行', enabled: true, icon: Zap },
                    { name: 'on_error', desc: '发生错误时执行', enabled: true, icon: AlertCircle },
                    { name: 'on_workflow_complete', desc: '工作流完成时执行', enabled: false, icon: Check },
                    { name: 'on_knowledge_search', desc: '知识库搜索时执行', enabled: false, icon: Database },
                  ].map((hook) => {
                    const Icon = hook.icon;
                    return (
                      <div key={hook.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${hook.enabled ? 'bg-violet-100' : 'bg-slate-200'}`}>
                            <Icon className={`w-5 h-5 ${hook.enabled ? 'text-violet-600' : 'text-slate-400'}`} />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{hook.name}</p>
                            <p className="text-sm text-slate-500">{hook.desc}</p>
                          </div>
                        </div>
                        <button className={`w-12 h-6 rounded-full transition-colors ${hook.enabled ? 'bg-violet-500' : 'bg-slate-300'}`}>
                          <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${hook.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'general' && (
              <div className="p-8">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">通用设置</h2>
                  <p className="text-slate-500">配置应用程序的通用选项</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-5 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      {darkMode ? <Moon className="w-6 h-6 text-slate-700" /> : <Sun className="w-6 h-6 text-slate-700" />}
                      <div>
                        <p className="font-medium text-slate-900">深色模式</p>
                        <p className="text-sm text-slate-500">切换深色/浅色主题</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`w-14 h-7 rounded-full transition-colors relative ${darkMode ? 'bg-violet-500' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-5 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <Bell className="w-6 h-6 text-slate-700" />
                      <div>
                        <p className="font-medium text-slate-900">通知</p>
                        <p className="text-sm text-slate-500">接收任务完成和错误通知</p>
                      </div>
                    </div>
                    <button className="w-14 h-7 bg-violet-500 rounded-full relative">
                      <div className="absolute top-1 w-5 h-5 bg-white rounded-full shadow translate-x-7" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-5 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <Shield className="w-6 h-6 text-slate-700" />
                      <div>
                        <p className="font-medium text-slate-900">沙箱模式</p>
                        <p className="text-sm text-slate-500">在隔离环境中执行代码</p>
                      </div>
                    </div>
                    <button className="w-14 h-7 bg-violet-500 rounded-full relative">
                      <div className="absolute top-1 w-5 h-5 bg-white rounded-full shadow translate-x-7" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
