// JavaScript source code

var mic;
var capture;
var cTracker;
var positions;
var userLine;

var face;

////////////////////////// BASIC P5 SET UP ////////////////////////////////////////
function setup() {
    var canvasWidth = displayWidth;
    var canvasHeight = displayHeight;
    let cnv = createCanvas(canvasWidth, canvasHeight);
    cnv.touchStarted(userStartAudio);

    background(0); // Black

    // Set up video
    capture = createCapture(VIDEO);
    capture.size(canvasWidth, canvasHeight);
    capture.hide();


    // Set up face tracker
    cTracker = new clm.tracker();
    cTracker.init();
    cTracker.start(capture.elt);

    face = new Face();

    //// Create and start an Audio input
    //mic = new p5.AudioIn();
    //mic.start();

    // Initialize mic and start it.
    mic = new Microphone();
    mic.init();

    // The line will start from the center of the canvas.
    var lineX = canvasWidth / 2;
    var lineY = canvasHeight / 2;
    var prevLineX = lineX;
    var prevLineY = lineY;
    // Create new instance of line.
    userLine = new Line(lineX, lineY, prevLineX, prevLineY);
}

function draw() {
    //translate(displayWidth, 0);
    //scale(-1.0, 1.0);
    //videoStuff();

    //drawLine();

    drawface();



    //console.log(a.volume);

    //print(mic.getVolumeLevel() + ', ' + mic.getFreqBin());
}
///////////////////////////////////////////////////////////////////////////////////

function drawface() {
    // Flip the canvas so that we get a mirror image
    translate(displayWidth, 0);
    scale(-1.0, 1.0);
    //image(capture, 0, 0, width, height);
    //background(220);
    face.show(cTracker);
}

function drawLine() {
    var volumeLevel = mic.getVolumeLevel(); // Read the amplitude (volume level).
    //var soundLevel = volumeLevel * 100; // This volume level is between 0–1 which is too small.
    var soundLevel = map(volumeLevel, 0, 60, 0, 20); // Trial and error gave me these numbers.
    //print(volumeLevel, soundLevel);
    userLine.show();
    userLine.move(soundLevel);
}