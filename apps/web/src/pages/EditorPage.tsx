import React, { useState } from 'react';
import { 
  Box, 
  Play, 
  Save,
  Plus,
  Trash2,
  GripVertical,
  Settings,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import clsx from 'clsx';

interface WorkflowNode {
  id: string;
  name: string;
  icon: string;
  color: string;
  x: number;
  y: number;
}

const AVAILABLE_NODES = [
  { id: 'import_geometry', name: '导入几何', icon: '📥', color: '#10B981' },
  { id: 'generate_mesh', name: '生成网格', icon: '🔲', color: '#3B82F6' },
  { id: 'check_quality', name: '质量检查', icon: '✅', color: '#8B5CF6' },
  { id: 'apply_load', name: '施加载荷', icon: '⚡', color: '#F59E0B' },
  { id: 'apply_constraint', name: '施加约束', icon: '🔒', color: '#EF4444' },
  { id: 'run_solver', name: '运行求解', icon: '🚀', color: '#EC4899' },
  { id: 'extract_results', name: '提取结果', icon: '📊', color: '#06B6D4' },
  { id: 'generate_report', name: '生成报告', icon: '📄', color: '#84CC16' },
];

const INITIAL_WORKFLOW: WorkflowNode[] = [
  { id: '1', name: '导入几何', icon: '📥', color: '#10B981', x: 50, y: 150 },
  { id: '2', name: '生成网格', icon: '🔲', color: '#3B82F6', x: 250, y: 150 },
  { id: '3', name: '质量检查', icon: '✅', color: '#8B5CF6', x: 450, y: 150 },
  { id: '4', name: '运行求解', icon: '🚀', color: '#EC4899', x: 650, y: 150 },
  { id: '5', name: '提取结果', icon: '📊', color: '#06B6D4', x: 850, y: 150 },
];

export function EditorPage() {
  const [nodes, setNodes] = useState<WorkflowNode[]>(INITIAL_WORKFLOW);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [workflowName, setWorkflowName] = useState('未命名工作流');
  const [zoom, setZoom] = useState(100);

  const addNode = (nodeTemplate: typeof AVAILABLE_NODES[0]) => {
    const newNode: WorkflowNode = {
      ...nodeTemplate,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
    };
    setNodes([...nodes, newNode]);
  };

  const deleteNode = (nodeId: string) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    if (selectedNode === nodeId) {
      setSelectedNode(null);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="text-xl font-semibold bg-transparent border-b-2 border-transparent hover:border-gray-200 focus:border-blue-500 outline-none"
          />
          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
            📋 编排技能
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Save className="w-5 h-5 text-gray-500" />
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors">
            <Play className="w-5 h-5" />
            运行
          </button>
        </div>
      </div>

      {/* Main editor area */}
      <div className="flex-1 flex bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Node palette */}
        <div className="w-64 border-r border-gray-200 p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">可用节点</h3>
          <div className="space-y-2">
            {AVAILABLE_NODES.map((nodeTemplate) => (
              <div
                key={nodeTemplate.id}
                onClick={() => addNode(nodeTemplate)}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${nodeTemplate.color}20` }}
                >
                  {nodeTemplate.icon}
                </div>
                <span className="text-sm font-medium text-gray-700">{nodeTemplate.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden bg-gray-50">
          {/* Canvas controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-2 z-10">
            <button 
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600 w-12 text-center">{zoom}%</span>
            <button 
              onClick={() => setZoom(Math.min(200, zoom + 10))}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-gray-200 mx-1" />
            <button className="p-1 hover:bg-gray-100 rounded">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Nodes */}
          <div 
            className="absolute inset-0"
            style={{ 
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'center center'
            }}
          >
            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {nodes.slice(0, -1).map((node, idx) => {
                const nextNode = nodes[idx + 1];
                return (
                  <line
                    key={`${node.id}-${nextNode.id}`}
                    x1={node.x + 60}
                    y1={node.y + 40}
                    x2={nextNode.x}
                    y2={nextNode.y + 40}
                    stroke="#CBD5E1"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                );
              })}
            </svg>

            {/* Node items */}
            {nodes.map((node) => (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                className={clsx(
                  'absolute w-28 cursor-move group',
                  selectedNode === node.id && 'ring-2 ring-blue-500 ring-offset-2 rounded-xl'
                )}
                style={{ left: node.x, top: node.y }}
              >
                <div 
                  className="w-full h-20 rounded-xl border-2 flex flex-col items-center justify-center"
                  style={{ borderColor: node.color, backgroundColor: `${node.color}10` }}
                >
                  <GripVertical className="absolute top-1 left-1 w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 cursor-grab" />
                  <span className="text-2xl">{node.icon}</span>
                  <span className="text-xs font-medium text-gray-700 mt-1">{node.name}</span>
                </div>
                {selectedNode === node.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNode(node.id);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Properties panel */}
        {selectedNode && (
          <div className="w-72 border-l border-gray-200 p-4 overflow-y-auto">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">节点属性</h3>
            {(() => {
              const node = nodes.find(n => n.id === selectedNode);
              if (!node) return null;
              return (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">名称</label>
                    <input
                      type="text"
                      value={node.name}
                      onChange={(e) => {
                        setNodes(nodes.map(n => 
                          n.id === selectedNode ? { ...n, name: e.target.value } : n
                        ));
                      }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">图标</label>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl border border-gray-200">
                      {node.icon}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">颜色</label>
                    <input
                      type="color"
                      value={node.color}
                      onChange={(e) => {
                        setNodes(nodes.map(n => 
                          n.id === selectedNode ? { ...n, color: e.target.value } : n
                        ));
                      }}
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={() => deleteNode(selectedNode)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      删除节点
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
