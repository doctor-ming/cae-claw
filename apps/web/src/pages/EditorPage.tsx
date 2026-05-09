import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Play, 
  Save, 
  Plus, 
  Trash2,
  Settings,
  ZoomIn,
  ZoomOut,
  Maximize2,
  GripVertical,
  Box,
  Database,
  Terminal,
  Cpu,
  Layers,
  ChevronRight,
  Download,
  Upload,
  Undo,
  Redo,
  GitBranch,
  FileCode,
  Users
} from 'lucide-react';

const nodeTypes = [
  { type: 'data_io', label: '数据输入', icon: Database, color: '#06B6D4', bgColor: 'from-cyan-400 to-blue-500' },
  { type: 'mesh', label: '网格生成', icon: Box, color: '#3B82F6', bgColor: 'from-blue-400 to-indigo-500' },
  { type: 'bc', label: '边界条件', icon: Settings, color: '#EF4444', bgColor: 'from-red-400 to-orange-500' },
  { type: 'solver', label: '求解器', icon: Cpu, color: '#8B5CF6', bgColor: 'from-violet-400 to-purple-500' },
  { type: 'post', label: '后处理', icon: Layers, color: '#10B981', bgColor: 'from-emerald-400 to-green-500' },
];

const workflowTemplates = [
  { id: 'static', name: '静力学分析', nodes: 8, icon: '📊', color: '#6366F1' },
  { id: 'modal', name: '模态分析', nodes: 5, icon: '📈', color: '#8B5CF6' },
  { id: 'topology', name: '拓扑优化', nodes: 7, icon: '🎯', color: '#F97316' },
];

const defaultNodes = [
  { id: '1', type: 'data_io', label: '导入几何', x: 80, y: 200, inputs: [], outputs: ['2'] },
  { id: '2', type: 'mesh', label: '网格划分', x: 300, y: 200, inputs: ['1'], outputs: ['3'] },
  { id: '3', type: 'bc', label: '边界条件', x: 520, y: 200, inputs: ['2'], outputs: ['4'] },
  { id: '4', type: 'solver', label: '求解', x: 740, y: 200, inputs: ['3'], outputs: ['5'] },
  { id: '5', type: 'post', label: '结果提取', x: 960, y: 200, inputs: ['4'], outputs: [] },
];

