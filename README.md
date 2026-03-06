# OpenClaw Dashboard

Operational dashboard and automation workspace for Ahmed Nasr.

## Purpose

This repository hosts scripts, generated assets, and support files used for dashboard operations, automation runs, and content/workflow utilities.

## Quick Start

### Prerequisites

- Node.js 20+
- npm
- Git
- GitHub CLI (`gh`) for CI/PR workflows

### Install

```bash
npm install
```

### Run

If using the local server utility:

```bash
node server.js
```

## Repository Structure

- `applications/` generated application artifacts
- `memory/` local memory/notes for this repo context
- `skills/` local skill definitions and references
- `reports/` generated reports
- `linkedin_posts/`, `linkedin_profile/` content and assets
- utility scripts (`*.py`, `*.js`, `*.sh`) for data extraction, link fixing, and sheet updates

## Deployment

GitHub Pages is enabled for this repo:

- URL: https://ahmednasr999.github.io/openclaw-dashboard/
- Workflow: `pages-build-deployment`

Any push to `main` can trigger a Pages build when Pages is enabled.

## CI Notes

Recent fix applied:

- Removed stale submodule gitlink at `2nd-brain/dashboard` that caused checkout failure in Pages workflow.

## Security Baseline

- Do not hardcode access tokens in scripts.
- Use environment variables for secrets.
- Rotate any token that has ever been committed.
- Enable GitHub secret scanning and push protection.

See `RUNBOOK.md` for incident and operations procedures.

## Troubleshooting

### Pages workflow not triggering

- Verify GitHub Pages is enabled in repo settings.
- Confirm default branch is `main`.
- Check Actions tab for workflow permissions.

### Checkout fails in CI with submodule errors

- Check for stale gitlinks: `git ls-tree -r --full-tree HEAD | grep ^160000`
- Ensure `.gitmodules` exists and maps all submodules, or remove stale entries.

