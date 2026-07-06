import lifeIcon from '../assets/life.png'
import { createRaster } from './raster'
import type { Player } from './player'

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

    player.on('damage', () => {
        const icon = icons.pop();
        if (icon) icon.remove();
    });
}
