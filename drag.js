canvasElement.addEventListener("mousedown", (e) => {
    if (isDrawing) {
        getMouseLocation(canvasElement, e);
        addShape(shape, num);
    }
});

const checkClosestPoint = () => {
    let closestPoint = [-999,-999];
    let closestDistance = 999;
    for (let i = 0; i < allShape.length; i++) {
        for (let j = 0; j < allShape[i].coordinates.length; j += 2) {
            const tmpX = allShape[i].coordinates[j];
            const tmpY = allShape[i].coordinates[j+1];
            const tmp = getLength([tmpX, tmpY, vertexX, vertexY]);
            if (tmp <= closestDistance) {
                closestDistance = tmp;
                closestPoint = [i, j];
            }
        }
    }
    if (closestDistance <= RADIUS) {
        clickedPolygon = closestPoint[0];
        clickedVertexIdx = closestPoint[1];
        isDragging = true;
        render(closestPoint);
        //ganti warna titik closestPoint ini
    }
}