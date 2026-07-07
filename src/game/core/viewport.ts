import { createEmitter } from './emitter'

export type ViewportSize = {
    width: number;
    height: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
    groundY: number;
};

type ViewportEvents = {
    resize: [ViewportSize];
};

export type Viewport = ReturnType<typeof createViewport>;

export const createViewport = (scope: paper.PaperScope) => {
    const events = createEmitter<ViewportEvents>();

    const read = (): ViewportSize => {
        const b = scope.view.bounds;
        return {
            width: b.width,
            height: b.height,
            left: b.left,
            right: b.right,
            top: b.top,
            bottom: b.bottom,
            groundY: scope.view.center.y,
        };
    };

    scope.view.onResize = () => events.emit('resize', read());

    return {
        get: read,
        getGroundY: () => scope.view.center.y,
        getWidth: () => scope.view.bounds.width,
        getLeft: () => scope.view.bounds.left,
        getRight: () => scope.view.bounds.right,
        onResize: events.on,
    };
};
