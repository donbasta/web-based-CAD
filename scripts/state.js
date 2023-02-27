// container for all drawn shapes
const allShape = [];

// buffer for storing temporary vertices while drawing
let vertices = [];

// location of cursor in canvas
let vertexX = -999;
let vertexY = -999;

// drawing constants
let shape;
let num;
let color;

// index of clicked polygon, and index of the clicked vertex of the polygon
let clickedPolygon = -999;
let clickedVertexIdx = -999;

// flag what shape is chosen
let chosenShape = null;

// flag for drawing, dragging
let isDragging = false;
let isDrawing = false;
let isPersegiClicked = {
    status: false,
    idx: null
}
