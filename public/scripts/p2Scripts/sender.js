// JavaScript source code for client-side websockets (sender).
// Resources: https://www.tutorialspoint.com/webrtc/webrtc_video_demo.htm, https://blog.logrocket.com/get-a-basic-chat-application-working-with-webrtc/

// Establish a connection with our signaling server.
var HOST = location.origin.replace(/^http/, 'ws'); // WebSocket requests use the WS protocol, not the HTTP protocol.
var webSocket = new WebSocket(HOST);

var username = 'oma/opa'; // Hardcoding this because this app is meant to only be used by 2 parties. Assuming oma/opa will start the call.

let localVideoStream;
let peerConnection;

let audioOn = true;
let videoOn = true;

// onopen function waits for the websocket connection to establish before sending message.
webSocket.onopen = () => {
    sendUsername(username);
    startCall();
}

// When there is a message from the server to the websocket:
webSocket.onmessage = (event) => {
    handleSignallingData(JSON.parse(event.data));
};

function handleSignallingData(data) {
    switch (data.type) {
        case "answer":
            peerConnection.setRemoteDescription(data.answer);
            break;
        // When a remote peer sends an ice candidate to us.
        case "candidate":
            peerConnection.addIceCandidate(data.candidate);
            break;
        case "mouseClient":
            newDrawing(data);
            console.log('receiving a message');
    };
}

// Send the username to the socket server so the server can store it.
function sendUsername() {
    //username = document.getElementById("usernameInput").value;
    sendData({
        type: "storeUser"
    });
}

// Send object to server.
function sendData(data) {
    data.username = username;
    webSocket.send(JSON.stringify(data))
}

function startCall() {
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

        // Configuration for peer connection.
        // STUN server and TURN servers that it will use to create the ICE candidates and to connect to the peer.
        let configuration = {
            iceServers: [
                {
                    "urls": ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"]
                }
            ]
        };

        // Create a peer connection and attach the local stream to it.
        // When some other peer connects to our peer, then our stream will be available to them.
        peerConnection = new RTCPeerConnection(configuration);
        peerConnection.addStream(localVideoStream);

        // When the peer connection connects with someone else, then a callback function is called:
        peerConnection.onaddstream = (e) => {
            document.getElementById("remoteVideo").srcObject = e.stream;
        };

        // As soon as the offer gets created.
        // Those candidates need to be sent to the server and the server will send that candidate to the person connection to us.
        peerConnection.onicecandidate = ((e) => {
            if (e.candidate == null)
                return;
            // Send our offer and candidates to the other client.
            sendData({
                type: "storeCandidate",
                candidate: e.candidate
            });
        })

        // Create and send our offer.
        createAndSendOffer();
    }, (error) => {
        console.log(error);
    })
}

/* Create and send our offer. This offer is stored on the socket server.
 * When someone tries to connect with us, the server will send our offer to that person
 * and then get that person's answer and return us that answer. We will store our answer in the peer connection.
 */
function createAndSendOffer() {
    peerConnection.createOffer((offer) => {
        sendData({
            type: "storeOffer",
            offer: offer
        })

        // After creating the offer we set the description of the remote peer connection.
        peerConnection.setLocalDescription(offer)
    }, (error) => {
        console.log(error);
    })
}

function muteAudio() {
    audioOn = !audioOn;
    // Mute the local audio source.Get the audio track from the local stream.
    localVideoStream.getAudioTracks()[0].enabled = audioOn;
}

function muteVideo() {
    videoOn = !videoOn;
    localVideoStream.getVideoTracks()[0].enabled = videoOn;
}