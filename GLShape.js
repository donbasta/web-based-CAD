const initBuffer = (coordinates) => {
    return new Float32Array(coordinates);
};

class GLShape {

    constructor(coordinates, gl, program, color) {
        this.numVertices = coordinates.length / 2;
        this.coordinates = coordinates;
        this.webglRenderingContext = gl;
        this.webglProgram = program;
        this.colorRGB = getColorRGB(color);
    }

    draw() {
        let gl = this.webglRenderingContext;
        let coord = this.coordinates;
        let numVertices = this.numVertices;
        let program = this.webglProgram;

        // get the Float32Array representation of coord
        const vertices = initBuffer(coord);

        let attributeLoc = gl.getAttribLocation(program, "aVertexPosition");
        let colorLoc = gl.getUniformLocation(program, "uColor");
        let itemSize = 2;

        let buff = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buff);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        gl.enableVertexAttribArray(attributeLoc);
        gl.vertexAttribPointer(attributeLoc, itemSize, gl.FLOAT, false, 0, 0);

        if(numVertices >= 3) { // polygon
            gl.uniform4fv(colorLoc, [...this.colorRGB, 1.0]);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, numVertices);
        }
        else if(numVertices == 2) { // line
            gl.lineWidth(1.0);
            gl.uniform4fv(colorLoc, [...this.colorRGB, 1.0]);
            gl.drawArrays(gl.LINES, 0, numVertices);
        }
    }

}