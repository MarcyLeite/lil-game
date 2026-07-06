import { createSprite } from '../core/sprite'
import { createEmitter } from '../core/emitter'
import { createPlayerBody } from './player-body'
import type { Input } from '../core/input'
import walkSprite from '../../assets/player-walk.png'
import duckSprite from '../../assets/player-duck.png'

const TOTAL_LIVES = 3

type PlayerEvents = {
    damage: [remaining: number];
    death: [];
    collect: [total: number];
};

export type Player = ReturnType<typeof createPlayer>;

export const createPlayer = (scope: paper.PaperScope, groundY: number, input: Input) => {
    const body = createPlayerBody(scope, groundY);

    const sprite = createSprite(
        scope,
        { width: body.hitbox.bounds.width, height: body.hitbox.bounds.height },
        body.hitbox.bounds.center,
        {
            walk: { src: walkSprite, frameCount: 4 },
            duck: { src: duckSprite, frameCount: 2 },
        },
    );

    const events = createEmitter<PlayerEvents>();

    let lives = TOTAL_LIVES;
    let score = 0;

    const takeDamage = () => {
        if (lives === 0) return;
        lives--;
        events.emit('damage', lives);
        if (lives === 0) events.emit('death');
    };

    const collect = () => {
        score++;
        events.emit('collect', score);
    };

    input.on('jump', body.jump);
    input.on('jumpCancel', body.cancelJump);
    input.on('duck', body.shrink);
    input.on('unduck', body.restore);

    const render = () => {
        const anim = body.isDucking() ? 'duck' : 'walk';
        if (body.isOnGround()) sprite.play(anim);
        else sprite.hold(anim, 1);
        sprite.setCenter(body.hitbox.bounds.center);
        sprite.update();
    };

    return {
        hitbox: body.hitbox,
        takeDamage,
        collect,
        on: events.on,
        totalLives: TOTAL_LIVES,
        update: body.update,
        render,
    };
};
