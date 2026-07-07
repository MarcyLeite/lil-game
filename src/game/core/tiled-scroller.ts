import type { Viewport } from './viewport'

type Options = {
    src: string,
    height: number,
    getTop: () => number,
    getSpeed: () => number,
    opacity?: number,
    sendToBack?: boolean,
};

export const createTiledScroller = (scope: paper.PaperScope, viewport: Viewport, options: Options) => {
    const tiles: paper.Raster[] = [];
    let tileWidth = 0;
    let template: paper.Raster | null = null;

    const spawnTile = () => {
        if (!template) return null;
        const tile = template.clone();
        tile.visible = true;
        if (options.opacity !== undefined) tile.opacity = options.opacity;
        tile.scale(tileWidth / template.width, options.height / template.height);
        if (options.sendToBack) tile.sendToBack();
        tiles.push(tile);
        return tile;
    };

    const layout = () => {
        if (tiles.length === 0) return;
        const y = options.getTop() + options.height / 2;
        const left = viewport.getLeft();
        for (let i = 0; i < tiles.length; i++) {
            tiles[i].position = new scope.Point(left + i * tileWidth + tileWidth / 2, y);
        }
    };

    const ensureCoverage = () => {
        if (tileWidth === 0) return;
        const needed = Math.ceil(viewport.getWidth() / tileWidth) + 1;
        while (tiles.length < needed) spawnTile();
    };

    template = new scope.Raster(options.src);
    template.visible = false;
    template.onLoad = () => {
        if (!template) return;
        tileWidth = template.width * (options.height / template.height);
        ensureCoverage();
        layout();
    };

    viewport.onResize('resize', () => {
        ensureCoverage();
        layout();
    });

    const update = () => {
        if (tiles.length === 0) return;
        const speed = options.getSpeed();
        const left = viewport.getLeft();
        const totalWidth = tiles.length * tileWidth;
        for (const tile of tiles) {
            tile.position.x -= speed;
            if (tile.position.x + tileWidth / 2 < left) {
                tile.position.x += totalWidth;
            }
        }
    };

    return { update };
};
