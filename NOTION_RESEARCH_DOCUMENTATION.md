# Notion Research Documentation Workflow

## Goal

Create a repeatable workflow to capture research in Notion with clear structure, source quality, and actionability.

## Recommended Notion Database Schema

Create a database named **Research Intelligence Hub** with these properties:

- `Title` (title)
- `Topic` (select)
- `Domain` (select): Strategy, Product, Engineering, Security, Market, Hiring
- `Status` (select): Inbox, Reviewing, Synthesized, Actioned, Archived
- `Priority` (select): Low, Medium, High, Critical
- `Source URL` (url)
- `Source Type` (select): Article, Paper, Report, Video, Thread, Internal
- `Credibility` (number 1-5)
- `Key Insight` (text)
- `Evidence` (text)
- `Recommendation` (text)
- `Owner` (person)
- `Decision Needed` (checkbox)
- `Decision Deadline` (date)
- `Captured At` (created time)
- `Last Reviewed` (date)

## Capture Standard (per entry)

Every new item must include:

1. **One-line thesis**: what this source claims.
2. **Three key points**: strongest evidence only.
3. **Reliability note**: why the source is trustworthy or weak.
4. **Impact on Ahmed stack**: explicit relevance.
5. **Recommendation**: clear action and timing.

## Synthesis Standard (weekly)

Create one weekly page: `Research Synthesis - YYYY-MM-DD`.

Sections:

- Top 5 insights
- Contradictions and unresolved questions
- Risks to monitor
- Opportunities to act this week
- Decisions required

## Execution Cadence

- Daily: capture and tag incoming sources.
- Twice weekly: synthesize high-priority items.
- Weekly: executive summary and decisions.

## Quality Gates

Before marking `Synthesized`:

- At least 2 independent sources for critical claims.
- Recommendation is specific and testable.
- Owner and deadline assigned if action is required.

## Example Entry Template

```markdown
Title: [Short headline]
Topic: [e.g., AI Agents in PMO]
Key Insight: [1 sentence]
Evidence:
- [fact 1]
- [fact 2]
- [fact 3]
Recommendation: [what to do next and why]
Decision Needed: [Yes/No]
Decision Deadline: [date]
```

## Integration Notes

- Link this workflow with Slack alerts for `Priority=Critical` and `Decision Needed=true`.
- Mirror weekly synthesis summary to Telegram at 8 PM Cairo.

