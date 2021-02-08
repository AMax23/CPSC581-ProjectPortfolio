// JavaScript source code

var mic;

var userLine;

////////////////////////// BASIC P5 SET UP ////////////////////////////////////////
function setup() {
    let cnv = createCanvas(displayWidth, displayHeight);
    cnv.mousePressed(userStartAudio);

    background(0); // Black

    // Create and start an Audio input
    mic = new p5.AudioIn();
    mic.start();

    // The line will start from the center of the canvas.
    var lineX = displayWidth / 2;
    var lineY = displayHeight / 2;
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