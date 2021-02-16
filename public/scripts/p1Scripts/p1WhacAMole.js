// P5 JavaScript source code for the main sketch.

// Comment this out temporarily cos its annoying.
//if (!window.location.href.toString().includes("https://")) { alert(`You will need "https://" to view this.`) }

var hammerImg;
var hammerHitImg;
var holeImg;
var bgImg;
var startScreenImg;
var gameOverScreenImg;

var startBtn;

var mic;
var volumeLevel;
var volumeThreshold = 30;

var holes = [];
var moles = [];
var numOfHoles = 6;
var randomMole;

var molePicked = false; // The purpose of this is to ensure that the mole is set only once while it's still active.

var screen = 0; // Screen 0 = Start screen, 1 = start game, 2 = game over

var hammer;

var score = 0;
var startTime;
var timeLimit_ms = 1 * 60 * 1000; // Game time limit in milliseconds. Init to 1 minute.

var timeMoleStaysOut = 100; // Number of times to be out of the hole.
var timeMoleIsOut = 0;
var timeMoleIsHidden = 0;
var timeMoleStaysHidden = 100; // Number of times to stay in the hole.

////////////////////////// BASIC P5 SET UP ////////////////////////////////////////
function preload() {
    // Load the images in a asynchronous way. setup() waits until preload() is done.
    hammerImg = loadImage('../images/project 1/thorsHammer.png'); // Load the image of the hammer
    hammerHitImg = loadImage('../images/project 1/thorsHammerHit.png'); // Load the image hammer when its hitting
    bgImg = loadImage('../images/project 1/background.png'); // Load the image of the grass
    holeImg = loadImage('../images/project 1/hole.png'); // Load the image of the hole
    moleImg = loadImage('../images/project 1/mole.png'); // Load the image of the mole
    startScreenImg = loadImage('../images/project 1/startScreen.png'); // Load game start screen image
    gameOverScreenImg = loadImage('../images/project 1/gameOverScreen.png'); // Load game over screen image
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
        showHammer();
    } else if (screen == 2) {
        gameOver();
    }
}
///////////////////////////////////////////////////////////////////////////////////

function gameStart() {
    // Game background
    image(bgImg, 0, 0, width, height);

    displayScore();
    displayTime();
    showMole();

    // Show holes
    for (var i = 0; i < holes.length; i++) {
        holes[i].show();
    }
}

function showMole() {

    // Pick a random hole for the mole to come out of.
    // Do this every time the mole is hit or when the mole goes in the hole.
    if ((moles[randomMole].hit || timeMoleIsHidden > timeMoleStaysHidden) && !molePicked) {
        // Pick a new hole, not same as previous one.
        while (true) {
            let newRandNum = floor(random(numOfHoles)); // Generate random number between 0 and 5.
            if (newRandNum != randomMole) {
                randomMole = newRandNum;
                break;
            }
        }
        molePicked = true;
        moles[randomMole].active = false; // The mole start off as not being active. This means it will start off hidden.
        moles[randomMole].hit = false; // In case the mole was hit, we need to reset the variable.
    }

    // Show the mole that's active.
    if (!moles[randomMole].hit && timeMoleIsOut <= timeMoleStaysOut && moles[randomMole].active) {
        // Mark the time when the mole fully comes out. It will only stay active for a bit and then hide again.
        if (moles[randomMole].show()) {
            timeMoleIsOut++;
            timeMoleIsHidden = 0;
        }
    } else if (moles[randomMole].out && timeMoleIsHidden <= timeMoleStaysHidden) {
        moles[randomMole].hide();
    } else if (timeMoleIsHidden > timeMoleStaysHidden) {
        timeMoleIsOut = 0;
        moles[randomMole].active = true;
    } else if (!moles[randomMole].out) {  // If the mole is not out (fully hidden), then start the timer for mole hiding
        timeMoleIsHidden++;
        molePicked = false; // Pick a random hole again once the mole hides.
    }

    // Put this extra canvas exactly where the hole is so its aligned.
    image(moles[randomMole].extraCanvas, moles[randomMole].x, moles[randomMole].y);
}

