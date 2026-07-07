import { createScroller } from "../core/scroller"
import { createSpawner } from "../core/spawner"
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

    const spawner = createSpawner(SPAWN_INTERVAL, () => {
        if (Math.random() < 0.5) {
            items.push({ scroller: createScroller(scope, createGroundObstacle(scope, groundY), player, getSpeed, () => player.takeDamage()) });
        } else {
            const aerial = createAerialObstacle(scope, groundY, getSpeed);
            items.push({
                scroller: createScroller(scope, aerial.hitbox, player, aerial.speed, () => player.takeDamage()),
                render: aerial.render,
                cleanup: aerial.cleanup,
            });
        }
    });

    const update = () => {
        spawner.tick();

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
