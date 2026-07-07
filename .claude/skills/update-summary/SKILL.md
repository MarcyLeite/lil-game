---
name: update-summary
description: Keep .claude/summary.md in sync with the current game architecture. Use when the user asks to "update the summary", "refresh the architecture doc", or after non-trivial changes to folder layout, core primitives, entities, managers, the frame loop, or lifecycle. Skip for pure content tweaks (constants, sprites, copy) that don't change structure.
---

# Update Summary

`.claude/summary.md` is the canonical architecture doc for this project. It describes folders, core primitives, entities, managers, the player event contract, the frame loop, lifecycle, and conventions. Keep it accurate to the current code — it's what future sessions read to onboard.

## When to update

Update the summary when the recent changes affect any of:

- **Folder layout** — a new file under `src/game/` (especially in `core/`, `entities/`, `managers/`, `ui/`).
- **Core primitives** — new/removed/renamed helper in `core/`, or a signature change worth documenting.
- **Entities** — new entity, removed entity, or a meaningful behavior change (new events, new lifecycle hook).
- **Managers** — new manager, or a change to how it composes scrollers/spawners.
- **Player events** — added, removed, or reshaped events on the player emitter.
- **Frame loop** — new `update()` / `render()` call added to or removed from `scope.view.onFrame`.
- **Lifecycle** — a new external anchor `destroy()` must break, or a change to what it cleans up.
- **Conventions** — a new convention emerges (e.g., a shared config pattern) or an old one no longer holds.

Skip updates for:

- Tweaks to numeric constants (speed, size, opacity, intervals) — they're implementation details.
- Sprite swaps, copy changes, HUD styling.
- Bug fixes that don't change the API shape.

If unsure, ask the user before editing.

## How to update

1. Read `.claude/summary.md` end-to-end first — the doc has strong voice and structure; match it.
2. Read the actual changed files to confirm what's real (don't paraphrase from memory or from the diff alone).
3. Edit the sections that need it:
   - Folder layout tree — keep files alphabetized within their folder, one-line comments in the same style.
   - Core primitives / Entities / Managers bullets — bold the filename, then dash + description.
   - Frame loop code block — mirror the actual call order in `src/game/index.ts`.
4. Preserve the existing tone: terse, declarative, avoids fluff. Don't add filler like "This is important because…".
5. If you introduced a new convention, add it to the **Conventions** section rather than sprinkling it elsewhere.
6. If you closed a "Known open threads" item, remove it from that section.

## What not to do

- Don't rewrite the whole file. Edit only the sections affected.
- Don't add emojis, timestamps, or a changelog section — the doc is a snapshot, not a history.
- Don't restate what the code trivially shows (types, imports). Document the *why* and the shape.
- Don't invent new sections without a clear reason — the existing structure has been deliberate.

## Verification

After editing, re-read the affected sections and confirm every claim maps to a real file/function. If you documented a symbol name, grep for it to make sure it exists.
