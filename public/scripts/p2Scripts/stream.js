let users = []; // Store all connected users.

const stream = (socket) => {

    console.log('Client connected');

    //console.log(socket);

    socket.onmessage = (message) => {
        var data = JSON.parse(message.data); // String data.
        var user = findUser(data.username);

        console.log('on Message');

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

                console.log('Receiver send answer');
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

    // Helper function for sending messages to a connection.
    function sendData(data, connection) {
        console.log('Send data');
        //console.log(connection);
        connection.send(JSON.stringify(data));
    }

    function findUser(username) {
        console.log('Find username');
        for (let i = 0; i < users.length; i++) {
            if (users[i].username == username)
                return users[i];
        }
    }
}

module.exports = stream;