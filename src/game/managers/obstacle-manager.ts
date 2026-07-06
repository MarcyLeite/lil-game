import { createScroller } from "../core/scroller"
import { createGroundObstacle } from "../entities/ground-obstacle"
import { createAerialObstacle } from "../entities/aerial-obstacle"
import type { Player } from '../entities/player'

const SPAWN_INTERVAL = 120

type Item = {
    scroller: ReturnType<typeof createScroller>,
    render?: () => void,
    cleanup?: () => void,
};

export const createObstacleManager = (scope: paper.PaperScope, groundY: number, player: Player, getSpeed: () => number) => {
    const items: Item[] = [];
    let frameCount = 0;

    const update = () => {
        frameCount++;
        if (frameCount % SPAWN_INTERVAL === 0) {
            if (Math.random() < 0.5) {
                items.push({ scroller: createScroller(scope, createGroundObstacle(scope, groundY), player, getSpeed, () => player.takeDamage()) });
            } else {
                const { hitbox, render, cleanup } = createAerialObstacle(scope, groundY);
                items.push({
                    scroller: createScroller(scope, hitbox, player, getSpeed, () => player.takeDamage()),
                    render,
                    cleanup,
                });
            }
        }

        for (let i = items.length - 1; i >= 0; i--) {
            const done = items[i].scroller.update();
            if (done) {
                items[i].cleanup?.();
                items.splice(i, 1);
            } else {
                items[i].render?.();
            }
        }
    };

    const getObstacleBounds = () => items.map(i => i.scroller.shape.bounds);

    return { update, getObstacleBounds };
};
