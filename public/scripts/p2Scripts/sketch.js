// JavaScript source code

// Comment this out temporarily cos its annoying.
//if (!window.location.href.toString().includes("https://")) { alert(`You will need "https://" to view this.`) }

let canvasPropSentToServer = false;
let myCanvasDiv;
let rhysDestroyBtn;

let boxImg;
let handImg;
let backgroundImg;
let animalImages;

let word = 'cow'; // An animal will appear on the boxes when oma/opa make a sound.
let letterParag = document.getElementById('letterSpoken');

let rhysPermissionToDestroy = false; // Oma/Opa have not given Rhys permission to destory yet.

////////////////////////// BASIC P5 SET UP ////////////////////////////////////////
function preload() {
}

function setup() {
    myCanvasDiv = document.getElementById('myCanvas');
    let canvasWidth = myCanvasDiv.offsetWidth;
    let canvasHeight = myCanvasDiv.offsetHeight;
    let cnv = createCanvas(canvasWidth, canvasHeight);
    // Put p5 canvas in the right div on main page.
    cnv.parent("myCanvas");

    // Add event listeners (only on oma/opa's side).
    if (username == 'oma/opa') {
        // When the clear button is clicked
        let clearBtn = document.getElementById('clrScrnBtn');
        clearBtn.addEventListener("click", clearScreen);

        rhysDestroyBtn = document.getElementById('rhysDestroyBtn');
        rhysDestroyBtn.addEventListener("click", rhysPermission);

        // Add event listener for whenever the canvas is clicked. A box will be added.
        myCanvasDiv.addEventListener("mousedown", addBoxes);
    }

    //boxImg = loadImage('//cdn.rawgit.com/liabru/matter-js/2560a681/demo/img/box.png');
    boxImg = loadImage('../images/project 2/needlepointFabric.png');
    handImg = loadImage('../images/project 2/hand.png');
    backgroundImg = loadImage('../images/project 2/jungleBackground.webp');

    animalImages = {
        cow: loadImage('../images/project 2/Animals/cow.png'),
        pig: loadImage('../images/project 2/Animals/pig.png'),
        sheep: loadImage('../images/project 2/Animals/sheep.png'),
        chicken: loadImage('../images/project 2/Animals/chicken.png'),
        goat: loadImage('../images/project 2/Animals/goat.png'),
        duck: loadImage('../images/project 2/Animals/duck.png'),
        horse: loadImage('../images/project 2/Animals/horse.png'),
        frog: loadImage('../images/project 2/Animals/frog.png')
    }
}

function draw() {

    if (username == 'Rhys') {
        drawHandPointer(); // This pointer is only drawn for Rhys.
    }

    // For oma and opa write the letter that is currently spoken.
    if (username == "oma/opa") {
        writeAnimalName();
    }

    // This only runs once to setup the canvas on the server side.
    // This doesn't work as i want it to cos the receiver will join last and will override these properties.
    // But idk how i wanna handle that rn.
    if (!canvasPropSentToServer && webSocket.readyState) {
        let data = {
            type: "canvas",
            canvasWidth: myCanvasDiv.offsetWidth,
            canvasHeight: myCanvasDiv.offsetHeight,
        }
        webSocket.send(JSON.stringify(data));
        canvasPropSentToServer = true;
    }
}
///////////////////////////////////////////////////////////////////////////////////

// Writes out the letter that is currently spoken by Oma/Opa for them to confirm.
function writeAnimalName() {
    word = animal != "Background Noise" ? animal : word;
    letterParag.innerHTML = 'Animal: ' + word.charAt(0).toUpperCase() + word.slice(1); // This just makes the first letter uppercase!
}

// Draws an image of a hand after tracking the hand position in the x, y location.
function drawHandPointer() {
    //background(0);
    // These coordinates come from the handtrack.js script.
    if (xCord != null && yCord != null && renderVideo && rhysPermissionToDestroy) {

        // Map the coordinates so they fit the user's screen.
        // These numbers came from trial and error.
        let xCordMapped = map(xCord, 130, 550, 0, width - 10);
        let yCordMapped = map(yCord, 80, 400, 10, height - 10);

        //console.log(xCord, yCord);
        //rect(xCordMapped - (handImg.width / 2), yCordMapped - (handImg.height / 2), handImg.width, handImg.height);
        image(handImg, xCordMapped - (handImg.width / 2), yCordMapped - (handImg.height / 2));
        //ellipse(xCordMapped, yCordMapped, 30, 30);

        // This is to keep it consistent with what addBoxes() is expecting as a parameter.
        let coords = {
            offsetX: xCordMapped,
            offsetY: yCordMapped
        }
        addBoxes(coords); // Since Rhys is the one who has the hand, this will destroy the box construction.
    }
}

