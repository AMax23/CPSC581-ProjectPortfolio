// P5 JavaScript source code for the main sketch.

// Comment this out temporarily cos its annoying.
//if (!window.location.href.toString().includes("https://")) { alert(`You will need "https://" to view this.`) }

//var capture; // Video managed by P5
//var face; // For face tracking

var hammerImg;
var hammerHitImg;
var holeImg;
var bgImg;

var startBtn;

var mic;
var volumeLevel;
// The point of having 2 thresholds is so the player does not keep yelling non stop.
// Once the player yells to bring out the moles then they need to stop yelling until
// the volume drops below the bottom threshold and then they can continue again.
var volumeThresholdTop = 30;
var volumeThresholdBottom = 20;
var soundInput = false;

var holes = [];
var moles = [];
var numOfHoles = 6;
var randomMole;

var screen = 0; // Screen 0 = Start screen, 1 = start game, 2 - game over

var hammer;

var score = 0;
var startTime;
var timeLimit_ms = 5 * 60 * 1000; // Game time limit in milliseconds. Init to 5 minutes.

////////////////////////// BASIC P5 SET UP ////////////////////////////////////////
function preload() {
    // Load the images in a asynchronous way. setup() waits until preload() is done.
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

    startBtn = createButton('Start Game');
    startBtn.id('startBtn');

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
        console.log('game over');
        gameOver();
    }

    showHammer();
}
///////////////////////////////////////////////////////////////////////////////////

function gameStart() {
    // Game background
    image(bgImg, 0, 0, width, height);

    displayScore();
    displayTime();

    volumeLevel = mic.getVolumeLevel(); // Read the amplitude (volume level).

    // Pick a random hole for the mole to come out of.
    if (moles[randomMole].hit) {
        randomMole = floor(random(numOfHoles)); // Generate random number between 0 and 5.
    }

    // Show the mole that's active.
    if (!moles[randomMole].hit && volumeLevel >= volumeThresholdTop && !soundInput) {
        moles[randomMole].out = moles[randomMole].show();
        soundInput = moles[randomMole].out;
    } else if (moles[randomMole].out && (volumeLevel < volumeThresholdTop || moles[randomMole].hit)) {
        moles[randomMole].hide();
    }

    if (volumeLevel < volumeThresholdBottom) {
        soundInput = false;
    }

    // Put this extra canvas exactly where the hole is so its aligned.
    image(moles[randomMole].extraCanvas, moles[randomMole].x, moles[randomMole].y);

    // Show holes
    for (var i = 0; i < holes.length; i++) {
        holes[i].show();
    }
}

function showHammer() {
    if (moleHit()) {
        push();
        // Slow down the frame rate to show the effect of the hammer hitting. Otherwise it's too fast.
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
            score++;
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

    // Start of by picking a random hole where the mole will come out of.
    randomMole = floor(random(6));
}

function displayScore() {
    let fontSize = windowWidth * 0.15; // Just trying to get a reasonaable font size bassed on the user's screen size.
    let xMultiplier = 0.10;
    if (score > 9) { xMultiplier = 0.20; }
    let xPos = windowWidth - windowWidth * xMultiplier;
    push();
    textSize(fontSize);
    textStyle(BOLD);
    fill(255);
    text(score, xPos, height - 50);
    pop();
}

// Rseet the game
function resetGame() {

}

function displayTime() {
    let timeBar = map(millis(), startTime, startTime + timeLimit_ms, 0, width);
    strokeWeight(10);
    line(0, 0, timeBar, 0);
    if (millis() >= startTime + timeLimit_ms) {
        screen = 2; // Screen 2 = game over. Time is up.
    } else {
        screen = 1; // Still playing.
    }
}


function startScreen() {
    push();
    background(0);
    startBtn.position(100, 165);
    startBtn.mousePressed(function () {
        screen = 1; // Start game. Button is hidden after mic is started in Mic.js
        startTime = millis(); // The time when the game has started. Countdown start time.
    });
    pop();
}


function gameOver() {
    clear();
    push();
    background(0);
    fill(255);
    textSize(60);
    textAlign(CENTER);
    text('Game Over!', width / 2, height / 2);
    pop();
}


//// This function fires on every resize of the browser window.
//function windowResized() {
//    resizeCanvas(windowWidth, windowHeight);
//}