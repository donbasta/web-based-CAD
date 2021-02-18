function identityMatrix(size) {
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