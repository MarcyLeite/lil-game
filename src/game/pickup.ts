export const createPickup = (scope: paper.PaperScope, shape: paper.Item, player: paper.Path, onCollect: () => void, getSpeed: () => number) => {
    const update = () => {
        shape.position.x -= getSpeed();

        if (shape.bounds.intersects(player.bounds)) {
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
