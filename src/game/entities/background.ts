import bgSprite from '../../assets/bg.png'
import { createTiledScroller } from '../core/tiled-scroller'

const BG_HEIGHT = 64
const BG_OPACITY = 0.2
const PARALLAX_FACTOR = 0.3

export const createBackground = (scope: paper.PaperScope, groundY: number, getSpeed: () => number) =>
    createTiledScroller(scope, {
        src: bgSprite,
        height: BG_HEIGHT,
        top: groundY - BG_HEIGHT,
        getSpeed: () => getSpeed() * PARALLAX_FACTOR,
        opacity: BG_OPACITY,
        sendToBack: true,
    });
