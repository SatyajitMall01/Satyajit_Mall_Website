# Orchestrator Token Optimizer

name: orchestrator-token-optimizer
description: Force cost-efficient sub-agent delegation in Claude Code. Prevents the main thread from doing work that cheaper tiers can handle.
when_to_use: Read this skill BEFORE starting any multi-step task, code edit, file-heavy operation, or data fetch in a new session.

---

## Core Rule

**The orchestrator (main thread) is a dispatcher, not a doer.**

Every tool call in the main thread costs the highest-tier tokens (opus-class pricing when the session is on the primary model). The orchestrator should:

1. Parse the user's request
2. Break it into independent subtasks
3. Dispatch each subtask to the cheapest capable agent tier via Task()
4. Collect results and synthesize a concise response to the user

The main thread contributes: intent parsing, routing decisions, result synthesis, user communication. Everything else is delegated.

---

## Routing Table

| Task Type | Agent | Model | Dispatch |
|-----------|-------|-------|---------|
| Find files, search code, grep patterns, read targeted file sections | A1 | Explore (haiku-class default) | `Task(subagent_type="Explore", ...)` |
| Fetch external data, call APIs, web lookups, deduplication | A2 | haiku | `Task(subagent_type="general-purpose", model="haiku", ...)` |
| Domain analysis, decision logic, project-specific reasoning | A3 | sonnet | `Task(subagent_type="general-purpose", model="sonnet", ...)` |
| Code generation, file edits, refactoring, formatting | A4 | sonnet | `Task(subagent_type="general-purpose", model="sonnet", ...)` |
| Reports, summaries, documentation, changelogs | A5 | sonnet | `Task(subagent_type="general-purpose", model="sonnet", ...)` |
| Architecture design, strategy, multi-file system design | A6 | opus | `Task(subagent_type="Plan", model="opus", ...)` |
| ML, forecasting, complex multi-step reasoning | A7 | opus | `Task(subagent_type="general-purpose", model="opus", ...)` |
| Math verification, integrity checks, smoke tests, QA | QA | haiku | `Task(subagent_type="general-purpose", model="haiku", ...)` |

---

## Delegation Templates

### Template 1: Code Edit Task

Trigger: user asks to fix, update, refactor, or add code in an existing file.

```
DO NOT read the file yourself.
DO NOT write or edit code yourself.

Dispatch A4 (sonnet):

Task(
  description="<short descriptive name, e.g. 'fix null check in parser'>",
  subagent_type="general-purpose",
  model="sonnet",
  prompt="""
File: <absolute/path/to/file.ext>
Change: <what to change and why — one or two sentences>
Constraints: <line range if known; what NOT to touch; any invariants to preserve>
After edit: verify the file parses / compiles cleanly.
Report: lines changed, final state of changed section.
"""
)
```

**Savings vs. main-thread edit:** ~300–800 tokens per edit, depending on file size.

---

### Template 2: Multi-File Investigation

Trigger: user asks "where is X", "which files use Y", "what calls Z", or any question requiring a search across the codebase.

```
DO NOT grep files yourself.
DO NOT read files yourself to find the answer.

Dispatch A1 (Explore):

Task(
  description="<what to find, e.g. 'all usages of deprecated_fn'>",
  subagent_type="Explore",
  prompt="""
Search for <symbol / pattern / concept> in <directory or glob pattern>.
Report: file paths, line numbers, relevant code snippets (1–3 lines of context per match).
Format: one match per line as: file:line: snippet
Under 300 words total. No prose, no summaries.
"""
)
```

**Savings vs. main-thread grep chain:** ~500–1500 tokens per investigation.

---

### Template 3: Data / API Fetch

Trigger: user asks to retrieve external data, call an API, scrape a page, or look up current information.

```
DO NOT fetch data yourself.

Dispatch A2 (haiku):

Task(
  description="<what to fetch, e.g. 'latest schema from API'>",
  subagent_type="general-purpose",
  model="haiku",
  prompt="""
Fetch: <URL or data source description>
Method: <GET/POST/etc.> with headers: <if any>
Return: JSON only. No prose.
Fields needed: <list the specific fields; discard the rest>
If fetch fails: return {"error": "<reason>"} — do not retry.
"""
)
```

**Savings vs. main-thread fetch:** ~200–500 tokens per fetch.

---

### Template 4: Architecture / Design Review

Trigger: user asks to design a new system, redesign an existing module, evaluate tradeoffs, or make a structural decision.

```
DO NOT design or architect yourself unless this is a 2-line config change.

Dispatch A6 (Plan, opus):

Task(
  description="<design problem, e.g. 'design caching layer for <component>'>",
  subagent_type="Plan",
  model="opus",
  prompt="""
Problem: <what needs to be designed or decided>
Constraints: <hard requirements — performance, compatibility, scale>
Current structure: <brief description of relevant existing code, 2–4 sentences>
Return:
  - Decision / recommendation (1 paragraph)
  - Files to touch (list)
  - Acceptance criteria (3–5 bullet points)
  - Key tradeoffs (2–3 bullet points)
No code unless a short snippet illustrates the decision.
"""
)
```

