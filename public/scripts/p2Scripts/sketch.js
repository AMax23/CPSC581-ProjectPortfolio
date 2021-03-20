// JavaScript source code

// Module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse;

// Create an engine
var engine;
var world;

let boxes = [];
let circles = [];
let grounds = [];
let mouseConstraint;

let boxA;
let boxB;
let ball;
let ground;

const toVertices = e => e.vertices.map(({ x, y }) => ({ x, y }));


////////////////////////// BASIC P5 SET UP ////////////////////////////////////////
function preload() {

}

function setup() {
    let canvasDiv = document.getElementById('mainCanvas');
    let canvasWidth = canvasDiv.offsetWidth;
    let canvasHeight = canvasDiv.offsetHeight;
    let cnv = createCanvas(canvasWidth, canvasHeight);
    // Put p5 canvas in the right div on main page.
    cnv.parent("mainCanvas");

    engine = Engine.create();
    world = engine.world;

    //  Engine.run(engine);
    grounds.push(new Boundary(-50, height / 2, 100, height)); // Left
    grounds.push(new Boundary(width + 50, height / 2, 100, height)); // Right
    grounds.push(new Boundary(width / 2, 0 - 50, width, 100)); // Top
    grounds.push(new Boundary(width / 2, height + 33, width, 100)); // Bottom
    //World.add(world, grounds);

    // create two boxes and a ground
    //boxA = Bodies.rectangle(200, 200, 80, 80);
    //boxB = Bodies.rectangle(270, 50, 160, 80);
    //ball = Bodies.circle(100, 50, 40);
    boxes.push(new Box(width / 2, 80, 50, 50));
    boxes.push(new Box(width / 2, 80, 50, 50));
    boxes.push(new Box(width / 2, 80, 50, 50));
    boxes.push(new Box(width / 2, 80, 50, 50));
    boxes.push(new Box(width / 2, 80, 50, 50));

    ground = Bodies.rectangle(width, height / 2, 10, height, {
        isStatic: true
    });
    World.add(engine.world, [grounds, boxes]);

    let mouse = Mouse.create(cnv.elt);
    mouse.pixelRatio = pixelDensity() // for retina displays etc
    let options = {
        mouse: mouse
    }
    mouseConstraint = MouseConstraint.create(engine, options);
    mouseConstraint.mouse.pixelRatio = pixelDensity();
    World.add(engine.world, mouseConstraint);

    // Run the engine
    Engine.run(engine);

    //console.log(box1);
}



function draw() {

    //fill(255, 255, 255);
    //rect(mouseX, mouseY, 100, 300);

    background(0);

    for (let ground of grounds) {
        ground.show();
    }

    for (let box of boxes) {
        box.show();
    }

    if (mouseConstraint.body) {
        //console.log('----------------------------------------------------');
        //console.log(mouseConstraint.body);
        let boxMoved = mouseConstraint.body.id - 1; // This is the number of the box that was moved. Minus 1 cos array starts at 0.
        //console.log(engine.world.bodies[boxMoved]);
        //console.log('----------------------------------------------------');
        sendBox(boxMoved);
        //console.log(boxes[0].body.velocity);
        //console.log(mouseConstraint.body.angularSpeed);
    }


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
}
///////////////////////////////////////////////////////////////////////////////////
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

function drawVertices(vertices) {
    beginShape();
    for (var i = 0; i < vertices.length; i++) {
        vertex(vertices[i].x, vertices[i].y);
    }
    endShape(CLOSE);
}

function sendBox(boxMoved) {

    let data = {
        type: 'toServer',
        username: username, // username comes from sender.js or receiver.js
        boxMoved: boxMoved,
        boxesPos: engine.world.bodies[boxMoved].position,
        boxesAng: engine.world.bodies[boxMoved].angle,
        canvas: { width: width, height: height }
    }

    //console.log(box1.position.x, box1.position.y);
    // Send the x and y coords to the server.
    //console.log('sending to server');
    webSocket.send(JSON.stringify(data));

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

    let boxMoved = data.boxMoved;

    if (engine.world.bodies[boxMoved].position != data.boxesPos || engine.world.bodies[boxMoved].angle != data.boxesAng) {
        //console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
        //console.log(engine.world.bodies[boxMoved].position, data.boxesPos);
        //console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');

        let bodyPosXMapped = map(data.boxesPos.x, 50, data.canvas.width, 0, width - 50);
        let bodyPosYMapped = map(data.boxesPos.y, 50, data.canvas.height, 0, height - 100);

        data.boxesPos.x = bodyPosXMapped;
        data.boxesPos.y = bodyPosYMapped;

        engine.world.bodies[boxMoved].position = data.boxesPos;
        engine.world.bodies[boxMoved].angle = data.boxesAng;
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

//function newDrawing(data) {
//    // Draw the iamge for the receiver. Change the colour of the fill so you can tell who's who.
//    fill(255, 0, 255);
//    ellipse(data.x, data.y, 30, 30);
//    //console.log('New drawing ' + data.x + ', ' + data.y);
//}