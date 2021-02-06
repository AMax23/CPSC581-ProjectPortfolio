// Catching game using P5.js framework.
// All the interaction happens with the 1 button.
// The objective is to make something creative with 1 button.

// Game variables:
// Start location of the cat that is falling.
var objectStartY = -10;
var yObject = objectStartY;
var xObject = 200;
//var ballWidth = 30;
//var ballHeight = 30;
var objectSpeed = 2; // Speed at which the cat falls. As player progresses, the speed increases.
var score = 0;
var highScore = 0;
var gameStarted = false;
var buttonPaddle = document.getElementById('btnPaddle'); // THe button will function as the paddle in the game.
//var allColours = ['#ff0000', '#ff7300', '#fffb00', '#48ff00', '#00ffd5', '#002bff', '#7a00ff', '#ff00c8', '#ff0000'];
//var ballColour = allColours[0];
var bullets = []; // Everytime the plater shoots, an instance of the Bullet object is created.
var snakes = [];
var numOfSnakes = 4; // The amount of snakes that appear on the screen 
var snakesAlive = false;
var textYPos = 50; // The y position of all the text on the screen...so they can be aligned.
var catImg;
var snakeImg;

////////////////////////// BASIC P5 SET UP  ////////////////////////////////////////

function setup() {
    createCanvas(windowWidth, windowHeight);
    catImg = loadImage('../images/project 0/cat.png'); // Load the image
    snakeImg = loadImage('../images/project 0/snake.png'); // Load the image
}

function draw() {
    // If the game is not started, check if the button is clicked, and start the game.
    if (!gameStarted) {
        buttonPaddle.ondblclick = function () {
            startGame();
            gameStarted = true;
        };
    } else {
        startGame();
    };
}

/////////////////////////////////////////////////////////////////////////////////////////

function startGame() {

    drawGameScore();

    if (yObject == objectStartY) {
        xObject = pickRandomX();
    };

    // Displays the image of the cat.
    image(catImg, xObject, yObject, catImg.width / 4, catImg.height / 4);
    yObject += objectSpeed;

    paddle();

    // Every time the score is divisible by 10, player gets bullets to shoot snakes.
    if (snakesAlive || (score >= 10 && score % 10 == 0)) {
        snake();
        shoot();
    };

    // Draw ball
    //fill(color(ballColour));
    //ellipse(xObject, yObject, ballWidth, ballHeight);

    // If the cat falls down then everything resets.
    if (yObject > windowHeight) {
        reset();
    }
}

// Return a random number for x position of an object.
function pickRandomX() {
    return random(100, windowWidth - 100);
}

// Return a random number for y position of an object.
function pickRandomY() {
    return random(-100, -50);

}

// When the game ends, it will pause and you can see your current and highest score.
function reset() {
    highScore = (score > highScore) ? score : highScore;
    gameStarted = false;
    drawGameScore();
    // Reset game settings:
    score = 0;
    objectSpeed = 2;
    yObject = objectStartY;
    bullets = [];
    snakes = [];
    snakesAlive = false;
}

function paddle() {
    var paddleContainer = document.getElementById("mainDiv");
    var xPaddle = paddleContainer.getBoundingClientRect().x;
    var yPaddle = paddleContainer.getBoundingClientRect().y;
    var paddleWidth = paddleContainer.getBoundingClientRect().width;
    var paddleHeight = paddleContainer.getBoundingClientRect().height;

    // If player catches the object
    if ((yObject > yPaddle && yObject < (yPaddle + paddleHeight - 10)) &&
        ((xObject + 100 > xPaddle && xObject < (xPaddle + paddleWidth)))) {
        yObject = objectStartY;
        objectSpeed += 0.5;
        score += 1;
        //ballColour = random(allColours);
    }
}

// If player clicks button, it will shoot.
function shoot() {
    var bullet;
    var paddleContainer = document.getElementById("mainDiv");
    var xPaddle = paddleContainer.getBoundingClientRect().x;
    var yPaddle = paddleContainer.getBoundingClientRect().y;

    buttonPaddle.onclick = function () {
        // Bullet shoots out of center of cat. 
        bullet = new Bullet(xPaddle + 95, yPaddle - 50);
        bullets.push(bullet);
    };

    // Show and move all bullets
    for (var i = 0; i < bullets.length; i++) {
        bullets[i].show();
        bullets[i].move();

        // Check if the bullet hit the snake.
        for (var j = 0; j < snakes.length; j++) {
            if ((bullets[i].y > snakes[j].y && bullets[i].y < (snakes[j].y + 100)) &&
                ((bullets[i].x > snakes[j].x && bullets[i].x < (snakes[j].x + 100)))) {
                bullets[i].shot = true;
                snakes[j].alive = false;
                objectSpeed = objectSpeed - 0.5 < 7 ? 7 : objectSpeed - 0.5; // Every time a snake gets his, the speed of the cat falling slows down.
            }
        };
    }

    // Delete the bullet object after it hits the snake.
    // This is also for performance. Dont need to draw bullets that go off the screen.
    for (var i = bullets.length - 1; i >= 0; i--) {
        if (bullets[i].shot) {
            bullets.splice(i, 1);
        };
    };

    // Delete the snake object after they have been shot. 
    for (var i = snakes.length - 1; i >= 0; i--) {
        if (!snakes[i].alive) {
            snakes.splice(i, 1);
        };
    }
    // If all the snakes have been shot, then reset the variable.
    if (snakes.length == 0) {
        snakesAlive = false;
    }
}

function snake() {

    var paddleContainer = document.getElementById("mainDiv");
    var xPaddle = paddleContainer.getBoundingClientRect().x;
    var yPaddle = paddleContainer.getBoundingClientRect().y;
    var paddleWidth = paddleContainer.getBoundingClientRect().width;
    var paddleHeight = paddleContainer.getBoundingClientRect().height;

    // If there are no snakes, then create new ones at random locations.
    if (!snakesAlive) {
        for (var i = 0; i < numOfSnakes; i++) {
            snakes[i] = new Snake(pickRandomX(), pickRandomY());
        }
        snakesAlive = true;
        objectSpeed = objectSpeed - 1;  // Slow down the falling cats the first time the snakes arrive.
    } else {
        // Show and move all the snakes there are.
        for (var i = 0; i < snakes.length; i++) {
            snakes[i].show(snakeImg);
            snakes[i].move();
            // Check if a snakes moves all the way down, then the snake is dead.
            if (snakes[i].y > windowHeight) {
                snakes[i].alive = false;
            };

            // If player touches the snake then only lose 1 point.
            if ((snakes[i].y > yPaddle && snakes[i].y < (yPaddle + paddleHeight - 10)) &&
                ((snakes[i].x + 50 > xPaddle && snakes[i].x < (xPaddle + paddleWidth)))) {
                snakes[i].alive = false;
                score--;
            }
        };
    }
}

// Draw the game background, current score, and highscore. When the game ends, draw 'game over'.
function drawGameScore() {

    var fontSize = windowWidth * 0.025; // Just trying to get a reasonaable font size bassed on the user's screen size.
    var highScoreXPos = windowWidth - windowWidth * 0.22/*325*/;
    var gameOverXPos = windowWidth / 2 - windowWidth * 0.09/*150*/;

    background(0);
    fill(250);
    textSize(fontSize);

    text("Score = " + score, 50, textYPos);
    text("High Score = " + highScore, highScoreXPos, textYPos)
    if (!gameStarted) {
        text("GAME OVER", gameOverXPos, textYPos);
    };
}