const changeLengthOfLineButton = (id) => {
    let btn = document.createElement('button');
    btn.innerHTML = "Change Length of the Line";
    btn.addEventListener('click', () => {
        const length = parseFloat(document.getElementById(`change-input-${id}`).value);
        changeLengthOfLineWithID(id, length);
        render();
    })
    return btn;
}

const changeSizeOfSquareButton = (id) => {
    let btn = document.createElement('button');
    btn.innerHTML = "Change Size of the Square";
    btn.addEventListener('click', () => {
        const length = parseFloat(document.getElementById(`change-input-${id}`).value);
        changeSizeOfSquareWithID(id, length);
        render();
    })
    return btn;
}

const changeColorOfPolygonButton = (id) => {
    let btn = document.createElement('button');
    btn.innerHTML = "Change Color of the Polygon";
    btn.addEventListener('click', () => {
        const color = document.getElementById(`change-input-${id}`).value;
        changeColorOfPolygonWithID(id, color);
        render();
    })
    return btn;
}

const changeLengthOfLineWithID = (id, length) => {
    for (let i = 0; i < allShape.length; i++) {
        if (allShape[i].id === id) {
            allShape[i].setLength(length);
        }
    }
}

const changeSizeOfSquareWithID = (id, length) => {
    for (let i = 0; i < allShape.length; i++) {
        if (allShape[i].id === id) {
            allShape[i].setSize(length);
        }
    }
}

const changeColorOfPolygonWithID = (id, color) => {
    for (let i = 0; i < allShape.length; i++) {
        if (allShape[i].id === id) {
            allShape[i].setColor(color);
        }
    }
}