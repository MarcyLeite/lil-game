import type { Player } from './player'

export const createObstacle = (scope: paper.PaperScope, shape: paper.Item, player: Player, getSpeed: () => number, onTick?: () => void) => {
    const update = () => {
        shape.position.x -= getSpeed();
        onTick?.();

        if (shape.bounds.intersects(player.hitbox.bounds)) {
            shape.remove();
            player.takeDamage();
            return true;
        }

        if (shape.position.x < scope.view.bounds.left - shape.bounds.width) {
            shape.remove();
            return true;
        }

        return false;
    };

    return { obstacle: shape, update };
};
