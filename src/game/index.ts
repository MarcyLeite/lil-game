import { createPlayer } from "./entities/player"
import { createObstacleManager } from "./managers/obstacle-manager"
import { createPickupManager } from "./managers/pickup-manager"
import { createHud } from "./ui/hud"
import { createDifficulty } from "./core/difficulty"
import { createInput } from "./core/input"

export const createGame = (scope: paper.PaperScope) => {
    scope.view.element.style.background = '#0d1b4b';

    const groundY = scope.view.center.y;
    const input = createInput(scope);
    const player = createPlayer(scope, groundY, input);
    createHud(scope, player);
    const difficulty = createDifficulty();

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

    const obstacleManager = createObstacleManager(scope, groundY, player, difficulty.getSpeed)
    const pickupManager = createPickupManager(scope, groundY, player, obstacleManager.getObstacleBounds, difficulty.getSpeed)

    scope.view.onFrame = () => {
        difficulty.tick();
        player.update();
        player.render();
        obstacleManager.update();
        pickupManager.update();
    };

    const destroy = () => {
        scope.view.onFrame = null;
        input.destroy();
        scope.project.activeLayer.removeChildren();
    };

    return { destroy };
}
