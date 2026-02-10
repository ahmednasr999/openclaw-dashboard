# HEARTBEAT.md - Recurring Tasks

Tasks to run during heartbeat checks. Don't just reply HEARTBEAT_OK — be productive.

---

## Critical Daily Tasks

**Rotate through these (don't do all every time):**

### 📧 Email Check
- Any urgent unread messages?
- Newsletters to summarize?
- Action items for Ahmed?

### 📅 Calendar Review
- Events in next 24-48h?
- Prep needed for meetings?
- Conflicts or double-bookings?

### 💼 Job Pipeline
- New matching jobs posted?
- Follow-ups needed?
- Interview prep reminders?

### 📱 LinkedIn/Content
- Engagement on recent posts?
- Comments needing replies?
- Next post ready to schedule?

### 🔧 System Health
- Dashboard responding?
- Cron jobs running?
- Any service errors?

---

## Memory Maintenance

**Weekly:**
- [ ] Review recent memory/YYYY-MM-DD.md files
- [ ] Update MEMORY.md with distilled learnings
- [ ] Remove outdated info
- [ ] Update active projects status

**Bi-weekly:**
- [ ] Full system health check (automated via cron)
- [ ] Review job application pipeline
- [ ] Check content calendar status

---

## Health Checks

### Services
```bash
# Dashboard
openclaw gateway status
curl -s http://100.99.230.14:3000 | head -1

# Cron jobs
openclaw cron list

# Disk space
df -h /
```

### Automations
- Bi-weekly health check: `7de7e8bf-9eb2-4a66-ad9b-f6f5ba019fae`
- Next run: Check with `openclaw cron runs <id>`

---

## Quiet Hours

**DON'T disturb Ahmed during:**
- 23:00 - 08:00 GST (unless urgent)
- Friday prayer time (12:00-14:00 GST)
- When calendar shows "Focus Time" or "Do Not Disturb"

**DO reach out if:**
- Calendar event <2h away
- Important email received
- Service down
- Been >8h since last interaction

---

## When to Reach Out

**Immediate (any time):**
- Critical service down
- Urgent calendar conflict
- Security issue

**During waking hours:**
- Interesting content found
- Job match discovered
- Reminder needed

**Batch for later:**
- Routine checks
- Non-urgent updates
- Content suggestions

---

## Heartbeat State Tracking

Track last checks in `memory/heartbeat-state.json`:

```json
{
  "lastChecks": {
    "email": 1703275200,
    "calendar": 1703260800,
    "jobs": 1703250000,
    "linkedin": 1703240000,
    "services": 1703230000,
    "memory": 1703220000
  },
  "quietHours": {
    "start": "23:00",
    "end": "08:00",
    "timezone": "GST"
  }
}
```

---

## Checklist Template

Copy this for each heartbeat:

```
[ ] Email — Any urgent? (Last: ___)
[ ] Calendar — Events <48h? (Last: ___)
[ ] Jobs — New postings? (Last: ___)
[ ] LinkedIn — Engagement? (Last: ___)
[ ] Services — All healthy? (Last: ___)
[ ] Memory — Need update? (Last: ___)

Status: ___
Next check: ___
```

---

*Update this file as routines evolve*
*Last updated: 2026-02-10*
