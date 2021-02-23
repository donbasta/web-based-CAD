let gl;
let program;

let shapeTable = document.getElementById("shape-table");

// get the click location
const getMouseLocation = (canvasElement, event) => { 
    let clientRect = canvasElement.getBoundingClientRect();
    let posX = event.clientX - clientRect.left;
    let posY = event.clientY - clientRect.top;

    let x = posX / canvasElement.width * 2 -1;
    let y = posY / canvasElement.height * (-2) + 1;
    vertexX = x;
    vertexY = y;
}

// create gl context and program when the page loads
const start = () => {
    canvas = document.getElementById("draw-shape");
    gl = canvas.getContext("experimental-webgl");
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    program = createProg(gl, "vertex", "fragment");
}

// compile shader
const compileShader = (gl, shader, shaderType) => {
    let s = gl.createShader(shaderType);

    gl.shaderSource(s, shader);
    gl.compileShader(s);

    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        throw "Couldn't compile shader: " + gl.getShaderInfoLog(shader);
    }
    return s;
}

// initialize shader
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

// create gl program
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

// num = number of vertices/length, based on shape
const addShape = (shape, num) => { 
    // Initialize old value
    let oldX = -999;
    let oldY = -999;

    if(shape === "line") {
        // if the point is different one and vertices not complete
        if(vertices.length != 4 || oldX != vertexX || oldY != vertexY) { 
            vertices = [...vertices, vertexX, vertexY];
            oldX = vertexX;
            oldY = vertexY;
        }
        // if all the points already collected
        if(vertices.length == 4){ 
            const obj = new GLShape(vertices, gl, program, color, shape);
            allShape.push(obj);
            vertices = [];
            render();
            isDrawing = false;
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
            isDrawing = false;
        }
    }
    else if(shape === "polygon") {
        // if the point is different one and vertices not complete
        if(vertices.length != num*2 || oldX != vertexX || oldY != vertexY) { 
            vertices = [...vertices, vertexX, vertexY];
            oldX = vertexX;
            oldY = vertexY;
        }
        // if all the points already collected
        if(vertices.length == num*2) { 
            const obj = new GLShape(vertices, gl, program, color, shape);
            allShape.push(obj);
            vertices = [];
            render();
            isDrawing = false;
        }
    }
}

// render all shape into canvas
const render = (clickedPoint=null) => {
    gl.clearColor(0.8, 0.8, 0.8, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const identityMat = identityMatrix(4);
    const mat = gl.getUniformLocation(program, "formMatrix");

    gl.useProgram(program);
    gl.uniformMatrix4fv(mat, false, identityMat)

    for (let i = 0 ; i < allShape.length ; i++) { 
        if (clickedPoint != null && clickedPoint[0] == i) {
            allShape[i].draw(clickedPoint[1]);
        } else {
            allShape[i].draw();
        }
    }

    showAllShapesInTable();
}

// create table of shapes
const showAllShapesInTable = () => {
    const rowCount = shapeTable.rows.length;
    for (let i = rowCount - 1; i > 0; i--) {
        shapeTable.deleteRow(i);
    }
    for (let i  = 0; i < allShape.length; i++) {
        addShapeToTable(i, allShape[i]);
    }
}

// adding new row to table of shapes
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

    let btn, input, option;

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
            // btn = changeColorOfPolygonButton(glShape.id);
            // input = document.createElement('input');
            // input.id = `change-input-${glShape.id}`
            // input.placeholder = "insert new color here";
            // cell_6.appendChild(input);
            // cell_7.appendChild(btn);
            btn = changeColorOfPolygonButton(glShape.id);
            select = document.createElement('select');
            select.id = `change-input-${glShape.id}`
            select.placeholder = "choose new color here";
            for (let i = 0; i < COLORS.length; i++) {
                let Opt = new Option(COLORS[i], COLORS[i]);
                if (COLORS[i] === glShape.color) {
                    Opt.defaultSelected = true;
                } else {
                    Opt.defaultSelected = false;
                }
                select.appendChild(Opt);
            }
            cell_6.appendChild(select);
            cell_7.appendChild(btn);
            break;
        default:
    } 
}

// save all shapes into .csv external files
const saveShapes = () => {
    var doc = "data:text/csv;charset=utf-8,"
    for (let i  = 0; i < allShape.length; i++) {
        doc += allShape[i].toString() + "\r\n";
    }   
    var URI = encodeURI(doc);
    var link = document.createElement('a');
    link.setAttribute("href",URI);
    link.setAttribute("download","tes.csv");
    document.body.appendChild(link);
    link.click();
}

// load shape
const loadShapes = (text) => {
    while(allShape.length > 0) allShape.length = 0
    var rows = text.split('\r\n');
    console.log(rows)
    for (var i = 0; i < rows.length-1; i++){
        var line = rows[i].split(',');
        var coordinates = [];
        for (var j = 7; j < line.length; j++){
            coordinates.push(parseFloat(line[j]))
        }
        var shape = new GLShape(coordinates, gl, program, line[2], line[1]);
        allShape[i] = shape;
    }
    render();
}

// Load .csv external file into canvas
const load = () => {
    var filename = document.getElementById('load-filename');
    // filename = filename.replace(/.*[\/\\]/, '');
    console.log(filename.files);
    var fileReader = new FileReader()
    fileReader.onloadend = () => (loadShapes(fileReader.result))
    fileReader.readAsText(filename.files[0])
    // loadFile(filename);
}

// load button enabler disabler
const checkLoad = () => {
    var fn = document.getElementById('load-filename');
    var butt = document.getElementById('load-button');
    if (fn.value != ""){
        butt.disabled = false;
    }else{
        butt.disabled = true;
    }
}