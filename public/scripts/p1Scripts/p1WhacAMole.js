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

    // Show moles
    for (var i = 0; i < moles.length; i++) {
        if (!moles[i].hit) {
            moles[i].show();
        }
    }
    // Show holes
    for (var i = 0; i < holes.length; i++) {
        holes[i].show();
    }
}

function hammer() {
    var volumeThreshold = 15;
    volumeLevel = mic.getVolumeLevel(); // Read the amplitude (volume level).
    //console.log('volume level = ' + volumeLevel);

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
        if (!moles[i].hit &&
            // Case when the top left of the hammer is between the bounds of the mole.
            (face.hammerBounds.topLeftX <= moles[i].moleBounds.topLeftX && face.hammerBounds.topLeftX >= moles[i].moleBounds.topRightX
                && face.hammerBounds.topLeftY > moles[i].moleBounds.topLeftY && face.hammerBounds.topLeftY < moles[i].moleBounds.bottomLeftY)

            // Case when the bottom left of the hammer is between the bounds of the mole.
            || (face.hammerBounds.bottomLeftX <= moles[i].moleBounds.topLeftX && face.hammerBounds.bottomLeftX >= moles[i].moleBounds.topRightX
                && face.hammerBounds.bottomLeftY > moles[i].moleBounds.topLeftY && face.hammerBounds.bottomLeftY < moles[i].moleBounds.bottomLeftY)

            // Case when the entire hammer is touching the mole but all the bounds of the hammer are outside the bounds of the mole's.
            || (face.hammerBounds.bottomRightY >= moles[i].moleBounds.topLeftY && face.hammerBounds.bottomRightY <= moles[i].moleBounds.bottomLeftY
                && face.hammerBounds.bottomRightX <= moles[i].moleBounds.topRightX && face.hammerBounds.topLeftX >= moles[i].moleBounds.topLeftX
                && face.hammerBounds.topRightY <= moles[i].moleBounds.topRightY)
        ) {
            // I have to do this craziness because everything is reversed due to the video mirrorring thingy.
            // I wish i had time to find a better way to manage the flipping but for now this will do.
            let tempIndex = 0;
            switch (i) {
                case 0:
                    tempIndex = 3;
                    break;
                case 1:
                    tempIndex = 4;
                    break;
                case 2:
                    tempIndex = 5;
                    break;
                case 3:
                    tempIndex = 0;
                    break;
                case 4:
                    tempIndex = 1;
                    break;
                case 5:
                    tempIndex = 2;
                    break;
            }
            // Only set the hit variable to true. I dont wanna delete the object from the array.
            // So the array length will always be the samee regardless of the mole being hit.
            moles[tempIndex].hit = true;
            moles[tempIndex].hide();
            //console.log('You hit mole ' + tempIndex);
            return true;
        }
    }
    return false;
}

// Function to create holes in a 2d array. And the moles.
function createHoles() {
    // Create 6 mole holes.
    // If you change the  num of cols and rows go back and update the switch statement in the hit detectection function.
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