const initBuffer = (coordinates) => {
    return new Float32Array(coordinates);
};

class GLShape {

    static counter = 1;

    static addCounter() {
        this.counter++;
    }

    constructor(coordinates, gl, program, color, type) {
        this.id = this.constructor.counter;
        this.constructor.addCounter();
        this.numVertices = coordinates.length / 2;
        this.coordinates = coordinates;
        this.webglRenderingContext = gl;
        this.webglProgram = program;
        this.color = color;
        this.colorRGB = getColorRGB(color);
        this.type = type;
    }

    setColor(color) {
        this.color = color;
        this.colorRGB = getColorRGB(color);
    }

    setCoordinates(coordinates) {
        this.coordinates = coordinates;
    }

    //for square only, should be implemented as child class but whatever
    setSize(length) {
        const centerX = (this.coordinates[0] + this.coordinates[2] + this.coordinates[4] + this.coordinates[6]) / 4.0;
        const centerY = (this.coordinates[1] + this.coordinates[3] + this.coordinates[5] + this.coordinates[7]) / 4.0;
        const newCoordinates = [
            centerX + length / 2.0, centerY + length / 2.0,
            centerX - length / 2.0, centerY + length / 2.0,
            centerX - length / 2.0, centerY - length / 2.0,
            centerX + length / 2.0, centerY - length / 2.0
        ]
        this.coordinates = newCoordinates;
    }

    //for line only, should be implemented as child class but whatever
    setLength(length) {
        const currentLength = getLength(this.coordinates);
        const newX = this.coordinates[0] + (length / currentLength) * (this.coordinates[2] - this.coordinates[0]);
        const newY = this.coordinates[1] + (length / currentLength) * (this.coordinates[3] - this.coordinates[1]);
        const newCoordinates = [
            this.coordinates[0], this.coordinates[1],
            newX, newY
        ]
        this.coordinates = newCoordinates;
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