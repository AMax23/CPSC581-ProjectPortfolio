let users = []; // Store all connected users (sender).

const Matter = require("matter-js");
const frameRate = 1000 / 30;
//const canvas = { width: 300, height: 200 };
const boxes = 5
const boxSize = 20
const wallThickness = 20
let online = 0;

let entities;
let engine = Matter.Engine.create();

//const entities = {
//    boxes: [...Array(boxes)].map(() =>
//        Matter.Bodies.rectangle(canvas.width / 2, 80, 50, 50)
//        //Matter.Bodies.rectangle(
//        //    Math.random() * canvas.width,
//        //    boxSize,
//        //    Math.random() * boxSize + boxSize,
//        //    Math.random() * boxSize + boxSize,
//        //)
//    ),
//    walls: [
//        Matter.Bodies.rectangle(
//            canvas.width / 2, 0,
//            canvas.width,
//            wallThickness,
//            { isStatic: true }
//        ),
//        Matter.Bodies.rectangle(
//            0, canvas.height / 2,
//            wallThickness,
//            canvas.height,
//            { isStatic: true }
//        ),
//        Matter.Bodies.rectangle(
//            canvas.width,
//            canvas.width / 2,
//            wallThickness,
//            canvas.width,
//            { isStatic: true }
//        ),
//        Matter.Bodies.rectangle(
//            canvas.width / 2,
//            canvas.height,
//            canvas.width,
//            wallThickness,
//            { isStatic: true }
//        ),
//    ]
//};

//////let cnv = createCanvas(200, 200);
//const engine = Matter.Engine.create();
////let MouseConstraint = Matter.MouseConstraint,
////    Mouse = Matter.Mouse;

//////let mouse = Mouse.create(cnv.elt);

////let mouseConstraint;
//////mouse.pixelRatio = pixelDensity() // for retina displays etc
////let options = {
////    //mouse: mouse
////}
////mouseConstraint = MouseConstraint.create(engine, options);
//////mouseConstraint.mouse.pixelRatio = pixelDensity();
////Matter.World.add(engine.world, mouseConstraint);


//Matter.World.add(engine.world, [].concat(...Object.values(entities)));
const toVertices = e => e.vertices.map(({ x, y }) => ({ x, y }));

