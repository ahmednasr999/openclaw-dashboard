# OpenClaw Dashboard Runbook

## 1. Operations Checklist

### Daily

- Check GitHub Actions for failed runs.
- Verify Pages URL loads.
- Review recent commits for accidental secrets.

### Weekly

- Rotate any temporary tokens used in scripts.
- Review open issues and PR debt.
- Run dependency update check.

## 2. CI Failure Playbook

### Symptom

`pages-build-deployment` fails at checkout with git/submodule error.

### Diagnosis

```bash
gh run list --repo ahmednasr999/openclaw-dashboard --limit 5
gh run view <run-id> --repo ahmednasr999/openclaw-dashboard
```

### Common Root Cause

- Stale gitlink exists without matching `.gitmodules` mapping.

### Fix

```bash
git checkout -b fix/ci-submodule-cleanup
git rm --cached <stale-submodule-path>
git commit -m "fix(ci): remove stale submodule gitlink"
git push -u origin fix/ci-submodule-cleanup
gh pr create --repo ahmednasr999/openclaw-dashboard --base main --head fix/ci-submodule-cleanup
```

## 3. Secret Exposure Playbook

### If token is found in repo

1. Revoke/rotate token immediately.
2. Remove from current files.
3. Purge from history if pushed.
4. Enable secret scanning and push protection.
5. Validate no active credential remains exposed.

## 4. Pages Verification

```bash
gh api repos/ahmednasr999/openclaw-dashboard --jq '{has_pages,default_branch,pushed_at}'
gh run list --repo ahmednasr999/openclaw-dashboard --limit 5
```

Success criteria:
- latest Pages run status is `success`
- site loads: https://ahmednasr999.github.io/openclaw-dashboard/

## 5. Ownership

- Primary owner: Ahmed Nasr
- AI operator: NASR
- Escalation: open issue + direct Slack alert

