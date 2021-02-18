var gl;
var program;
const allShape = [];

var sqButton = document.getElementById("sq-button");
sqButton.addEventListener('click', function() {
    drawAll("sq");
})

var lineButton = document.getElementById("line-button");
lineButton.addEventListener('click', function() {
    drawAll("line");
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

function initBuffer(shape) {
    if(shape == "sq") {
        const verticesSq = new Float32Array([
            -0.5, -0.5,
            +0.5, -0.5,
            +0.5, +0.5,
            -0.5, +0.5
        ]);

        return verticesSq;
    }
    else if(shape == "line") {
        const verticesLine = new Float32Array([
            -0.5, 0.5,
            0.5, 0.5
        ]);
        
        return verticesLine;
    }
}

function draw(shape) {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    let attributeLoc = gl.getAttribLocation(program, "aVertexPosition");
    let colorLoc = gl.getUniformLocation(program, "uColor");
    let mat = gl.getUniformLocation(program, "formMatrix");
    let identityMat = new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
    let itemSize = 2;

    const vertices = initBuffer(shape);

    buff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buff);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.useProgram(program);
    gl.enableVertexAttribArray(attributeLoc);
    gl.vertexAttribPointer(attributeLoc, itemSize, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(colorLoc, [1, 0.0, 0.0, 1.0]);
    gl.uniformMatrix4fv(mat, false, identityMat);
    console.log(mat);

    if(vertices.length == 8) { // square
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
    else if(vertices.length == 4) { // line
        gl.lineWidth(1.0);
        gl.drawArrays(gl.LINES, 0, 2);
    }
}

function drawAll(shape) {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vertices = initBuffer(shape);
    let mat = gl.getUniformLocation(program, "formMatrix");
    let identityMat = new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);

    gl.useProgram(program);
    gl.uniformMatrix4fv(mat, false, identityMat)

    const obj = [shape, vertices, identityMat];
    allShape.push(obj);

    for(let i = 0 ; i < allShape.length ; i++ ){ 
        let attributeLoc = gl.getAttribLocation(program, "aVertexPosition");
        let colorLoc = gl.getUniformLocation(program, "uColor");
        let itemSize = 2;

        buff = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buff);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        gl.enableVertexAttribArray(attributeLoc);
        gl.vertexAttribPointer(attributeLoc, itemSize, gl.FLOAT, false, 0, 0);
        gl.uniform4fv(colorLoc, [1, 0.0, 0.0, 1.0]);

        if(vertices.length == 8) { // square
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        }
        else if(vertices.length == 4) { // line
            gl.lineWidth(1.0);
            gl.drawArrays(gl.LINES, 0, 2);
        }
    }
}