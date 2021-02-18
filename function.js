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

function addShape(shape) {

    let vertices;
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

    const obj = new GLShape(vertices, gl, program);
    allShape.push(obj);

    render();
}

function render() {

    console.log(allShape);
    
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