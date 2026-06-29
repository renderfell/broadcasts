---
name: ship-feature
description: >
  Automates the end-to-end flow after a feature is developed and tested locally:
  first uses the commit-plan skill to prepare a commit (waits for user approval), then (on approval) pushes the branch, opens a PR, and (after further confirmation) squash-merges it to main.
  Use this when the user says "ship it", "do the pr", "/ship-feature", "merge this feature", or "let's release this".
  Designed for this project's workflow (feature branch → test locally → commit + PR + squash merge → semantic release).
metadata:
  short-description: 'Ship a tested feature: commit → push → PR → squash merge'
  triggers: ['/ship-feature', 'ship it', 'pr and merge', "let's release this"]
---

# Ship Feature Workflow

You are an agent that safely automates shipping a feature after the user has developed and locally tested it.

## Core Rules (never break these)

- **Never run a commit without explicit user approval** of the exact commit message/plan.
- **Never push, create PR, or merge** until the commit has been created **and** the user has given clear approval for the next stage.
- Always work on a feature branch (never directly on main).
- When creating the commit, follow the rules from the `commit-plan` skill (minimal body, lowercase, avoid type/scope unless necessary).
- **Always use squash merge** when merging to main (this project's policy).
- After merge, the semantic-release workflow will handle versioning and deploy — you only need to report the result.
- If anything looks wrong (wrong branch, dirty state, no changes, on main), stop and ask the user.

## Step-by-step Process

When the user invokes this skill (via /ship-feature or natural language like "ship this feature"):

1. **Assess current state**
   - Run `git branch --show-current`
   - Run `git status --porcelain`
   - Confirm we are **not** on main.
   - If there are no changes and nothing to commit, inform the user and stop.
   - Show the current branch and a short summary of changes.

2. **Review recent changes**
   - Optionally show `git diff --stat` and/or last few commits on the branch.
   - Ask the user: "Does this look good to ship?"

3. **Create commit using commit-plan (if changes exist)**
   - Explicitly invoke the `commit-plan` skill (or follow its exact rules) to generate the proposed commits.
   - Show the user the full plan with the exact commands.
   - **Do not execute `git commit` yet.**
   - Wait for explicit user approval of the commit plan (e.g. "yes", "commit this", "looks good", "ship").
   - Only after the user approves the commit, run the `git commit` command(s).
   - After the commit succeeds, show the hash and summary, then ask if they want to continue to push + PR.

4. **Push the branch** (only after user explicitly approves continuing after the commit)
   - Ask something like: "Commit is done. Ready to push and create PR?"
   - Only on clear approval, run `git push -u origin <branch>`.
   - Confirm success.

5. **Create Pull Request**
   - Use `gh pr create --base main --head <current-branch>`
   - Use the commit title as PR title (or a cleaned version).
   - Write a concise PR body (what was changed, why, any testing notes).
   - If a PR already exists for this branch, just report the existing PR URL instead of creating a new one.
   - Report the PR URL to the user.

6. **Wait for user approval to merge**
   - Only reach this step after the commit has been created **and** the user has explicitly approved moving forward (e.g. "push", "create pr", "continue", "ship").
   - After creating the PR, tell the user the PR URL and say: "PR created. Say 'merge', 'squash merge', or 'ship' when ready to merge."
   - **Do not merge automatically** unless the user explicitly approves the merge.

7. **Merge (when user approves)**
   - Run `gh pr merge <pr-number> --squash --delete-branch`
   - Confirm the merge.
   - Report the merge commit on main.

8. **Post-merge reporting (optional but nice)**
   - Run `gh run list --workflow=release.yml --branch main --limit 2` to show that the release workflow has started.
   - Tell the user they can monitor with `gh run watch` if they want.
   - Optionally check `gh release list --limit 1` after some time (but don't block).

## Safety & Edge Cases

- If the branch is already merged or PR is closed, handle gracefully.
- If user is on main, tell them to switch to a feature branch first.
- If there are uncommitted changes that shouldn't be included, ask the user to stash or commit them separately first.
- Respect the project's policy: squash merge only.
- Never force push unless the user explicitly asks and understands the risk.

## Tone & Interaction Style

Be concise but clear.
The commit step requires explicit approval of the commit plan/message before you run `git commit`.
Push, PR creation, and merge each require their own confirmation (or a clear "go ahead with everything" after seeing the commit).
Do not chain actions past the commit without user sign-off.

## Example Invocation Responses

User: "/ship-feature"
→ You check state → run commit-plan logic → show proposed commit commands → wait for explicit "yes", "commit", "approve", or "ship" before running git commit. Only after commit succeeds, ask about pushing/PR.

User: "ship this"
→ Follow the full flow, but stop and ask for approval before executing the commit, and again before push/PR and before merge.

User: "just merge the pr"
→ If PR already exists and commit was already approved, proceed to merge after confirmation.

This skill makes the "develop → test → ship" loop much faster and consistent while staying safe.
