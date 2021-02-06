var path = require('path'); 		    // some convenient dir/path functions
var express = require('express');	    // use the express module
var app = express();			        // this is our express.js instance
const PORT = process.env.PORT || 5000;  // Port should be 5000 by default

app.use(express.static(path.join(__dirname, 'public'))) // lets us serve static files from the "public" directory
    .get('/', (req, res) => {                           // respond to HTTP GET request. '/' is the root endpoint.
        res.sendFile(path.join(__dirname, 'public/pages/index.html')) // serve the landing static page
    })

    .listen(PORT); // keep the server listening on port 5000
