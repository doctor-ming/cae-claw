# CAE Claw

AI Agent Platform for CAE Software (ANSA, HyperWorks, etc.)

## Features

- 🤖 **AI Agent Engine** - Natural language understanding and task planning
- 📦 **Skill System** - Unified Skill concept (atomic + composite workflows)
- 🔧 **CAE Integration** - Seamless integration with ANSA, HyperWorks
- 💻 **Multi-Client** - Web UI, Desktop App, CLI support
- 🔄 **Self-Evolution** - Continuous learning and optimization

## Tech Stack

- **Agent Framework**: LangGraph + LangChain
- **Frontend**: React 19 + TypeScript + Tailwind CSS
- **Desktop**: Electron + electron-vite
- **Database**: SQLite (local) / PostgreSQL (cloud)
- **LLM**: OpenAI, Claude, Gemini, DeepSeek, Ollama

## Quick Start

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start development
pnpm dev
```

## Project Structure

```
cae-claw/
├── apps/
│   ├── web/              # React Web UI
│   └── desktop/          # Electron Desktop App
├── packages/
│   ├── core/             # Shared types & schemas
│   ├── agent/            # AI Agent Core Engine
│   ├── skills/           # Skill Registry & Manager
│   ├── tools/            # Tool Definitions (CAE integration)
│   └── gateway/          # API Gateway Service
```

## Documentation

See [SPEC.md](./SPEC.md) for detailed product specification.

## License

MIT
