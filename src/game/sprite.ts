import walkSprite from '../assets/player-walk.png'
import duckSprite from '../assets/player-duck.png'
import { createSheet } from './raster'

const ANIM_SPEED = 8

export const createSprite = (scope: paper.PaperScope, initialBounds: paper.Rectangle) => {
    const displayW = initialBounds.width;
    const displayH = initialBounds.height;

    const clipRect = new scope.Path.Rectangle({
        rectangle: initialBounds,
        fillColor: 'white',
    });

    const loadSheet = (src: string, frameCount: number) => ({
        raster: createSheet(scope, src, displayW, displayH, frameCount),
        frameCount,
    });

    const walk = loadSheet(walkSprite, 4);
    const duck = loadSheet(duckSprite, 2);
    duck.raster.visible = false;

    new scope.Group({ children: [clipRect, walk.raster, duck.raster], clipped: true });

    let tick = 0;
    let ducking = false;

    const panSheet = (raster: paper.Raster, frameCount: number, center: paper.Point, frame: number) => {
        raster.position.y = center.y;
        raster.position.x = center.x + displayW * (frameCount / 2 - frame) - displayW / 2;
    };

    const update = (bounds: paper.Rectangle, onGround: boolean) => {
        tick++;
        const active = ducking ? duck : walk;
        const frame = onGround ? Math.floor(tick / ANIM_SPEED) % active.frameCount : 1;

        clipRect.position = bounds.center;
        panSheet(active.raster, active.frameCount, bounds.center, frame);
    };

    const setDucking = (value: boolean) => {
        ducking = value;
        walk.raster.visible = !value;
        duck.raster.visible = value;
    };

    return { update, setDucking };
};
