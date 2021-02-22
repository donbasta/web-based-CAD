let gl;
let program;
const allShape = [];
let vertices = [];
let vertexX = -999;
let vertexY = -999;
let shape;
let num;
let color = "black";

let shapeTable = document.getElementById("shape-table");

let canvasElement = document.getElementById("draw-shape");
canvasElement.addEventListener("mousedown", (e) => {
    getMouseLocation(canvasElement, e);
    addShape(shape, num);
});

const getMouseLocation = (canvasElement, event) => { // get the click location
    let clientRect = canvasElement.getBoundingClientRect();
    let posX = event.clientX - clientRect.left;
    let posY = event.clientY - clientRect.top;

    let x = posX / canvasElement.width * 2 -1;
    let y = posY / canvasElement.height * (-2) + 1;
    vertexX = x;
    vertexY = y;
}

const start = () => {
    canvas = document.getElementById("draw-shape");
    gl = canvas.getContext("experimental-webgl");
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    program = createProg(gl, "vertex", "fragment");
}

const compileShader = (gl, shader, shaderType) => {
    let s = gl.createShader(shaderType);

    gl.shaderSource(s, shader);
    gl.compileShader(s);

    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        throw "Couldn't compile shader: " + gl.getShaderInfoLog(shader);
    }
    return s;
}

const initShader = (gl, shaderId) => {
    let shader = document.getElementById(shaderId);
    if (!shader) {
        throw("Unknown script element " + scriptId);
    }
    let shaderType;
    
    if(shader.type == "x-shader/x-vertex") {
        shaderType = gl.VERTEX_SHADER;
    }
    else if(shader.type == "x-shader/x-fragment") {
        shaderType = gl.FRAGMENT_SHADER;
    }
    else {
        throw("Shader type undefined");
    }

    return compileShader(gl, shader.text, shaderType);
}

const createProg = (gl, vertexId, fragmentId) => {
    let vertexShader = initShader(gl, vertexId);
    let fragmentShader = initShader(gl, fragmentId);

    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw ("Failed to link " + gl.getProgramInfoLog(program));
    }

    return program;
}

const addShape = (shape, num) => { // num = number of vertices/length, based on shape
    // Initialize old value
    let oldX = -999;
    let oldY = -999;

    if(shape === "line") {
        if(vertices.length != 4 || oldX != vertexX || oldY != vertexY) { // if the point is different one and vertices not complete
            vertices = [...vertices, vertexX, vertexY];
            oldX = vertexX;
            oldY = vertexY;
        }

        if(vertices.length == 4){ // if all the points already collected
            const obj = new GLShape(vertices, gl, program, color, shape);
            allShape.push(obj);
            vertices = [];
            render();
        }
    }
    else if(shape === "square") {
        if(oldX != vertexX && oldY != vertexY) {
            vertices = [
                vertexX, vertexY, 
                vertexX+num, vertexY,
                vertexX+num, vertexY-num,
                vertexX, vertexY-num
            ];
            
            const obj = new GLShape(vertices, gl, program, color, shape);
            allShape.push(obj);
            vertices = [];
            render();
        }
    }
    else if(shape === "polygon") {
        if(vertices.length != num*2 || oldX != vertexX || oldY != vertexY) { // if the point is different one and vertices not complete
            vertices = [...vertices, vertexX, vertexY];
            oldX = vertexX;
            oldY = vertexY;
        }

        if(vertices.length == num*2) { // if all the points already collected
            const obj = new GLShape(vertices, gl, program, color, shape);
            allShape.push(obj);
            vertices = [];
            render();
        }
    }
}

const render = () => {
    gl.clearColor(0.8, 0.8, 0.8, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const identityMat = identityMatrix(4);
    const mat = gl.getUniformLocation(program, "formMatrix");

    gl.useProgram(program);
    gl.uniformMatrix4fv(mat, false, identityMat)

    for (let i = 0 ; i < allShape.length ; i++) { 
        allShape[i].draw();
    }

    showAllShapesInTable();
}

const showAllShapesInTable = () => {
    const rowCount = shapeTable.rows.length;
    for (let i = rowCount - 1; i > 0; i--) {
        shapeTable.deleteRow(i);
    }
    for (let i  = 0; i < allShape.length; i++) {
        addShapeToTable(i, allShape[i]);
    }
}

const addShapeToTable = (i, glShape) => {
    let row = shapeTable.insertRow();
    let cell_1 = row.insertCell(0);
    let cell_2 = row.insertCell(1);
    let cell_3 = row.insertCell(2);
    let cell_4 = row.insertCell(3);
    let cell_5 = row.insertCell(4);
    let cell_6 = row.insertCell(5);
    let cell_7 = row.insertCell(6);

    cell_1.innerHTML = i + 1;
    cell_2.innerHTML = glShape.type;
    cell_3.innerHTML = numVerticesToShape(glShape.numVertices);
    cell_4.innerHTML = glShape.color;
    cell_5.innerHTML = glShape.id;

    let btn, input;

    switch (glShape.type) {
        case 'line':
            btn = changeLengthOfLineButton(glShape.id);
            input = document.createElement('input');
            input.id = `change-input-${glShape.id}`;
            input.placeholder = "insert new length here";
            cell_6.appendChild(input);
            cell_7.appendChild(btn);
            break;
        case 'square':
            btn = changeSizeOfSquareButton(glShape.id);
            input = document.createElement('input');
            input.id = `change-input-${glShape.id}`;
            input.placeholder = "insert new size here";
            cell_6.appendChild(input);
            cell_7.appendChild(btn);
            break;
        case 'polygon':
            btn = changeColorOfPolygonButton(glShape.id);
            input = document.createElement('input');
            input.id = `change-input-${glShape.id}`
            input.placeholder = "insert new color here";
            cell_6.appendChild(input);
            cell_7.appendChild(btn);
            break;
        default:
    }
      
}