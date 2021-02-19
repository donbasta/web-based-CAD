const identityMatrix = (size) => {
    identityMat = new Array(size * size);
    for (let i = 0; i < size * size; i++) {
        if (i % (size + 1) == 0) {
            identityMat[i] = 1.0;
        } else {
            identityMat[i] = 0.0;
        }
    }
    return new Float32Array(identityMat);
};

const getColorRGB = (color) => {
    if (color === "RED") {
        return [255, 0, 0];
    }
    if (color === "GREEN") {
        return [0, 255, 0];
    }
    if (color === "BLUE") {
        return [0, 0, 255];
    }
    if (color === "YELLOW") {
        return [255, 255, 0];
    }
    if (color === "CYAN") {
        return [0, 255, 255];
    }
    if (color === "MAGENTA") {
        return [255, 0, 255];
    }
    if (color === "BLACK") {
        return [255, 0, 255];
    }
    if (color === "WHITE") {
        return [255, 0, 255];
    }
}