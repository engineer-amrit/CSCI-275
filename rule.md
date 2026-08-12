# Project Rules

## General

- Never execute destructive commands without explicit approval.
- Never modify files outside this repository.
- Never install or uninstall packages without approval.
- Never create commits, branches, or tags without approval.
- Never push to any remote repository.
- Never force push.
- Never rewrite Git history.

## File Operations

- Do not delete files unless explicitly instructed.
- Do not rename files unless explicitly instructed.
- Do not overwrite configuration files without approval.
- Preserve existing project structure.

## Dependencies

- Do not add, remove, or update dependencies without approval.
- Do not modify lockfiles unless dependency changes are approved.

## Commands

Require approval before executing commands such as:

- rm
- rm -rf
- git reset
- git clean
- git rebase
- git push
- git push --force
- git push --force-with-lease
- npm install
- pnpm add
- pnpm remove
- yarn add
- docker system prune
- docker volume rm
- sudo
- chmod
- chown

## Code Changes

- Prefer the smallest possible change.
- Do not refactor unrelated code.
- Do not change formatting outside modified files.
- Do not introduce new libraries unless requested.
- Preserve existing coding style.

## Communication

- Explain the planned changes before modifying multiple files.
- Ask for clarification if requirements are ambiguous.
- Do not assume missing requirements.
