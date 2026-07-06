import starIcon from '../../assets/star.png'
import { createRaster } from '../core/raster'

const PICKUP_SIZE = 16
const MIN_OFFSET_Y = 20
const MAX_OFFSET_Y = 100

export const createPickup = (scope: paper.PaperScope, groundY: number) => {
    const offsetY = Math.random() * (MAX_OFFSET_Y - MIN_OFFSET_Y) + MIN_OFFSET_Y;
    return createRaster(
        scope,
        starIcon,
        new scope.Point(scope.view.bounds.right, groundY - PICKUP_SIZE - offsetY),
        PICKUP_SIZE,
        PICKUP_SIZE,
    );
};
