import type { Viewport } from '../core/viewport'

const PLAYER_WIDTH = 25
const PLAYER_HEIGHT = 35
const PLAYER_OFFSET = 20
const GRAVITY = 0.5
const JUMP_FORCE = 10
const MIN_JUMP_FORCE = 4

export type PlayerBody = ReturnType<typeof createPlayerBody>;

export const createPlayerBody = (scope: paper.PaperScope, viewport: Viewport) => {
    const groundY = () => viewport.getGroundY();

    const hitbox = new scope.Path.Rectangle({
        point: new scope.Point(viewport.getLeft() + PLAYER_OFFSET, groundY() - PLAYER_HEIGHT),
        size: new scope.Size(PLAYER_WIDTH, PLAYER_HEIGHT),
        opacity: 0,
    });

    let velocityY = 0;
    let ducking = false;

    const effectiveRadius = () => hitbox.bounds.height / 2;
    const isOnGround = () => hitbox.position.y >= groundY() - effectiveRadius();
    const isDucking = () => ducking;

    const pinToGround = () => {
        hitbox.position.y = groundY() - effectiveRadius();
    };

    const pinToLeft = () => {
        hitbox.position.x = viewport.getLeft() + PLAYER_OFFSET + hitbox.bounds.width / 2;
    };

    const jump = () => {
        if (ducking || !isOnGround()) return;
        velocityY = -JUMP_FORCE;
    };

    const cancelJump = () => {
        if (velocityY < -MIN_JUMP_FORCE) velocityY = -MIN_JUMP_FORCE;
    };

    const shrink = () => {
        if (ducking || !isOnGround()) return;
        ducking = true;
        hitbox.scale(0.5);
        pinToGround();
    };

    const restore = () => {
        if (!ducking) return;
        ducking = false;
        hitbox.scale(2);
        pinToGround();
    };

    const update = () => {
        velocityY += GRAVITY;
        hitbox.position.y += velocityY;

        const r = effectiveRadius();
        if (hitbox.position.y >= groundY() - r) {
            hitbox.position.y = groundY() - r;
            velocityY = 0;
        }
    };

    viewport.onResize('resize', () => {
        pinToLeft();
        if (isOnGround()) pinToGround();
    });

    return { hitbox, jump, cancelJump, shrink, restore, isOnGround, isDucking, update };
};
