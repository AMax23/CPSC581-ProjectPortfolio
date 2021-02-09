// JavaScript source code

var mic;
var capture;
var cTracker;
var positions;
var userLine;

var eye;

////////////////////////// BASIC P5 SET UP ////////////////////////////////////////
function setup() {
    var canvasWidth = displayWidth;
    var canvasHeight = 0.5 * displayHeight;
    let cnv = createCanvas(canvasWidth, canvasHeight);
    cnv.touchStarted(userStartAudio);

    background(0); // Black

    //// Set up video
    //capture = createCapture(VIDEO);
    //capture.size(400, 400);
    ////capture.hide();

    //// Set up face tracker
    //cTracker = new clm.tracker();
    //cTracker.init();
    //cTracker.start(capture.elt);

    //eye = new Eye(cTracker);

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
    drawLine();
    //videoStuff();

    //drawEyes();
    
    //console.log(a.volume);

    //print(mic.getVolumeLevel() + ', ' + mic.getFreqBin());
}
///////////////////////////////////////////////////////////////////////////////////

function drawEyes() {
    // Flip the canvas so that we get a mirror image
    translate(displayWidth, 0);
    scale(-1.0, 1.0);
    background(220);
    eye.show();
}

//function videoStuff() {
//    background(220);
//    image(capture, 100, 10);

//    // Positions of the tracked facial features as a 2D array
//    positions = cTracker.getCurrentPosition();
//    let mouthDist;

//    // Iteratire through all the positions and draw little circles on them.
//    if (positions) {
//        positions.forEach(pos => {
//            fill(255, 0, 0);
//            noStroke();
//            circle(pos[0], pos[1], 3);
//        });

//        // Eye points from clmtrackr: https://github.com/auduno/clmtrackr
//        const leftEye = {
//            outline: [23, 63, 24, 64, 25, 65, 26, 66].map(getPoint),
//            center: getPoint(27),
//            top: getPoint(24),
//            bottom: getPoint(26)
//        };

//        const rightEye = {
//            outline: [28, 67, 29, 68, 30, 69, 31, 70].map(getPoint),
//            center: getPoint(32),
//            top: getPoint(29),
//            bottom: getPoint(31)
//        };

//        const eye1 = createVector(positions[27][0], positions[27][1]);
//        const eye2 = createVector(positions[23][0], positions[23][1]);

//        console.log('eye distance = ' + eye1.sub(eye2).mag());


//        const mouthTop = createVector(positions[60][0], positions[60][1]);
//        const mouthBottom = createVector(positions[57][0], positions[57][1]);

//        mouthDist = mouthTop.sub(mouthBottom).mag();
//    }

//    //console.log('mouth distance = ' + mouthDist);
//}

//function getPoint(index) {
//    console.log('holly');
//    return createVector(positions[index][0], positions[index][1]);
//}

function drawLine() {
    var volumeLevel = mic.getVolumeLevel(); // Read the amplitude (volume level).
    //var soundLevel = volumeLevel * 100; // This volume level is between 0–1 which is too small.
    var soundLevel = map(volumeLevel, 0, 60, 0, 20); // Trial and error gave me these numbers.
    //print(volumeLevel, soundLevel);
    userLine.show();
    userLine.move(soundLevel);
}