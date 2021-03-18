// JavaScript source code

////////////////////////// BASIC P5 SET UP ////////////////////////////////////////
function preload() {

}

function setup() {
    let canvasDiv = document.getElementById('mainCanvas');
    let canvasWidth = canvasDiv.offsetWidth;
    let canvasHeight = canvasDiv.offsetHeight;
    let cnv = createCanvas(canvasWidth, canvasHeight);
    // Put p5 canvas in the right div on main page.
    cnv.parent("mainCanvas");

}

function draw() {

    fill(255, 255, 255);
    rect(mouseX, mouseY, 100, 300);

    
}
///////////////////////////////////////////////////////////////////////////////////