export function EditorPage() {
  const [nodes, setNodes] = useState(defaultNodes);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [workflowName, setWorkflowName] = useState('静力学分析工作流');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragNodeRef = useRef<string | null>(null);

  const getNodeConfig = (type: string) => nodeTypes.find(n => n.type === type) || nodeTypes[0];

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if ((e.target as HTMLElement).closest('.node-action')) return;
    isDraggingRef.current = true;
    dragNodeRef.current = nodeId;
    setSelectedNode(nodeId);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current || !dragNodeRef.current) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    setNodes(prev => prev.map(node => {
      if (node.id === dragNodeRef.current) {
        return {
          ...node,
          x: Math.max(0, node.x + e.movementX / zoom),
          y: Math.max(0, node.y + e.movementY / zoom),
        };
      }
      return node;
    }));
  }, [zoom]);

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    dragNodeRef.current = null;
  };

  const addNode = (type: string) => {
    const newId = (Math.max(...nodes.map(n => parseInt(n.id)), 0) + 1).toString();
    setNodes([...nodes, {
      id: newId,
      type,
      label: nodeTypes.find(n => n.type === type)?.label || '新节点',
      x: 400 + Math.random() * 100,
      y: 200 + Math.random() * 50,
      inputs: [],
      outputs: []
    }]);
  };

  return (
    <div className="h-full flex flex-col -m-6 bg-slate-50">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200/60">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
              <GitBranch className="w-5 h-5 text-white" />
            </div>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="text-lg font-semibold bg-transparent border-none outline-none focus:ring-0"
            />
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
            已保存
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all">
              <Undo className="w-4 h-4 text-slate-600" />
            </button>
            <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all">
              <Redo className="w-4 h-4 text-slate-600" />
            </button>
          </div>
          
          <div className="w-px h-6 bg-slate-200 mx-2" />
          
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <button 
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"
            >
              <ZoomOut className="w-4 h-4 text-slate-600" />
            </button>
            <span className="px-3 text-sm text-slate-600 font-medium">{Math.round(zoom * 100)}%</span>
            <button 
              onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"
            >
              <ZoomIn className="w-4 h-4 text-slate-600" />
            </button>
          </div>
          
          <button className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            <span className="text-sm">导出</span>
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Upload className="w-4 h-4" />
            <span className="text-sm">导入</span>
          </button>
          
          <div className="w-px h-6 bg-slate-200 mx-2" />
          
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all text-sm font-medium">
            <Play className="w-4 h-4" />
            运行工作流
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-72 bg-white border-r border-slate-200/60 flex flex-col">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">节点库</h3>
            <div className="space-y-2">
              {nodeTypes.map((node) => {
                const Icon = node.icon;
                return (
                  <button
                    key={node.type}
                    onClick={() => addNode(node.type)}
                    className="w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${node.bgColor} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-slate-900">{node.label}</p>
                      <p className="text-xs text-slate-500">点击添加</p>
                    </div>
                    <Plus className="w-5 h-5 text-slate-400 group-hover:text-violet-500" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Templates */}
          <div className="p-5 flex-1 overflow-y-auto">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">工作流模板</h3>
            <div className="space-y-3">
              {workflowTemplates.map((tmpl) => (
                <button
                  key={tmpl.id}
                  className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-xl hover:border-violet-300 hover:shadow-md transition-all"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${tmpl.color}15` }}
                  >
                    {tmpl.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-slate-900">{tmpl.name}</p>
                    <p className="text-xs text-slate-500">{tmpl.nodes} 个节点</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div 
          ref={canvasRef}
          className="flex-1 relative overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Grid */}
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `
                radial-gradient(circle, #cbd5e1 1px, transparent 1px)
              `,
              backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
              backgroundPosition: `${pan.x}px ${pan.y}px`
            }}
          />

          {/* Nodes */}
          <div 
            className="absolute inset-0"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
          >
            {/* Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
              {nodes.map((node) => 
                node.outputs.map((outputId) => {
                  const target = nodes.find(n => n.id === outputId);
                  if (!target) return null;
                  const sourceConfig = getNodeConfig(node.type);
                  const targetConfig = getNodeConfig(target.type);
                  
                  const startX = node.x + 160;
                  const startY = node.y + 48;
                  const endX = target.x;
                  const endY = target.y + 48;
                  const midX = (startX + endX) / 2;
                  
                  return (
                    <g key={`${node.id}-${outputId}`}>
                      <path
                        d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                        stroke={sourceConfig.color}
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        opacity="0.6"
                      />
                      <circle cx={endX} cy={endY} r="6" fill={targetConfig.color} stroke="white" strokeWidth="2" />
                    </g>
                  );
                })
              )}
            </svg>

            {/* Node Cards */}
            {nodes.map((node) => {
              const config = getNodeConfig(node.type);
              const Icon = config.icon;
              const isSelected = selectedNode === node.id;
              
              return (
                <div
                  key={node.id}
                  className={`absolute w-[160px] bg-white rounded-2xl shadow-lg border-2 cursor-move transition-all ${
                    isSelected ? 'border-violet-500 shadow-xl shadow-violet-500/20 scale-105' : 'border-transparent hover:border-slate-300'
                  }`}
                  style={{ left: node.x, top: node.y }}
                  onMouseDown={(e) => handleMouseDown(e, node.id)}
                >
                  <div className="p-4">
                    <div 
                      className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${config.bgColor} flex items-center justify-center shadow-lg mb-3`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900 text-center">{node.label}</p>
                    <p className="text-xs text-slate-400 text-center mt-1">{config.label}</p>
                  </div>

                  {/* Input/Output */}
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2">
                    {node.inputs.length > 0 && (
                      <div className="w-6 h-6 bg-white rounded-full border-2 shadow flex items-center justify-center" style={{ borderColor: config.color }}>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                      </div>
                    )}
                  </div>
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2">
                    {node.outputs.length > 0 && (
                      <div className="w-6 h-6 bg-white rounded-full border-2 shadow flex items-center justify-center" style={{ borderColor: config.color }}>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                      </div>
                    )}
                  </div>

                  {/* Delete */}
                  <button 
                    className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity shadow-lg"
                    onClick={() => setNodes(nodes.filter(n => n.id !== node.id))}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Add Node FAB */}
          <button 
            className="absolute bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full shadow-xl hover:shadow-2xl hover:shadow-violet-500/30 transition-all flex items-center justify-center"
            onClick={() => addNode('data_io')}
          >
            <Plus className="w-7 h-7" />
          </button>
        </div>

        {/* Right Panel - Properties */}
        <div className="w-80 bg-white border-l border-slate-200/60 p-5 overflow-y-auto">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">属性面板</h3>
          
          {selectedNode ? (
            (() => {
              const node = nodes.find(n => n.id === selectedNode);
              const config = node ? getNodeConfig(node.type) : null;
              if (!node || !config) return null;
              
              return (
                <div className="space-y-5">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${config.color}10 border border-${config.color}20`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.bgColor} flex items-center justify-center shadow-lg`}>
                        <config.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{node.label}</p>
                        <p className="text-sm text-slate-500">{config.label}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-2">节点名称</label>
                    <input
                      type="text"
                      value={node.label}
                      onChange={(e) => setNodes(nodes.map(n => n.id === node.id ? { ...n, label: e.target.value } : n))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-2">节点类型</label>
                    <select
                      value={node.type}
                      onChange={(e) => setNodes(nodes.map(n => n.id === node.id ? { ...n, type: e.target.value, label: nodeTypes.find(t => t.type === e.target.value)?.label || n.label } : n))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    >
                      {nodeTypes.map((t) => (
                        <option key={t.type} value={t.type}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-2">位置</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">X</span>
                        <input
                          type="number"
                          value={Math.round(node.x)}
                          onChange={(e) => setNodes(nodes.map(n => n.id === node.id ? { ...n, x: parseInt(e.target.value) || 0 } : n))}
                          className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">Y</span>
                        <input
                          type="number"
                          value={Math.round(node.y)}
                          onChange={(e) => setNodes(nodes.map(n => n.id === node.id ? { ...n, y: parseInt(e.target.value) || 0 } : n))}
                          className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors text-sm font-medium">
                      <Trash2 className="w-4 h-4" />
                      删除节点
                    </button>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
                <GitBranch className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-sm text-slate-500">选择节点查看属性</p>
              <p className="text-xs text-slate-400 mt-1">点击画布上的节点</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
