import { createPlayer } from "./player"
import { createObstacleManager } from "./obstacle-manager"
import { createPickupManager } from "./pickup-manager"
import { createHud } from "./hud"

const TOTAL_LIVES = 3
const BASE_SPEED = 3
const SPEED_INCREMENT = 0.5
const SPEED_INTERVAL = 300 // frames (~5s at 60fps)

export const createGame = (scope: paper.PaperScope) => {
    scope.view.element.style.background = '#0d1b4b';

    const groundY = scope.view.center.y;
    const hud = createHud(scope, TOTAL_LIVES);
    const player = createPlayer(scope, groundY)

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

    const onCollision = () => {
        const remaining = hud.removeLife();
        if (remaining === 0) showGameOver();
    };

    const obstacleManager = createObstacleManager(scope, groundY, player, onCollision, getSpeed)
    const pickupManager = createPickupManager(scope, groundY, player, () => hud.addPoint(), obstacleManager.getObstacleBounds, getSpeed)

    const prevOnFrame = scope.view.onFrame;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scope.view.onFrame = (event: any) => {
        if (prevOnFrame) prevOnFrame(event);
        frameCount++;
        obstacleManager.update();
        pickupManager.update();
    };
}
