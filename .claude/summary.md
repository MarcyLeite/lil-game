# Game Architecture

A side-scrolling runner built on paper.js. The player runs, jumps over ground obstacles, ducks under aerial obstacles, and collects airborne pickups. Difficulty (scroll speed) scales with time.

## Folder layout

```
src/game/
  index.ts                         # composer: single frame loop, returns { destroy }
  core/                            # reusable primitives
    difficulty.ts                  # speed curve + tick counter
    emitter.ts                     # generic typed event emitter
    input.ts                       # keyboard + mouse → semantic action events
    raster.ts                      # createRaster + createSheet loader helpers
    scroller.ts                    # "moves left + intersects player" behavior
    spawner.ts                     # interval-triggered spawn callback
    sprite.ts                      # generic animated sprite (named animations)
  entities/                        # things that exist in the game world
    aerial-obstacle.ts             # animated aerial obstacle (hitbox + sprite)
    background.ts                  # tiled parallax backdrop
    ground.ts                      # tiled scrolling ground strip
    ground-obstacle.ts             # static ground obstacle factory
    pickup.ts                      # airborne pickup factory
    player-body.ts                 # physics + posture (hitbox, jump, ducking)
    player.ts                      # composes body + sprite; owns lives, score, events
  managers/                        # spawn + track collections of entities
    obstacle-manager.ts
    pickup-manager.ts
  ui/
    hud.ts                         # renders lives + score, pure listener
```

Folders group by role: `core/` = reusable building blocks, `entities/` = scene-present things, `managers/` = collection spawners/trackers, `ui/` = HUD/menus.

## Core primitives (`core/`)

- **`raster.ts`** — centralizes `new Raster + onLoad + scale`. Two variants: `createRaster` (single icon) and `createSheet` (spritesheet).
- **`emitter.ts`** — generic `createEmitter<T extends Record<string, unknown[]>>()`. Keys are event names, values are argument tuples. Typed `on`/`emit`.
- **`sprite.ts`** — generic animated sprite. `createSprite(scope, {width, height}, initialCenter, animations)`. `play(name)`, `hold(name, frame)`, `setCenter(point)`, `update()`, `remove()`. Sprite owns its position (no coupling to hitbox) — entities call `setCenter` each frame to sync.
- **`scroller.ts`** — unified "moves left + intersects player + removes self when hit or off-screen." `createScroller(scope, shape, player, getSpeed, onHit)`. `update()` returns `true` when the scroller is done.
- **`difficulty.ts`** — `createDifficulty()` owns the speed curve constants and a tick counter. Exposes `tick()` and `getSpeed()`.
- **`input.ts`** — maps physical inputs to semantic action events: `jump`, `jumpCancel`, `duck`, `unduck`. Keys and mouse triggers configured here. Returns `{ on, destroy }`.
- **`spawner.ts`** — `createSpawner(interval, spawn)` returns `{ tick }`. Every `interval`-th tick, calls `spawn()`.

## Entities

- **`player-body.ts`** — the physical player: hitbox, velocity, gravity, jump/cancel-jump, shrink/restore (ducking), ground detection, `update()`. Owns all physics constants (dimensions, gravity, jump forces). Exposes `isDucking()`, `isOnGround()` getters.
- **`player.ts`** — the game character. Composes body + sprite, owns lives + score state, wires input to body actions, emits gameplay events. Exposes `type Player = ReturnType<typeof createPlayer>` used across other modules.
- **`ground-obstacle.ts`** — static raster (used as both visual and hitbox). No animation.
- **`aerial-obstacle.ts`** — animated obstacle: separate invisible hitbox + animated sprite. Returns `{ hitbox, render, cleanup }`. `cleanup` is required because sprite is a separate paper item from the hitbox.
- **`pickup.ts`** — airborne collectible. Static raster.
- **`ground.ts`** — tiles `ground.png` across the view width and scrolls at `getSpeed()`, wrapping tiles from left to right. Exposes `{ update }`.
- **`background.ts`** — tiles `bg.png` above `groundY` and scrolls at `getSpeed() * PARALLAX_FACTOR` for a parallax layer behind the scene. Applies `BG_OPACITY` to fade it and sends tiles to back on load. Exposes `{ update }`.

## Player events

The player is the central event source. Emits events **with values** — subscribers don't derive state:

```ts
type PlayerEvents = {
    damage: [remaining: number];  // fires on takeDamage(), carries lives left
    death: [];                    // fires when lives hit 0
    collect: [total: number];     // fires on collect(), carries new score
};
```

- **HUD** subscribes to `damage` (removes life icons down to `remaining`) and `collect` (updates score text with `total`).
- **`index.ts`** subscribes to `death` (shows game over screen).

## Physics ≠ rendering

Entities never touch `scope.view.onFrame`. `index.ts` owns the single frame loop:

```ts
scope.view.onFrame = () => {
    difficulty.tick();
    player.update();       // physics
    player.render();       // sprite frame + position
    background.update();   // parallax layer
    ground.update();       // scrolling ground strip
    obstacleManager.update();
    pickupManager.update();
};
```

- `update()` = state/behavior (physics, movement, collision).
- `render()` = drives visuals (sprite frame advance, sheet panning).

Obstacle-manager tracks `{ scroller, render?, cleanup? }` per item and drives each render explicitly rather than routing through the scroller. Aerial obstacles scroll at `getSpeed() * AERIAL_SPEED_FACTOR` (their scroller wraps the base speed) so bees feel a touch slower than ground scenery.

## Lifecycle

`createGame(scope)` returns `{ destroy }`. `destroy()` breaks three external anchors:

- `scope.view.onFrame = null` — stops the frame loop
- `input.destroy()` — removes window listeners + paper Tool
- `scope.project.activeLayer.removeChildren()` — clears all scene items

Everything else (emitters, entity closures, manager state) is GC'd naturally once these anchors break. This enables restart/level flows without leaking listeners.

## Conventions

- **Events for state changes with potential multiple subscribers** (player events, input events); **function-injection for stateful reads** (`getObstacleBounds`, `getSpeed`) — those are queries, not notifications.
- **Events carry authoritative values**. Listeners don't count locally; the emitter passes the number.
- **Types shared across modules** live with their owning file and export via `ReturnType<typeof factory>` (e.g., `Player`, `Input`, `PlayerBody`).
- **Generic names for entity variants** — `ground-obstacle`/`aerial-obstacle`, not `cactus`/`bee`. Code describes role, not art asset.
- **Constants stay with their owner** — `PLAYER_WIDTH` in `player-body.ts`, `PICKUP_SIZE` in `pickup.ts`, `SPAWN_INTERVAL` in each manager. No central config file at this scale — colocation is more discoverable.
- **Cleanup is explicit** when an entity creates multiple paper items (see `aerial-obstacle.ts`). Two items to create = two items to dispose. Not hidden.

## Known open threads

- **State machine for player animations**: as more animations arrive (jump-specific, damage, land-impact), the `isOnGround ? play(anim) : hold(anim, 1)` logic in `player.render()` will grow into a state machine. Not needed yet.
- **Restart flow**: `destroy()` exists but no UI/logic invokes it. A game-over screen with a "restart" button would use it.
- **Sound**: no audio module — collect/damage/jump/game-over sounds would need one.
- **Tests**: no test suite. Pure functions (`emitter`, `scroller` collision math, `difficulty` speed curve, `spawner` tick logic) are the natural first targets.

Typecheck (`npx tsc --noEmit`) passes clean.
