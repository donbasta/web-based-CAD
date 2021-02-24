// Get canvas DOM
let canvasElement = document.getElementById("draw-shape");

// Add mousedown event for interactive shape drawing
canvasElement.addEventListener("mousedown", (e) => {
    getMouseLocation(canvasElement, e);
    if (isDrawing) {
        addShape(shape, num);
    } else {
        checkClosestPoint();
    }
});

// Add double click event to stop dragging
canvasElement.addEventListener("dblclick", (e) => {
    isDragging = false;
    isPersegiClicked = {
        status: false,
        idx: null
    }
})

// Add mousemove event to drag points when isDragging flag is true, re-render every move
canvasElement.addEventListener("mousemove", (e) => {
    getMouseLocation(canvasElement, e);
    if (isDragging) {
        allShape[clickedPolygon].coordinates[clickedVertexIdx] = vertexX;
        allShape[clickedPolygon].coordinates[clickedVertexIdx + 1] = vertexY;
        render();
    }
})

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
        if (allShape[clickedPolygon].shape === "square") {
            isPersegiClicked.status = {
                status: true,
                idx: clickedVertexIdx / 2
            };
        }
        render(closestPoint);
    }
}