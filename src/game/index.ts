import { createPlayer } from "./entities/player"
import { createGround } from "./entities/ground"
import { createBackground } from "./entities/background"
import { createObstacleManager } from "./managers/obstacle-manager"
import { createPickupManager } from "./managers/pickup-manager"
import { createHud } from "./ui/hud"
import { createGameOver } from "./ui/game-over"
import { createDifficulty } from "./core/difficulty"
import { createInput } from "./core/input"
import { createViewport } from "./core/viewport"
import { createEmitter } from "./core/emitter"

type GameEvents = {
    ready: [];
    score: [total: number];
    damage: [remaining: number];
    gameOver: [];
};

export type Game = ReturnType<typeof createGame>;

export const createGame = (scope: paper.PaperScope) => {
    const events = createEmitter<GameEvents>();
    const viewport = createViewport(scope);

    const input = createInput(scope);
    const player = createPlayer(scope, viewport, input);
    createHud(scope, viewport, player);
    const difficulty = createDifficulty();
    const background = createBackground(scope, viewport, difficulty.getSpeed);
    const ground = createGround(scope, viewport, difficulty.getSpeed);

    const gameOver = createGameOver(scope, viewport);

    player.on('death', () => {
        gameOver.show();
        scope.view.onFrame = null;
        events.emit('gameOver');
    });
    player.on('damage', remaining => events.emit('damage', remaining));
    player.on('collect', total => events.emit('score', total));

    const obstacleManager = createObstacleManager(scope, viewport, player, difficulty.getSpeed)
    const pickupManager = createPickupManager(scope, viewport, player, obstacleManager.getObstacleBounds, difficulty.getSpeed)

    scope.view.onFrame = () => {
        difficulty.tick();
        player.update();
        player.render();
        background.update();
        ground.update();
        obstacleManager.update();
        pickupManager.update();
    };

    queueMicrotask(() => events.emit('ready'));

    const destroy = () => {
        scope.view.onFrame = null;
        scope.view.onResize = null;
        input.destroy();
        scope.project.activeLayer.removeChildren();
    };

    return { destroy, on: events.on };
}