// Gets the data from the server and draws those vertices for each object.
function drawObject(data) {
    clear(); // Clear the canvas and redraw all the shapes and walls.

    // Game background
    image(backgroundImg, 0, 0, width, height);

    let walls = data.walls;
    let boxes = data.boxes;

    // The wall is just now invisible im not drawing it.
    //push();
    //fill(154, 203, 75); // Green colour
    //stroke(3);
    //walls.forEach(wall => drawBody(wall));
    //pop();

    push();
    fill(124, 74, 38); // Brown colour
    stroke(255);
    strokeWeight(2);
    boxes.forEach(box => drawSprite(data)); // Put image on top of the x y positions.
    //boxes.forEach(box => drawBody(box)); // Draw a rect on with the vertices.
    pop();
}

// Draws an image over the box position.
function drawSprite(boxes) {
    for (let i = 0; i < boxes.positions.length; i++) {
        const pos = boxes.positions[i];
        const angle = boxes.angles[i];
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        imageMode(CENTER);
        rect(0 - boxImg.width / 2, 0 - boxImg.height / 2, boxImg.width, boxImg.height); // Draw a border around box.
        image(boxImg, 0, 0);
        pop();

        // Add a letter inside the box.
        push();
        //let colour = boxes.boxesLetters[i].colour;
        //fill(colour.r, colour.g, colour.b);
        //textSize(50);
        //stroke(0);
        //strokeWeight(3);
        //textAlign(CENTER);
        //text(boxes.boxesLetters[i].letter, pos.x, pos.y + 15);

        // Rotae the image.
        translate(pos.x, pos.y);
        rotate(angle);
        imageMode(CENTER);
        let animal = boxes.boxesAnimals[i].animalNoise;
        image(animalImages[animal], 0, 0);
        pop();
    }
}

// Helper function to draw the vertices for each object.
function drawBody(vertices) {
    beginShape();
    for (var i = 0; i < vertices.length; i++) {
        vertex(vertices[i].x, vertices[i].y);
    }
    endShape(CLOSE);
}

// Everytime the user clicks, a new box get added to the world.
// Or if Rhys is the one who clicks then the blocks get destroyed.
function addBoxes(event) {
    let data = {
        type: "userClick",
        username: username, // This username comes from the recevier and sender js.
        x: event.offsetX,
        y: event.offsetY
    }
    // Only if oma/opa send a box then add a letter.
    if (username != 'Rhys') {
        // The letter comes in the format "LetterA".
        //letter = letterSpoken != "Background Noise" ? letterSpoken.substr(letterSpoken.length - 1) : letter;
        data.animalNoise = word;
        //data.letterColour = { r: random(255), g: random(255), b: random(255) }; // Add a random colour (RGB) for the letter.
    }
    webSocket.send(JSON.stringify(data));
}

// Remove all the boxes from the screen.
function clearScreen(event) {
    let data = {
        type: "clearScreen",
        username: username // This username comes from the recevier and sender js.
    }
    webSocket.send(JSON.stringify(data));
}

// When the button is cliicked Rhys's permission to destory the blocks will change.
function rhysPermission(event) {
    rhysPermissionToDestroy = !rhysPermissionToDestroy;
    let data = {
        type: "rhysDestory",
        username: username, // This username comes from the recevier and sender js.
        permissionToDestroy: rhysPermissionToDestroy
    }
    webSocket.send(JSON.stringify(data));

    // Change the style of button element when clicked.
    if (rhysPermissionToDestroy) {
        rhysDestroyBtn.style.background = 'Black';
        rhysDestroyBtn.style.color = 'White';
    } else {
        rhysDestroyBtn.style.background = 'White';
        rhysDestroyBtn.style.color = 'Black';
    }
}