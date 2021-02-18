let gl;
let program;
const allShape = [];

let sqButton = document.getElementById("sq-button");
sqButton.addEventListener('click', function() {
    addShape("square");
})

let lineButton = document.getElementById("line-button");
lineButton.addEventListener('click', function() {
    addShape("line");
})

let triangleButton = document.getElementById("triangle-button");
triangleButton.addEventListener('click', function() {
    addShape("triangle");
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
    addShape("polygon", numVertices);
})

function start() {
    canvas = document.getElementById("draw-shape");
    gl = canvas.getContext("experimental-webgl");
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);
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

function addShape(shape, numVertices=null) {

    let vertices = [];
    if (shape === "square") {
        vertices = [
            -0.5, -0.5,
            +0.5, -0.5,
            +0.5, +0.5,
            -0.5, +0.5
        ];
    }
    if (shape === "line") {
        vertices = [
            -0.5, 0.5,
            0.5, 0.5
        ];
    }
    if (shape === "triangle") {
        vertices = [
            -1.0, -1.0,
            +1.0, +1.0,
            +1.0, -1.0
        ];
    }
    if (shape === "polygon") {
        for (let i = 0; i < numVertices; i++) {
            vertices.push(0.5 * Math.cos(2 * Math.PI * i / numVertices));
            vertices.push(0.5 * Math.sin(2 * Math.PI * i / numVertices));
        }
    }

    const obj = new GLShape(vertices, gl, program);
    allShape.push(obj);

    render();
}

function render() {
    
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const identityMat = identityMatrix(4);
    const mat = gl.getUniformLocation(program, "formMatrix");

    gl.useProgram(program);
    gl.uniformMatrix4fv(mat, false, identityMat)

    for(let i = 0 ; i < allShape.length ; i++ ){ 
        allShape[i].draw();
    }

}