import { createSheet } from './raster'

const DEFAULT_ANIM_SPEED = 8

type Animation = { src: string, frameCount: number, speed?: number };

export const createSprite = (
    scope: paper.PaperScope,
    size: { width: number, height: number },
    initialCenter: paper.Point,
    animations: Record<string, Animation>,
) => {
    const { width, height } = size;

    const clipRect = new scope.Path.Rectangle({
        point: new scope.Point(initialCenter.x - width / 2, initialCenter.y - height / 2),
        size: new scope.Size(width, height),
        fillColor: 'white',
    });

    const sheets: Record<string, { raster: paper.Raster, frameCount: number, speed: number }> = {};
    for (const [name, anim] of Object.entries(animations)) {
        sheets[name] = {
            raster: createSheet(scope, anim.src, width, height, anim.frameCount),
            frameCount: anim.frameCount,
            speed: anim.speed ?? DEFAULT_ANIM_SPEED,
        };
    }

    const names = Object.keys(sheets);
    let current = names[0];
    for (const name of names) sheets[name].raster.visible = name === current;

    const group = new scope.Group({ children: [clipRect, ...names.map(n => sheets[n].raster)], clipped: true });

    let tick = 0;
    let heldFrame: number | null = null;

    const panSheet = (raster: paper.Raster, frameCount: number, frame: number) => {
        raster.position.y = clipRect.position.y;
        raster.position.x = clipRect.position.x + width * (frameCount / 2 - frame) - width / 2;
    };

    const setActive = (name: string) => {
        if (current === name) return;
        sheets[current].raster.visible = false;
        sheets[name].raster.visible = true;
        current = name;
    };

    const play = (name: string) => {
        setActive(name);
        heldFrame = null;
    };

    const hold = (name: string, frame: number) => {
        setActive(name);
        heldFrame = frame;
    };

    const setCenter = (point: paper.Point) => {
        clipRect.position = point;
    };

    const update = () => {
        tick++;
        const active = sheets[current];
        const frame = heldFrame ?? (Math.floor(tick / active.speed) % active.frameCount);
        panSheet(active.raster, active.frameCount, frame);
    };

    const remove = () => group.remove();

    return { update, play, hold, setCenter, remove };
};
