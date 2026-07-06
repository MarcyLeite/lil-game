export const createSpawner = (interval: number, spawn: () => void) => {
    let ticks = 0;

    const tick = () => {
        ticks++;
        if (ticks % interval === 0) spawn();
    };

    return { tick };
};
