import { createEmitter } from './emitter'

const JUMP_KEYS = ['Space', 'ArrowUp'];
const DUCK_KEYS = ['ArrowDown', 'ShiftLeft', 'ShiftRight'];

type InputEvents = {
    jump: [];
    jumpCancel: [];
    duck: [];
    unduck: [];
};

export type Input = ReturnType<typeof createInput>;

export const createInput = (scope: paper.PaperScope) => {
    const events = createEmitter<InputEvents>();

    const tool = new scope.Tool();
    tool.onMouseDown = () => events.emit('jump');
    tool.onMouseUp = () => events.emit('jumpCancel');

    const onKeyDown = (e: KeyboardEvent) => {
        if (JUMP_KEYS.includes(e.code)) events.emit('jump');
        if (DUCK_KEYS.includes(e.code)) events.emit('duck');
    };

    const onKeyUp = (e: KeyboardEvent) => {
        if (JUMP_KEYS.includes(e.code)) events.emit('jumpCancel');
        if (DUCK_KEYS.includes(e.code)) events.emit('unduck');
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    const destroy = () => {
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
        tool.remove();
    };

    return { on: events.on, destroy };
};
