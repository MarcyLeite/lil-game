import { createSprite } from '../core/sprite'
import { createEmitter } from '../core/emitter'
import walkSprite from '../../assets/player-walk.png'
import duckSprite from '../../assets/player-duck.png'

const TOTAL_LIVES = 3
const PLAYER_WIDTH = 25
const PLAYER_HEIGHT = 35
const PLAYER_OFFSET = 20
const GRAVITY = 0.5
const JUMP_FORCE = 10
const MIN_JUMP_FORCE = 4

type PlayerEvents = {
    damage: [remaining: number];
    death: [];
    collect: [total: number];
};

export type Player = ReturnType<typeof createPlayer>;

export const createPlayer = (scope: paper.PaperScope, groundY: number) => {
    const hitbox = new scope.Path.Rectangle({
        point: new scope.Point(scope.view.bounds.left + PLAYER_OFFSET, groundY - PLAYER_HEIGHT),
        size: new scope.Size(PLAYER_WIDTH, PLAYER_HEIGHT),
        opacity: 0,
    });

    const sprite = createSprite(
        scope,
        { width: PLAYER_WIDTH, height: PLAYER_HEIGHT },
        hitbox.bounds.center,
        {
            walk: { src: walkSprite, frameCount: 4 },
            duck: { src: duckSprite, frameCount: 2 },
        },
    );
    const events = createEmitter<PlayerEvents>();

    let velocityY = 0;
    let isShrunk = false;
    let lives = TOTAL_LIVES;
    let score = 0;

    const takeDamage = () => {
        if (lives === 0) return;
        lives--;
        events.emit('damage', lives);
        if (lives === 0) events.emit('death');
    };

    const collect = () => {
        score++;
        events.emit('collect', score);
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
        pinToGround();
    };

    const restore = () => {
        if (!isShrunk) return;
        isShrunk = false;
        hitbox.scale(2);
        pinToGround();
    };

    const update = () => {
        velocityY += GRAVITY;
        hitbox.position.y += velocityY;

        const r = effectiveRadius();
        if (hitbox.position.y >= groundY - r) {
            hitbox.position.y = groundY - r;
            velocityY = 0;
        }
    };

    const render = () => {
        const anim = isShrunk ? 'duck' : 'walk';
        if (isOnGround()) sprite.play(anim);
        else sprite.hold(anim, 1);
        sprite.setCenter(hitbox.bounds.center);
        sprite.update();
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

    return { hitbox, takeDamage, collect, on: events.on, totalLives: TOTAL_LIVES, update, render };
}
