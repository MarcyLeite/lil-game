import bgSprite from '../../assets/bg.png'
import { createTiledScroller } from '../core/tiled-scroller'
import type { Viewport } from '../core/viewport'

const BG_HEIGHT = 64
const BG_OPACITY = 0.2
const PARALLAX_FACTOR = 0.3

export const createBackground = (scope: paper.PaperScope, viewport: Viewport, getSpeed: () => number) =>
    createTiledScroller(scope, viewport, {
        src: bgSprite,
        height: BG_HEIGHT,
        getTop: () => viewport.getGroundY() - BG_HEIGHT,
        getSpeed: () => getSpeed() * PARALLAX_FACTOR,
        opacity: BG_OPACITY,
        sendToBack: true,
    });
