import type { Player } from '../entities/player'

export const createScroller = (
    scope: paper.PaperScope,
    shape: paper.Item,
    player: Player,
    getSpeed: () => number,
    onHit: () => void,
) => {
    const update = () => {
        shape.position.x -= getSpeed();

        if (shape.bounds.intersects(player.hitbox.bounds)) {
            shape.remove();
            onHit();
            return true;
        }

        if (shape.position.x < scope.view.bounds.left - shape.bounds.width) {
            shape.remove();
            return true;
        }

        return false;
    };

    return { shape, update };
};
