let colorForm = document.getElementById("color-form");
let colorDropdown = document.getElementById("color-dropdown");

// handling square input form
let sqButton = document.getElementById("square-button");
let sqForm = document.getElementById("square-form")
let sqInput = document.getElementById("square-input");
let sqButtonSubmit = document.getElementById("square-btn-submit");
sqButton.addEventListener('click', () => {
    if (chosenShape !== null) {
        hideForm(chosenShape);
    }
    chosenShape = "square";
    colorForm.style.display = 'block';
    sqForm.style.display = 'block';
})
sqButtonSubmit.addEventListener('click', () => {
    colorForm.style.display = 'none';
    sqForm.style.display = 'none';
    const length = parseFloat(sqInput.value);
    color = colorDropdown.value;
    shape = "square";
    num = length;
    isDrawing = true;
    chosenShape = null;
})

// handling lint input form
let lineButton = document.getElementById("line-button");
let lineForm = document.getElementById("line-form");
let lineButtonSubmit = document.getElementById("line-btn-submit");
lineButton.addEventListener('click', () => {
    if (chosenShape !== null) {
        hideForm(chosenShape);
    }
    chosenShape = "line";
    colorForm.style.display = 'block';
    lineForm.style.display = 'block';
})
lineButtonSubmit.addEventListener('click', () => {
    colorForm.style.display = 'none';
    lineForm.style.display = 'none';
    color = colorDropdown.value;
    shape = "line";
    num = 0;
    isDrawing = true;
    chosenShape = null;
});

// handling polygon input form
let polygonForm = document.getElementById("polygon-form");
let polygonInput = document.getElementById("polygon-input");
let polygonButton = document.getElementById("polygon-button");
let polygonButtonSubmit = document.getElementById("polygon-btn-submit");
let btnSubmit = document.getElementById("btn-submit");
polygonButton.addEventListener('click', () => {
    if (chosenShape !== null) {
        hideForm(chosenShape);
    }
    chosenShape = "polygon";
    colorForm.style.display = 'block';
    polygonForm.style.display = 'block';
})
polygonButtonSubmit.addEventListener('click', () => {
    colorForm.style.display = 'none';
    polygonForm.style.display = 'none';
    const numVertices = parseInt(polygonInput.value);
    color = colorDropdown.value;
    shape = "polygon";
    num = numVertices;
    isDrawing = true;
    chosenShape = null;
});


const hideForm = (shapeForm) => {
    colorForm.style.display = 'none';
    if (shapeForm === "polygon") {
        polygonForm.style.display = 'none';
    } else if (shapeForm === "square") {
        sqForm.style.display = 'none';
    } else if (shapeForm === "line") {
        lineForm.style.display = 'none';
    }
}