---
name: model-switcher
description: Switch between local (Qwen 2.5 7B), API (Kimi K2.5), and Auto model modes. Use when you want to control cost by using local models for drafts and API for final polish, or when you need to switch processing modes mid-session.
---

# Model Switcher

Switch between local and API models for cost optimization.

## Modes

### /local Mode
- **Model:** Qwen 2.5 7B (via Ollama)
- **Cost:** $0.00
- **Best for:** Drafts, brainstorming, simple queries
- **Speed:** ~30-60s per response
- **Quality:** 80-85%

### /api Mode
- **Model:** Kimi K2.5 (via Moonshot)
- **Cost:** ~$0.15-0.18 per 10K tokens
- **Best for:** Final polish, complex reasoning, CV tailoring
- **Speed:** ~5-10s per response
- **Quality:** 95%+

### /auto Mode
- **Logic:** Uses rules to pick model
- **Rules:**
  - CV tailoring → Kimi (high quality needed)
  - Code analysis → Qwen (fast, good enough)
  - Chat/brainstorm → Qwen (cost-effective)
  - Final review → Kimi (polish required)

## Usage

Since OpenClaw doesn't support runtime model switching, use **session switching**:

### Switch to Local Mode
```bash
openclaw session use local
```

### Switch to API Mode
```bash
openclaw session use api
```

### Switch to Auto Mode
```bash
openclaw session use auto
```

### Check Current Mode
```bash
openclaw session status
```

## Alternative: Agent Mention

Mention specific agents in chat:
- `@local` - Routes to local agent
- `@api` - Routes to API agent  
- `@auto` - Routes to auto agent

## Cost Comparison

| Task | Local Cost | API Cost | Savings |
|------|------------|----------|---------|
| CV Draft | $0.00 | $0.15 | 100% |
| CV Polish | $0.00 | $0.05 | 100% |
| Brainstorm | $0.00 | $0.10 | 100% |
| Analysis | $0.00 | $0.20 | 100% |

**Estimated monthly savings:** 70-80% for mixed workloads

## Hybrid Workflow (Recommended)

1. **Draft with /local**
   - Generate initial CV content
   - Brainstorm ideas
   - Quick iterations

2. **Polish with /api**
   - Final CV refinement
   - Complex reasoning tasks
   - Quality-critical outputs

3. **Total cost:** ~30% of API-only approach

## Setup Requirements

1. **Install Ollama:**
   ```bash
   curl -fsSL https://ollama.com/install.sh | sh
   ```

2. **Pull Qwen model:**
   ```bash
   ollama pull qwen2.5:7b
   ```

3. **Start Ollama:**
   ```bash
   ollama serve
   ```

4. **Verify:**
   ```bash
   curl http://localhost:11434/api/tags
   ```

## Troubleshooting

**Qwen not responding:**
- Check Ollama is running: `ps aux | grep ollama`
- Verify model loaded: `ollama list`
- Test manually: `ollama run qwen2.5:7b`

**Fallback not working:**
- Check both providers configured
- Verify API keys valid
- Check network connectivity

**Slow local responses:**
- Normal on CPU-only (30-60s expected)
- Consider GPU for faster inference
- Use smaller context window for speed

## Configuration

Config location: `/home/openclaw/.openclaw/openclaw.json`

Providers configured:
- `ollama/qwen2.5:7b` → http://localhost:11434/v1
- `moonshot/kimi-k2.5` → https://api.moonshot.ai/v1

---

*Model switching enables 70%+ cost savings while maintaining quality for critical tasks.*