const stream = (socket) => {

    console.log('Client connected');
    if (entities) {
        setInterval(() => {
            Matter.Engine.update(engine, frameRate);
            //io.emit("update state", {
            //    boxes: entities.boxes.map(toVertices),
            //    walls: entities.walls.map(toVertices),
            //    online,
            //});

            let clientData = {
                type: "UpdateState",
                boxes: entities.boxes.map(toVertices),
                walls: entities.walls.map(toVertices),
            }
            // Goes through all the users (should be only 2), and whoever drew sends it to the other client.
            for (let i = 0; i < users.length; i++) {
                //if (users[i].username != user.username) {
                users[i].conn.send(JSON.stringify(clientData));
                //}
            }
            //console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<UPDATE>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        }, frameRate);
    }

    socket.onmessage = (message) => {
        var data = JSON.parse(message.data); // String data.
        var user = findUser(data.username);

        console.log('on Message');

        if (data.type == 'canvas') {

            console.log('oooooooooooooooooooooooooooooooooooooooooooooo');
            console.log(data);
            console.log('oooooooooooooooooooooooooooooooooooooooooooooo');

            //let MouseConstraint = Matter.MouseConstraint,
            //    Mouse = Matter.Mouse;

            ////let mouse = Mouse.create(data.canvas);

            //console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
            //console.log(data.canvas);
            //console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');

            //let clientData = {
            //    type: "canvasMouse",
            //    w: Matter.World
            //    //e: engine.world

            //};

            //for (let i = 0; i < users.length; i++) {
            //    //if (users[i].username != user.username) {
            //    users[i].conn.send(JSON.stringify(clientData));
            //    //}
            //}


            //let mouseConstraint;
            //mouse.pixelRatio = data.pixelDensity;//pixelDensity() // for retina displays etc
            //let options = {
            //    mouse: mouse
            //}
            //mouseConstraint = MouseConstraint.create(engine, options);
            //mouseConstraint.mouse.pixelRatio = data.pixelDensity;//pixelDensity();
            //Matter.World.add(engine.world, mouseConstraint);

            const canvas = { width: 400, height: 400 };

            entities = {
                boxes: [...Array(boxes)].map(() =>
                    Matter.Bodies.rectangle(canvas.width / 2, 80, 50, 50)
                    //Matter.Bodies.rectangle(
                    //    Math.random() * canvas.width,
                    //    boxSize,
                    //    Math.random() * boxSize + boxSize,
                    //    Math.random() * boxSize + boxSize,
                    //)
                ),
                walls: [
                    // Left
                    Matter.Bodies.rectangle(
                        -50, canvas.height / 2, 100, canvas.height,
                        { isStatic: true }
                    ),
                    // Right
                    Matter.Bodies.rectangle(
                        canvas.width + 50, canvas.height / 2, 100, canvas.height,
                        { isStatic: true }
                    ),
                    // Top
                    Matter.Bodies.rectangle(
                        canvas.width / 2, 0 - 50, canvas.width, 100,
                        { isStatic: true }
                    ),
                    // Bottom
                    Matter.Bodies.rectangle(
                        canvas.width / 2, canvas.height + 33, canvas.width, 100,
                        { isStatic: true }
                    ),
                    //Matter.Bodies.rectangle(
                    //    0, canvas.height / 2,
                    //    wallThickness,
                    //    canvas.height,
                    //    { isStatic: true }
                    //),
                    //Matter.Bodies.rectangle(
                    //    canvas.width,
                    //    canvas.width / 2,
                    //    wallThickness,
                    //    canvas.width,
                    //    { isStatic: true }
                    //),
                    //Matter.Bodies.rectangle(
                    //    canvas.width / 2,
                    //    canvas.height,
                    //    canvas.width,
                    //    wallThickness,
                    //    { isStatic: true }
                    //),
                ]
            };

            ////let cnv = createCanvas(200, 200);

            //let MouseConstraint = Matter.MouseConstraint,
            //    Mouse = Matter.Mouse;

            ////let mouse = Mouse.create(cnv.elt);

            //let mouseConstraint;
            ////mouse.pixelRatio = pixelDensity() // for retina displays etc
            //let options = {
            //    //mouse: mouse
            //}
            //mouseConstraint = MouseConstraint.create(engine, options);
            ////mouseConstraint.mouse.pixelRatio = pixelDensity();
            //Matter.World.add(engine.world, mouseConstraint);


            Matter.World.add(engine.world, [].concat(...Object.values(entities)));



        } else if (data.type == 'storeUser' && user == null) {
            // Add a type field for every message coming from the client.
            const newUser = {
                conn: socket,
                username: data.username
            };
            users.push(newUser);
            console.log(newUser.username + ' connected');

        } else if (data.type == 'storeOffer' && user != null) {
            user.offer = data.offer;
        } else if (data.type == 'storeCandidate' && user != null && user.candidates == null) {
            user.candidates = [];
            user.candidates.push(data.candidate);
        } else if (data.type == 'sendAnswer' && user != null) {
            console.log('Receiver send answer');
            sendData({
                type: "answer",
                answer: data.answer
            }, user.conn);
        } else if (data.type == 'sendCandidate' && user != null) {
            sendData({
                type: "candidate",
                candidate: data.candidate
            }, user.conn);
        } else if (data.type == 'joinCall' && user != null) {
            console.log('Matata');
            sendData({
                type: "offer",
                offer: user.offer
            }, socket);

            if (user.candidates) {
                user.candidates.forEach(candidate => {
                    sendData({
                        type: "candidate",
                        candidate: candidate
                    }, socket);
                })
            }
        } else if (data.type == 'mouseDrag' && user != null) {
            //console.log(data.x + ', ' + data.y);
            let clientData = {
                type: "mouseClient",
                x: data.x,
                y: data.y
            };

            // Goes through all the users (should be only 2), and whoever drew sends it to the other client.
            for (let i = 0; i < users.length; i++) {
                if (users[i].username != user.username) {
                    users[i].conn.send(JSON.stringify(clientData));
                }
            }
        } else if (data.type == 'toServer') {
            //let clientData = {
            //    type: "toClient",
            //    //x: data.x,
            //    //y: data.y
            //    boxesPos: data.boxesPos,
            //    boxesAng: data.boxesAng,
            //    canvas: canvas

            //};

            let clientData = data;
            clientData.type = "toClient";

            console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<SENDING TO CLIENT>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');

            // Goes through all the users (should be only 2), and whoever drew sends it to the other client.
            for (let i = 0; i < users.length; i++) {
                //if (users[i].username != user.username) {
                users[i].conn.send(JSON.stringify(clientData));
                //}
            }
        } else if (data.type == 'userClick') {
            let clientData = data;
            clientData.type = "toClient";

            //console.log('USER CLICK RECEIVED');

            let coordinates = {
                x: data.x,
                y: data.y
            }

            entities.boxes.forEach(box => {
                // https://stackoverflow.com/a/50472656/6243352

                //console.log('///////////////////////////////////good////////////////////////////////////////////////////');

                const force = 0.01;
                const deltaVector = Matter.Vector.sub(box.position, coordinates);
                const normalizedDelta = Matter.Vector.normalise(deltaVector);
                const forceVector = Matter.Vector.mult(normalizedDelta, force);
                Matter.Body.applyForce(box, box.position, forceVector);
            });
        }
    }

    // When the user disconnects, delete the user and clean up connection.
    socket.on('close', () => {
        users.forEach(user => {
            if (user.conn == socket) {
                console.log('Client disconnected: ' + user.username);
                users.splice(users.indexOf(user), 1);
                return;
            }
        })
    })

    // Helper function for sending messages to a connection.
    function sendData(data, connection) {
        console.log('Send data');
        connection.send(JSON.stringify(data));
    }

    function findUser(username) {
        console.log('Find username');
        console.log('---------------------------------------------------------------');
        console.log('---------------------------------------------------------------');
        for (let i = 0; i < users.length; i++) {
            console.log('looking for: ' + username + ' found user = ' + users[i].username);

            if (users[i].username == username)
                return users[i];
        }
    }
}

module.exports = stream;