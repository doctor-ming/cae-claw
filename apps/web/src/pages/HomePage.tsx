import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Settings,
  Box,
  Play,
  Loader2,
  ChevronDown,
  Moon,
  Sun,
  Terminal,
  FileCode,
  Database,
  Workflow,
  Cpu,
  Layers,
  Zap,
  Brain,
  MessageSquare,
  Wand2,
  Clock,
  ChevronRight,
  Mic,
  Paperclip,
  Smile,
  MoreHorizontal,
  Trash2,
  Copy,
  ThumbsUp,
  RefreshCw,
  Eye
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tools?: ToolCall[];
}

interface ToolCall {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  result?: string;
}

const quickActions = [
  { icon: FileCode, label: '生成脚本', desc: 'ANSA/HyperWorks/Abaqus', color: 'from-violet-500 to-purple-500', prompt: '帮我生成 ANSA 四面体网格脚本' },
  { icon: Database, label: '知识查询', desc: '语义搜索知识库', color: 'from-blue-500 to-cyan-500', prompt: '查询 ANSA 网格质量标准' },
  { icon: Terminal, label: '远程执行', desc: 'SSH 命令操作', color: 'from-green-500 to-emerald-500', prompt: '在远程服务器执行 ls -la' },
  { icon: Workflow, label: '工作流编排', desc: '可视化 DAG 编辑', color: 'from-orange-500 to-amber-500', prompt: '创建一个拓扑优化工作流' },
  { icon: Brain, label: 'CAE 分析', desc: '智能任务执行', color: 'from-pink-500 to-rose-500', prompt: '执行拓扑优化分析' },
  { icon: Zap, label: '快捷命令', desc: '常用操作入口', color: 'from-indigo-500 to-blue-500', prompt: '运行网格生成技能' },
];

