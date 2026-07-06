import type { Player } from './player'

export const createPickup = (scope: paper.PaperScope, shape: paper.Item, player: Player, onCollect: () => void, getSpeed: () => number) => {
    const update = () => {
        shape.position.x -= getSpeed();

        if (shape.bounds.intersects(player.hitbox.bounds)) {
            shape.remove();
            onCollect();
            return true;
        }

        if (shape.position.x < scope.view.bounds.left - shape.bounds.width) {
            shape.remove();
            return true;
        }

        return false;
    };

    return { update };
};
