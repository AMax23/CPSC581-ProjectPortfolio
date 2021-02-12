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

var screen = 1;

var hammerBounds = {
    'topLeftX': 0,
    'topLeftY': 0,
    'topRightX': 0,
    'topRightY': 0,
    'bottomLeftX': 0,
    'bottomLeftY': 0,
    'bottomRightX': 0,
    'bottomRightY': 0
};

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
    if (screen == 0) {
        startScreen();
    } else if (screen == 1) {
        gameStart();
    } else if (screen == 2) {
        gameOver();
    }

    hammer();
}
///////////////////////////////////////////////////////////////////////////////////

function gameStart() {
    // Game background
    image(grassImg, 0, 0, width, height);
    //background(0);

    // Show holes and moles
    for (var i = 0; i < holes.length; i++) {
        moles[i].show();
        //moles[i].hide();
        holes[i].show();
    }
}

function hammer() {
    var volumeThreshold = 15;
    volumeLevel = mic.getVolumeLevel(); // Read the amplitude (volume level).
    //console.log('volume level = ' + volumeLevel);

    //Initially for a bit the x and y might be undefined because the camera is still initializing.
    if (face.currX != undefined) {
        push();
        // Flip the image
        translate(displayWidth, 0);
        scale(-1.0, 1.0);
        fill(255, 255, 0);
        hammerBounds.bottomRightX = face.currX - 70;
        hammerBounds.bottomRightY = face.currY + 40;
        ellipse(hammerBounds.bottomRightX, hammerBounds.bottomRightY, 10, 10);
        fill(255, 0, 0);
        hammerBounds.bottomLeftX = face.currX - 20;
        hammerBounds.bottomLeftY = face.currY + 60;
        ellipse(face.currX - 20, face.currY + 60, 10, 10);
        fill(0, 255, 0);
        hammerBounds.topLeftX = face.currX - 10;
        hammerBounds.topLeftY = face.currY + 30;
        ellipse(face.currX - 10, face.currY + 30, 10, 10);
        fill(255, 0, 255);
        hammerBounds.topRightX = face.currX - 70;
        hammerBounds.topRightY = face.currY + 10;
        ellipse(face.currX - 70, face.currY + 10, 10, 10);
        pop();
    }

    if (isMoleHit()) {
        face.show(hammerHitImg);
    } else {
        face.show(hammerImg);
    }
}

/* Check if the hammer made contact with the mole.
 * If it does, then it returns true and a differend hammer is drawn.
 */
function isMoleHit() {

    // The x and y directions are flipped because the canvas is flipped when it draws the hammer
    // This is because of the camera mirroring.
    for (var i = 0; i < moles.length; i++) {
        if (
            // Case when the top left of the hammer is between the bounds of the mole.
            (hammerBounds.topLeftX <= moles[i].moleBounds.topLeftX && hammerBounds.topLeftX >= moles[i].moleBounds.topRightX
                && hammerBounds.topLeftY > moles[i].moleBounds.topLeftY && hammerBounds.topLeftY < moles[i].moleBounds.bottomLeftY)

            // Case when the bottom left of the hammer is between the bounds of the mole.
            || (hammerBounds.bottomLeftX <= moles[i].moleBounds.topLeftX && hammerBounds.bottomLeftX >= moles[i].moleBounds.topRightX
                && hammerBounds.bottomLeftY > moles[i].moleBounds.topLeftY && hammerBounds.bottomLeftY < moles[i].moleBounds.bottomLeftY)

            // Case when the entire hammer is touching the mole but all the bounds of the hammer are outside the bounds of the mole's.
            || (hammerBounds.bottomRightY >= moles[i].moleBounds.topLeftY && hammerBounds.bottomRightY <= moles[i].moleBounds.bottomLeftY
                && hammerBounds.bottomRightX <= moles[i].moleBounds.topRightX && hammerBounds.topLeftX >= moles[i].moleBounds.topLeftX
                && hammerBounds.topRightY <= moles[i].moleBounds.topRightY
            )
        ) {
            return true;
        }
    }
    return false;
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