# Security Ownership Map

## Scope
Repository: `ahmednasr999/openclaw-dashboard`

## Ownership Model

- **Accountable Owner:** Ahmed Nasr
- **Operational Executor:** NASR (AI operator)
- **Escalation Channel:** Slack `#ai-codex`

## Control Ownership

### 1) Secrets Management
- Owner: Ahmed Nasr
- Executor: NASR
- Controls:
  - No hardcoded tokens in repo
  - Env-based token usage only
  - Secret scanning enabled
  - Push protection enabled
- Review cadence: Weekly

### 2) CI/CD Security
- Owner: Ahmed Nasr
- Executor: NASR
- Controls:
  - All workflows green before release
  - No stale submodule pointers
  - PR-based change flow for risky edits
- Review cadence: Per release and weekly

### 3) Incident Response
- Owner: Ahmed Nasr
- First responder: NASR
- SLA:
  - Detection acknowledgment: < 10 minutes
  - Initial containment plan: < 30 minutes
- Escalation:
  - Critical secret leak: rotate credential immediately, then history cleanup

### 4) Documentation and Runbooks
- Owner: NASR
- Reviewer: Ahmed Nasr
- Controls:
  - README and RUNBOOK stay current after major changes
  - Security findings logged and tracked
- Review cadence: After every major fix

## RACI Snapshot

- Token leak found: NASR (R), Ahmed (A), N/A (C), N/A (I)
- Token rotation: Ahmed (A/R), NASR (C)
- Repo patch and PR: NASR (R), Ahmed (A)
- Secret scanning config: NASR (R), Ahmed (A)
- Post-incident review: NASR (R), Ahmed (A)

## Minimum Monthly Audit

1. Verify secret scanning and push protection still enabled.
2. Review failed Actions runs and root causes.
3. Validate no tokens are present in tracked files.
4. Confirm runbooks match current architecture.

