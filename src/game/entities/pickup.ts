import starIcon from '../../assets/star.png'
import { createRaster } from '../core/raster'
import type { Viewport } from '../core/viewport'

const PICKUP_SIZE = 16
const MIN_OFFSET_Y = 20
const MAX_OFFSET_Y = 100

export const createPickup = (scope: paper.PaperScope, viewport: Viewport) => {
    const offsetY = Math.random() * (MAX_OFFSET_Y - MIN_OFFSET_Y) + MIN_OFFSET_Y;
    return createRaster(
        scope,
        starIcon,
        new scope.Point(viewport.getRight(), viewport.getGroundY() - PICKUP_SIZE - offsetY),
        PICKUP_SIZE,
        PICKUP_SIZE,
    );
};
