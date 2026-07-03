import lifeIcon from '../assets/life.png'

const LIFE_RADIUS = 8
const LIFE_GAP = 6
const HUD_MARGIN = 15

export const createHud = (scope: paper.PaperScope, totalLives: number) => {
    const icons: paper.Raster[] = [];

    for (let i = 0; i < totalLives; i++) {
        const center = new scope.Point(
            HUD_MARGIN + i * (LIFE_RADIUS * 2 + LIFE_GAP) + LIFE_RADIUS,
            HUD_MARGIN + LIFE_RADIUS,
        );
        const raster = new scope.Raster(lifeIcon);
        raster.position = center;
        raster.onLoad = () => {
            const size = LIFE_RADIUS * 2;
            raster.scale(size / raster.width, size / raster.height);
        };
        icons.push(raster);
    }

    let score = 0;
    const scoreText = new scope.PointText({
        point: new scope.Point(scope.view.bounds.right - HUD_MARGIN, HUD_MARGIN + LIFE_RADIUS),
        content: 'Score: 0',
        fillColor: 'white',
        fontFamily: 'monospace',
        fontSize: 14,
        justification: 'right',
    });

    const removeLife = () => {
        const icon = icons.pop();
        if (icon) icon.remove();
        return icons.length;
    };

    const addPoint = () => {
        score++;
        scoreText.content = `Score: ${score}`;
    };

    return { removeLife, addPoint };
}
