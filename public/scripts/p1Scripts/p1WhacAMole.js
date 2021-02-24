// P5 JavaScript source code for the main sketch.

// Comment this out temporarily cos its annoying.
if (!window.location.href.toString().includes("https://")) { alert(`You will need "https://" to view this.`) }

let hammerImg;
let hammerHitImg;
let holeImg;
let moleImg;
let bombImg;
let startScreenImg;
let gameOverScreenImg;
let highScoresScreenImg;

let inputBox;
let submitBtn;

let mic;
let volumeLevel;
let volumeThresholdSmallMole = 15; // This number came from trial and error.
let volumeThresholdBigMole = 40; // For the big moles, player has to yell louder!

let hammer;
let holes = [];
let moles = [];
let numOfHoles = 6;
let randomMole; // Initialized when creating new holes and then updates everytime the mole is hit or when it hides.
let molePicked = false; // The purpose of this is to ensure that the mole is set only once while it's still active.
let whatToShow = 0; // Parameter for Mole.show(). 0 = show a mole, 1 = show a bomb.
let moleSize = 'small'; // Mole size is either big or small. Default is small.

let screen = 0; // Screen 0 = Start screen, 1 = start game, 2 = game over, 3 = tutorial Mode, 4 = players' high scores

let tutorialMode = false;
let messageTime = 0;
let nextInsMsg = 0;
let instructions = ['TILT/ROTATE YOUR DEVICE \nTO MOVE HAMMER', 'TO HIT THE MOLE, ADJUST \n YOUR VOICE TO ITS SIZE',
    'THE MOLES GET FASTER \nAS YOUR SCORE INCREASES', 'IF YOU HIT THE BOMB \n YOU WILL LOSE 5 POINTS',
    'TIME LEFT IS THE TOP BAR \n YOU HAVE 60 SECONDS', 'TOP LEFT IS YOUR SCORE', 'GO BACK TO START MENU \n WHEN YOU ARE READY'];

let score = 0;
let molesMissed = 0;
let accuracy; // accuracy = score / (score + molesMissed)
let timeLeft = 0; // The start time of the program. Used to get the time remaining.
let gameTimeLimit = 3546; // ~ 1 min. This is a count of how many times the game loop runs until it's game over. There was a problem using millis()...
let leaderboard = new Leaderboard();
let scorePosted = false;
let leaderBoardRequested = false;

let moleSpeedFactor = 5; // Subtract from timeMoleStaysOut and timeMoleStaysHidden.
let minMoleHideTime = 30; // The longest time the mole will stay hidden.
let minMoleOutTime = 30; // Minimum amount of time the mole will stay out. 20 is really quick, 30 is average (for me, i guess)
let timeMoleStaysOut = 100; // Number of times to be out of the hole.
let timeMoleIsOut = 0;
let timeMoleIsHidden = 0;
let timeMoleStaysHidden = 100; // Number of times to stay in the hole.
let pointsToLoseBombHit = 5; // How many points to subtract if a bomb is hit.
let whenToShowBomb = gameTimeLimit * (1 - 0.25); // 25% into the gane, and bombs will start appearing with a certain probabilty.
let whenToChangeMoleSize = gameTimeLimit * (1 - 0.50); // 50% into the gane, and large moles will start appearing with a certain probabilty.

