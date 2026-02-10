# TOOLS.md - Local Setup Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

---

## API Keys & Credentials

**Stored in environment:**
- `ELEVENLABS_API_KEY` — For sag (TTS) skill
- `GOOGLE_SHEETS_SA` — Service account at `/home/openclaw/.openclaw/config/google-sheets-sa.json`
- `MOONSHOT_API_KEY` — Kimi K2.5 model access
- `TELEGRAM_BOT_TOKEN` — Configured in OpenClaw

**To check:**
```bash
echo $ELEVENLABS_API_KEY
echo $MOONSHOT_API_KEY
```

---

## SSH Hosts & Aliases

**VPS (Current machine):**
- Host: srv1352768
- IP: 76.13.46.115
- Tailscale IP: 100.99.230.14
- User: openclaw

**GitHub:**
- Repo: ahmednasr999/openclaw-dashboard
- Deploy key configured for auto-deploy

---

## Device Names

**Services:**
- Dashboard: http://100.99.230.14:3000
- Gateway: http://127.0.0.1:18789
- Canvas: http://127.0.0.1:18793

**Smart Home:**
- (None configured yet)

---

## Preferred Voices & Models

**TTS (sag skill):**
- Default voice: "Nova" (warm, slightly British)
- Alternative: "Adam" (professional)

**AI Model:**
- Primary: moonshot/kimi-k2.5
- Fallback: (not configured)

---

## Platform-Specific Formatting

**Discord:**
- No markdown tables! Use bullet lists
- Wrap links in `<>` to suppress embeds: `<https://example.com>`

**WhatsApp:**
- No headers — use **bold** or CAPS for emphasis
- Keep messages short

**Telegram (current):**
- Markdown supported
- Inline buttons available
- Can send files, images, voice

**LinkedIn:**
- Professional tone
- No emojis in headlines
- Use hashtags: #DigitalTransformation #GCC

---

## Skill Locations

**Built-in:**
`/usr/local/lib/node_modules/openclaw/skills/`

**Custom/User:**
`~/.openclaw/skills/`

**Current custom skills:**
- cv-tailor
- knowledge-base

---

## Important Paths

**Workspace:**
`/root/.openclaw/agents/main/workspace/`

**Memory:**
`/root/.openclaw/agents/main/workspace/memory/`

**Businesses:**
`/root/.openclaw/agents/main/workspace/businesses/`

**Config:**
`/home/openclaw/.openclaw/openclaw.json`

**Logs:**
`/tmp/openclaw/openclaw-2026-02-10.log`

---

## Quick Commands

```bash
# Check OpenClaw status
openclaw status

# Check gateway
openclaw gateway status

# List cron jobs
openclaw cron list

# Restart gateway
openclaw gateway restart

# Update OpenClaw
openclaw update
```

---

## Dashboard Info

**URL:** http://100.99.230.14:3000
**Auto-deploy:** Enabled via GitHub Actions
**Service:** systemd (auto-restart)
**Status:** Check with `systemctl status openclaw-dashboard`

---

## Notes

*Add environment-specific details as you discover them*

- Canvas server runs on port 8080 (when started)
- Python 3.13 available
- Node 22.22.0 via nvm
- 7.8GB RAM, 96GB disk
- GitHub CLI (`gh`) available

---

*Last updated: 2026-02-10*
