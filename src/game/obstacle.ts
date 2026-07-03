export const createObstacle = (scope: paper.PaperScope, shape: paper.Item, player: paper.Path, onCollision: () => void, getSpeed: () => number, onTick?: () => void) => {
    const update = () => {
        shape.position.x -= getSpeed();
        onTick?.();

        if (shape.bounds.intersects(player.bounds)) {
            shape.remove();
            onCollision();
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
