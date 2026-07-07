type Options = {
    src: string,
    height: number,
    top: number,
    getSpeed: () => number,
    opacity?: number,
    sendToBack?: boolean,
};

export const createTiledScroller = (scope: paper.PaperScope, options: Options) => {
    const tiles: paper.Raster[] = [];
    let tileWidth = 0;

    const template = new scope.Raster(options.src);
    template.visible = false;
    template.onLoad = () => {
        tileWidth = template.width * (options.height / template.height);
        const viewWidth = scope.view.bounds.width;
        const count = Math.ceil(viewWidth / tileWidth) + 1;
        for (let i = 0; i < count; i++) {
            const tile = template.clone();
            tile.visible = true;
            if (options.opacity !== undefined) tile.opacity = options.opacity;
            tile.scale(tileWidth / template.width, options.height / template.height);
            tile.position = new scope.Point(
                scope.view.bounds.left + i * tileWidth + tileWidth / 2,
                options.top + options.height / 2,
            );
            if (options.sendToBack) tile.sendToBack();
            tiles.push(tile);
        }
        template.remove();
    };

    const update = () => {
        if (tiles.length === 0) return;
        const speed = options.getSpeed();
        for (const tile of tiles) {
            tile.position.x -= speed;
            if (tile.position.x + tileWidth / 2 < scope.view.bounds.left) {
                tile.position.x += tiles.length * tileWidth;
            }
        }
    };

    return { update };
};
