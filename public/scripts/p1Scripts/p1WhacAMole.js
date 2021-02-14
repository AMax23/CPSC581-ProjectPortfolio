// P5 JavaScript source code for the main sketch.

// Comment this out temporarily cos its annoying.
//if (!window.location.href.toString().includes("https://")) { alert(`You will need "https://" to view this.`) }

var capture; // Video managed by P5
var face; // For face tracking

var hammerImg;
var hammerHitImg;
var holeImg;
var bgImg;

var mic;
var volumeLevel;
var volumeThreshold = 30;

var holes = [];
var moles = [];

var screen = 1;

var maxSpeed = 15;
var x, y;

var hammer;


////////////////////////// BASIC P5 SET UP ////////////////////////////////////////
function preload() {
    // Load the images in a asynchronous way
    hammerImg = loadImage('../images/project 1/thorsHammer.png'); // Load the image of the hammer
    hammerHitImg = loadImage('../images/project 1/thorsHammerHit.png'); // Load the image hammer when its hitting
    bgImg = loadImage('../images/project 1/background.png'); // Load the image of the grass
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
    bgImg.loadPixels();
    holeImg.loadPixels();
    moleImg.loadPixels();

    //// Set up video
    //capture = createCapture(VIDEO);
    ////capture.size(canvasWidth, canvasHeight);
    //capture.hide();

    //// Initialize face tracker.
    //face = new Face(capture);
    //face.init();

    // Initialize mic and start it.
    mic = new Microphone();
    mic.init();

    createHoles();

    hammer = new Hammer(width / 2, height / 2);
}

function draw() {
    frameRate(60);

    if (screen == 0) {
        startScreen();
    } else if (screen == 1) {
        gameStart();
    } else if (screen == 2) {
        gameOver();
    }

    showHammer();
}
///////////////////////////////////////////////////////////////////////////////////

function gameStart() {
    // Game background
    image(bgImg, 0, 0, width, height);
    //background(0);

    volumeLevel = mic.getVolumeLevel(); // Read the amplitude (volume level).

    // Show moles
    for (var i = 0; i < moles.length; i++) {
        if (!moles[i].hit && volumeLevel >= volumeThreshold) {
            moles[i].show();
            moles[i].out = true;
        } else if (moles[i].out && (volumeLevel < volumeThreshold || moles[i].hit)) {
            moles[i].hide();
        }
        // Put this extra canvas exactly where the hole is so its aligned.
        image(moles[i].extraCanvas, moles[i].x, moles[i].y);
    }
    // Show holes
    for (var i = 0; i < holes.length; i++) {
        holes[i].show();
    }
}

function showHammer() {
    if (moleHit()) {
        push();
        // Slow down the frame rate to show the effect of the hammer hitting.
        // Otherwise it's too fast.
        frameRate(10);
        hammer.show(hammerHitImg);
        pop();
    } else {
        hammer.show(hammerImg);
    }
}

/* Check if the hammer made contact with the mole.
 * If it does, then it returns true and a differend hammer is drawn.
 */
function moleHit() {
    for (var i = 0; i < moles.length; i++) {
        if (!moles[i].hit && moles[i].out && (
            // Case when the top right of the hammer is between the bounds of the mole.
            (hammer.hammerBounds.topRightX >= moles[i].moleBounds.topLeftX && hammer.hammerBounds.topRightX <= moles[i].moleBounds.topRightX
                && hammer.hammerBounds.topRightY > moles[i].moleBounds.topRightY && hammer.hammerBounds.topRightY < moles[i].moleBounds.bottomRightY)

            // Case when the bottom right makes contact with the mole.
            || (hammer.hammerBounds.bottomRightY >= moles[i].moleBounds.topRightY && hammer.hammerBounds.bottomRightY <= moles[i].moleBounds.bottomRightY
                && hammer.hammerBounds.bottomRightX >= moles[i].moleBounds.topLeftX && hammer.hammerBounds.bottomRightX <= moles[i].moleBounds.topRightX)

            // Case when the entire hammer is touching the mole but all the bounds of the hammer are outside the bounds of the mole's.
            || (hammer.hammerBounds.topRightX > moles[i].moleBounds.topRightX && hammer.hammerBounds.bottomLeftX <= moles[i].moleBounds.topLeftX
                && hammer.hammerBounds.topLeftY < moles[i].moleBounds.topLeftY
                && hammer.hammerBounds.bottomLeftY > moles[i].moleBounds.topLeftY)
        )
        ) {
            // Only set the hit variable to true. I dont wanna delete the object from the array.
            // So the array length will always be the same regardless of the mole being hit.
            moles[i].hit = true;
            window.navigator.vibrate(100); // Vibrate for 100ms when the mole is hit cos it's fun (or annoying!)
            moles[i].hide();
            //console.log('You hit mole ' + i);
            return true;
        }
    }
    return false;
}

// Function to create holes in a 2d array. And the moles.
function createHoles() {
    // Create 6 mole holes.
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