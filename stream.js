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
let maxBoxes = 9; // Only this many boxes at a time on the canvas. More than this and it will be laggy :(
let boxSize = 102; // If this number is changed the box image dimensions will also need to be changed.
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

let worldUpdateInterval;

let animal = '';
let allAnimals = [];

const toVertices = e => e.vertices.map(({ x, y }) => ({ x, y }));

let boxPositions = [];
let boxAngles = [];

const MessageType = {
    SERVER_INFO: 0,
    CLIENT1: 1,
    CLIENT2: 2,
    CALL_REQUEST: 3
};

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

var clients = {}; // iterating over object key:value pairs => object[key] returns key's value

const stream = (socket, request) => {

    // route to endpoint handlers
    switch (request.url) {
        case "/client1":
            if (!clients.client1) {
                console.log("Oma/Opa Connected");
                clients.client1 = socket;
                socket.send(
                    JSON.stringify({
                        type: MessageType.SERVER_INFO,
                        message: "Connected to server. Waiting for peer..."
                    })
                );
            } else {
                socket.close(1013, "Client 1 already taken. Try again later.");
            }
            break;

        case "/client2":
            if (!clients.client2) {
                console.log("Rhys Connected");
                clients.client2 = socket;
                socket.send(
                    JSON.stringify({
                        type: MessageType.SERVER_INFO,
                        message: "Connected to server. Waiting for peer..."
                    })
                );
            } else {
                socket.close(1013, "Client 2 already taken. Try again later.");
            }
            break;

        default:
            console.log("default");
            socket.close(1000, "Endpoint Not Found");
            break;
    }

    // handle and route messages to endpoint handlers
    socket.onmessage = (mEvent) => {
        var msg = JSON.parse(mEvent.data);
        //console.log(msg);
        if (msg.type in [0, 1, 2, 3]) {
            switch (request.url) {
                case "/client1":
                    if (clients.client2 != undefined) { // clients2 exists, forward the message
                        clients.client2.send(JSON.stringify(msg));
                    } else {
                        clients.client1.send(
                            JSON.stringify({
                                type: MessageType.SERVER_INFO,
                                message: "Waiting for Rhys to connect..."
                            })
                        );
                    }
                    break;

                case "/client2":
                    if (clients.client1 != undefined) {
                        clients.client1.send(JSON.stringify(msg)); // clients1 exists, forward the message
                    } else {
                        clients.client2.send(
                            JSON.stringify({
                                type: MessageType.SERVER_INFO,
                                message: "Waiting for Oma/Opa to connect..."
                            })
                        );
                    }
                    break;

                default:
                    socket.close(1000, "Endpoint Not Found");
                    break;
            }
        } else {

            var data = JSON.parse(mEvent.data); // String data.
            var user = data.username;

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

                // When both clients are connected then start updating the world and send it to the clients.
                if (entities && clients.client1 && clients.client2) { worldUpdateInterval = setInterval(updateWorld, frameRate); }

            } else if (data.type == 'userClick' && user != null) {
                let coordinates = {
                    x: data.x,
                    y: data.y
                }

                // If oma/opa click then add a new box, but if Rhys clicks then do the force effect.
                if (entities.boxes.length < maxBoxes && user == 'oma/opa') {
                    // Add the new box where the user clicks.
                    let newBox = Bodies.rectangle(coordinates.x, coordinates.y, boxSize, boxSize, boxOptions);
                    World.add(world, newBox);
                    entities.boxes.push(newBox);
                    animal = data.animalNoise;
                    //entities.boxesLetters.push(animal);
                    allAnimals.push({ animalNoise: animal });
                    if (entities.boxes.length == 1 && clients.client1 && clients.client2) { worldUpdateInterval = setInterval(updateWorld, frameRate); }
                } else if (user != 'oma/opa') {
                    entities.boxes.forEach(box => {
                        // https://stackoverflow.com/a/50472656/6243352
                        let force = 0.09;
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
                allAnimals = [];
                engine.events = {}; //  Remove all events on the engine or any object
            } else if (data.type == 'rhysDestory' && user != null) {
                let clientData = data;
                clientData.type = "rhysDestoryPerm";
                // Sends to Rhys the permission data. User who sends this should always be oma/opa.
                clients.client2.send(JSON.stringify(clientData));
            }
        }
    };

    // When the user disconnects, delete the user and clean up connection.
    socket.onclose = (e) => {
        console.log("Socket closed: " + e.code + " " + e.reason); // Debug message to confirm closed socket.
        clearInterval(interval); // Stop heartbeat for this socket.

        if (e.code == 1001) {
            // Code 1001: client closed socket, disconnect all clients and delete them
            for (var s in clients) {
                clients[s].send(JSON.stringify({ type: 'clientDisconnected' }));
                clients[s].close(4000, "Peer disconnected");
                clients[s] = undefined;
            }
        }

        /// If someone disconnects reset the engine and world.
        if (entities) {
            entities.boxes.forEach(box => {
                World.remove(world, box);
            });
            entities.boxes = []; // Clear the boxes array.
            allAnimals = [];
            engine.events = {}; //  Remove all events on the engine or any object
        }

        clearInterval(worldUpdateInterval); // Stop the world update when client disconnects.
    };

    // Establish ping-pong heartbeats
    socket.isAlive = true;
    socket.on("pong", () => {
        // ping-pong heartbeat
        //console.log("pong at " + request.url);
        socket.isAlive = true; // a successful ping-pong means connection is still alive
    });

    var interval = setInterval(() => {
        if (socket.isAlive === false) {
            // didn't get a pong back within 10s
            socket.terminate(); // kill the socket in cold blood
            clients[
                request.url.slice(1) /* remove the / from the endpoint name */
            ] = undefined;
            return;
        }

        socket.isAlive = false; // first assume connection is dead
        socket.ping(); // do the "heartbeat" to 'revive' it
    }, 10000); // 10s

    function updateWorld() {
        Engine.update(engine, frameRate);
        getBoxProperties(entities.boxes); // Get the x and y positions, and angle.

        let clientData = {
            type: "UpdateState",
            boxes: entities.boxes.map(toVertices),
            walls: entities.walls.map(toVertices),
            positions: boxPositions,
            angles: boxAngles,
            //boxesLetters: entities.boxesLetters
            boxesAnimals: allAnimals
        }
        // Send message to all connections
        clients.client1.send(JSON.stringify(clientData));
        clients.client2.send(JSON.stringify(clientData));

        if (entities.boxes.length == 0) { clearInterval(worldUpdateInterval); }
    }
}

module.exports = stream;