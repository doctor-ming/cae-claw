import React, { useState } from 'react';
import { 
  Settings as SettingsIcon,
  User,
  Key,
  Database,
  Bell,
  Shield,
  Monitor,
  ChevronRight,
  Check
} from 'lucide-react';
import clsx from 'clsx';

const SETTINGS_TABS = [
  { id: 'general', label: '通用', icon: SettingsIcon },
  { id: 'account', label: '账户', icon: User },
  { id: 'api', label: 'API 密钥', icon: Key },
  { id: 'cae', label: 'CAE 软件', icon: Monitor },
  { id: 'notifications', label: '通知', icon: Bell },
  { id: 'security', label: '安全', icon: Shield },
];

const LLM_PROVIDERS = [
  { id: 'openai', name: 'OpenAI', models: ['GPT-4o', 'GPT-4o-mini', 'GPT-4'] },
  { id: 'anthropic', name: 'Anthropic', models: ['Claude 3.5 Sonnet', 'Claude 3 Haiku'] },
  { id: 'deepseek', name: 'DeepSeek', models: ['DeepSeek V2', 'DeepSeek Coder'] },
  { id: 'ollama', name: 'Ollama (本地)', models: ['Llama 3', 'Qwen 2', 'Mistral'] },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    language: 'zh-CN',
    theme: 'light',
    autoSave: true,
    telemetry: true,
   ansaPath: '/usr/local/ansa',
    ansaPort: 9988,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">设置</h1>
        <p className="text-gray-500 mt-1">管理应用程序和账户设置</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 space-y-1">
          {SETTINGS_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">通用设置</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">语言</div>
                    <div className="text-sm text-gray-500">选择界面显示语言</div>
                  </div>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    className="px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="zh-CN">简体中文</option>
                    <option value="en-US">English</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">主题</div>
                    <div className="text-sm text-gray-500">选择界面主题</div>
                  </div>
                  <div className="flex gap-2">
                    {['light', 'dark', 'auto'].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => setSettings({ ...settings, theme })}
                        className={clsx(
                          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                          settings.theme === theme
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        )}
                      >
                        {theme === 'light' && '浅色'}
                        {theme === 'dark' && '深色'}
                        {theme === 'auto' && '自动'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">自动保存</div>
                    <div className="text-sm text-gray-500">自动保存工作流和配置</div>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, autoSave: !settings.autoSave })}
                    className={clsx(
                      'w-12 h-6 rounded-full transition-colors relative',
                      settings.autoSave ? 'bg-blue-600' : 'bg-gray-300'
                    )}
                  >
                    <div className={clsx(
                      'w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform',
                      settings.autoSave ? 'translate-x-6' : 'translate-x-0.5'
                    )} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">匿名使用统计</div>
                    <div className="text-sm text-gray-500">帮助改进 CAE Claw</div>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, telemetry: !settings.telemetry })}
                    className={clsx(
                      'w-12 h-6 rounded-full transition-colors relative',
                      settings.telemetry ? 'bg-blue-600' : 'bg-gray-300'
                    )}
                  >
                    <div className={clsx(
                      'w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform',
                      settings.telemetry ? 'translate-x-6' : 'translate-x-0.5'
                    )} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cae' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">CAE 软件配置</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ANSA 安装路径
                  </label>
                  <input
                    type="text"
                    value={settings.ansaPath}
                    onChange={(e) => setSettings({ ...settings, ansaPath: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="/usr/local/ansa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    监听端口
                  </label>
                  <input
                    type="number"
                    value={settings.ansaPort}
                    onChange={(e) => setSettings({ ...settings, ansaPort: parseInt(e.target.value) })}
                    className="w-32 px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>

                <div className="pt-4">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
                    测试连接
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">API 密钥</h2>
              <p className="text-sm text-gray-500">
                配置大语言模型 API 密钥以启用 AI 功能
              </p>
              
              <div className="space-y-4">
                {LLM_PROVIDERS.map((provider) => (
                  <div key={provider.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-900">{provider.name}</span>
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        已配置
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mb-3">
                      可用模型: {provider.models.join(', ')}
                    </div>
                    <input
                      type="password"
                      placeholder="输入 API 密钥..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">账户信息</h2>
              <div className="text-sm text-gray-500">
                账户管理功能开发中...
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">通知设置</h2>
              <div className="text-sm text-gray-500">
                通知功能开发中...
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">安全设置</h2>
              <div className="text-sm text-gray-500">
                安全功能开发中...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
