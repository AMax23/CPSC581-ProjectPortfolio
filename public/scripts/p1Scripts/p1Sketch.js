// JavaScript source code

var mic;

var userLine;

// Canvas
var canvasWidth = 600;
var canvasHeight = 400;
var canvasColour = 0; // Black

////////////////////////// BASIC P5 SET UP ////////////////////////////////////////
function setup() {
    let cnv = createCanvas(canvasWidth, canvasHeight);
    cnv.mousePressed(userStartAudio);
    background(canvasColour);

    // Create and start an Audio input
    mic = new p5.AudioIn();
    mic.start();

    // The line will start from the center of the canvas.
    var lineX = canvasWidth / 2;
    var lineY = canvasHeight / 2;
    var prevLineX = lineX;
    var prevLineY = lineY;
    userLine = new Line(lineX, lineY, prevLineX, prevLineY);

}

function draw() {
    drawLine();
}
///////////////////////////////////////////////////////////////////////////////////

function drawLine() {

    var volumeLevel = mic.getLevel(); // Read the amplitude (volume level).
    var soundLevel = volumeLevel * 100; // This volume level is between 0–1 which is too small.
    //print(soundLevel);
    userLine.show();
    userLine.move(soundLevel);
}