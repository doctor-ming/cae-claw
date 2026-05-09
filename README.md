# CAE Claw

AI Agent Platform for CAE Software (ANSA, HyperWorks, Abaqus, etc.)

基于大语言模型的 CAE 智能助手平台，支持 ANSA、HyperWorks、Abaqus 等主流 CAE 软件的自动化操作和脚本生成。

## 核心特性

| 特性 | 说明 |
|-----|------|
| 🤖 **AI Agent 引擎** | 基于 LangGraph 的智能任务规划与执行 |
| 📦 **统一 Skill 系统** | 原子技能与复合工作流的统一管理 |
| 🔧 **CAE 集成** | 无缝集成 ANSA、HyperWorks、Abaqus |
| 💻 **脚本生成** | 基于知识库的智能 Python 脚本生成 |
| 🛡️ **沙箱执行** | 隔离环境下的安全代码执行 |
| 📚 **知识库** | CAE 领域知识管理与语义搜索 |
| 🔌 **Hook 系统** | 事件驱动的扩展机制 |
| 🧠 **记忆管理** | 多层次记忆系统（情景/语义/工作记忆） |
| 💾 **会话存储** | 持久化会话管理与历史记录 |

## 技术栈

| 层级 | 技术 |
|-----|------|
| Agent 框架 | LangGraph + LangChain |
| 前端 | React 19 + TypeScript + Tailwind CSS |
| 桌面端 | Electron + electron-vite |
| 网关 | Express + WebSocket |
| 数据库 | SQLite (本地) / PostgreSQL (云端) |
| LLM 支持 | OpenAI, Claude, Gemini, DeepSeek, Ollama |

## 项目结构

```
cae-claw/
├── apps/
│   └── web/                    # React Web UI
├── packages/
│   ├── core/                   # 核心模块
│   │   └── src/
│   │       ├── skill.ts         # Skill 定义
│   │       ├── sandbox.ts       # 沙箱系统
│   │       ├── knowledge.ts     # 知识库
│   │       ├── hook.ts          # Hook 系统
│   │       ├── session.ts       # 会话存储
│   │       └── memory.ts        # 记忆管理
│   ├── agent/                   # Agent 引擎
│   │   └── src/
│   │       └── engine.ts        # LangGraph 引擎
│   ├── skills/                  # Skill 管理
│   │   └── src/
│   │       ├── registry.ts      # Skill 注册表
│   │       └── defaults.ts      # 默认 Skills
│   ├── tools/                   # 工具集
│   │   └── src/
│   │       ├── registry.ts      # 工具注册表
│   │       ├── script.ts        # 脚本工具
│   │       └── cae_script.ts    # CAE 脚本生成
│   └── gateway/                 # API 网关
│       └── src/
│           └── index.ts         # Express + WebSocket
```

## 工具能力说明

### 工具分类

| 分类 | 说明 | 工具 |
|-----|------|-----|
| `ansa` | ANSA 软件集成 | ANSATool |
| `ssh` | SSH 远程操作 | SSHTool, CommandTool |
| `hyperworks` | HyperWorks 集成 | - |
| `post_processing` | 后处理工具 | - |
| `workflow` | 工作流控制 | - |
| `system` | 系统工具 | - |
| `coding` | 脚本编码 | ScriptTool, CAEScriptTool |

### SSHTool - SSH 远程操作

```typescript
interface SSHConfig {
  host: string;
  port: number;
  username: string;
  auth_type: 'password' | 'key' | 'agent';
  password?: string;
  private_key_path?: string;
  passphrase?: string;
  proxy_enabled?: boolean;
  proxy_host?: string;
  proxy_port?: number;
  proxy_username?: string;
  proxy_password?: string;
}

// 功能
connect(config: SSHConfig): Promise<SSHSession>
disconnect(session_id: string): Promise<boolean>
execute(session_id: string, command: string): Promise<CommandResult>
upload(session_id: string, localPath: string, remotePath: string): Promise<boolean>
download(session_id: string, remotePath: string, localPath: string): Promise<boolean>
sftp(session_id: string, command: string): Promise<CommandResult>
```

### ANSATool - ANSA 软件控制

