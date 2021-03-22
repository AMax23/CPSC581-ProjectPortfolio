// JavaScript source code for client-side websockets (receiver).
// Resources: https://www.tutorialspoint.com/webrtc/webrtc_video_demo.htm, https://blog.logrocket.com/get-a-basic-chat-application-working-with-webrtc/

// Establish a connection with our signaling server.
var HOST = location.origin.replace(/^http/, 'ws'); // WebSocket requests use the WS protocol, not the HTTP protocol.
var webSocket = new WebSocket(HOST);

let localVideoStream;
let peerConnection;
let personToCall = 'oma/opa'; // Name of the person to call. Hardcoding ito oma/opa because Rhys will only call them.
var username = "Rhys";

let audioOn = true;
let videoOn = true;

// Configuration for peer connection.
// STUN server and TURN servers that it will use to create the ICE candidates and to connect to the peer.
const peerConnectionConfig = {
    iceServers: [
        {
            "urls": ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"]
        }
    ],
};

// onopen function waits for the websocket connection to establish before sending message.
webSocket.onopen = () => {
    sendUsername();
    joinCall();
}

// When there is a message from the server to the websocket:
webSocket.onmessage = (event) => {
    handleSignallingData(JSON.parse(event.data));
}

function handleSignallingData(data) {
    switch (data.type) {
        case "offer": // For the receiver there is no answer, only gets offer. Will create answers and send it.
            peerConnection.setRemoteDescription(data.offer);
            createAndSendAnswer();
            break;
        case "candidate":
            peerConnection.addIceCandidate(data.candidate);
            break;
        case "mouseClient":
            newDrawing(data);
            break;
        case "toClient":
            console.log('getting data');
            moveBox(data);
            break;
        case "UpdateState":
            drawObject(data);
            break;
        default:
            break;
    };
}

// Send the username to the socket server so the server can store it.
function sendUsername() {
    var data = {
        username: username,
        type: "storeUser"
    };
    webSocket.send(JSON.stringify(data));
}

function createAndSendAnswer() {
    peerConnection.createAnswer((answer) => {
        peerConnection.setLocalDescription(answer);
        sendData({
            type: "sendAnswer",
            answer: answer
        });
    }, error => {
        console.log(error);
    })
}

// Send object to server.
function sendData(data) {
    data.username = personToCall;
    webSocket.send(JSON.stringify(data));
}

function joinCall() {
    // Once the join call button is clicked, get the username from the input box.
    //personToCall = document.getElementById('usernameInput').value;

    //// Make the video call div visible.
    //document.getElementById("videoCallDiv").style.display = "inline";

    let constraints = {
        video: {
            frameRate: 24,
            width: {
                min: 480, ideal: 720, max: 1280
            },
            aspectRatio: 1.33333
        },
        audio: true
    }

    // Video stream from the device.
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            // Show the stream in the local video element.
            localVideoStream = stream;
            document.getElementById("localVideo").srcObject = localVideoStream;

            // Create a peer connection and attach the local stream to it.
            // When some other peer connects to our peer, then our stream will be available to them.
            peerConnection = new RTCPeerConnection(peerConnectionConfig);
            //peerConnection.addStream(localVideoStream);
            //localVideoStream.getTracks().forEach(track => peerConnection.addTrack(track, localVideoStream));
            stream.getTracks().forEach(function (track) {
                peerConnection.addTrack(track, localVideoStream);
            });

            // When our peer connection connects with someone else, then a callback function is called:
            peerConnection.ontrack = (e) => {
                document.getElementById("remoteVideo").srcObject = e.streams[0];
            };

            // As soon as the offer gets created.
            // Those candidates need to be sent to the server and the server will send that candidate to the person connection to us.
            peerConnection.onicecandidate = ((e) => {
                if (e.candidate == null)
                    return;
                // Send our offer and candidates to the other client.
                sendData({
                    type: "sendCandidate",
                    candidate: e.candidate
                });
            })

            // Send the username to the server and connect the call with that person.
            sendData({
                type: "joinCall",
            });

        }, (error) => {
            console.log(error);
        })
}


function muteAudio() {
    audioOn = !audioOn;
    // Mute the local audio source. Get the audio track from the local stream.
    localVideoStream.getAudioTracks()[0].enabled = audioOn;
}

function muteVideo() {
    videoOn = !videoOn;
    localVideoStream.getVideoTracks()[0].enabled = videoOn;
}