---
name: fast-mode
description: Use when the user explicitly wants the simplest direct fix for a small change and does not want the full planning, TDD, or OpenSpec workflow.
---

# Fast Mode

## Overview

This skill is for small, low-risk tasks.

When this skill is active, it becomes the primary execution mode.

Do not invoke OpenSpec, Superpowers planning workflows, TDD-first development, or
architecture planning unless the user explicitly requests them or the task exceeds
the scope of this skill.

The goal is to maximize delivery speed while keeping changes safe.

Optimize for:

- Minimum code changes
- Minimum process
- Minimum execution time

Do not optimize for process completeness.

## When to Use

- The user explicitly asks for a quick, direct, simple, or minimal change
- The task is narrow enough to understand in one pass
- The change does not need a spec, plan, or design review
- The user says not to use the full skill/process stack

Typical examples:

- Fix a small bug
- Rename a variable
- Update a style
- Modify a component
- Adjust an API call
- Change configuration
- Improve logging
- Update documentation
- Make a small refactor

## Decision Rules

When uncertain, prefer remaining in Fast Mode.

Escalate only if one or more of the following are true:

- Multiple modules require coordinated changes
- Public APIs change
- Database schema changes
- Infrastructure changes
- Security-sensitive logic changes
- The user requests design, planning, OpenSpec, or TDD

## What to Skip

Never invoke the following workflows:

- OpenSpec
- Superpowers planning workflows
- `brainstorming`
- `writing-plans`
- TDD-first development
- Architecture planning
- Implementation planning

unless:

- The user explicitly requests them
- This skill determines the task exceeds its intended scope

Do not spawn subagents for work that can reasonably be completed by a single agent.

Only use subagents when:

- Multiple independent codebases are involved
- Parallel execution provides a clear benefit
- The user explicitly requests it

Do not over-decompose the request into phases.

## What to Keep

- Still follow `AGENTS.md`
- Still respect protected files and ask before touching them
- Still avoid forbidden paths like `node_modules/` and `dist/`
- Still use project-standard APIs, components, and file layout rules
- Still verify the change with the smallest useful check

## Execution Pattern

1. Understand the request
2. Locate only the relevant files
3. Make the minimum necessary change
4. Run the smallest useful verification
5. Stop

Avoid:

- Additional cleanup
- Opportunistic refactoring
- Unrelated improvements
- Speculative optimizations

## Verification

Prefer the smallest verification that provides confidence.

Examples:

- Type-check a single package
- Run one targeted test
- Build only the affected package

Avoid:

- Full repository builds
- Full test suites

unless necessary.

## Common Mistakes

- Using this skill for risky, ambiguous, or multi-part work
- Skipping verification entirely when a quick check is easy
- Ignoring protected-file rules because the task feels small

## Fallback

If the task turns out to be larger than expected, stop and ask the user whether to continue in
fast mode or switch back to the normal workflow. Do not switch modes silently.

Do not silently escalate into a planning workflow. Always ask the user before changing execution
modes.
