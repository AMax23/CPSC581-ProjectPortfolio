var path = require('path');             // Some convenient dir/path functions
var express = require('express');       // Use the express module
var app = express();                    // This is our express.js instance
const PORT = process.env.PORT || 5000;  // Port should be 5000 by default
const WS = require("ws");               // Require websocket and setup server.
var wsServer = new WS.Server({ noServer: true });
var stream = require('./stream.js'); // Socket server stuff...

/////////////////////////////////////////// Database related stuff /////////////////////////////////////////////

// First set up the PG client � the PG server is hosted elsewhere.
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
/////////////////////////////////////////// End Database related stuff /////////////////////////////////////////////

// When a user connects to the sever
// Listen and log connections and disconnections.
wsServer.on('connection', stream);

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