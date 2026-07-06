import cactusSprite from '../../assets/cacto.png'
import { createRaster } from '../core/raster'

const GROUND_WIDTH = 20
const GROUND_HEIGHT = 40

export const createGroundObstacle = (scope: paper.PaperScope, groundY: number) => {
    return createRaster(
        scope,
        cactusSprite,
        new scope.Point(scope.view.bounds.right + GROUND_WIDTH / 2, groundY - GROUND_HEIGHT / 2),
        GROUND_WIDTH,
        GROUND_HEIGHT,
    );
};
