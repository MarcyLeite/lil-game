import groundSprite from '../../assets/ground.png'
import { createTiledScroller } from '../core/tiled-scroller'
import type { Viewport } from '../core/viewport'

const TILE_HEIGHT = 24

export const createGround = (scope: paper.PaperScope, viewport: Viewport, getSpeed: () => number) =>
    createTiledScroller(scope, viewport, {
        src: groundSprite,
        height: TILE_HEIGHT,
        getTop: () => viewport.getGroundY(),
        getSpeed,
    });
