import { createPlayer } from "./entities/player"
import { createObstacleManager } from "./managers/obstacle-manager"
import { createPickupManager } from "./managers/pickup-manager"
import { createHud } from "./ui/hud"

const BASE_SPEED = 3
const SPEED_INCREMENT = 0.5
const SPEED_INTERVAL = 300

export const createGame = (scope: paper.PaperScope) => {
    scope.view.element.style.background = '#0d1b4b';

    const groundY = scope.view.center.y;
    const player = createPlayer(scope, groundY);
    createHud(scope, player);

    let frameCount = 0;
    const getSpeed = () => BASE_SPEED + Math.floor(frameCount / SPEED_INTERVAL) * SPEED_INCREMENT;

    const showGameOver = () => {
        new scope.PointText({
            point: scope.view.center,
            content: 'GAME OVER',
            fillColor: 'white',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            fontSize: 48,
            justification: 'center',
        });
        scope.view.onFrame = null;
    };

    player.on('death', showGameOver);

    const obstacleManager = createObstacleManager(scope, groundY, player, getSpeed)
    const pickupManager = createPickupManager(scope, groundY, player, obstacleManager.getObstacleBounds, getSpeed)

    scope.view.onFrame = () => {
        frameCount++;
        player.update();
        player.render();
        obstacleManager.update();
        pickupManager.update();
    };
}
