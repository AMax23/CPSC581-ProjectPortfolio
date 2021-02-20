// P5 JavaScript source code for the main sketch.

// Comment this out temporarily cos its annoying.
if (!window.location.href.toString().includes("https://")) { alert(`You will need "https://" to view this.`) }

var hammerImg;
var hammerHitImg;
var holeImg;
var bgImg;
var startScreenImg;
var gameOverScreenImg;

var inputBox;
var submitBtn;

var mic;
var volumeLevel;
var volumeThreshold = 15; // This number came from trial and error.

var hammer;
var holes = [];
var moles = [];
var numOfHoles = 6;
var randomMole; // Initialized when creating new holes and then updates everytime the mole is hit or when it hides.
var molePicked = false; // The purpose of this is to ensure that the mole is set only once while it's still active.

var screen = 0; // Screen 0 = Start screen, 1 = start game, 2 = game over, 3 = tutorial Mode

var tutorialMode = false;
var messageTime = 0;
var instructions = ['TILT/ROTATE YOUR DEVICE \nTO MOVE HAMMER', 'YELL TO HIT THE MOLE', 'TIME REMAINING IS THE TOP BAR \n YOU HAVE 60 SECONDS',
    'TOP LEFT IS YOUR SCORE', 'THE MOLES GET FASTER \nAS YOUR SCORE INCREASES', 'GO BACK TO START MENU \n WHEN YOU ARE READY'];
var nextInsMsg = 0;

var score = 0;
var molesMissed = 0;
var accuracy; // accuracy = score / (score + molesMissed)
var startTime = 0; // The start time of the program. Used to get the time remaining.
var gameTimeLimit = 3546; // ~ 1 min. This is a count of how many times the game loop runs until it's game over. There was a problem using millis()...
var leaderboard = new Leaderboard();
var scorePosted = false;
var leaderBoardRequested = false;

var timeMoleStaysOut = 100; // Number of times to be out of the hole.
var timeMoleIsOut = 0;
var timeMoleIsHidden = 0;
var timeMoleStaysHidden = 100; // Number of times to stay in the hole.

////////////////////////// BASIC P5 SET UP ////////////////////////////////////////
function preload() {
    // Load the images in a asynchronous way. setup() waits until preload() is done.
    hammerImg = loadImage('../images/project 1/thorsHammer.png'); // *** IF THIS IMAGE IS CHANGED, HAMMER BOUNDS NEED TO BE UPDATED ***
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

    // Create buttons and input for the different screens
    inputBox = createInput('').attribute('placeholder', 'Your Name');
    inputBox.attribute('maxlength', 10); // Set the max char limit for the input.
    submitBtn = createButton('Submit');

    // Initialize mic and start it.
    mic = new Microphone();
    mic.init();

    createHoles();

    hammer = new Hammer(width / 2, height / 2);
    hammer.requestOrientationPermission();
}

