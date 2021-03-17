var path = require('path');             // Some convenient dir/path functions
var express = require('express');       // Use the express module
var app = express();                    // This is our express.js instance
const PORT = process.env.PORT || 5000;  // Port should be 5000 by default
// Require websocket and setup server.
const ws = require("ws");
var wsServer = new ws.Server({ noServer: true });

// First set up the PG client – the PG server is hosted elsewhere.
// https://devcenter.heroku.com/articles/heroku-postgresql#connecting-in-node-js
const { Client, Connection } = require('pg');

// For local testing
/* Table:
   CREATE TABLE Leaderboard (
      PlayerName VARCHAR(10)
    , Score INT
    , Accuracy DECIMAL(4,3)
   );
 */

var connectionString = process.env.DATABASE_URL;
var connectionString = 'postgres://hkxgwfwgoliqme:d22829be8625e7347d87184bda71cbb6a068dba4b2c260932bc184974d1d0226@ec2-52-7-168-69.compute-1.amazonaws.com:5432/d2o94nape5edke';

connectionString = {
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
};

const client = new Client(connectionString);
client.on('connect', () => console.log('Connected to db'));

client.connect();

// Parse our incoming requests by using the express.json(), express.urlencoded() middleware functions.
app.use(express.json());
//app.use(express.urlencoded());

// Endpoint for getting the leaderbooard names and scores. Only top 3 players are returned
app.get('/leaderboard', (req, res) => {
    let q = 'SELECT DISTINCT PlayerName, Score, Accuracy FROM leaderboard ORDER BY Score DESC, Accuracy DESC LIMIT 10;'
    client.query(q, (error, response) => {
        //console.log(error, response)
        res.send(response);
    });
})

// Endpoint for posting the player's score and name.
app.post('/score', (req, res) => {
    let name = req.body.playername;
    let score = req.body.score;
    let accuracy = req.body.accuracy;
    //console.log(name, score, accuracy);
    // PostgreSQL interprets " as being quotes for identifiers, ' as being quotes for strings.
    let q = 'INSERT INTO leaderboard (playername, score, accuracy) VALUES (\'' + name + '\'' + ', ' + score + ', ' + accuracy + ')';
    client.query(q, (err, res) => {
        //console.log(err, res)
    })
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Socket server stuff...

let users = []; // Store all connected users.

// When a user connects to our sever
// Listen and log connections and disconnections.
wsServer.on('connection', (socket) => {
    console.log('Client connected');

    socket.onmessage = (message) => {
        var data = JSON.parse(message.data); // String data.
        var user = findUser(data.username);

        // Add a type field for every message coming from the client.
        switch (data.type) {
            case "storeUser":

                if (user != null) {
                    return
                }
                const newUser = {
                    conn: socket,
                    username: data.username
                };
                users.push(newUser);
                console.log(newUser.username + ' connected');
                break;
            case "storeOffer":
                if (user == null) {
                    return;
                }
                user.offer = data.offer;
                break;

            case "storeCandidate":
                if (user == null) {
                    return;
                }
                if (user.candidates == null)
                    user.candidates = [];

                user.candidates.push(data.candidate);
                break;
            case "sendAnswer":
                if (user == null) {
                    return;
                }
                sendData({
                    type: "answer",
                    answer: data.answer
                }, user.conn);
                break;
            case "sendCandidate":
                if (user == null) {
                    return;
                }
                sendData({
                    type: "candidate",
                    candidate: data.candidate
                }, user.conn);
                break;
            case "joinCall":
                if (user == null) {
                    return;
                }
                console.log('Matata');

                sendData({
                    type: "offer",
                    offer: user.offer
                }, socket);

                user.candidates.forEach(candidate => {
                    sendData({
                        type: "candidate",
                        candidate: candidate
                    }, socket);
                })
                break;
        }
    }

    // When the user disconnects, delete the user and clean up connection.
    socket.on('close', function () {
        console.log('Client disconnected');
        if (socket.name) {
            delete users[socket.name];

            if (socket.otherName) {
                console.log("Disconnecting from ", socket.otherName);
                var conn = users[socket.otherName];
                conn.otherName = null;

                if (conn != null) {
                    sendData({
                        type: "leave"
                    }, conn);
                }

            }
        }
    });
});

// Helper function for sending messages to a connection.
function sendData(data, connection) {
    connection.send(JSON.stringify(data));
}

function findUser(username) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].username == username)
            return users[i];
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use(express.static(path.join(__dirname, 'public')))               // Lets us serve static files from the "public" directory
    .get('/', (req, res) => {                                         // Respond to HTTP GET request. '/' is the root endpoint.
        res.sendFile(path.join(__dirname, 'public/pages/index.html')) // Serve the landing static page
    })
    .listen(PORT) // Keep the server listening on port 5000
    /*
     * We use the existing HTTP/S server to handle the WebSocket handshake request.
     * The connection event is emitted when the handshake is complete.
     * The HTTP/S and WS servers both listen to port 5000.
     */
    .on("upgrade", (request, socket, head) => {
        wsServer.handleUpgrade(request, socket, head, (socket) => {
            wsServer.emit("connection", socket, request);
        });
    });