const initBuffer = (coordinates) => {
    return new Float32Array(coordinates);
};

class GLShape {

    static counter = 1;

    static addCounter() {
        this.counter++;
    }

    constructor(coordinates, gl, program, color, type, isPoint=false) {
        if (!isPoint) {
            this.id = this.constructor.counter;
            this.constructor.addCounter();
        }
        this.numVertices = coordinates.length / 2;
        this.coordinates = coordinates;
        this.webglRenderingContext = gl;
        this.webglProgram = program;
        this.color = color;
        this.colorRGB = getColorRGB(color);
        this.type = type;
        this.isPoint = isPoint;
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

    toString() {
        let stringarr = [
            this.id,
            this.type,
            this.color,
            this.colorRGB[0],
            this.colorRGB[1],
            this.colorRGB[2],
            this.numVertices
        ]
        for (let i = 0; i < this.coordinates.length; i++){
            stringarr.push(this.coordinates[i]);
        }
        return stringarr.join(',');
    }

    draw(clickedPointIdx=null) {
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

        if (!this.isPoint) {
            for (let i = 0; i < coord.length; i += 2) {
                let pX = coord[i];
                let pY = coord[i + 1];
                console.log(pX, pY);
                let pointCoor = [];
                for (let j = 0; j < CIRCLE; j++) {
                    pointCoor = [...pointCoor, pX + RADIUS * Math.cos(2*Math.PI*j/CIRCLE), pY + RADIUS * Math.sin(2*Math.PI*j/CIRCLE)];
                }
                console.log(pointCoor);
                let colorPoint = "point";
                if (clickedPointIdx != null && i === clickedPointIdx) {
                    colorPoint = "point-2";
                }
                const point = new this.constructor(pointCoor, gl, program, colorPoint, "point", true);
                console.log(point);
                console.log("dbg << dbg");
                point.draw();
                console.log("dbg >> dbg");
            }
        }

    }

}