import { createPickup } from "./pickup"
import starIcon from '../assets/star.png'

const SPAWN_INTERVAL = 180
const PICKUP_SIZE = 16

export const createPickupManager = (
    scope: paper.PaperScope,
    groundY: number,
    player: paper.Path,
    onCollect: () => void,
    getObstacleBounds: () => paper.Rectangle[],
    getSpeed: () => number,
) => {
    const pickups: ReturnType<typeof createPickup>[] = [];
    let frameCount = 0;

    const spawnShape = () => {
        const offsetY = Math.random() * 80 + 20;
        const raster = new scope.Raster(starIcon);
        raster.position = new scope.Point(scope.view.bounds.right, groundY - PICKUP_SIZE - offsetY);
        raster.onLoad = () => {
            raster.scale(PICKUP_SIZE / raster.width, PICKUP_SIZE / raster.height);
        };
        return raster;
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
                pickups.push(createPickup(scope, shape, player, onCollect, getSpeed));
            }
        }

        for (let i = pickups.length - 1; i >= 0; i--) {
            if (pickups[i].update()) pickups.splice(i, 1);
        }
    };

    return { update };
};
