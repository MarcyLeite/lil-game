import { createSprite } from './sprite'
import { createEmitter } from './emitter'

const TOTAL_LIVES = 3
const PLAYER_WIDTH = 25
const PLAYER_HEIGHT = 35
const PLAYER_OFFSET = 20
const GRAVITY = 0.5
const JUMP_FORCE = 10
const MIN_JUMP_FORCE = 4

type PlayerEvents = {
    damage: [];
    death: [];
};

export type Player = ReturnType<typeof createPlayer>;

export const createPlayer = (scope: paper.PaperScope, groundY: number) => {
    const hitbox = new scope.Path.Rectangle({
        point: new scope.Point(scope.view.bounds.left + PLAYER_OFFSET, groundY - PLAYER_HEIGHT),
        size: new scope.Size(PLAYER_WIDTH, PLAYER_HEIGHT),
        opacity: 0,
    });

    const sprite = createSprite(scope, hitbox.bounds);
    const events = createEmitter<PlayerEvents>();

    let velocityY = 0;
    let isShrunk = false;
    let lives = TOTAL_LIVES;

    const takeDamage = () => {
        if (lives === 0) return;
        lives--;
        events.emit('damage');
        if (lives === 0) events.emit('death');
    };

    const effectiveRadius = () => hitbox.bounds.height / 2;
    const isOnGround = () => hitbox.position.y >= groundY - effectiveRadius();

    const jump = () => {
        if (isShrunk || !isOnGround()) return;
        velocityY = -JUMP_FORCE;
    };

    const cancelJump = () => {
        if (velocityY < -MIN_JUMP_FORCE) velocityY = -MIN_JUMP_FORCE;
    };

    const pinToGround = () => {
        hitbox.position.y = groundY - effectiveRadius();
    };

    const shrink = () => {
        if (isShrunk || !isOnGround()) return;
        isShrunk = true;
        hitbox.scale(0.5);
        sprite.setDucking(true);
        pinToGround();
    };

    const restore = () => {
        if (!isShrunk) return;
        isShrunk = false;
        hitbox.scale(2);
        sprite.setDucking(false);
        pinToGround();
    };

    scope.view.onFrame = () => {
        velocityY += GRAVITY;
        hitbox.position.y += velocityY;

        const r = effectiveRadius();
        if (hitbox.position.y >= groundY - r) {
            hitbox.position.y = groundY - r;
            velocityY = 0;
        }

        sprite.update(hitbox.bounds, isOnGround());
    };

    const tool = new scope.Tool();
    tool.onMouseDown = jump;
    tool.onMouseUp = cancelJump;

    window.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') jump();
        if (e.code === 'ArrowDown' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') shrink();
    });

    window.addEventListener('keyup', (e: KeyboardEvent) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') cancelJump();
        if (e.code === 'ArrowDown' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') restore();
    });

    return { hitbox, takeDamage, on: events.on, totalLives: TOTAL_LIVES };
}
