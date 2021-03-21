// JavaScript source code

//// Module aliases
//var Engine = Matter.Engine,
//    Render = Matter.Render,
//    World = Matter.World,
//    Bodies = Matter.Bodies,
//    MouseConstraint = Matter.MouseConstraint,
//    Mouse = Matter.Mouse;

//// Create an engine
//var engine;
//var world;

//let boxes = [];
//let circles = [];
//let grounds = [];
//let mouseConstraint;

//let boxA;
//let boxB;
//let ball;
//let ground;

//var num = 60;
//var x = [];
//var y = [];

//let toDraw = false;

let once = true;

let myCanvasDiv;

let cnv;

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

    //console.log(canvasWidth, canvasHeight);

    myCanvasDiv = document.getElementById('myCanvas');

    //console.log('in setup');

    background(0);

    //webSocket.onopen = () => {
    //    let data = {
    //        type: "canvas",
    //        canvas: canvasDiv
    //    }
    //    webSocket.send(JSON.stringify(data));
    //}


    //engine = Engine.create();
    //world = engine.world;

    ////  Engine.run(engine);
    //grounds.push(new Boundary(-50, height / 2, 100, height)); // Left
    //grounds.push(new Boundary(width + 50, height / 2, 100, height)); // Right
    //grounds.push(new Boundary(width / 2, 0 - 50, width, 100)); // Top
    //grounds.push(new Boundary(width / 2, height + 33, width, 100)); // Bottom
    ////World.add(world, grounds);

    //// create two boxes and a ground
    ////boxA = Bodies.rectangle(200, 200, 80, 80);
    ////boxB = Bodies.rectangle(270, 50, 160, 80);
    ////ball = Bodies.circle(100, 50, 40);
    //boxes.push(new Box(width / 2, 80, 50, 50));
    //boxes.push(new Box(width / 2, 80, 50, 50));
    //boxes.push(new Box(width / 2, 80, 50, 50));
    //boxes.push(new Box(width / 2, 80, 50, 50));
    //boxes.push(new Box(width / 2, 80, 50, 50));
    //boxes.push(new Box(width / 2, 80, 50, 50));
    //boxes.push(new Box(width / 2, 80, 50, 50));
    //boxes.push(new Box(width / 2, 80, 50, 50));
    //boxes.push(new Box(width / 2, 80, 50, 50));

    //ground = Bodies.rectangle(width, height / 2, 10, height, {
    //    isStatic: true
    //});
    //World.add(engine.world, [grounds, boxes]);

    //let mouse = Mouse.create(cnv.elt);
    //mouse.pixelRatio = pixelDensity() // for retina displays etc
    //let options = {
    //    mouse: mouse
    //}
    //mouseConstraint = MouseConstraint.create(engine, options);
    //mouseConstraint.mouse.pixelRatio = pixelDensity();
    //World.add(engine.world, mouseConstraint);

    //// Run the engine
    //Engine.run(engine);

    ////console.log(box1);

    //noStroke();
    //for (var i = 0; i < num; i++) {
    //    x[i] = 0;
    //    y[i] = 0;
    //}
}


function draw() {

    if (once && webSocket.readyState) {
        console.log('Hello');

        //console.log(myCanvasDiv);

        //console.log(myCanvasDiv.offsetWidth, myCanvasDiv.offsetHeight);


        let data = {
            type: "canvas",
            //pixelDensity: pixelDensity(),
            canvas: myCanvasDiv//cnv.elt
            //canvasWidth: myCanvasDiv.offsetWidth,
            //canvasHeight: myCanvasDiv.offsetHeight,
        }

        //console.log(myCanvasDiv);

        //console.log();

        webSocket.send(JSON.stringify(data, [""]));

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

    //if (mouseConstraint.body) {
    //    //console.log('----------------------------------------------------');
    //    //console.log(mouseConstraint.body);
    //    //let boxMoved = mouseConstraint.body.id - 1; // This is the number of the box that was moved. Minus 1 cos array starts at 0.
    //    //console.log(engine.world.bodies[boxMoved]);
    //    //console.log('----------------------------------------------------');
    //    sendBox();
    //    //console.log(boxes[0].body.velocity);
    //    //console.log(mouseConstraint.body.angularSpeed);
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


function setMouseConstraints(data) {
    //let MouseConstraint = Matter.MouseConstraint,
    //    Mouse = Matter.Mouse;

    //let mouse = Mouse.create(myCanvasDiv);

    //let mouseConstraint;
    //mouse.pixelRatio = pixelDensity() // for retina displays etc
    //let options = {
    //    mouse: mouse
    //}
    //mouseConstraint = MouseConstraint.create(engine, options);
    //mouseConstraint.mouse.pixelRatio = pixelDensity();
    //data.w.add(engine.world, mouseConstraint);
}

function mousePressed() {
    console.log('ok');


    //document.addEventListener("mousedown", e => {
    //socket.emit("player click", { x: e.offsetX, y: e.offsetY });

    let data = {
        type: "userClick",
        x: mouseX,
        y: mouseY
    }
    webSocket.send(JSON.stringify(data));

    //});

}

function drawStuff(data) {
    clear();
    //console.log('num of people online = ' + data.online);

    let boxes = data.boxes;
    let wall = data.walls;
    //ctx.fillStyle = "#111";
    //ctx.strokeStyle = "#111";
    //walls.forEach(wall => draw(wall, ctx));
    ////ctx.fillStyle = "#aaa";
    //boxes.forEach(box => draw(box, ctx));
    //onlineEl.textContent = online;

    boxes.forEach(box => drawBody(box));
}

function drawBody(vertices) {
    //ctx.beginPath();
    //body.forEach(e => ctx.lineTo(e.x, e.y));
    //ctx.closePath();
    //ctx.fill();
    //ctx.stroke();

    //console.log('does it come here');
    //fill(255, 0, 255);

    textSize(70);
    textStyle(BOLD);
    fill(255);
    text('hello', 350, 150);
    stroke(3);
    //console.log(vertices);

    ////console.log(vertices[0].x, vertices[0].y);

    beginShape();

    ////vertices.forEach(e => line(e.x,e.y,0,0));


    for (var i = 0; i < vertices.length; i++) {
        vertex(vertices[i].x, vertices[i].y);
        //console.log('umm');
    }
    endShape(CLOSE);
}


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