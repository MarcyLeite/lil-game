import { createPlayer } from "./player"
import { createObstacleManager } from "./obstacle-manager"
import { createPickupManager } from "./pickup-manager"
import { createHud } from "./hud"
import { createScore } from "./score"

const BASE_SPEED = 3
const SPEED_INCREMENT = 0.5
const SPEED_INTERVAL = 300 // frames (~5s at 60fps)

export const createGame = (scope: paper.PaperScope) => {
    scope.view.element.style.background = '#0d1b4b';

    const groundY = scope.view.center.y;
    const player = createPlayer(scope, groundY)
    createHud(scope, player);
    const score = createScore(scope);

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
    const pickupManager = createPickupManager(scope, groundY, player, () => score.addPoint(), obstacleManager.getObstacleBounds, getSpeed)

    const prevOnFrame = scope.view.onFrame;
    scope.view.onFrame = (event: any) => {
        if (prevOnFrame) prevOnFrame(event);
        frameCount++;
        obstacleManager.update();
        pickupManager.update();
    };
}
