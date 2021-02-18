var gl;

function initWebGL() {
    canvas = document.getElementById("draw-shape");
    gl = canvas.getContext("experimental-webgl");
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
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

function initShaders(gl, vertexId, fragmentId) {
    let vertexShader = initShader(gl, vertexId);
    let fragmentShader = initShader(gl, fragmentId);
    return createProg(gl, vertexShader, fragmentShader);
}

function createProg(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw ("Failed to link " + gl.getProgramInfoLog(program));
    }
    return program;
}

function createRectangle() {
    initWebGL();
    program = initShaders(gl, "vertex", "fragment");
    let attributeLoc = gl.getAttribLocation(program, "aVertexPosition");
    let colorLoc = gl.getUniformLocation(program, "uColor");

    const vertices = new Float32Array([
        -1.0, -1.0,
        +1.0, -1.0,
        +1.0, +1.0,
        -1.0, +1.0
    ]);
    let itemSize = 2;

    buff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buff);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.useProgram(program);
    gl.enableVertexAttribArray(attributeLoc);
    gl.vertexAttribPointer(attributeLoc, itemSize, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(colorLoc, [1, 0.0, 0.0, 1.0]);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}