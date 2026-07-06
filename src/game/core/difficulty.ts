const BASE_SPEED = 3
const SPEED_INCREMENT = 0.5
const SPEED_INTERVAL = 300 // frames (~5s at 60fps)

export const createDifficulty = () => {
    let ticks = 0;

    const tick = () => { ticks++; };

    const getSpeed = () => BASE_SPEED + Math.floor(ticks / SPEED_INTERVAL) * SPEED_INCREMENT;

    return { tick, getSpeed };
};
