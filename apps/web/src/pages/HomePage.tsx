import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Settings,
  Plus,
  Loader2,
  Moon,
  Sun,
  RefreshCw,
  Mic,
  Paperclip,
  Copy,
  Trash2,
  MessageSquare,
  Workflow,
  Database,
  Terminal,
  FileCode,
  Brain,
  Zap,
  Home,
  BookOpen,
  GitBranch,
  ChevronLeft,
  ChevronRight,
  Clock,
  Star,
  MoreHorizontal
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

const navItems = [
  { icon: Home, label: '首页', path: '/' },
  { icon: MessageSquare, label: '对话', path: '/chat' },
  { icon: BookOpen, label: '技能市场', path: '/skills' },
  { icon: GitBranch, label: '编排器', path: '/editor' },
  { icon: Settings, label: '设置', path: '/settings' },
];

const recentChats = [
  { id: '1', title: '静力学分析工作流', time: '10分钟前' },
  { id: '2', title: 'ANSA 网格生成脚本', time: '1小时前' },
  { id: '3', title: '远程服务器连接配置', time: '2小时前' },
  { id: '4', title: '拓扑优化分析', time: '昨天' },
];

export function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

    setTimeout(() => {
      const responseContent = '我已经理解了你的需求，正在处理中...';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        tools: [
          { name: 'CAEScriptTool', status: 'completed', result: '完成' },
        ]
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className={`flex flex-col bg-white border-r border-slate-200/60 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-100">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30 flex-shrink-0">
            <Bot className="w-6 h-6 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent truncate">CAE Claw</h1>
              <p className="text-xs text-slate-500">AI Assistant</p>
            </div>
          )}
        </div>

        {/* New Chat Button */}
        <div className="px-3 py-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all">
            <Plus className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>新建对话</span>}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 overflow-y-auto">
          {!sidebarCollapsed && (
            <div className="mb-4">
              <p className="px-4 text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">导航</p>
            </div>
          )}
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.path === '/';
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-violet-50 text-violet-700' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              );
            })}
          </div>

          {/* Recent Chats */}
          {!sidebarCollapsed && (
            <div className="mt-6">
              <div className="flex items-center justify-between px-4 mb-2">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">最近对话</p>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1">
                {recentChats.map((chat) => (
                  <button
                    key={chat.id}
                    className="w-full flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors text-left"
                  >
                    <MessageSquare className="w-4 h-4 flex-shrink-0 text-slate-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{chat.title}</p>
                      <p className="text-xs text-slate-400">{chat.time}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto px-3 py-4 border-t border-slate-100 flex items-center justify-center gap-2">
          <button className="flex-1 flex items-center justify-center p-2.5 hover:bg-slate-100 rounded-xl transition-colors">
            <Settings className="w-5 h-5 text-slate-500" />
          </button>
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex-1 flex items-center justify-center p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5 text-slate-500" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-slate-500" />
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                  message.role === 'assistant' 
                    ? 'bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20' 
                    : 'bg-gradient-to-br from-slate-700 to-slate-900 shadow-lg'
                }`}>
                  {message.role === 'assistant' ? (
                    <Bot className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>

                <div className={`flex-1 max-w-2xl ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block p-4 rounded-2xl ${
                    message.role === 'assistant' 
                      ? 'bg-white border border-slate-200/80 shadow-sm' 
                      : 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {message.tools && message.tools.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.tools.map((tool, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 shadow-sm text-xs">
                          <div className={`w-2 h-2 rounded-full ${
                            tool.status === 'completed' ? 'bg-green-500' :
                            tool.status === 'running' ? 'bg-blue-500 animate-pulse' : 'bg-slate-400'
                          }`} />
                          <span className="font-medium text-slate-700">{tool.name}</span>
                          {tool.result && <span className="text-slate-400">→ {tool.result}</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className={`mt-1 flex items-center gap-2 ${message.role === 'user' ? 'justify-end' : ''}`}>
                    <span className="text-xs text-slate-400">
                      {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <Bot className="w-5 h-5 text-white" />
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

            {/* Empty State */}
            {messages.length === 0 && !isTyping && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                  <Bot className="w-10 h-10 text-violet-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">你好，我是 CAE Claw</h2>
                <p className="text-slate-500 max-w-md mb-8">
                  AI 驱动的 CAE 自动化助手，可以帮你完成 ANSA 网格划分、HyperWorks 优化、Abaqus 分析等任务
                </p>
                <div className="flex flex-wrap justify-center gap-3 max-w-lg">
                  {[
                    { icon: FileCode, label: '生成脚本' },
                    { icon: Database, label: '知识查询' },
                    { icon: Terminal, label: '远程执行' },
                    { icon: Workflow, label: '工作流编排' },
                    { icon: Brain, label: 'CAE 分析' },
                    { icon: Zap, label: '快捷命令' },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(`帮我${item.label}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:border-violet-300 hover:shadow-md transition-all text-sm"
                    >
                      <item.icon className="w-4 h-4 text-violet-600" />
                      <span className="text-slate-700">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="px-8 pb-8">
          <div className="max-w-3xl mx-auto">
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
                    placeholder="输入你的 CAE 任务..."
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
            </div>
            <p className="text-xs text-slate-400 text-center mt-3">
              CAE Claw AI 可以帮助生成脚本、执行命令、创建工作流
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