export function HomePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好！我是 CAE Claw AI 助手。我可以帮助你完成 ANSA、HyperWorks、Abaqus 等 CAE 软件的自动化操作。\n\n✨ **我的能力：**\n• 生成 CAE 二次开发脚本\n• 执行远程服务器命令\n• 创建和管理工作流\n• 搜索专业知识库\n\n请告诉我你需要什么帮助？',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setShowQuickActions(false);

    setTimeout(() => {
      const responses = [
        '我已经理解了你的需求，正在为你生成相应的脚本和执行方案...',
        '好的，让我分析一下你的请求并制定执行计划...',
        '正在连接远程服务器，准备执行 CAE 分析任务...',
      ];
      const responseContent = responses[Math.floor(Math.random() * responses.length)];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent + '\n\n**执行步骤：**\n1. 连接远程服务器\n2. 加载 CAE 模型\n3. 执行网格划分\n4. 运行求解器\n5. 提取结果',
        timestamp: new Date(),
        tools: [
          { name: 'SSHTool', status: 'completed', result: '已连接' },
          { name: 'CAEScriptTool', status: 'running', result: '生成中' },
          { name: 'SandboxTool', status: 'pending' }
        ]
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Elegant Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-500/30">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">CAE Claw AI</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-xs text-slate-500">在线 · 随时待命</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors group">
            <RefreshCw className="w-5 h-5 text-slate-500 group-hover:text-slate-700" />
          </button>
          <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors group">
            <Moon className="w-5 h-5 text-slate-500 group-hover:text-slate-700" />
          </button>
          <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors group">
            <Settings className="w-5 h-5 text-slate-500 group-hover:text-slate-700" />
          </button>
          <div className="w-px h-8 bg-slate-200 mx-1"></div>
          <button className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all text-sm">
            新建会话
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message, idx) => (
            <div key={message.id} className={`flex gap-5 animate-in ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`flex-shrink-0 ${message.role === 'assistant' ? '' : ''}`}>
                {message.role === 'assistant' ? (
                  <div className="w-11 h-11 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                ) : (
                  <div className="w-11 h-11 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 max-w-3xl ${message.role === 'user' ? 'text-right' : ''}`}>
                <div className={`group inline-block p-5 rounded-2xl ${
                  message.role === 'assistant' 
                    ? 'bg-white border border-slate-200/80 shadow-sm' 
                    : 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20'
                }`}>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>

                {/* Tool Calls */}
                {message.tools && message.tools.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.tools.map((tool, tIdx) => (
                      <div 
                        key={tIdx} 
                        className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 shadow-sm text-xs"
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          tool.status === 'completed' ? 'bg-green-500' :
                          tool.status === 'running' ? 'bg-blue-500 animate-pulse' :
                          tool.status === 'error' ? 'bg-red-500' : 'bg-slate-400'
                        }`} />
                        <span className="font-medium text-slate-700">{tool.name}</span>
                        {tool.status === 'running' && <Loader2 className="w-3 h-3 animate-spin text-blue-500" />}
                        {tool.status === 'completed' && tool.result && (
                          <span className="text-slate-400">→ {tool.result}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className={`mt-2 flex items-center gap-1 ${message.role === 'user' ? 'justify-end' : ''}`}>
                  <span className="text-xs text-slate-400">
                    {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className={`flex items-center gap-1 ${message.role === 'user' ? '' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                    <button className="p-1 hover:bg-slate-100 rounded-lg">
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <button className="p-1 hover:bg-slate-100 rounded-lg">
                      <ThumbsUp className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <button className="p-1 hover:bg-slate-100 rounded-lg">
                      <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-5">
              <div className="w-11 h-11 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="bg-white border border-slate-200/80 rounded-2xl px-5 py-4 shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {showQuickActions && messages.length === 1 && (
            <div className="mt-8 space-y-6">
              {/* Hero Section */}
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 rounded-full text-violet-700 text-sm font-medium mb-4">
                  <Sparkles className="w-4 h-4" />
                  AI驱动的 CAE 自动化平台
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  你好，今天需要什么帮助？
                </h2>
                <p className="text-slate-500 max-w-md mx-auto">
                  智能助手可以帮你完成 ANSA 网格划分、HyperWorks 优化、Abaqus 分析等任务
                </p>
              </div>

              {/* Quick Action Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {quickActions.map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuickAction(action.prompt)}
                      className="group relative p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl`} />
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1">{action.label}</h3>
                      <p className="text-sm text-slate-500">{action.desc}</p>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="w-5 h-5 text-violet-500" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Example Prompts */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-violet-500" />
                  试试这样问
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    '帮我生成 ANSA 四面体网格脚本',
                    '在远程服务器运行模态分析',
                    '创建一个拓扑优化工作流',
                    '查询网格质量检查标准',
                    '导出 Abaqus 结果数据',
                    '批量处理 10 个仿真文件'
                  ].map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickAction(prompt)}
                      className="px-4 py-2 bg-slate-50 hover:bg-violet-50 hover:text-violet-700 rounded-xl text-sm text-slate-600 transition-colors border border-slate-200"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} className="h-20" />
        </div>
      </div>

      {/* Input Area */}
      <div className="px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-200/50 transition-all focus-within:border-violet-300 focus-within:shadow-xl focus-within:shadow-violet-500/10">
            <div className="flex items-end gap-3 p-4">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <Paperclip className="w-5 h-5 text-slate-400" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <Mic className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              <div className="flex-1">
                <textarea
                  ref={inputRef as any}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="输入你的 CAE 任务，Shift + Enter 换行..."
                  rows={1}
                  className="w-full resize-none bg-transparent outline-none text-sm placeholder:text-slate-400 max-h-32"
                  style={{ minHeight: '24px' }}
                />
              </div>

              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-3 bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            <div className="px-4 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">CAE Claw AI 可以帮助生成脚本、执行命令、创建工作流</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">Enter</kbd>
                <span>发送</span>
                <span className="mx-1">·</span>
                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">Shift + Enter</kbd>
                <span>换行</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
