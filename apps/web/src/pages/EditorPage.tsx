import React, { useState } from 'react';
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
  ChevronDown,
  Circle
} from 'lucide-react';

const nodeTypes = [
  { type: 'data_io', label: '数据输入', icon: Database, color: '#06B6D4' },
  { type: 'mesh', label: '网格生成', icon: Box, color: '#3B82F6' },
  { type: 'bc', label: '边界条件', icon: Settings, color: '#EF4444' },
  { type: 'solver', label: '求解器', icon: Cpu, color: '#8B5CF6' },
  { type: 'post', label: '后处理', icon: Layers, color: '#10B981' },
];

const defaultNodes = [
  { id: '1', type: 'data_io', label: '导入几何', x: 100, y: 200, inputs: [], outputs: ['2'] },
  { id: '2', type: 'mesh', label: '网格划分', x: 300, y: 200, inputs: ['1'], outputs: ['3'] },
  { id: '3', type: 'bc', label: '边界条件', x: 500, y: 200, inputs: ['2'], outputs: ['4'] },
  { id: '4', type: 'solver', label: '求解', x: 700, y: 200, inputs: ['3'], outputs: ['5'] },
  { id: '5', type: 'post', label: '结果提取', x: 900, y: 200, inputs: ['4'], outputs: [] },
];

export function EditorPage() {
  const [nodes, setNodes] = useState(defaultNodes);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [workflowName, setWorkflowName] = useState('静力学分析工作流');
  const [zoom, setZoom] = useState(1);

  const getNodeConfig = (type: string) => nodeTypes.find(n => n.type === type) || nodeTypes[0];

  return (
    <div className="h-full flex flex-col -m-6">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="text-lg font-semibold bg-transparent border-none outline-none focus:ring-0"
          />
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            已保存
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-500 min-w-[50px] text-center">{Math.round(zoom * 100)}%</span>
          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-200 mx-2" />
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Save className="w-4 h-4" />
            保存
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all">
            <Play className="w-4 h-4" />
            运行
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Node Library */}
        <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">节点库</h3>
          <div className="space-y-2">
            {nodeTypes.map((node) => {
              const Icon = node.icon;
              return (
                <div
                  key={node.type}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-grab hover:bg-gray-100 transition-colors"
                  draggable
                >
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${node.color}20` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: node.color }} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{node.label}</span>
                </div>
              );
            })}
          </div>

          <h3 className="text-sm font-semibold text-gray-700 mb-4 mt-6">工作流模板</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-colors text-left">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                📋
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">静力学分析</p>
                <p className="text-xs text-gray-500">8 步</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-colors text-left">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                📊
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">模态分析</p>
                <p className="text-xs text-gray-500">5 步</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-colors text-left">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                🎯
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">拓扑优化</p>
                <p className="text-xs text-gray-500">7 步</p>
              </div>
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-50 relative overflow-hidden">
          {/* Grid Background */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />
          
          {/* Nodes */}
          <div className="absolute inset-0" style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {nodes.map((node) => 
                node.outputs.map((outputId) => {
                  const targetNode = nodes.find(n => n.id === outputId);
                  if (!targetNode) return null;
                  const sourceConfig = getNodeConfig(node.type);
                  const targetConfig = getNodeConfig(targetNode.type);
                  return (
                    <path
                      key={`${node.id}-${outputId}`}
                      d={`M ${node.x + 140} ${node.y + 40} C ${node.x + 200} ${node.y + 40}, ${targetNode.x - 60} ${targetNode.y + 40}, ${targetNode.x} ${targetNode.y + 40}`}
                      stroke={sourceConfig.color}
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      opacity="0.5"
                    />
                  );
                })
              )}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => {
              const config = getNodeConfig(node.type);
              const Icon = config.icon;
              const isSelected = selectedNode === node.id;
              
              return (
                <div
                  key={node.id}
                  className={`absolute w-[140px] bg-white rounded-2xl shadow-lg border-2 transition-all cursor-pointer ${
                    isSelected ? 'border-blue-500 shadow-xl shadow-blue-500/25' : 'border-transparent hover:border-gray-300'
                  }`}
                  style={{ left: node.x, top: node.y }}
                  onClick={() => setSelectedNode(node.id)}
                >
                  <div className="p-4">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 mx-auto"
                      style={{ backgroundColor: `${config.color}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: config.color }} />
                    </div>
                    <p className="text-sm font-medium text-gray-900 text-center">{node.label}</p>
                  </div>
                  
                  {/* Input/Output indicators */}
                  {node.inputs.length > 0 && (
                    <div 
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-4 h-4 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: config.color }}
                    />
                  )}
                  {node.outputs.length > 0 && (
                    <div 
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-4 h-4 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: config.color }}
                    />
                  )}

                  {/* Delete button */}
                  <button 
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNodes(nodes.filter(n => n.id !== node.id));
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Add Node Button */}
          <button 
            className="absolute bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center"
            onClick={() => {
              const newId = (Math.max(...nodes.map(n => parseInt(n.id))) + 1).toString();
              setNodes([...nodes, {
                id: newId,
                type: 'data_io',
                label: '新节点',
                x: 400,
                y: 200 + nodes.length * 20,
                inputs: [],
                outputs: []
              }]);
            }}
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-72 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">属性</h3>
          
          {selectedNode ? (
            <div className="space-y-4">
              {(() => {
                const node = nodes.find(n => n.id === selectedNode);
                const config = node ? getNodeConfig(node.type) : null;
                if (!node || !config) return null;
                
                return (
                  <>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${config.color}15` }}
                        >
                          <config.icon className="w-5 h-5" style={{ color: config.color }} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{node.label}</p>
                          <p className="text-xs text-gray-500">{config.label}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">节点名称</label>
                      <input
                        type="text"
                        value={node.label}
                        onChange={(e) => setNodes(nodes.map(n => n.id === node.id ? { ...n, label: e.target.value } : n))}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">节点类型</label>
                      <select
                        value={node.type}
                        onChange={(e) => setNodes(nodes.map(n => n.id === node.id ? { ...n, type: e.target.value } : n))}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        {nodeTypes.map((t) => (
                          <option key={t.type} value={t.type}>{t.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">位置</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-xs text-gray-400">X</span>
                          <input
                            type="number"
                            value={node.x}
                            onChange={(e) => setNodes(nodes.map(n => n.id === node.id ? { ...n, x: parseInt(e.target.value) } : n))}
                            className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <span className="text-xs text-gray-400">Y</span>
                          <input
                            type="number"
                            value={node.y}
                            onChange={(e) => setNodes(nodes.map(n => n.id === node.id ? { ...n, y: parseInt(e.target.value) } : n))}
                            className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                        <Trash2 className="w-4 h-4" />
                        删除节点
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Box className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">选择节点查看属性</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
