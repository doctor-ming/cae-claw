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
  Layers
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
  { icon: FileCode, label: '生成脚本', prompt: '帮我生成一个 ANSA 网格划分脚本' },
  { icon: Database, label: '知识查询', prompt: '查询 ANSA 网格质量标准' },
  { icon: Terminal, label: '远程执行', prompt: '在远程服务器执行 ls -la' },
  { icon: Workflow, label: '创建工作流', prompt: '创建一个静力学分析工作流' },
  { icon: Box, label: '运行 Skill', prompt: '运行网格生成技能' },
  { icon: Cpu, label: 'CAE 分析', prompt: '执行拓扑优化分析' },
];

const agentCapabilities = [
  { icon: Sparkles, label: '智能对话', desc: '自然语言理解 CAE 任务' },
  { icon: FileCode, label: '脚本生成', desc: 'ANSA/HyperWorks/Abaqus 脚本' },
  { icon: Terminal, label: '远程执行', desc: 'SSH 命令与文件传输' },
  { icon: Layers, label: '工作流编排', desc: '可视化 DAG 编辑器' },
  { icon: Database, label: '知识检索', desc: 'CAE 领域知识库' },
  { icon: Cpu, label: '沙箱执行', desc: '隔离环境安全运行' },
];

export function HomePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好！我是 CAE Claw AI 助手。我可以帮助你：\n\n• 生成 ANSA、HyperWorks、Abaqus 脚本\n• 执行远程服务器命令\n• 创建和管理 CAE 工作流\n• 搜索知识库获取帮助\n\n请告诉我你需要什么帮助？',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        '我已经理解了你的需求，正在为你生成相应的脚本...',
        '好的，让我分析一下你的请求并执行相应操作...',
        '正在连接远程服务器，准备执行命令...',
      ];
      const responseContent = responses[Math.floor(Math.random() * responses.length)];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        tools: [
          { name: 'CAEScriptTool', status: 'completed', result: '脚本生成完成' },
          { name: 'SSHTool', status: 'pending' }
        ]
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">CAE Claw AI</h1>
            <p className="text-xs text-gray-500">智能 CAE 助手</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Moon className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
              message.role === 'assistant' 
                ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25' 
                : 'bg-gray-900'
            }`}>
              {message.role === 'assistant' ? (
                <Bot className="w-5 h-5 text-white" />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
            <div className={`flex-1 max-w-3xl ${message.role === 'user' ? 'text-right' : ''}`}>
              <div className={`inline-block p-4 rounded-2xl ${
                message.role === 'assistant' 
                  ? 'bg-white border border-gray-200 shadow-sm' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
              }`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
              </div>
              
              {/* Tool Calls */}
              {message.tools && message.tools.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.tools.map((tool, idx) => (
                    <div key={idx} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-xs">
                      <div className={`w-2 h-2 rounded-full ${
                        tool.status === 'completed' ? 'bg-green-500' :
                        tool.status === 'running' ? 'bg-blue-500 animate-pulse' :
                        tool.status === 'error' ? 'bg-red-500' : 'bg-gray-400'
                      }`} />
                      <span className="font-medium text-gray-700">{tool.name}</span>
                      {tool.status === 'running' && <Loader2 className="w-3 h-3 animate-spin text-blue-500" />}
                      {tool.status === 'completed' && tool.result && (
                        <span className="text-gray-500">→ {tool.result}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-1 text-xs text-gray-400">
                {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {showQuickActions && messages.length === 1 && (
          <div className="mt-8">
            <p className="text-sm text-gray-500 mb-4 text-center">快捷操作</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAction(action.prompt)}
                  className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
                    <action.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">{action.label}</span>
                </button>
              ))}
            </div>

            {/* Capabilities */}
            <div className="mt-8">
              <p className="text-sm text-gray-500 mb-4 text-center">核心能力</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {agentCapabilities.map((cap, idx) => (
                  <div key={idx} className="p-4 bg-white border border-gray-200 rounded-xl text-center">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center mb-3">
                      <cap.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">{cap.label}</h3>
                    <p className="text-xs text-gray-500 mt-1">{cap.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="输入你的 CAE 任务..."
              className="w-full px-4 py-3 pr-12 bg-gray-100 rounded-xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all text-sm"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600">
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            发送
          </button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-3">
          CAE Claw AI 可以帮助生成脚本、执行命令、创建工作流
        </p>
      </div>
    </div>
  );
}
