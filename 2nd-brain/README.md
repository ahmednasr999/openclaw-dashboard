# 2nd Brain - Agent Command Center

A comprehensive knowledge management and agent orchestration system built during Build Night 1.

## 🚀 Quick Start

```bash
# Start ChromaDB
cd 2nd-brain && docker-compose up -d

# Start dashboard
cd 2nd-brain/dashboard && npm run dev

# Open dashboard
open http://localhost:3000
```

## 📁 Directory Structure

```
2nd-brain/
├── memories/          # Knowledge base storage
├── documents/         # File uploads
├── jobs/              # Job application tracking
├── tasks/             # Todo items
├── prompts/           # Agent prompt library
├── agents/            # 11 agent SOUL.md files
├── automations/       # Cron scripts
├── dashboard/         # Next.js dashboard
│   ├── app/          # Pages
│   ├── components/   # UI components
│   └── dist/         # Built static files
├── docker-compose.yml # ChromaDB setup
└── active-tasks.md   # Crash recovery log
```

## 🤖 The 11 Agents

| Agent | Role | Authority |
|-------|------|-----------|
| EL-KABIR | Main Strategist | Final authority on strategy |
| AMIR | Orchestrator | Task assignment & scheduling |
| ADHAM | Researcher | Content screening & research |
| HEIKAL | Writer | Content creation |
| AL TAWEEL | Growth | Network & opportunities |
| LOTFI | Job Tracker | Application management |
| FAIRUZ | Interview Coach | Interview prep |
| HAZEM | Analytics | Data & reporting |
| MAHER | Developer | Technical implementation |
| MOKHTAR | QA | Testing & quality |
| BASMA | Designer | UI/UX & visuals |

## 🛡️ Security

- **skill-vetter**: Validates external skills before execution
- **docker-sandbox**: Isolates untrusted code
- External content validation via ADHAM

## 🔄 Automations

- **07:00 Cairo**: Morning Brief
- **07:30 Cairo**: Weather + Quote
- **08:00 Cairo**: Agent Standup

Setup: `crontab /tmp/cron-setup.txt`

## 📊 Dashboard Features

- **Dashboard**: System overview and metrics
- **Memories**: Semantic search via ChromaDB
- **Documents**: File management
- **Jobs**: Kanban board for applications
- **Tasks**: Todo list with priorities
- **Agent Activity**: Live agent status
- **Prompt Library**: Reusable templates

## 🛠️ Built With

- Next.js 16 + TypeScript
- Tailwind CSS + shadcn/ui
- ChromaDB (Docker)
- Node.js 22

## 📸 Screenshots

See `/screenshots/` directory for full page captures.

## 📝 Build Night 1 Deliverables

- ✅ Working dashboard with 7 pages
- ✅ 11 agent SOUL.md files
- ✅ Security tools (skill-vetter, docker-sandbox)
- ✅ Automation scripts
- ✅ README documentation

**Completed:** 2026-02-13 21:58 UTC