function showHammer() {
    if (moleHit()) {
        push();
        // Play a sound when the hammer hits the mole.
        mic.whackSound.play();
        mic.whackSound.currentTime = 0;
        // Slow down the frame rate to show the effect of the hammer hitting. Otherwise it's too fast.
        // This is changed back in the draw function.
        frameRate(10);
        hammer.show(hammerHitImg);
        pop();
    } else {
        hammer.show(hammerImg);
    }
}

/* Check if the hammer made contact with the mole.
 * If it does, then it returns true and a differend hammer is drawn.
 * To hit the mole you must also have some sound input otherwise the hammer will not hit.
 */
function moleHit() {
    volumeLevel = mic.getVolumeLevel(); // Read the amplitude (volume level).

    for (var i = 0; i < moles.length; i++) {
        if (!moles[i].hit && moles[i].out && volumeLevel >= volumeThreshold && (
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
            //moles[i].hide();
            //console.log('You hit mole ' + i);
            score++;
            // After each hit, the moles come out faster and go back in fast too!
            if (timeMoleStaysHidden >= 30) {
                timeMoleStaysHidden = timeMoleStaysHidden - 5;
            }
            if (timeMoleStaysOut >= 20) {
                timeMoleStaysOut = timeMoleStaysOut - 5;
            }
            // Reset the time for when the mole is out if it's hit.
            //timeMoleIsOut = 0;
            timeMoleIsHidden = 0;
            molePicked = false;
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
    let fontSize = 70; //windowWidth * 0.15; // Just trying to get a reasonaable font size bassed on the user's screen size.
    //let xMultiplier = 50;
    //if (score > 9) { xMultiplier = 90; }
    //let xPos = 10;//width - xMultiplier; //windowWidth - windowWidth * xMultiplier;
    push();
    textSize(fontSize);
    textStyle(BOLD);
    fill(255);
    text(score, 10, 60);
    pop();
}

// Rseet the game
function resetGame() {
    holes = [];
    moles = [];
    score = 0;
    timeMoleIsHidden = 0;
    timeMoleIsOut = 0;
    timeMoleStaysHidden = 100;
    timeMoleStaysOut = 100;
    createHoles();
}

// Show the time remaining at the top.
function displayTime() {
    let timeBar = map(millis(), startTime + timeLimit_ms, startTime, 0, width);
    push();
    strokeWeight(10);
    // Change the bar colour depending on how much time is left.
    if (millis() >= 0.75 * (startTime + timeLimit_ms)) {
        stroke(255, 0, 0);
    } else {
        stroke(0, 255, 0);
    }
    line(0, 0, timeBar, 0);
    pop();
    if (millis() >= startTime + timeLimit_ms) {
        screen = 2; // Screen 2 = game over. Time is up.
    } else {
        screen = 1; // Still playing.
    }
}


function startScreen() {
    push();
    //background(0);
    image(startScreenImg, 0, 0, width, height);
    startBtn.position(width / 2, height / 2);
    startBtn.mousePressed(function () {
        screen = 1; // Start game. Button is hidden after mic is started in Mic.js
        startTime = millis(); // The time when the game has started. Countdown start time.
    });
    pop();
}


function gameOver() {
    clear();
    push();
    image(gameOverScreenImg, 0, 0, width, height);
    fill(255);
    textSize(20);
    textAlign(CENTER);
    //molesMissed = molesMissed - score;
    //text('Your score is ' + score
    //    + '\n Hits = ' + score
    //    + '\n Misses = ' + (molesMissed)
    //    + '\n Accuracy = ' + score / (score + molesMissed - score)
    //    , width / 2, height / 2);
    pop();
}


//// This function fires on every resize of the browser window.
//function windowResized() {
//    resizeCanvas(windowWidth, windowHeight);
//}