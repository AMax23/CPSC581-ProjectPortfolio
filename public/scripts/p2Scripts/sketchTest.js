// JavaScript source code

let once = true;
let myCanvasDiv;

////////////////////////// BASIC P5 SET UP ////////////////////////////////////////
function preload() {

}

function setup() {
    let canvasDiv = document.getElementById('mainCanvas');
    let canvasWidth = canvasDiv.offsetWidth;
    let canvasHeight = canvasDiv.offsetHeight;
    cnv = createCanvas(canvasWidth, canvasHeight);
    // Put p5 canvas in the right div on main page.
    cnv.parent("mainCanvas");
    cnv.id('myCanvas');

    myCanvasDiv = document.getElementById('myCanvas');
    // Add event listener for whenever the canvas is clicked.
    myCanvasDiv.addEventListener("mousedown", addBoxes)
}

function draw() {

    // This only runs once to setup the canvas on the server side.
    if (once && webSocket.readyState) {
        let data = {
            type: "canvas",
            canvasWidth: myCanvasDiv.offsetWidth,
            canvasHeight: myCanvasDiv.offsetHeight,
        }
        webSocket.send(JSON.stringify(data));
        once = false;
    }


    //drawMousePos();

    //if (mouseMoved()) {
    //    console.log('ok');
    //}

    //fill(255, 0, 255);
    //rect(mouseX, mouseY, 100, 300);

    //background(0);

    //for (let ground of grounds) {
    //    ground.show();
    //}

    //for (let box of boxes) {
    //    box.show();
    //}

    //noStroke();
    //fill(255);
    //drawVertices(boxA.vertices);
    //drawVertices(boxB.vertices);
    //drawVertices(ball.vertices);

    //fill(128);
    //drawVertices(ground.vertices);
    //drawMouse(mouseConstraint);

    //for (let box of boxes) {
    //    box.show();
    //}

    //for (let ground of grounds) {
    //    ground.show();
    //}
    //aaa();

    //console.log('how');

    //if (!toDraw) {
    //    console.log('okkkk');
    //}

}
///////////////////////////////////////////////////////////////////////////////////

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

// 
function drawObject(data) {
    clear(); // Clear the canvas and redraw all the shapes and walls.

    let walls = data.walls;
    let boxes = data.boxes;

    push();
    fill(0, 255, 0);
    stroke(3);
    walls.forEach(wall => drawBody(wall));
    pop();

    push();
    fill(0);
    stroke(255);
    strokeWeight(2);
    boxes.forEach(box => drawBody(box));
    pop();
}

// Helper function to draw the vertices for each object.
function drawBody(vertices) {
    beginShape();
    for (var i = 0; i < vertices.length; i++) {
        vertex(vertices[i].x, vertices[i].y);
    }
    endShape(CLOSE);
}

/* OLD CODE
function drawMouse(mouseConstraint) {
    if (mouseConstraint.body) {
        var pos = mouseConstraint.body.position;
        var offset = mouseConstraint.constraint.pointB;
        var m = mouseConstraint.mouse.position;
        stroke(0, 255, 0);
        strokeWeight(2);
        line(pos.x + offset.x, pos.y + offset.y, m.x, m.y);
    }
}

function sendBox() {

    let allBodies = [];

    for (let i = 0; i < engine.world.bodies.length; i++) {
        let bodiesDate = {
            position: engine.world.bodies[i].position,
            angle: engine.world.bodies[i].angle,
        };

        allBodies.push(bodiesDate);
    }

    let data = {
        type: 'toServer',
        username: username, // username comes from sender.js or receiver.js
        //boxMoved: boxMoved,
        //boxesPos: engine.world.bodies[boxMoved].position,
        //boxesAng: engine.world.bodies[boxMoved].angle,
        canvas: { width: width, height: height },
        bodies: allBodies

    }

    //console.log(box1.position.x, box1.position.y);
    // Send the x and y coords to the server.
    //console.log('sending to server');

    //if (webSocket.readyState) {
    //console.log('here');
    webSocket.send(JSON.stringify(data));
    //}

    //console.log(data.boxesPos.x, data.boxesPos.y);
    //console.log('Canvas width and height = ' + width, height);

    //console.log(boxes[0]);
}

//function aaa() {
//    for (let box of boxes) {
//        box.show();
//    }

//    //for (let ground of grounds) {
//    //    ground.show();
//    //}
//    let data = {
//        type: 'toServer',
//        username: username, // username comes from sender.js or receiver.js
//        //x: box1.position.x,
//        //y: box1.position.y
//        boxesX: width / 2,
//        boxesY: 80,
//        boxesWidth: 200,
//        boxdesHeight: 200
//    }

//    //console.log(box1.position.x, box1.position.y);
//    // Send the x and y coords to the server.
//    webSocket.send(JSON.stringify(data));


//}

function moveBox(data) {

    //let boxMoved = data.boxMoved;

    for (let i = 0; i < data.bodies.length; i++) {

        //if (engine.world.bodies[i].position != data.bodies[i].position || engine.world.bodies[i].angle != data.bodies[i].angle) {
        //console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
        //console.log(engine.world.bodies[boxMoved].position, data.boxesPos);
        //console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');

        let bodyPosXMapped = map(data.bodies[i].position.x, 0, data.canvas.width, 0, width);
        let bodyPosYMapped = map(data.bodies[i].position.y, 0, data.canvas.height, 0, height);

        data.bodies[i].position.x = bodyPosXMapped;
        data.bodies[i].position.y = bodyPosYMapped;

        engine.world.bodies[i].position = data.bodies[i].position;
        engine.world.bodies[i].angle = data.bodies[i].angle;
        //}
    }

    //console.log(data.boxesPos, data.boxesAng);
    //console.log(data.boxesPos.x, data.boxesPos.y);
    //console.log('Canvas width and height = ' + width, height);
    //console.log(engine.world.bodies[boxMoved]);
}

//function mouseDragged() {
//    let data = {
//        type: 'mouseDrag',
//        username: username, // username comes from sender.js or receiver.js
//        x: mouseX,
//        y: mouseY
//    }

//    // Send the x and y coords to the server.
//    webSocket.send(JSON.stringify(data));

//    fill(255, 250, 0);
//    ellipse(mouseX, mouseY, 30, 30);
//}

function newDrawing(data) {
    //Draw the iamge for the receiver. Change the colour of the fill so you can tell who's who.
    fill(255, 0, 255);
    ellipse(data.x, data.y, 30, 30);
    console.log('New drawing ' + data.x + ', ' + data.y);
}

function drawMousePos() {
    background(0);

    //Copy array values from back to front
    for (var i = num - 1; i > 0; i--) {
        x[i] = x[i - 1];
        y[i] = y[i - 1];
    }

    x[0] = mouseX; //Set the first element
    y[0] = mouseY; //Set the first element

    for (var i = 0; i < num; i++) {
        fill(i * 4);
        ellipse(x[i], y[i], 50, 50);
    }
}

//function mouseMoved() {
//    console.log('ok');
//}

*/