**When to use:** only when the decision is genuinely architectural (new abstraction, new dependency, cross-module changes). Single-function changes go to A4.

---

### Template 5: Math / Integrity QA

Trigger: user asks to verify a calculation, check a count, validate a schema, confirm a data invariant.

```
DO NOT verify math or run QA checks yourself.

Dispatch QA (haiku):

Task(
  description="verify <invariant name>",
  subagent_type="general-purpose",
  model="haiku",
  prompt="""
Verify: <specific invariant — e.g. 'sum of column X equals total Y'>
Data: <values, query result, or file to inspect>
Return: PASS or FAIL
If FAIL: observed value vs. expected value (one line each).
No prose. No explanation unless FAIL.
"""
)
```

**Savings vs. main-thread verification:** ~100–400 tokens per check.

---

## Parallel Dispatch Rule

Independent subtasks must be dispatched in a single response as multiple Task() calls. They run simultaneously.

```
# CORRECT — two independent fetches, one response:
Task(description="search codebase for symbol X", subagent_type="Explore", ...)
Task(description="fetch config from API", subagent_type="general-purpose", model="haiku", ...)

# WRONG — sequential despite no dependency:
Task(description="search codebase for symbol X", ...)
# ... waits for result ...
Task(description="fetch config from API", ...)
```

**Phased pattern for dependent tasks:**

```
Phase 1 (parallel):  A1 investigate + A2 fetch data
Phase 2 (sequential after Phase 1): orchestrator synthesizes
Phase 3 (parallel):  A4 edit file A + A4 edit file B
Phase 4 (parallel):  QA verify file A + QA verify file B
```

Maximum 4 parallel Task() calls per dispatch. For larger workflows, batch into phases.

---

## Session Reuse Rule

For multi-turn iterations on the same task (edit → review → re-edit), continue in the existing agent session rather than spawning fresh agents. A fresh agent per iteration pays the context-load tax on every iteration.

Pattern:
```
Turn 1: spawn A4, capture agent_id
Turn 2: SendMessage(agent_id, "Revise the function to also handle <edge case>")
Turn 3: SendMessage(agent_id, "Now add a unit test for that branch")
```

vs. the wasteful pattern:
```
Turn 1: Task(...) — agent loads full context
Turn 2: Task(...) — NEW agent loads full context again
Turn 3: Task(...) — THIRD new agent loads full context again
```

---

## Anti-Patterns

| Anti-Pattern | Symptom | Fix | Est. Waste |
|---|---|---|---|
| Main-thread full file read | `Read("file.py")` for a 300+ line file | Dispatch A1 (Explore haiku) with targeted line range | ~500 tokens/read |
| Main-thread code generation | `Edit()` or `Write()` called in main thread | Dispatch A4 (sonnet) | ~300–800 tokens/edit |
| Sequential independent tasks | 3 Task() calls in sequence with no data dependency | Dispatch all 3 in one response (parallel) | ~2x latency + tokens |
| Opus on grep | Main thread calls Grep for a symbol | Dispatch A1 (Explore) — costs ~10x less | ~400 tokens/grep |
| Missing ROUTE declaration | Main thread jumps to tools without ROUTE/WHY header | §5.3 mandates ROUTE on every non-trivial turn | unpredictable drift |

---

## When Opus IS the Right Choice

Use the main thread at opus tier for:

- **Intent parsing** — understanding what the user actually wants (ambiguous, implicit, multi-part requests)
- **Decision-making** — choosing between approaches when tradeoffs require judgment
- **Result synthesis** — combining outputs from multiple sub-agents into a coherent, concise response
- **Architecture** — designing new abstractions or restructuring systems (delegate via A6 Plan if multi-file)
- **User communication** — the final response the user reads

Escalate to A6 or A7 (opus sub-agents) ONLY for:
- Designing new strategies or architectures that require extended reasoning
- Evaluating ML/forecasting approaches
- Complex multi-step reasoning with more than ~3 unknown variables

Everything else: sonnet (A4, A5) or haiku (A1, A2, QA).

---

## Quick Reference

```
User says "fix X"        → A1(haiku) find → orchestrator decide → A4(sonnet) edit → QA(haiku) verify
User says "add feature"  → A4(sonnet) implement → QA(haiku) verify
User says "where is X"   → A1(haiku Explore) search → orchestrator summarize
User says "fetch data"   → A2(haiku) fetch → orchestrator use
User says "write report" → A5(sonnet) generate → orchestrator review
User says "redesign"     → A6(Plan, opus) design → A4(sonnet) implement → QA(haiku) verify
User says "check math"   → QA(haiku) verify → orchestrator report result
```

---

## Cost Savings Estimate

| Scenario | Without kit | With kit | Savings |
|---|---|---|---|
| Fix a bug (find + edit + verify) | ~5K main-thread | ~500 main + 3K sonnet + 1K haiku | ~60% |
| Multi-file investigation | ~4K main-thread | ~200 main + 2K haiku | ~55% |
| Generate documentation | ~8K main-thread | ~300 main + 5K sonnet + 500 haiku | ~65% |
| Full multi-step workflow | ~25K main-thread | ~2K main + 8K sonnet + 5K haiku | ~65% |
