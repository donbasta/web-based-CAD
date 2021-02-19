let gl;
let program;
const allShape = [];
let vertices = [];
let vertexX = -999;
let vertexY = -999;
let shape = "";
let num = 0;

let sqButton = document.getElementById("square-button");
let sqForm = document.getElementById("square-form")
let sqInput = document.getElementById("square-input");
let sqButtonSubmit = document.getElementById("square-btn-submit");
sqButton.addEventListener('click', function() {
    sqForm.style.display = 'block';
})
sqButtonSubmit.addEventListener('click', function() {
    sqForm.style.display = 'none';
    const length = parseFloat(sqInput.value);
    shape = "sq";
    num = length;
    
})

let lineButton = document.getElementById("line-button");
lineButton.addEventListener('click', function() {
    shape = "line";
    num = 0;
})

let polygonForm = document.getElementById("polygon-form");
let polygonInput = document.getElementById("polygon-input");
let polygonButton = document.getElementById("polygon-button");
let polygonButtonSubmit = document.getElementById("polygon-btn-submit");
let btnSubmit = document.getElementById("btn-submit");
polygonButton.addEventListener('click', function() {
    polygonForm.style.display = 'block';
})
polygonButtonSubmit.addEventListener('click', function() {
    polygonForm.style.display = 'none';
    const numVertices = parseInt(polygonInput.value);
    shape = "polygon";
    num = numVertices;
})

let canvasElement = document.getElementById("draw-shape");
canvasElement.addEventListener("mousedown", function(e) {
    getMouseLocation(canvasElement, e);
    addShape(shape, num);
});

function getMouseLocation(canvasElement, event) { // get the click location
    let clientRect = canvasElement.getBoundingClientRect();
    let posX = event.clientX - clientRect.left;
    let posY = event.clientY - clientRect.top;

    let x = posX / canvasElement.width * 2 -1;
    let y = posY / canvasElement.height * (-2) + 1;
    vertexX = x;
    vertexY = y;
}

function start() {
    canvas = document.getElementById("draw-shape");
    gl = canvas.getContext("experimental-webgl");
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    program = createProg(gl, "vertex", "fragment");
}

function compileShader(gl, shader, shaderType) {
    let s = gl.createShader(shaderType);

    gl.shaderSource(s, shader);
    gl.compileShader(s);

    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        throw "Couldn't compile shader: " + gl.getShaderInfoLog(shader);
    }
    return s;
}

function initShader(gl, shaderId) {
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

function createProg(gl, vertexId, fragmentId) {
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

function addShape(shape, num) { // num = number of vertices/length, based on shape
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
            const obj = new GLShape(vertices, gl, program);
            allShape.push(obj);
            vertices = [];
            render();
        }
    }

    else if(shape === "sq") {
        if(oldX != vertexX && oldY != vertexY) {
            vertices = [
                vertexX, vertexY, 
                vertexX+num, vertexY,
                vertexX+num, vertexY-num,
                vertexX, vertexY-num
            ];
            
            const obj = new GLShape(vertices, gl, program);
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
            const obj = new GLShape(vertices, gl, program);
            allShape.push(obj);
            vertices = [];
            render();
        }
    }
}

function render() {
    gl.clearColor(0.8, 0.8, 0.8, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const identityMat = identityMatrix(4);
    const mat = gl.getUniformLocation(program, "formMatrix");

    gl.useProgram(program);
    gl.uniformMatrix4fv(mat, false, identityMat)

    for(let i = 0 ; i < allShape.length ; i++ ){ 
        allShape[i].draw();
    }
}