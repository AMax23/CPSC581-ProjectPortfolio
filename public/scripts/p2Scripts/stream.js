const Matter = require("matter-js");

// Module aliases
let Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Vector = Matter.Vector,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse;

// Create an engine
let engine = Engine.create();
let world;
let mouseConstraint;

let entities;
let boxes = 5;
let boxSize = 80;
let wallThickness = 100;
let frameRate = 1000 / 30;

let users = []; // Store all connected users.

const toVertices = e => e.vertices.map(({ x, y }) => ({ x, y }));

const stream = (socket) => {

    // When both clients are connected then start updating the world and send it to the clients.
    if (entities) {
        setInterval(() => {
            Engine.update(engine, frameRate);

            let clientData = {
                type: "UpdateState",
                boxes: entities.boxes.map(toVertices),
                walls: entities.walls.map(toVertices)
            }
            // Send message to all connections
            for (let i = 0; i < users.length; i++) {
                users[i].conn.send(JSON.stringify(clientData));
            }
        }, frameRate);
    }

    socket.onmessage = (message) => {
        var data = JSON.parse(message.data); // String data.
        var user = findUser(data.username);

        // The client will send different messages types. For each one it does something different.
        if (data.type == 'canvas') {
            let canvas = { width: data.canvasWidth, height: data.canvasHeight };

            entities = {
                boxes: [...Array(boxes)].map(() =>
                    Bodies.rectangle(canvas.width / 2, 80, boxSize, boxSize, {
                        friction: 0.6,
                        restitution: 0.5,
                        //density: 0.005,
                        frictionAir: 0
                    })
                ),
                walls: [
                    // Left
                    Bodies.rectangle(
                        0, canvas.height / 2, wallThickness, canvas.height,
                        { friction: 0.0, isStatic: true }
                    ),
                    // Right
                    Bodies.rectangle(
                        canvas.width, canvas.width / 2, wallThickness, canvas.width,
                        { friction: 0.1, isStatic: true }
                    ),
                    // Top
                    Bodies.rectangle(
                        canvas.width / 2, 0, canvas.width, wallThickness,
                        { friction: 0.0, isStatic: true }
                    ),
                    // Bottom
                    Bodies.rectangle(
                        canvas.width / 2, canvas.height, canvas.width, wallThickness,
                        { friction: 1, isStatic: true }
                    ),
                ]
            };

            World.add(engine.world, [].concat(...Object.values(entities)));

        } else if (data.type == 'storeUser' && user == null) {
            // Add the new user to the list of all users.
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
            let clientData = data;
            clientData.type = "toClient";

            // Goes through all the users (should be only 2), and whoever drew sends it to the other client.
            for (let i = 0; i < users.length; i++) {
                //if (users[i].username != user.username) {
                users[i].conn.send(JSON.stringify(clientData));
                //}
            }
        } else if (data.type == 'userClick' && user != null) {
            let coordinates = {
                x: data.x,
                y: data.y
            }

            // If oma/opa click then add a new box, but if Rhys clicks then do the force effect.
            if (user.username == 'oma/opa') {
                // Add the new box where the user clicks.
                let newBox = Bodies.rectangle(coordinates.x, coordinates.y, boxSize, boxSize);
                World.add(engine.world, newBox);
                entities.boxes.push(newBox);

            } else {
                entities.boxes.forEach(box => {
                    // https://stackoverflow.com/a/50472656/6243352

                    let force = 0.05;
                    let deltaVector = Vector.sub(box.position, coordinates);
                    let normalizedDelta = Vector.normalise(deltaVector);
                    let forceVector = Vector.mult(normalizedDelta, force);
                    Body.applyForce(box, box.position, forceVector);
                });
            }
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
        connection.send(JSON.stringify(data));
    }

    // If the user connection already exists return that.
    function findUser(username) {
        for (let i = 0; i < users.length; i++) {
            if (users[i].username == username)
                return users[i];
        }
    }
}

module.exports = stream;