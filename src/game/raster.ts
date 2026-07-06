export const createRaster = (
    scope: paper.PaperScope,
    src: string,
    position: paper.Point,
    width: number,
    height: number,
): paper.Raster => {
    const raster = new scope.Raster(src);
    raster.position = position;
    raster.onLoad = () => {
        raster.scale(width / raster.width, height / raster.height);
    };
    return raster;
};

export const createSheet = (
    scope: paper.PaperScope,
    src: string,
    frameW: number,
    frameH: number,
    frameCount: number,
): paper.Raster => {
    const raster = new scope.Raster(src);
    raster.onLoad = () => {
        raster.scale((frameW * frameCount) / raster.width, frameH / raster.height);
    };
    return raster;
};