////////////////////////// BASIC P5 SET UP ////////////////////////////////////////
function preload() {
    // Load the images in a asynchronous way. setup() waits until preload() is done.
    hammerImg = loadImage('../images/project 1/thorsHammer.png'); // *** IF THIS IMAGE IS CHANGED, HAMMER BOUNDS NEED TO BE UPDATED ***
    hammerHitImg = loadImage('../images/project 1/thorsHammerHit.png'); // Load the image hammer when its hitting
    bgImg = loadImage('../images/project 1/background.png'); // Load the image of the grass
    holeImg = loadImage('../images/project 1/hole.png'); // Load the image of the hole
    moleImg = loadImage('../images/project 1/moleNoHole.png'); // Load the image of the mole
    bombImg = loadImage('../images/project 1/bomb.png'); // Load the image of the bomb
    startScreenImg = loadImage('../images/project 1/startScreen.png'); // Load game start screen image
    gameOverScreenImg = loadImage('../images/project 1/gameOverScreen.png'); // Load game over screen image
    highScoresScreenImg = loadImage('../images/project 1/HighScoresScreen.png'); // Load game over screen image
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

    hammer = new Hammer(width / 2, height / 2);
    hammer.requestOrientationPermission();

    createHoles();
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
    } else if (screen == 4) {
        highScores();
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

// Pick a random hole and then randomly choose if a mole will come out of that hole of a mole.
function chooseRandomMole() {
    // Pick a random hole for the mole to come out of.
    // Do this every time the mole is hit or when the mole goes in the hole.
    if ((moles[randomMole].hit || timeMoleIsHidden > timeMoleStaysHidden) && !moles[randomMole].active && !molePicked) {
        // Pick a new hole, not same as previous one.
        while (true) {
            let newRandNum = floor(random(numOfHoles)); // Generate random number for the hole.
            if (newRandNum != randomMole) {
                randomMole = newRandNum;
                break;
            }
        }

        // As the game progresses, there will be bombs in the game. 33% of the time a bomb will show up after a certain score.
        // Pick a random number between 0 and 2
        // If the number is [1, 2] then show a mole, otherwise show a bomb.
        if (whenToShowBomb > timeLeft) {
            // Do not show a bomb twice in a row.
            while (true) {
                let newRandNum = floor(random(3)) == 0 ? 1 : 0
                if ((newRandNum != whatToShow) || newRandNum == 0) {
                    whatToShow = newRandNum;
                    break;
                }
            }
        } else {
            // Just show a mole if score is not high enough for bombs.
            whatToShow = 0;
        }

        // At one point in the game, there will be different mole sizes.
        if (whenToChangeMoleSize > timeLeft) {
            moleSize = floor(random(2)) == 0 ? 'big' : 'small';
        }

        molePicked = true;
        moles[randomMole].active = false; // The mole starts off as not being active. This means it will start off hidden.
        moles[randomMole].hit = false; // In case the mole was hit, we need to reset the variable.
    }
}

// Randomly pick a new mole, show it and then hide it again.
function showMole() {
    chooseRandomMole();

    // Show the mole that's active.
    if (!moles[randomMole].hit && timeMoleIsOut <= timeMoleStaysOut && moles[randomMole].active) {
        // Mark the time when the mole fully comes out. It will only stay active for a bit and then hide again.
        if (moles[randomMole].show(whatToShow, moleSize)) {
            timeMoleIsOut++;
            timeMoleIsHidden = 0;
        }
    } else if (moles[randomMole].out && timeMoleIsHidden <= timeMoleStaysHidden) {
        // Hide the mole
        // And if the mole is fully hidden and the mole was never hit, increase the missed counter.
        if (!moles[randomMole].hide()) {
            if (!moles[randomMole].hit && whatToShow == 0) {
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
    image(moles[randomMole].extraCanvas, moles[randomMole].x, moles[randomMole].y - moles[randomMole].canvasOffsetY);
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
        if ((moles[i].moleSize == 'big' && volumeLevel >= volumeThresholdBigMole) || (moles[i].moleSize == 'small' && volumeLevel >= volumeThresholdSmallMole)) {
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

                // If player hits a mole:
                if (whatToShow == 0) {
                    //console.log('You hit mole ' + i);
                    score++;
                    // After each mole hit, the moles come out faster and go back in fast too!
                    timeMoleStaysHidden = timeMoleStaysHidden > minMoleHideTime ? timeMoleStaysHidden - moleSpeedFactor : minMoleHideTime;
                    timeMoleStaysOut = timeMoleStaysOut > minMoleOutTime ? timeMoleStaysOut - moleSpeedFactor : minMoleOutTime;
                } else {
                    // Player hit a bomb:
                    //console.log('You hit a bomb!!!');
                    score = score - pointsToLoseBombHit <= 0 ? 0 : score - pointsToLoseBombHit;
                    // Make the mole slower if the bomb was hit. Showing some mercy here :). Max time is 100.
                    timeMoleStaysHidden = timeMoleStaysHidden >= 100 ? 100 : timeMoleStaysHidden + moleSpeedFactor;
                    timeMoleStaysOut = timeMoleStaysOut > 100 ? 100 : timeMoleStaysOut + moleSpeedFactor;
                }

                // Reset the time for when the mole is out if it's hit.
                timeMoleIsOut = 0;
                timeMoleIsHidden = 0;
                molePicked = false;
                return true;
            }
        }
    }
    return false;
}

// Function to create holes in a 2d array. And the moles.
function createHoles() {
    holes = [];
    moles = [];
    // Create mole holes.
    let numOfCols = 2; //width > 900 ? 3 : 2;
    let numOfRows = 3; //height > 500 ? 3 : 2;
    numOfHoles = numOfCols * numOfRows;
    let colSpace = width / numOfCols - (holeImg.width / 7 / 2);
    let rowSpace = height / 2 / numOfRows;
    for (let i = 0; i < numOfCols; i++) {
        for (let j = 0; j < numOfRows; j++) {
            let x = (colSpace * i) + (colSpace / 2); // These numbers came from trial and error to see what centers the holes.
            let y = (rowSpace * j) + (rowSpace / 2) + (height * 0.2);
            let hole = new Hole(x, y, holeImg);
            let mole = new Mole(x, y, moleImg, bombImg);
            holes.push(hole);
            moles.push(mole);
        }
    }

    // Start of by picking a random hole where the mole will come out of.
    randomMole = floor(random(numOfHoles));

    //for (let i = 0; i < holes.length; i++) {
    //    line(holes[i].x - rowSpace, holes[i].y - colSpace, width, holes[i].y - colSpace); // Horizontal line
    //    line(holes[i].x, holes[i].y + holes[i].img.height / 7, width, holes[i].y + holes[i].img.height / 7); // Horizontal line
    //    for (let j = 0; j < holes.length; j++) {
    //        push();
    //        fill(255, 0, 0);
    //        line(holes[j].x - rowSpace, holes[j].y - colSpace, holes[j].x - rowSpace, height); // Horizontal line
    //        line(holes[j].x + holes[i].img.width / 7, holes[j].y, holes[j].x + holes[i].img.width / 7, height); // Horizontal line
    //        pop();
    //    }
    //}

    // Hardcoding 0 and 3 for now until i find a different way to do this.
    // Set the min and max bounds for the hammer. Allows easier movement of the hammer.
    hammer.setConstraints(holes[0].x + (holeImg.width / 7) - 15, holes[3].x + (holeImg.width / 7) - 15, holes[0].y - 15, holes[2].y - 15)
}

// Display the player's current score.
function displayScore() {
    push();
    textSize(70);
    textStyle(BOLD);
    fill(255);
    text(score, 10, 65);
    pop();
}

// Rseet the game
function resetGame() {
    holes = [];
    moles = [];
    score = 0;
    scorePosted = false;
    leaderBoardRequested = false;
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
    strokeWeight(15);

    timeLeft--;
    let timeBar = map(timeLeft, 0, gameTimeLimit, 0, width);

    // Change the bar colour depending on how much time is left.
    timeLeft <= 0.25 * gameTimeLimit ? stroke(255, 0, 0) : stroke(0, 74, 173);

    line(0, 0, timeBar, 0);
    pop();

    // Either time is up or still playing. 2 = game over screen
    screen = timeLeft < 0 && !tutorialMode ? 2 : screen;
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

    let highScoreBtn = {
        "bottomLeftX": 0,
        "bottomLeftY": 0,
        "bottomRightX": 0,
        "bottomRightY": 0,
        "topLeftX": 0,
        "topLeftY": 0,
        "topRightX": 0,
        "topRightY": 0
    }

    startBtn.bottomRightX = width * 0.8;
    startBtn.bottomRightY = height * 0.663;
    startBtn.topRightX = width * 0.8;
    startBtn.topRightY = height * 0.622;
    startBtn.bottomLeftX = width * 0.2;
    startBtn.bottomLeftY = height * 0.663;
    startBtn.topLeftX = width * 0.2;
    startBtn.topLeftY = height * 0.622;

    instructionsBtn.bottomRightX = width * 0.8;
    instructionsBtn.bottomRightY = height * 0.74;
    instructionsBtn.topRightX = width * 0.8;
    instructionsBtn.topRightY = height * 0.697;
    instructionsBtn.bottomLeftX = width * 0.2;
    instructionsBtn.bottomLeftY = height * 0.74;
    instructionsBtn.topLeftX = width * 0.2;
    instructionsBtn.topLeftY = height * 0.697;

    highScoreBtn.bottomRightX = width * 0.8;
    highScoreBtn.bottomRightY = height * 0.814;
    highScoreBtn.topRightX = width * 0.8;
    highScoreBtn.topRightY = height * 0.77;
    highScoreBtn.bottomLeftX = width * 0.2;
    highScoreBtn.bottomLeftY = height * 0.814;
    highScoreBtn.topLeftX = width * 0.2;
    highScoreBtn.topLeftY = height * 0.77;

    //push();
    //fill(255, 0, 0);
    //rect(startBtn.bottomRightX, startBtn.bottomRightY, 10, 10);
    //fill(255, 255, 0);
    //rect(startBtn.topRightX, startBtn.topRightY, 10, 10);
    //fill(255, 0, 255);
    //rect(startBtn.topLeftX, startBtn.topLeftY, 10, 10);
    //fill(0, 0, 255);
    //rect(startBtn.bottomLeftX, startBtn.bottomLeftY, 10, 10);

    //fill(255, 0, 0);
    //rect(instructionsBtn.bottomRightX, instructionsBtn.bottomRightY, 10, 10);
    //fill(255, 255, 0);
    //rect(instructionsBtn.topRightX, instructionsBtn.topRightY, 10, 10);
    //fill(255, 0, 255);
    //rect(instructionsBtn.topLeftX, instructionsBtn.topLeftY, 10, 10);
    //fill(0, 0, 255);
    //rect(instructionsBtn.bottomLeftX, instructionsBtn.bottomLeftY, 10, 10);

    //fill(255, 0, 0);
    //rect(highScoreBtn.bottomRightX, highScoreBtn.bottomRightY, 10, 10);
    //fill(255, 255, 0);
    //rect(highScoreBtn.topRightX, highScoreBtn.topRightY, 10, 10);
    //fill(255, 0, 255);
    //rect(highScoreBtn.topLeftX, highScoreBtn.topLeftY, 10, 10);
    //fill(0, 0, 255);
    //rect(highScoreBtn.bottomLeftX, highScoreBtn.bottomLeftY, 10, 10);
    //pop();

    // If the start button is clicked.
    if (screen == 0 && mouseIsPressed && mouseX >= startBtn.topLeftX && mouseX <= startBtn.topRightX
        && mouseY >= startBtn.topLeftY && mouseY <= startBtn.bottomLeftY) {
        // Play a sound when player presses start.
        mic.whackSound.play();
        mic.whackSound.currentTime = 0;
        screen = 1; // Start game. Button is hidden after mic is started in Mic.js
        timeLeft = gameTimeLimit; // The time when the game has started. Countdown start time.
    }

    // If the instructions button is clicked.
    if (screen == 0 && mouseIsPressed && mouseX >= instructionsBtn.topLeftX && mouseX <= instructionsBtn.topRightX
        && mouseY >= instructionsBtn.topLeftY && mouseY <= instructionsBtn.bottomLeftY) {
        // Play a sound when player presses the button.
        mic.whackSound.play();
        mic.whackSound.currentTime = 0;
        screen = 3; // Tutorial mode is on.
        timeLeft = gameTimeLimit;
        tutorialMode = true;
    }

    // If the high scores button is clicked.
    if (screen == 0 && mouseIsPressed && mouseX >= highScoreBtn.topLeftX && mouseX <= highScoreBtn.topRightX
        && mouseY >= highScoreBtn.topLeftY && mouseY <= highScoreBtn.bottomLeftY) {
        // Play a sound when player presses start.
        mic.whackSound.play();
        mic.whackSound.currentTime = 0;
        screen = 4; // Go to high scores screen.
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
            // The name must be at least 1 character. Only take the first 10 characters in the name.
            if (name.length > 0) {
                leaderboard.postScore(name.substr(0, 10), score, accuracy / 100);
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

    backToMenuBtn.bottomRightX = width * 0.850
    backToMenuBtn.bottomRightY = height * 0.295;
    backToMenuBtn.topRightX = width * 0.850
    backToMenuBtn.topRightY = height * 0.252;
    backToMenuBtn.topLeftX = width * 0.15
    backToMenuBtn.topLeftY = height * 0.252;
    backToMenuBtn.bottomLeftX = width * 0.15
    backToMenuBtn.bottomLeftY = height * 0.295;

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

// Display the leaderboard table.
function highScores() {
    clear();
    image(highScoresScreenImg, 0, 0, width, height);

    let scoreBoard = document.getElementById('leaderboard');

    // Show the leaderboard
    document.getElementById('leaderboard').style.visibility = "visible";
    // Only get the leaderboard once 
    if (!leaderBoardRequested) {
        leaderboard.getScores();
        scoreBoard.style.top = '70%';
        scoreBoard.style.height = '65%';
        leaderBoardRequested = true;
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

    backToMenuBtn.bottomRightX = width * 0.850
    backToMenuBtn.bottomRightY = height * 0.295;
    backToMenuBtn.topRightX = width * 0.850
    backToMenuBtn.topRightY = height * 0.252;
    backToMenuBtn.topLeftX = width * 0.15
    backToMenuBtn.topLeftY = height * 0.252;
    backToMenuBtn.bottomLeftX = width * 0.15
    backToMenuBtn.bottomLeftY = height * 0.295;

    //fill(255, 0, 0);
    //rect(backToMenuBtn.bottomRightX, backToMenuBtn.bottomRightY, 10, 10);
    //fill(255, 255, 0);
    //rect(backToMenuBtn.topRightX, backToMenuBtn.topRightY, 10, 10);
    //fill(255, 0, 255);
    //rect(backToMenuBtn.topLeftX, backToMenuBtn.topLeftY, 10, 10);
    //fill(0, 0, 255);
    //rect(backToMenuBtn.bottomLeftX, backToMenuBtn.bottomLeftY, 10, 10);

    // If user presses the 'back to menu button'.
    if (screen == 4 && mouseIsPressed && mouseX >= backToMenuBtn.bottomLeftX && mouseX <= backToMenuBtn.bottomRightX
        && mouseY >= backToMenuBtn.topRightY && mouseY <= backToMenuBtn.bottomRightY) {
        // Play a sound when player presses the button.
        mic.whackSound.play();
        mic.whackSound.currentTime = 0;
        screen = 0; // Start screen.
        // Change it back to what it was originally. This matches whats in p1Styles for Leaderboard.
        scoreBoard.style.top = '80%';
        scoreBoard.style.height = '30%';
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
    timeLeft = timeLeft <= 0 ? gameTimeLimit : timeLeft;
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
    let rectHeight = height * 0.09;
    let rectStartY = holes[2].y + (holeImg.height / 7) + 20; //height - (rectHeight);
    rect(0, rectStartY, width, rectHeight);
    pop();

    push();
    fill(0);
    textSize(20);
    textStyle(BOLD);
    textAlign(CENTER);
    if (messageTime <= 300) {
        text(instructions[nextInsMsg], width / 2, rectStartY + (rectHeight * 0.4));
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

    // Destroy the holes and moles and recreate them if resized. ** PROBABLY NOT A GOOD IDEA **
    createHoles();
}