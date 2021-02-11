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

////////////////////////// BASIC P5 SET UP ////////////////////////////////////////
function setup() {
    var canvasWidth = displayWidth;
    var canvasHeight = displayHeight;
    let cnv = createCanvas(canvasWidth, canvasHeight);
    cnv.id('gameCanvas');
    cnv.touchStarted(userStartAudio);

    // Load the images
    hammerImg = loadImage('../images/project 1/thorsHammer.png'); // Load the image of the hammer
    hammerHitImg = loadImage('../images/project 1/thorsHammerHit.png'); // Load the image hammer when its hitting
    holeImg = loadImage('../images/project 1/hole.png'); // Load the image of the mole
    grassImg = loadImage('../images/project 1/grass.jpg'); // Load the image of the grass

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

    image(grassImg, 0, 0, width, height);

    // Show holes
    for (var i = 0; i < holes.length; i++) {
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

// Function to create holes in a 2d array.
function createHoles() {
    // Create 6 mole holes
    let numOfCols = 3;
    let numOfRows = 2;
    let colSpace = width / numOfCols;
    let rowSpace = height / 2 / numOfRows;
    for (let i = 0; i < numOfCols; i++) {
        for (let j = 0; j < numOfRows; j++) {
            let x = (colSpace * i) + (colSpace / 2) - 50; // 50 came from trial and error to see what centers the holes.
            let y = (rowSpace * j) + (rowSpace / 2) + 150;
            let hole = new Hole(x, y, holeImg);
            holes.push(hole);
        }
    }
}

//// This function fires on every resize of the browser window.
//function windowResized() {
//    resizeCanvas(windowWidth, windowHeight);
//}