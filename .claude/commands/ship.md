# Ship Code

Full workflow: branch → code & commit → lint → push → wait for CI → merge to master.

## Usage

```
/ship PF-42_Add_Login_Page
```

The argument is the branch name. It must match the pattern `PF-<number>_<description>` (e.g. `PF-42_Add_Login_Page`). If omitted you will be asked for one.

---

## Steps

### 1 — Validate / prompt for branch name

If `$ARGUMENTS` is empty, ask the user for a branch name before proceeding.

Validate it matches: `^PF-[0-9]+_[A-Za-z0-9_]+$`

If it does not match, stop and tell the user the required format with an example.

### 2 — Create and switch to the feature branch

```bash
git checkout -b $ARGUMENTS
```

If the branch already exists locally, switch to it instead:

```bash
git checkout $ARGUMENTS
```

Confirm the active branch with `git branch --show-current`.

### 3 — Implement the requested changes

Apply all code changes needed for the task. Follow the project conventions in CLAUDE.md:
- Use the correct path aliases (`@components`, `@data`, `@pages`, etc.)
- No relative imports in the frontend
- Use the existing HTTP client (`request` object) — do not add axios
- TanStack Query v5 API (`queryKey`/`queryFn`, mutations use `onSuccess`/`onError`)
- No new `tailwind.config.js` or `postcss.config.js`

### 4 — Commit the changes

Stage only the files you modified (never `git add -A` blindly):

```bash
git add <specific files>
git commit -m "<concise description of what changed and why>"
```

Append the session URL to the commit message body:
```
https://claude.ai/code/session_01EVxPgfgHXb7X4XxdZsy1Mp
```

### 5 — Run lint on affected code

Determine which project(s) were changed:
- Frontend changes → `yarn nx run p-frog:lint`
- Backend changes  → `yarn nx run api:lint`
- Both changed     → run both

If lint fails, fix every reported issue, re-stage the affected files, and amend the commit:

```bash
git add <fixed files>
git commit --amend --no-edit
```

Repeat until lint passes cleanly.

### 6 — Push the branch

```bash
git push -u origin $ARGUMENTS
```

If the push fails due to a network error, retry with exponential back-off: wait 2 s, 4 s, 8 s, 16 s between attempts (max 4 retries).

### 7 — Wait for CI to pass

CI runs on GitHub Actions (`.github/workflows/ci.yml`). Poll the PR / branch status using the GitHub MCP tools:

1. Find or create the PR with `mcp__github__list_pull_requests` / `mcp__github__pull_request_read`.
2. Check the latest commit status / check-runs every ~30 seconds.
3. While CI is running, report progress to the user ("CI still running — build-client ✓, e2e-tests pending…").
4. If any job fails:
   - Read the failure output.
   - Fix the root cause locally.
   - Commit the fix, re-run lint, push again.
   - Restart the wait loop.
5. Once **all jobs are green**, proceed to step 8.

### 8 — Merge to master

```bash
git checkout master
git pull origin master
git merge --no-ff $ARGUMENTS -m "Merge $ARGUMENTS into master"
git push -u origin master
```

If there are merge conflicts, resolve them, stage the resolutions, complete the merge commit, then push.

After a successful push, confirm to the user:

> Branch `$ARGUMENTS` has been merged into `master` and pushed. CI was green on all jobs.

---

## Quick-reference: CI jobs

| Job | Triggered when |
|-----|---------------|
| `validate-branch-name` | PRs only — checks `^PF-[0-9]+_[A-Za-z0-9_]+$` |
| `build-client` | Frontend / libs changed |
| `build-server` | Backend / libs changed |
| `server-unittests` | Backend / libs changed |
| `e2e-tests` | Any change (full stack) |
| `lint-client` | Frontend changed |
| `lint-server` | Backend changed |

## Quick-reference: lint commands

| Scope | Command |
|-------|---------|
| Frontend only | `yarn nx run p-frog:lint` |
| Backend only  | `yarn nx run api:lint` |
| Everything    | `yarn lint` |
