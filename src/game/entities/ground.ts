import groundSprite from '../../assets/ground.png'

const TILE_HEIGHT = 24

export const createGround = (scope: paper.PaperScope, groundY: number, getSpeed: () => number) => {
    const tiles: paper.Raster[] = [];
    let tileWidth = 0;

    const template = new scope.Raster(groundSprite);
    template.visible = false;
    template.onLoad = () => {
        tileWidth = template.width * (TILE_HEIGHT / template.height);
        const viewWidth = scope.view.bounds.width;
        const count = Math.ceil(viewWidth / tileWidth) + 1;
        for (let i = 0; i < count; i++) {
            const tile = template.clone();
            tile.visible = true;
            tile.scale(tileWidth / template.width, TILE_HEIGHT / template.height);
            tile.position = new scope.Point(
                scope.view.bounds.left + i * tileWidth + tileWidth / 2,
                groundY + TILE_HEIGHT / 2,
            );
            tiles.push(tile);
        }
    };

    const update = () => {
        if (tiles.length === 0) return;
        const speed = getSpeed();
        for (const tile of tiles) {
            tile.position.x -= speed;
            if (tile.position.x + tileWidth / 2 < scope.view.bounds.left) {
                tile.position.x += tiles.length * tileWidth;
            }
        }
    };

    return { update };
};
