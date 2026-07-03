import { createObstacle } from "./obstacle"
import cactusSprite from '../assets/cacto.png'
import beeSprite from '../assets/bee.png'

const SPAWN_INTERVAL = 120
const OBSTACLE_WIDTH = 20
const OBSTACLE_HEIGHT = 40
const BEE_SIZE = 32
const BEE_FRAME_COUNT = 4
const BEE_ANIM_SPEED = 6

export const createObstacleManager = (scope: paper.PaperScope, groundY: number, player: paper.Path, onCollision: () => void, getSpeed: () => number) => {
    const obstacles: ReturnType<typeof createObstacle>[] = [];
    let frameCount = 0;

    const spawnGround = () => {
        const raster = new scope.Raster(cactusSprite);
        raster.position = new scope.Point(
            scope.view.bounds.right + OBSTACLE_WIDTH / 2,
            groundY - OBSTACLE_HEIGHT / 2,
        );
        raster.onLoad = () => {
            raster.scale(OBSTACLE_WIDTH / raster.width, OBSTACLE_HEIGHT / raster.height);
        };
        return raster;
    };

    const spawnAerial = () => {
        const minOffset = 20;
        const maxOffset = 120;
        const offsetY = Math.random() * (maxOffset - minOffset) + minOffset;
        const center = new scope.Point(
            scope.view.bounds.right + BEE_SIZE / 2,
            groundY - BEE_SIZE / 2 - offsetY,
        );

        const clipRect = new scope.Path.Rectangle({
            from: center.subtract(new scope.Point(BEE_SIZE / 2, BEE_SIZE / 2)),
            to: center.add(new scope.Point(BEE_SIZE / 2, BEE_SIZE / 2)),
            fillColor: 'white',
        });

        const sheet = new scope.Raster(beeSprite);
        sheet.onLoad = () => {
            sheet.scale(
                (BEE_SIZE * BEE_FRAME_COUNT) / sheet.width,
                BEE_SIZE / sheet.height,
            );
        };

        const group = new scope.Group({ children: [clipRect, sheet], clipped: true });

        let beeTick = 0;
        const onTick = () => {
            beeTick++;
            const frame = Math.floor(beeTick / BEE_ANIM_SPEED) % BEE_FRAME_COUNT;
            sheet.position.y = clipRect.position.y;
            sheet.position.x = clipRect.position.x + BEE_SIZE * (BEE_FRAME_COUNT / 2 - frame) - BEE_SIZE / 2;
        };

        return { group, onTick };
    };

    const update = () => {
        frameCount++;
        if (frameCount % SPAWN_INTERVAL === 0) {
            if (Math.random() < 0.5) {
                obstacles.push(createObstacle(scope, spawnGround(), player, onCollision, getSpeed));
            } else {
                const { group, onTick } = spawnAerial();
                obstacles.push(createObstacle(scope, group, player, onCollision, getSpeed, onTick));
            }
        }

        for (let i = obstacles.length - 1; i >= 0; i--) {
            const done = obstacles[i].update();
            if (done) obstacles.splice(i, 1);
        }
    };

    const getObstacleBounds = () => obstacles.map(o => o.obstacle.bounds);

    return { update, getObstacleBounds };
};
