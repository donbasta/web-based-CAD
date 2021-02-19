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
    if (color === "red") {
        return [255, 0, 0];
    }
    if (color === "green") {
        return [0, 255, 0];
    }
    if (color === "blue") {
        return [0, 0, 255];
    }
    if (color === "yellow") {
        return [255, 255, 0];
    }
    if (color === "cyan") {
        return [0, 255, 255];
    }
    if (color === "magenta") {
        return [255, 0, 255];
    }
    if (color === "black") {
        return [0, 0, 0];
    }
    if (color === "white") {
        return [255, 255, 255];
    }
}

const numVertices_to_shape = {
    2 : "line",
    3 : "triangle",
    4 : "quadrilateral",
    5 : "pentagon",
    6 : "hexagon",
    7 : "heptagon",
    8 : "octagon",
    9 : "nonagon",
    10 : "decagon"
}

const numVerticesToShape = (n) => {
    if (n <= 10) {
        return numVertices_to_shape[n];
    } else {
        return `${n}-gon`;
    }
} 