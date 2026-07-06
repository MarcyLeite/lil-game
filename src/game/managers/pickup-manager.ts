import { createScroller } from "../core/scroller"
import starIcon from '../../assets/star.png'
import { createRaster } from '../core/raster'
import type { Player } from '../entities/player'

const SPAWN_INTERVAL = 180
const PICKUP_SIZE = 16

export const createPickupManager = (
    scope: paper.PaperScope,
    groundY: number,
    player: Player,
    getObstacleBounds: () => paper.Rectangle[],
    getSpeed: () => number,
) => {
    const pickups: ReturnType<typeof createScroller>[] = [];
    let frameCount = 0;

    const spawnShape = () => {
        const offsetY = Math.random() * 80 + 20;
        return createRaster(scope, starIcon, new scope.Point(scope.view.bounds.right, groundY - PICKUP_SIZE - offsetY), PICKUP_SIZE, PICKUP_SIZE);
    };

    const overlapsObstacle = (shape: paper.Item) =>
        getObstacleBounds().some(b => b.intersects(shape.bounds));

    const update = () => {
        frameCount++;
        if (frameCount % SPAWN_INTERVAL === 0) {
            const shape = spawnShape();
            if (overlapsObstacle(shape)) {
                shape.remove();
            } else {
                pickups.push(createScroller(scope, shape, player, getSpeed, () => player.collect()));
            }
        }

        for (let i = pickups.length - 1; i >= 0; i--) {
            if (pickups[i].update()) pickups.splice(i, 1);
        }
    };

    return { update };
};
