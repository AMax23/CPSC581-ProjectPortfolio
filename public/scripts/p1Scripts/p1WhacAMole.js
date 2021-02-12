// P5 JavaScript source code for the main sketch.

// Comment this out temporarily cos its annoying.
//if (!window.location.href.toString().includes("https://")) { alert(`You will need "https://" to view this.`) }

var capture; // Video managed by P5
var face; // For face tracking

var hammerImg;
var hammerHitImg;
var holeImg;
var grassImg;

var mic;
var volumeLevel;

var holes = [];
var moles = [];

var first = true;
var x = 1;

////////////////////////// BASIC P5 SET UP ////////////////////////////////////////
function preload() {
    // Load the images in a asynchronous way
    hammerImg = loadImage('../images/project 1/thorsHammer.png'); // Load the image of the hammer
    hammerHitImg = loadImage('../images/project 1/thorsHammerHit.png'); // Load the image hammer when its hitting
    grassImg = loadImage('../images/project 1/grass.jpg'); // Load the image of the grass
    holeImg = loadImage('../images/project 1/hole.png'); // Load the image of the hole
    moleImg = loadImage('../images/project 1/mole.png'); // Load the image of the mole
}

function setup() {
    var canvasWidth = displayWidth;
    var canvasHeight = displayHeight;
    let cnv = createCanvas(canvasWidth, canvasHeight);
    cnv.id('gameCanvas');
    cnv.touchStarted(userStartAudio);

    // setup() waits until preload() is done
    hammerImg.loadPixels();
    hammerHitImg.loadPixels();
    grassImg.loadPixels();
    holeImg.loadPixels();
    moleImg.loadPixels();

    // Set up video
    capture = createCapture(VIDEO);
    //capture.size(canvasWidth, canvasHeight);
    capture.hide();

    // Initialize face tracker.
    face = new Face(capture);
    face.init();

    // Initialize mic and start it.
    mic = new Microphone();
    mic.init();

    createHoles();
}

function draw() {

    // Game background
    image(grassImg, 0, 0, width, height);

    // Show holes and moles
    for (var i = 0; i < holes.length; i++) {
        moles[i].show();
        //moles[i].hide();
        holes[i].show();
    }

    hammer();
}
///////////////////////////////////////////////////////////////////////////////////

function hammer() {
    var volumeThreshold = 15;
    volumeLevel = mic.getVolumeLevel(); // Read the amplitude (volume level).
    //console.log('volume level = ' + volumeLevel);

    if (volumeLevel > volumeThreshold) {
        face.show(hammerHitImg);
    } else {
        face.show(hammerImg);
    }
}

// Function to create holes in a 2d array. And the moles.
function createHoles() {
    // Create 6 mole holes
    let numOfCols = 2;
    let numOfRows = 3;
    let colSpace = width / numOfCols - 60;
    let rowSpace = height / 2 / numOfRows;
    for (let i = 0; i < numOfCols; i++) {
        for (let j = 0; j < numOfRows; j++) {
            let x = (colSpace * i) + (colSpace / 2) + 10; // 50, 150, and 60 came from trial and error to see what centers the holes.
            let y = (rowSpace * j) + (rowSpace / 2) + 150;
            let hole = new Hole(x, y, holeImg);
            let mole = new Mole(x, y, moleImg);
            holes.push(hole);
            moles.push(mole);
        }
    }
}

//// This function fires on every resize of the browser window.
//function windowResized() {
//    resizeCanvas(windowWidth, windowHeight);
//}