```typescript
interface ANSAToolConfig {
  ansa_path?: string;
  default_port?: number;
  working_dir?: string;
}

// 功能
start_session(port?: number): Promise<Session>
stop_session(session_id: string): Promise<boolean>
run_script(session_id: string, script: string): Promise<ScriptResult>
run_script_async(session_id: string, script: string): Promise<TaskResult>
get_task_result(task_id: string): Promise<TaskResult>
```

### ScriptTool - 通用脚本工具

```typescript
// 支持语言
type ScriptLanguage = 'python' | 'javascript' | 'typescript' | 
                      'bash' | 'powershell' | 'ansa' | 'hyperworks' | 'abaqus';

// 功能
create_script(name: string, language: ScriptLanguage, code: string): Promise<string>
get_script(scriptId: string): Promise<string | null>
update_script(scriptId: string, code: string): Promise<boolean>
delete_script(scriptId: string): Promise<boolean>
execute_script(scriptId: string, args?: Record<string, any>): Promise<ScriptExecutionResult>
execute(code: string, args?: Record<string, any>): Promise<ScriptExecutionResult>
analyze(code: string): Promise<ScriptAnalysis>
detectLanguage(code: string): ScriptLanguage
lint(code: string, language: ScriptLanguage): Promise<{ issues: LintIssue[] }>

// 模板管理
createTemplate(template: ScriptTemplate): string
getTemplate(id: string): ScriptTemplate | undefined
listTemplates(category?: string): ScriptTemplate[]
generateFromTemplate(templateId: string, variables: Record<string, any>): Promise<string>
```

### CAEScriptTool - CAE 脚本生成工具

```typescript
// 支持的 CAE 软件
type CAESoftware = 'ansa' | 'hyperworks' | 'abaqus' | 'nastran' | 'lsdyna' | 'custom';

// 脚本上下文
interface ScriptContext {
  software: CAESoftware;
  task: string;
  parameters: Record<string, any>;
  working_dir?: string;
}

// 功能
generateScript(context: ScriptContext): Promise<GenerationResult>
getAutocomplete(software: CAESoftware, prefix: string): Promise<APIFunction[]>
execute(code: string, context: { software: CAESoftware; timeout?: number }): Promise<Result>
```

### CAE 知识库 API

| 软件 | 模块 | API |
|-----|------|-----|
| ANSA | geometry | create_surface, ... |
| ANSA | mesh | generate_mesh, ... |
| ANSA | boundary_conditions | set_constraint, ... |
| ANSA | material | create_material, ... |
| ANSA | property | assign_property, ... |
| ANSA | results | read_results, ... |
| HyperWorks | modules | create_module, ... |
| HyperWorks | mesh | create_nodes, ... |
| HyperWorks | bc | create_load, ... |
| HyperWorks | solver | write_input, ... |
| Abaqus | mdb | models, parts, materials, steps, ... |
| Abaqus | odbAccess | openOdb, ... |

## Skill 系统

### Skill 分类

| 分类 | 说明 | 图标 |
|-----|------|-----|
| `data_io` | 数据处理 | 📥 |
| `mesh` | 网格处理 | 🔲 |
| `boundary_conditions` | 边界条件 | ⚡ |
| `solver` | 求解分析 | 🚀 |
| `post_processing` | 后处理 | 📊 |
| `optimization` | 优化 | 🎯 |
| `remote_command` | 远程命令 | 🖥️ |
| `workflow` | 工作流 | 🔄 |
| `sandbox` | 沙箱 | 🛡️ |
| `knowledge` | 知识库 | 📚 |

### 默认 Skills

#### 原子技能 (Atomic Skills)

