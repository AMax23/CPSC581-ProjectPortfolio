// JavaScript source code

var mic;

// Canvas
var canvasWidth = 600;
var canvasHeight = 400;
var canvasColour = 0; // Black

// The line will start from the center of the canvas.
var lineX = canvasWidth / 2;
var lineY = canvasHeight / 2;
var prevLineX = lineX;
var prevLineY = lineY;

////////////////////////// BASIC P5 SET UP ////////////////////////////////////////
function setup() {
    let cnv = createCanvas(canvasWidth, canvasHeight);
    cnv.mousePressed(userStartAudio);
    background(canvasColour);

    // Create and start an Audio input
    mic = new p5.AudioIn();
    mic.start();
}

function draw() {
    drawLine();
}
///////////////////////////////////////////////////////////////////////////////////

function drawLine() {
    // Draw a line with the x and y coords
    stroke(255);
    line(prevLineX, prevLineY, lineX, lineY);

    var volumeLevel = mic.getLevel(); // Read the amplitude (volume level).
    var soundLevel = volumeLevel * 10; // This volume level is between 0–1 which is too small.

    console.log('sound Level = ' + soundLevel);
    //console.log(lineX + ', ' + lineY);

    // Prev x and y coords become current.
    prevLineX = lineX;
    prevLineY = lineY;

    // Move line based on the sound level.
    lineY = lineY + soundLevel;
    lineX = lineX + soundLevel;
}