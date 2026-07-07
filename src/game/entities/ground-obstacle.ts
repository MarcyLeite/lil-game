import cactusSprite from '../../assets/cacto.png'
import { createRaster } from '../core/raster'
import type { Viewport } from '../core/viewport'

const GROUND_WIDTH = 20
const GROUND_HEIGHT = 40

export const createGroundObstacle = (scope: paper.PaperScope, viewport: Viewport) => {
    return createRaster(
        scope,
        cactusSprite,
        new scope.Point(viewport.getRight() + GROUND_WIDTH / 2, viewport.getGroundY() - GROUND_HEIGHT / 2),
        GROUND_WIDTH,
        GROUND_HEIGHT,
    );
};