| Skill | 名称 | 分类 | 说明 |
|-------|------|-----|------|
| import_geometry | 导入几何 | data_io | 从 CAD 格式导入几何模型 |
| generate_mesh | 生成网格 | mesh | 根据几何生成网格 |
| check_quality | 网格质量检查 | mesh | 检查网格质量 |
| apply_load | 施加载荷 | boundary_conditions | 向网格施加载荷 |
| apply_constraint | 施加约束 | boundary_conditions | 施加约束条件 |
| run_solver | 运行求解器 | solver | 运行 CAE 求解器 |
| extract_results | 提取结果 | post_processing | 提取分析结果 |
| generate_report | 生成报告 | post_processing | 生成分析报告 |
| ssh_execute | 远程执行 | remote_command | SSH 远程执行命令 |
| ssh_upload | 上传文件 | remote_command | SFTP 上传文件 |
| ssh_download | 下载文件 | remote_command | SFTP 下载文件 |
| cmd_execute | 本地命令 | remote_command | 执行本地命令 |
| sandbox_execute | 沙箱执行 | sandbox | 沙箱环境执行 |
| sandbox_create | 创建沙箱 | sandbox | 创建沙箱环境 |
| kb_search | 知识搜索 | knowledge | 搜索知识库 |
| kb_add_document | 添加文档 | knowledge | 添加知识文档 |

#### 工作流 (Workflows)

| Workflow | 名称 | 说明 |
|----------|------|------|
| static_analysis | 静力学分析 | 完整的线性静力学分析流程 |
| modal_analysis | 模态分析 | 模态分析完整流程 |
| topology_optimization | 拓扑优化 | 拓扑优化完整流程 |
| remote_batch_process | 远程批量处理 | SSH 批量处理工作流 |

## Hook 系统

### Hook 类型

| 类型 | 触发时机 |
|-----|---------|
| `before_skill_execute` | Skill 执行前 |
| `after_skill_execute` | Skill 执行后 |
| `before_agent_run` | Agent 运行前 |
| `after_agent_run` | Agent 运行后 |
| `on_error` | 错误发生时 |
| `on_tool_call` | 工具调用时 |
| `on_tool_result` | 工具返回时 |
| `on_skill_register` | Skill 注册时 |
| `on_workflow_start` | 工作流开始 |
| `on_workflow_complete` | 工作流完成 |
| `on_session_start` | 会话开始 |
| `on_session_end` | 会话结束 |
| `on_knowledge_search` | 知识库搜索 |
| `on_knowledge_add` | 添加知识 |
| `on_sandbox_create` | 创建沙箱 |
| `on_sandbox_execute` | 沙箱执行 |

## 记忆管理

### 记忆类型

| 类型 | 说明 | 用途 |
|-----|------|-----|
| `episodic` | 情景记忆 | 存储会话中的重要事件 |
| `semantic` | 语义记忆 | 持久化的结构化知识 |
| `working` | 工作记忆 | 短期的临时信息 |

### 相关性评分

记忆相关性基于三个维度计算：
- **新近度 (40%)**: 最近的记忆权重更高
- **频率 (30%)**: 访问次数多的记忆更重要
- **重要程度 (30%)**: 用户标记的重要信息

## 会话存储

### 存储后端

| 后端 | 说明 |
|-----|------|
| `InMemoryStorage` | 内存存储，适合开发测试 |
| `FileStorage` | 文件系统存储，适合本地部署 |

### SessionStore API

```typescript
create(userId: string, title?: string): Promise<Session>
get(id: string): Promise<Session | null>
update(session: Session): Promise<Session>
delete(id: string): Promise<void>
list(userId: string, options?: ListOptions): Promise<Session[]>
addMessage(sessionId: string, message: Message): Promise<Message>
getMessages(sessionId: string, limit?: number): Promise<Message[]>
updateState(sessionId: string, key: keyof SessionState, data: any): Promise<Session>
archive(sessionId: string): Promise<Session>
restore(sessionId: string): Promise<Session>
clearHistory(sessionId: string): Promise<Session>
cleanup(timeout?: number): Promise<number>
```

## 快速开始

```bash
# 安装依赖
pnpm install

# 构建所有包
pnpm build

# 启动开发服务器
pnpm dev

# 仅构建 core 包
pnpm --filter @cae-claw/core build

# 仅构建 web 包
pnpm --filter @cae-claw/web build
```

## 环境变量

```bash
# LLM 配置
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-xxx

# 数据库
DATABASE_URL=postgresql://localhost:5432/cae-claw

# 服务器
PORT=3000
NODE_ENV=development
```

## 文档

- [产品规格说明书](./SPEC.md) - 详细的产品功能规格

## License

MIT
