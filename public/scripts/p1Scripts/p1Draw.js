// JavaScript source code

var mic;

// Canvas
var canvasWidth = 600;
var canvasHeight = 400;
var canvasColour = 0;

// The line will start from the center of the canvas.
var lineX = canvasWidth / 2;
var lineY = canvasHeight / 2;
var prevLineX = lineX;
var prevLineY = lineY;

////////////////////////// BASIC P5 SET UP ////////////////////////////////////////
function setup() {
    createCanvas(canvasWidth, canvasHeight);
    background(canvasColour);

    // Create and start an Audio input
    mic = new p5.AudioIn();
    mic.start;
}

function draw() {
    // This function is to fix the error on the Chrome browser:
    // "The AudioContext was not allowed to start. It must be resumed(or created) after a user gesture on the page."
    getAudioContext().resume();
    drawLine();
}
///////////////////////////////////////////////////////////////////////////////////

function drawLine() {
    // Draw a line with the x and y coords
    stroke(255);
    line(prevLineX, prevLineY, lineX, lineY);

    var volumeLevel = mic.getLevel(); // Read the amplitude (volume level).
    var soundLevel = volumeLevel * 10; // This volume level is between 0–1 which is too small.

    console.log('volumeLevel = ' + volumeLevel * 100);
    //console.log(lineX + ', ' + lineY);

    // Prev x and y coords become current.
    prevLineX = lineX;
    prevLineY = lineY;

    // Move line based on the sound level.
    lineY = lineY + soundLevel;
    lineX = lineX + soundLevel;
}