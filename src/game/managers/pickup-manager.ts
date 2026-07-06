import { createScroller } from "../core/scroller"
import { createSpawner } from "../core/spawner"
import { createPickup } from "../entities/pickup"
import type { Player } from '../entities/player'

const SPAWN_INTERVAL = 180

export const createPickupManager = (
    scope: paper.PaperScope,
    groundY: number,
    player: Player,
    getObstacleBounds: () => paper.Rectangle[],
    getSpeed: () => number,
) => {
    const pickups: ReturnType<typeof createScroller>[] = [];

    const overlapsObstacle = (shape: paper.Item) =>
        getObstacleBounds().some(b => b.intersects(shape.bounds));

    const spawner = createSpawner(SPAWN_INTERVAL, () => {
        const shape = createPickup(scope, groundY);
        if (overlapsObstacle(shape)) {
            shape.remove();
        } else {
            pickups.push(createScroller(scope, shape, player, getSpeed, () => player.collect()));
        }
    });

    const update = () => {
        spawner.tick();

        for (let i = pickups.length - 1; i >= 0; i--) {
            if (pickups[i].update()) pickups.splice(i, 1);
        }
    };

    return { update };
};
