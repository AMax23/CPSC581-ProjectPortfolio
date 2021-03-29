const Matter = require("matter-js");

// Module aliases
let Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Vector = Matter.Vector;

// Create an engine
let engine = Engine.create();
let world = engine.world;

let entities;
let boxes = 0; // Starting off with no boxes on the screen.
let maxBoxes = 10; // Only this many boxes at a time on the canvas. More than this and it will be laggy :(
let boxSize = 62;
// Properties for the box.
let boxOptions = {
    friction: 1,
    restitution: 0, // Elasticity, 0 = none
    //density: 0.005,
    frictionAir: 0
};
let wallOptions = {
    friction: 1,
    isStatic: true,
    restitution: 0, // Elasticity
};
let wallThickness = 100;
let frameRate = 1000 / 30;

let users = []; // Store all connected users.

let letter = 'A';
let allLetters = [];

const toVertices = e => e.vertices.map(({ x, y }) => ({ x, y }));

let boxPositions = [];
let boxAngles = [];

// Gets the box x and y postiions, and angle, and stores it in an array.
function getBoxProperties(boxes) {
    boxPositions = [];
    boxAngles = [];
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].position) {
            boxAngles.push(boxes[i].angle);
            boxPositions.push(boxes[i].position);
        }
    }
}

const stream = (socket) => {

    // When both clients are connected then start updating the world and send it to the clients.
    if (entities) {
        setInterval(() => {
            Engine.update(engine, frameRate);

            getBoxProperties(entities.boxes); // Get the x and y positions, and angle.

            let clientData = {
                type: "UpdateState",
                boxes: entities.boxes.map(toVertices),
                walls: entities.walls.map(toVertices),
                positions: boxPositions,
                angles: boxAngles,
                //boxesLetters: entities.boxesLetters
                boxesLetters: allLetters
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
                    Bodies.rectangle(canvas.width / 2, 80, boxSize, boxSize, boxOptions) // This box is not actually added.
                ),
                walls: [
                    // Right
                    Bodies.rectangle(
                        canvas.width, canvas.height / 2, wallThickness, canvas.height, wallOptions),
                    // Left
                    Bodies.rectangle(
                        0, canvas.height / 2, wallThickness, canvas.height, wallOptions),
                    // Bottom
                    Bodies.rectangle(
                        canvas.width / 2, canvas.height, canvas.width, wallThickness, wallOptions),
                    // Top
                    Bodies.rectangle(
                        canvas.width / 2, 0, canvas.width, wallThickness, wallOptions)
                ]
            };

            World.add(world, [].concat(...Object.values(entities)));

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
                users[i].conn.send(JSON.stringify(clientData));
            }
        } else if (data.type == 'userClick' && user != null) {
            let coordinates = {
                x: data.x,
                y: data.y
            }

            // If oma/opa click then add a new box, but if Rhys clicks then do the force effect.
            if (entities.boxes.length < maxBoxes && user.username == 'oma/opa') {
                // Add the new box where the user clicks.
                let newBox = Bodies.rectangle(coordinates.x, coordinates.y, boxSize, boxSize, boxOptions);
                World.add(world, newBox);
                entities.boxes.push(newBox);
                letter = data.letter;
                //entities.boxesLetters.push(letter);
                allLetters.push({ letter: letter, colour: data.letterColour });
            } else if (user.username != 'oma/opa') {
                entities.boxes.forEach(box => {
                    // https://stackoverflow.com/a/50472656/6243352

                    let force = 0.05;
                    let deltaVector = Vector.sub(box.position, coordinates);
                    let normalizedDelta = Vector.normalise(deltaVector);
                    let forceVector = Vector.mult(normalizedDelta, force);
                    Body.applyForce(box, box.position, forceVector);
                });
            }
        } else if (data.type == 'clearScreen' && user != null) {
            // Remove the boxes from the world as well.
            // Even if the array is cleared Matter js will still know of its existence.
            entities.boxes.forEach(box => {
                World.remove(world, box);
            });
            entities.boxes = []; // Clear the boxes array.
            allLetters = [];
        }
    }

    // When the user disconnects, delete the user and clean up connection.
    socket.on('close', () => {
        users.forEach(user => {
            if (user.conn == socket) {
                console.log('Client disconnected: ' + user.username);
                users.splice(users.indexOf(user), 1);
            }
        })

        let clientData = {
            type: 'clientDisconnected'
        }
        // Goes through all the users (should be only 1 left), and let them know other client has left the call.
        for (let i = 0; i < users.length; i++) {
            users[i].conn.send(JSON.stringify(clientData));
        }
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