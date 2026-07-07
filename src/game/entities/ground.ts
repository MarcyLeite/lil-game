import groundSprite from '../../assets/ground.png'
import { createTiledScroller } from '../core/tiled-scroller'

const TILE_HEIGHT = 24

export const createGround = (scope: paper.PaperScope, groundY: number, getSpeed: () => number) =>
    createTiledScroller(scope, {
        src: groundSprite,
        height: TILE_HEIGHT,
        top: groundY,
        getSpeed,
    });
