let colorForm = document.getElementById("color-form");
let colorDropdown = document.getElementById("color-dropdown");

let sqButton = document.getElementById("square-button");
let sqForm = document.getElementById("square-form")
let sqInput = document.getElementById("square-input");
let sqButtonSubmit = document.getElementById("square-btn-submit");
sqButton.addEventListener('click', () => {
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
})

let lineButton = document.getElementById("line-button");
lineButton.addEventListener('click', () => {
    shape = "line";
    num = 0;
})

let polygonForm = document.getElementById("polygon-form");
let polygonInput = document.getElementById("polygon-input");
let polygonButton = document.getElementById("polygon-button");
let polygonButtonSubmit = document.getElementById("polygon-btn-submit");
let btnSubmit = document.getElementById("btn-submit");
polygonButton.addEventListener('click', () => {
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
})