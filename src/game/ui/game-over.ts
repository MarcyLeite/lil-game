import type { Viewport } from '../core/viewport'

export const createGameOver = (scope: paper.PaperScope, viewport: Viewport) => {
    let text: paper.PointText | null = null;

    const show = () => {
        text = new scope.PointText({
            point: scope.view.center,
            content: 'GAME OVER',
            fillColor: 'white',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            fontSize: 48,
            justification: 'center',
        });
    };

    viewport.onResize('resize', () => {
        if (text) text.point = scope.view.center;
    });

    return { show };
};