function draw() {
    frameRate(60);

    if (screen == 0) {
        startScreen();
    } else if (screen == 1) {
        gameStart();
        showHammer();
        quitGame();
    } else if (screen == 2) {
        gameOver();
    } else if (screen == 3) {
        tutorial();
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

// Randomly pick a new mole, show it and then hide it again.
function showMole() {
    // Pick a random hole for the mole to come out of.
    // Do this every time the mole is hit or when the mole goes in the hole.
    if ((moles[randomMole].hit || timeMoleIsHidden > timeMoleStaysHidden) && !moles[randomMole].active && !molePicked) {
        // Pick a new hole, not same as previous one.
        while (true) {
            // The tutorial mode have instructions which cover the top 2 holes.
            let newRandNum = tutorialMode ? random([1, 2, 4, 5]) : floor(random(numOfHoles)); // Generate random number between 0 and 5.
            if (newRandNum != randomMole) {
                randomMole = newRandNum;
                break;
            }
        }
        molePicked = true;
        moles[randomMole].active = false; // The mole starts off as not being active. This means it will start off hidden.
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
        // Hide the mole
        // And if the mole is fully hidden and the mole was never hit, increase the missed counter.
        if (!moles[randomMole].hide()) {
            if (!moles[randomMole].hit) {
                molesMissed++;
            }
        }
    } else if (timeMoleIsHidden > timeMoleStaysHidden) {
        timeMoleIsOut = 0;
        moles[randomMole].active = true;
    } else if (!moles[randomMole].out) {  // If the mole is not out (fully hidden), then start the timer for mole hiding.
        timeMoleIsHidden++;
        molePicked = false; // Pick a random hole again once the mole hides.
    }

    // If the mole has been out, then it becomes active and a new mole will be picked randomly.
    if (timeMoleIsOut > timeMoleStaysOut) {
        moles[randomMole].active = false;
    }

    // This is when the mole is hit, we need to show the effect of the mole hiding.
    // When the mole is hidden, then a new random mole/hole will be picked.
    if (moles[randomMole].hit && timeMoleIsHidden > timeMoleStaysHidden) {
        moles[randomMole].active = false;
        molePicked = false;
    }

    // Put this extra canvas exactly where the hole is so its aligned.
    image(moles[randomMole].extraCanvas, moles[randomMole].x, moles[randomMole].y);
}

// Show hammer and check if mole was hit.
function showHammer() {
    if (moleHit()) {
        push();
        // Play a sound when the hammer hits the mole.
        mic.whackSound.play();
        // Slow down the frame rate to show the effect of the hammer hitting. Otherwise it's too fast.
        // This is changed back in the draw function.
        frameRate(10);
        hammer.show(hammerHitImg);
        mic.whackSound.currentTime = 0; // Set the sound back to position 0.
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

            //console.log('You hit mole ' + i);
            score++;

            // After each hit, the moles come out faster and go back in fast too!
            timeMoleStaysHidden = timeMoleStaysHidden > 30 ? timeMoleStaysHidden - 5 : timeMoleStaysHidden;
            timeMoleStaysOut = timeMoleStaysOut > 25 ? timeMoleStaysOut - 3 : timeMoleStaysOut;

            // Reset the time for when the mole is out if it's hit.
            timeMoleIsOut = 0;
            timeMoleIsHidden = 0;
            molePicked = false;
            return true;
        }
    }
    return false;
}

// Function to create holes in a 2d array. And the moles.
function createHoles() {
    // Create mole holes.
    let numOfCols = width > 900 ? 3 : 2;
    let numOfRows = 3;
    numOfHoles = numOfCols * numOfRows;
    let colSpace = width / numOfCols - (holeImg.width/7/2); // 60
    let rowSpace = height / 2 / numOfRows + (height*0.1);
    for (let i = 0; i < numOfCols; i++) {
        for (let j = 0; j < numOfRows; j++) {
            let x = (colSpace * i) + (colSpace / 2) + 10; // These numbers came from trial and error to see what centers the holes.
            let y = (rowSpace * j) + (rowSpace / 2) + 150;
            let hole = new Hole(x, y, holeImg);
            let mole = new Mole(x, y, moleImg);
            holes.push(hole);
            moles.push(mole);
        }
    }
    // Start of by picking a random hole where the mole will come out of.
    randomMole = floor(random(numOfHoles));
}

// Display the player's current score.
function displayScore() {
    let fontSize = 70;
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
    molesMissed = 0;
    timeMoleIsHidden = 0;
    timeMoleIsOut = 0;
    timeMoleStaysHidden = 100;
    timeMoleStaysOut = 100;
    messageTime = 0;
    nextInsMsg = 0;
    tutorialMode = false;
    createHoles();
}

// Show the time remaining at the top.
function displayTime() {
    push();
    strokeWeight(10);

    startTime--;
    let timeBar = map(startTime, 0, gameTimeLimit, 0, width);

    // Change the bar colour depending on how much time is left.
    startTime <= 0.25 * gameTimeLimit ? stroke(255, 0, 0) : stroke(0, 255, 0);

    line(0, 0, timeBar, 0);
    pop();

    // Either time is up or still playing. 2 = game over screen
    screen = startTime < 0 && !tutorialMode ? 2 : screen;
}

function startScreen() {
    push();
    image(startScreenImg, 0, 0, width, height);

    let startBtn = {
        "bottomLeftX": 0,
        "bottomLeftY": 0,
        "bottomRightX": 0,
        "bottomRightY": 0,
        "topLeftX": 0,
        "topLeftY": 0,
        "topRightX": 0,
        "topRightY": 0
    }

    let instructionsBtn = {
        "bottomLeftX": 0,
        "bottomLeftY": 0,
        "bottomRightX": 0,
        "bottomRightY": 0,
        "topLeftX": 0,
        "topLeftY": 0,
        "topRightX": 0,
        "topRightY": 0
    }

    startBtn.bottomRightX = width / 2 + width / 2 * 0.13;
    startBtn.bottomRightY = height / 2;
    startBtn.topRightX = width / 2 + width / 2 * 0.13;
    startBtn.topRightY = height / 2 - height / 2 * 0.07;
    startBtn.bottomLeftX = width / 2 - width / 2 * 0.14;
    startBtn.bottomLeftY = height / 2;
    startBtn.topLeftX = width / 2 - width / 2 * 0.14;
    startBtn.topLeftY = height / 2 - height / 2 * 0.07;

    //fill(255, 0, 0);
    //rect(startBtn.bottomRightX, startBtn.bottomRightY, 10, 10);
    //fill(255, 255, 0);
    //rect(startBtn.topRightX, startBtn.topRightY, 10, 10);
    //fill(255, 0, 255);
    //rect(startBtn.bottomLeftX, startBtn.bottomLeftY, 10, 10);
    //fill(0, 0, 255);
    //rect(startBtn.topLeftX, startBtn.topLeftY, 10, 10);

    // If the start button is clicked.
    if (screen == 0 && mouseIsPressed && mouseX >= startBtn.topLeftX && mouseX <= startBtn.topRightX
        && mouseY >= startBtn.topLeftY && mouseY <= startBtn.bottomLeftY) {
        // Play a sound when player presses start.
        mic.whackSound.play();
        mic.whackSound.currentTime = 0;
        screen = 1; // Start game. Button is hidden after mic is started in Mic.js
        startTime = gameTimeLimit; // The time when the game has started. Countdown start time.
    }

    instructionsBtn.bottomRightX = width / 2 + width / 2 * 0.30;
    instructionsBtn.bottomRightY = height / 2 + height / 2 * 0.13;
    instructionsBtn.topRightX = width / 2 + width / 2 * 0.30;
    instructionsBtn.topRightY = height / 2 + height / 2 * 0.08;
    instructionsBtn.bottomLeftX = width / 2 - width / 2 * 0.31;
    instructionsBtn.bottomLeftY = height / 2 + height / 2 * 0.13;
    instructionsBtn.topLeftX = width / 2 - width / 2 * 0.31;
    instructionsBtn.topLeftY = height / 2 + height / 2 * 0.08;

    //fill(255, 0, 0);
    //rect(instructionsBtn.bottomRightX, instructionsBtn.bottomRightY, 10, 10);
    //fill(255, 255, 0);
    //rect(instructionsBtn.topRightX, instructionsBtn.topRightY, 10, 10);
    //fill(255, 0, 255);
    //rect(instructionsBtn.topLeftX, instructionsBtn.topLeftY, 10, 10);
    //fill(0, 0, 255);
    //rect(instructionsBtn.bottomLeftX, instructionsBtn.bottomLeftY, 10, 10);

    // If the instructions button is clicked
    if (screen == 0 && mouseIsPressed && mouseX >= instructionsBtn.topLeftX && mouseX <= instructionsBtn.topRightX
        && mouseY >= instructionsBtn.topLeftY && mouseY <= instructionsBtn.bottomLeftY) {
        // Play a sound when player presses the button.
        mic.whackSound.play();
        mic.whackSound.currentTime = 0;
        screen = 3; // Tutorial mode is on.
        startTime = gameTimeLimit;
        tutorialMode = true;
    }
    pop();
}

function gameOver() {
    clear();
    push();
    image(gameOverScreenImg, 0, 0, width, height);

    let leaderboardPos = document.getElementById('leaderboard').getBoundingClientRect();

    // Show the leaderboard
    document.getElementById('leaderboard').style.visibility = "visible";
    // Only get the leaderboard once 
    if (!leaderBoardRequested) {
        leaderboard.getScores();
        leaderBoardRequested = true;
    }

    fill(255);
    textSize(20);
    textAlign(CENTER);
    accuracy = (score != 0) ? (score / (score + molesMissed) * 100).toFixed(0) : 0;
    text('Your score is ' + score
        + '\n Missed = ' + (molesMissed)
        + '\n Accuracy = ' + accuracy + '%'
        , width / 2, height / 2 - height / 2 * 0.3);

    pop();

    // Only allow the player to submit their score if their score is greater than the last player's.
    // Otherwise there is no point in submitting if they get a low score. It will never be shown.
    var lastPlayerScore = Number(document.getElementById("10Score").innerText);
    if (score > lastPlayerScore && !scorePosted) {
        inputBox.position(leaderboardPos.x + 5, leaderboardPos.y - 50);
        submitBtn.position(inputBox.x + inputBox.width + 1, inputBox.y);
        inputBox.show();
        submitBtn.show();
        submitBtn.mousePressed(function () {
            let name = inputBox.value().trim();
            // The name must be at least 1 character.
            if (name.length > 0) {
                leaderboard.postScore(name, score, accuracy / 100);
                inputBox.value(''); // Clear the input box after submitting
                scorePosted = true;
                // Update the leaderboatd and show it again.
                leaderboard.getScores();
            }
        });
    } else {
        // Initially the get leaderboard request takes a while so the input btn is shown for a second or so.
        // So it goes into the first if and displays the input and the submit btn. So, we need to hide it again.
        inputBox.hide();
        submitBtn.hide();
        push();
        fill(255);
        textSize(20);
        textAlign(CENTER);
        text('Beat one of these scores \nand submit your high score!', width / 2, leaderboardPos.y - 50);
        pop();
    }

    let backToMenuBtn = {
        "bottomLeftX": 0,
        "bottomLeftY": 0,
        "bottomRightX": 0,
        "bottomRightY": 0,
        "topLeftX": 0,
        "topLeftY": 0,
        "topRightX": 0,
        "topRightY": 0
    }

    backToMenuBtn.bottomRightX = width / 2 + width / 2 * 0.23;
    backToMenuBtn.bottomRightY = height / 2 - height / 2 * 0.4;
    backToMenuBtn.topRightX = width / 2 + width / 2 * 0.23;
    backToMenuBtn.topRightY = height / 2 - height / 2 * 0.5;
    backToMenuBtn.topLeftX = width / 2 - width / 2 * 0.24;
    backToMenuBtn.topLeftY = height / 2 - height / 2 * 0.5;
    backToMenuBtn.bottomLeftX = width / 2 - width / 2 * 0.24;
    backToMenuBtn.bottomLeftY = height / 2 - height / 2 * 0.4;

    //fill(255, 0, 0);
    //rect(backToMenuBtn.bottomRightX, backToMenuBtn.bottomRightY, 10, 10);
    //fill(255, 255, 0);
    //rect(backToMenuBtn.topRightX, backToMenuBtn.topRightY, 10, 10);
    //fill(255, 0, 255);
    //rect(backToMenuBtn.topLeftX, backToMenuBtn.topLeftY, 10, 10);
    //fill(0, 0, 255);
    //rect(backToMenuBtn.bottomLeftX, backToMenuBtn.bottomLeftY, 10, 10);

    // If user presses the 'back to menu button'.
    if (screen == 2 && mouseIsPressed && mouseX >= backToMenuBtn.bottomLeftX && mouseX <= backToMenuBtn.bottomRightX
        && mouseY >= backToMenuBtn.topRightY && mouseY <= backToMenuBtn.bottomRightY) {
        // Play a sound when player presses the button.
        mic.whackSound.play();
        mic.whackSound.currentTime = 0;
        screen = 0; // Start screen.
        inputBox.hide();
        submitBtn.hide();
        document.getElementById('leaderboard').style.visibility = "hidden";
        resetGame();
    }
}

// Sample game play for the users who click on instructions.
// To show how the game works.
function tutorial() {
    // Game background
    image(bgImg, 0, 0, width, height);

    displayScore();

    displayTime();
    // If time runs out, just restart it.
    startTime = startTime <= 0 ? gameTimeLimit : startTime;
    showMole();

    // Show holes
    for (var i = 0; i < holes.length; i++) {
        holes[i].show();
    }

    // Keep the mole speed the same while in tutorial.
    timeMoleStaysHidden = 50;
    timeMoleStaysOut = 100;

    push();
    stroke(2);
    strokeWeight(3);
    textSize(18);
    fill("#ffffff");
    rect(width / 2 - 400 / 2, height / 2 - height / 2 * 0.5, 400, 100);
    pop();

    push();
    fill(0);
    textSize(20);
    textStyle(BOLD);
    textAlign(CENTER);
    if (messageTime <= 300) {
        text(instructions[nextInsMsg], width / 2, height / 2 - height / 2 * 0.49 + 40);
        messageTime++;
    } else {
        // Show the next instruction after whacking mole twice.
        if (score >= 2 || nextInsMsg == 0 || (score >= 2 && nextInsMsg == 1)) {
            nextInsMsg = nextInsMsg == instructions.length - 1 ? 0 : nextInsMsg + 1;
        }
        // Reset the time the message is displayed.
        messageTime = 0;
    }
    pop();

    showHammer();

    quitGame();
}

// Check to see if the quit button was pressed anytime during the game.
function quitGame() {
    let quitBtn = {
        "bottomLeftX": 0,
        "bottomLeftY": 0,
        "bottomRightX": 0,
        "bottomRightY": 0,
        "topLeftX": 0,
        "topLeftY": 0,
        "topRightX": 0,
        "topRightY": 0
    }

    quitBtn.bottomRightX = width / 2 + width / 2 * 0.94;
    quitBtn.bottomRightY = height / 2 - height / 2 * 0.86;
    quitBtn.topRightX = width / 2 + width / 2 * 0.94;
    quitBtn.topRightY = height / 2 - height / 2 * 0.93;
    quitBtn.topLeftX = width / 2 + width / 2 * 0.55;
    quitBtn.topLeftY = height / 2 - height / 2 * 0.93;
    quitBtn.bottomLeftX = width / 2 + width / 2 * 0.55;
    quitBtn.bottomLeftY = height / 2 - height / 2 * 0.86;

    //fill(255, 0, 0);
    //rect(quitBtn.bottomRightX, quitBtn.bottomRightY, 10, 10);
    //fill(255, 255, 0);
    //rect(quitBtn.topRightX, quitBtn.topRightY, 10, 10);
    //fill(255, 0, 255);
    //rect(quitBtn.topLeftX, quitBtn.topLeftY, 10, 10);
    //fill(0, 0, 255);
    //rect(quitBtn.bottomLeftX, quitBtn.bottomLeftY, 10, 10);

    // If the quit button is pressed then go back to main menu.
    if (mouseIsPressed && mouseX >= quitBtn.bottomLeftX && mouseX <= quitBtn.bottomRightX
        && mouseY >= quitBtn.topRightY && mouseY <= quitBtn.bottomRightY) {
        screen = 0; // Start screen.
        resetGame();
    }
}

// This function fires on every resize of the browser window.
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}