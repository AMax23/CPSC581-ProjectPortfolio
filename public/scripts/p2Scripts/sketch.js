// JavaScript source code

// Comment this out temporarily cos its annoying.
//if (!window.location.href.toString().includes("https://")) { alert(`You will need "https://" to view this.`) }

let canvasPropSentToServer = false;
let myCanvasDiv;

let boxImg;

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

    // Add event listener for whenever the canvas is clicked.
    myCanvasDiv.addEventListener("mousedown", addBoxes);

    // Add event listener for when the clear button is clicked (only on oma/opa's side).
    if (username == 'oma/opa') {
        let clearBtn = document.getElementById('clrScrnBtn');
        clearBtn.addEventListener("click", clearScreen);
    }

    //boxImg = loadImage('//cdn.rawgit.com/liabru/matter-js/2560a681/demo/img/box.png');
    boxImg = loadImage('../images/project 2/crate.png');
}

function draw() {
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

// Gets the data from the server and draws those vertices for each object.
function drawObject(data) {
    clear(); // Clear the canvas and redraw all the shapes and walls.

    let walls = data.walls;
    let boxes = data.boxes;

    push();
    fill(154, 203, 75); // Green colour
    stroke(3);
    walls.forEach(wall => drawBody(wall));
    pop();

    push();
    fill(124, 74, 38); // Brown colour
    stroke(255);
    strokeWeight(2);
    boxes.forEach(box => drawSprite(data));
    //boxes.forEach(box => drawBody(box));
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
        image(boxImg, 0, 0);
        pop();

        // Add a letter inside the box.
        push();
        fill(255);
        textSize(50);
        textAlign(CENTER);
        text('A', pos.x, pos.y + 15);
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
function addBoxes(event) {
    let data = {
        type: "userClick",
        username: username, // This username comes from the recevier and sender js.
        x: event.offsetX,
        y: event.offsetY
    }
    webSocket.send(JSON.stringify(data));
}

// Remove all the boxes from the screen.
function clearScreen(event) {
    let data = {
        type: "clearScreen",
        username: username, // This username comes from the recevier and sender js.
    }
    webSocket.send(JSON.stringify(data));
}