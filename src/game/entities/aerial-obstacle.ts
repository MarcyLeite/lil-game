import beeSprite from '../../assets/bee.png'
import { createSprite } from '../core/sprite'
import type { Viewport } from '../core/viewport'

const AERIAL_SIZE = 32
const AERIAL_FRAME_COUNT = 4
const AERIAL_ANIM_SPEED = 6
const AERIAL_SPEED_FACTOR = 0.9
const MIN_OFFSET_Y = 20
const MAX_OFFSET_Y = 120

export const createAerialObstacle = (scope: paper.PaperScope, viewport: Viewport, getSpeed: () => number) => {
    const offsetY = Math.random() * (MAX_OFFSET_Y - MIN_OFFSET_Y) + MIN_OFFSET_Y;
    const center = new scope.Point(
        viewport.getRight() + AERIAL_SIZE / 2,
        viewport.getGroundY() - AERIAL_SIZE / 2 - offsetY,
    );

    const hitbox = new scope.Path.Rectangle({
        point: new scope.Point(center.x - AERIAL_SIZE / 2, center.y - AERIAL_SIZE / 2),
        size: new scope.Size(AERIAL_SIZE, AERIAL_SIZE),
        opacity: 0,
    });

    const sprite = createSprite(
        scope,
        { width: AERIAL_SIZE, height: AERIAL_SIZE },
        center,
        { fly: { src: beeSprite, frameCount: AERIAL_FRAME_COUNT, speed: AERIAL_ANIM_SPEED } },
    );
    sprite.play('fly');

    const render = () => {
        sprite.setCenter(hitbox.bounds.center);
        sprite.update();
    };

    const cleanup = () => sprite.remove();

    const speed = () => getSpeed() * AERIAL_SPEED_FACTOR;

    return { hitbox, render, cleanup, speed };
};
