const HUD_MARGIN = 15
const LIFE_RADIUS = 8

export const createScore = (scope: paper.PaperScope) => {
    let value = 0;

    const text = new scope.PointText({
        point: new scope.Point(scope.view.bounds.right - HUD_MARGIN, HUD_MARGIN + LIFE_RADIUS),
        content: 'Score: 0',
        fillColor: 'white',
        fontFamily: 'monospace',
        fontSize: 14,
        justification: 'right',
    });

    const addPoint = () => {
        value++;
        text.content = `Score: ${value}`;
    };

    return { addPoint };
};
