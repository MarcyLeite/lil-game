import lifeIcon from '../../assets/life.png'
import { createRaster } from '../core/raster'
import type { Player } from '../entities/player'

const LIFE_RADIUS = 8
const LIFE_GAP = 6
const HUD_MARGIN = 15

export const createHud = (scope: paper.PaperScope, player: Player) => {
    const icons: paper.Raster[] = [];

    for (let i = 0; i < player.totalLives; i++) {
        const center = new scope.Point(
            HUD_MARGIN + i * (LIFE_RADIUS * 2 + LIFE_GAP) + LIFE_RADIUS,
            HUD_MARGIN + LIFE_RADIUS,
        );
        const raster = createRaster(scope, lifeIcon, center, LIFE_RADIUS * 2, LIFE_RADIUS * 2);
        icons.push(raster);
    }

    const scoreText = new scope.PointText({
        point: new scope.Point(scope.view.bounds.right - HUD_MARGIN, HUD_MARGIN + LIFE_RADIUS),
        content: 'Score: 0',
        fillColor: 'white',
        fontFamily: 'monospace',
        fontSize: 14,
        justification: 'right',
    });

    player.on('damage', remaining => {
        while (icons.length > remaining) {
            icons.pop()?.remove();
        }
    });

    player.on('collect', total => {
        scoreText.content = `Score: ${total}`;
    });
}
