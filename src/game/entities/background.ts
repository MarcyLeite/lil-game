import bgSprite from '../../assets/bg.png'

const BG_HEIGHT = 64
const BG_OPACITY = 0.2
const PARALLAX_FACTOR = 0.3

export const createBackground = (scope: paper.PaperScope, groundY: number, getSpeed: () => number) => {
    const tiles: paper.Raster[] = [];
    let tileWidth = 0;

    const template = new scope.Raster(bgSprite);
    template.visible = false;
    template.onLoad = () => {
        tileWidth = template.width * (BG_HEIGHT / template.height);
        const viewWidth = scope.view.bounds.width;
        const count = Math.ceil(viewWidth / tileWidth) + 1;
        for (let i = 0; i < count; i++) {
            const tile = template.clone();
            tile.visible = true;
            tile.opacity = BG_OPACITY;
            tile.scale(tileWidth / template.width, BG_HEIGHT / template.height);
            tile.position = new scope.Point(
                scope.view.bounds.left + i * tileWidth + tileWidth / 2,
                groundY - BG_HEIGHT / 2,
            );
            tile.sendToBack();
            tiles.push(tile);
        }
    };

    const update = () => {
        if (tiles.length === 0) return;
        const speed = getSpeed() * PARALLAX_FACTOR;
        for (const tile of tiles) {
            tile.position.x -= speed;
            if (tile.position.x + tileWidth / 2 < scope.view.bounds.left) {
                tile.position.x += tiles.length * tileWidth;
            }
        }
    };

    return { update };
};
