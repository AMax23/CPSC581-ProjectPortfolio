var path = require('path'); 		    // some convenient dir/path functions
var express = require('express');	    // use the express module
var app = express();			        // this is our express.js instance
const PORT = process.env.PORT || 5000;  // Port should be 5000 by default

//// First you need to set up the PG client – the PG server is hosted elsewhere.
//const { Pool, Client } = require('pg')
//const pool = new Pool({
//    user: process.env.DB_USER,
//    host: process.env.DB_HOST,
//    database: process.env.DB,
//    password: process.env.DB_PASSWORD,
//    port: process.env.DB_PORT
//});


//console.log(pool.port);

////app.post('/upload', (req, res) => {
//    let q = 'SELECT  PlayerName , Score , Accuracy  FROM leaderboard;';
//    pool.query(q, (err, res) => {
//        console.log(err, res)
//    })
////})

//app.get('/leaderboard', (req, res) => {
//    let q = 'SELECT  PlayerName , Score , Accuracy  FROM leaderboard;'; /*<a string describing the query you want to make>;*/
//    pool.query(q, (error, response) => {
//        console.log(error, response)
//        res.send(response);
//    })
//})


const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();
console.log('process port = ' + process.env.DB_PORT);

//client.connect();

//client.query('SELECT  PlayerName , Score , Accuracy  FROM leaderboard;', (err, res) => {
//    if (err) throw err;
//    for (let row of res.rows) {
//        console.log(JSON.stringify(row));
//    }
//    client.end();
//});


app.use(express.static(path.join(__dirname, 'public'))) // lets us serve static files from the "public" directory
    .get('/', (req, res) => {                           // respond to HTTP GET request. '/' is the root endpoint.
            res.sendFile(path.join(__dirname, 'public/pages/index.html')) // serve the landing static page
        })
    .listen(PORT); // keep the server listening on port 5000



//const Database = require('./db/postgres-db.js');

//var DB = new Database();

//console.log(DB);



//    DB.write('A', 40, 0.7);




//const {Client} = require('pg');

//var connectionString = 'postgres://hkxgwfwgoliqme:d22829be8625e7347d87184bda71cbb6a068dba4b2c260932bc184974d1d0226@ec2-52-7-168-69.compute-1.amazonaws.com:5432/d2o94nape5edke';

//const client = new Client({
//    connectionString: connectionString,
//    ssl: {
//        rejectUnauthorized: false
//    }
//});

//client.connect();

///* SQL Command i ran:
//CREATE TABLE Leaderboard (
//      PlayerName VARCHAR(10)
//    , Score INT
//    , Accuracy DECIMAL(4,2)
//)
// * 
// */

//client.query('INSERT INTO leaderboard (PlayerName, Score, Accuracy) VALUES ("B", 15, 0.32);'
//    , (err, res) => {
//        if (err) throw err;
//        for (let row of res.rows) {
//            console.log(JSON.stringify(row));
//        }
//        client.end();
//    });

//client.query('SELECT  PlayerName , Score , Accuracy  FROM leaderboard;'
//    , (err, res) => {
//        if (err) throw err;
//        for (let row of res.rows) {
//            console.log(JSON.stringify(row));
//        }
//        client.end();
//    });

