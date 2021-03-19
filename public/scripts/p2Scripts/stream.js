let users = []; // Store all connected users (sender).

const stream = (socket) => {

    console.log('Client connected');

    socket.onmessage = (message) => {
        var data = JSON.parse(message.data); // String data.
        var user = findUser(data.username);

        console.log('on Message');

        if (data.type == 'storeUser' && user == null) {
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
        } else if (data.type == 'toServer' && user != null) {
            console.log(data.x + ', ' + data.y);
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

            // Goes through all the users (should be only 2), and whoever drew sends it to the other client.
            for (let i = 0; i < users.length; i++) {
                if (users[i].username != user.username) {
                    users[i].conn.send(JSON.stringify(clientData));
                }
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