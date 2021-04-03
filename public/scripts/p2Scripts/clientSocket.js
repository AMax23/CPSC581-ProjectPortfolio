// Adapted from https://github.com/shanet/WebRTC-Example

var localVid = document.getElementById('localVideo');
var remoteVid = document.getElementById('remoteVideo');
var callBtn = document.getElementById('callBtn');

var localVideoStream;
var peerConnection;
var webSocket;

let username;

let audioOn = true;
let videoOn = true;

const peerConnectionConfig = {
    iceServers: [
        { urls: "stun:stun.stunprotocol.org:3478" },
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:19302" },
        { urls: "stun:stun.ekiga.net" },
        { urls: "stun:stun.fwdnet.net" },
        { urls: "stun:stun.ideasip.com" },
        { urls: "stun:stun.iptel.org" },
    ],
};

// Access the value of the query.
const params = new URLSearchParams(window.location.search)

const MessageType = {
    SERVER_INFO: 0,
    CLIENT1: 1,
    CLIENT2: 2,
    CALL_REQUEST: 3,
};

if (params.get('client') == 'client1') {
    username = 'oma/opa';
    getWebcam();
    const HOST = location.origin.replace(/^http/, 'ws'); // WebSocket requests use the WS protocol, not the HTTP protocol.
    destination = HOST + "/client1";
    webSocket = new WebSocket(destination);
    webSocket.onmessage = handleMessage;
}

if (params.get('client') == 'client2') {
    username = 'Rhys';
    getWebcam();
    const HOST = location.origin.replace(/^http/, 'ws'); // WebSocket requests use the WS protocol, not the HTTP protocol.
    destination = HOST + "/client2";
    webSocket = new WebSocket(destination);
    webSocket.onmessage = handleMessage;
}

callBtn.addEventListener("click", () => {
    start(true);
});

// Send object to server.
function sendData(data) {
    data.username = username;
    webSocket.send(JSON.stringify(data))
}

function getWebcam() {
    let constraints = {
        video: {
            frameRate: 24,
            width: {
                min: 480, ideal: 720, max: 1280
            }//,
            //aspectRatio: 1.33333
        },
        audio: true
    }

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            localVideoStream = stream;
            document.getElementById("localVideo").srcObject = localVideoStream;
        })
}

function start(isCaller) {
    peerConnection = new RTCPeerConnection(peerConnectionConfig);
    peerConnection.onicecandidate = gotIceCandidate;
    peerConnection.ontrack = gotRemoteStream;
    peerConnection.addStream(localVideoStream);

    if (isCaller) {
        peerConnection.createOffer().then(createdDescription).catch(errorHandler); // using chained Promises for async
    }
}

function gotIceCandidate(event) {
    if (event.candidate != null) {
        sendData({
            type: MessageType.CALL_REQUEST,
            ice: event.candidate,
            message: "Sending ICE candidate",
        })
    }
}

function createdDescription(description) {
    peerConnection
        .setLocalDescription(description)
        .then(() => {
            sendData({
                type: MessageType.CALL_REQUEST,
                sdp: peerConnection.localDescription,
                message: "Requesting call",
            })
        })
        .catch(errorHandler);
}

function gotRemoteStream(event) {
    document.getElementById("remoteVideo").srcObject = event.streams[0];
    document.getElementById('clientConnectMessage').innerHTML = ""; // Connected to peer.
    setupDiv();
}

function handleMessage(mEvent) {
    var data = JSON.parse(mEvent.data);

    switch (data.type) {
        case MessageType.SERVER_INFO:
            document.getElementById('clientConnectMessage').innerHTML = data.message;
            break;

        // Message came from Client 1, Handle as Client2
        case MessageType.CLIENT1:
            break;

        // Message came from Client 2, Handle as Client1
        case MessageType.CLIENT2:
            break;

        case MessageType.CALL_REQUEST:
            if (!peerConnection) {
                document.getElementById('clientConnectMessage').innerHTML = "Receiving Call!";
                start(false);
            }

            // Are we on the SDP stage or the ICE stage of the handshake?
            if (data.sdp) {
                peerConnection
                    .setRemoteDescription(new RTCSessionDescription(data.sdp))
                    .then(() => {
                        // Only create answers in response to offers
                        if (data.sdp.type == "offer") {
                            peerConnection
                                .createAnswer()
                                .then(createdDescription)
                                .catch(errorHandler);
                        }
                    })
                    .catch(errorHandler);
            } else if (data.ice) {
                peerConnection
                    .addIceCandidate(new RTCIceCandidate(data.ice))
                    .catch(errorHandler);
            }
            break;
        case "UpdateState":
            drawObject(data);
            break;
        case 'clientDisconnected':
            // Dispose remote video from the DOM structure.
            var videoElement = document.getElementById('remoteVideo');
            videoElement.pause();
            videoElement.removeAttribute('src'); // Empty source
            videoElement.load();
            location.href = location.origin + '/pages/p2.html';
            break;
        case 'rhysDestoryPerm':
            rhysPermissionToDestroy = data.permissionToDestroy; // Change Rhys's permission. This is a global variable in sketch.js.
            // If Rhys has permission then video will start otherwise it will not in handtrack.js.
            startVideo();

            // Change the style of button element when clicked.
            if (rhysPermissionToDestroy) {
                document.getElementById('waveHand').src = '../images/project 2/waveHand.png';
            } else {
                document.getElementById('waveHand').src = '../images/project 2/doNotWaveHand.png';
            }
            break;
        default:
            break;
    }
}

function errorHandler(error) {
    console.error(error);
}

function toggleAudio() {
    if (audioOn) {
        document.getElementById('micBtn').src = '../images/project 2/micOff.png';
        audioOn = false;
    } else {
        document.getElementById('micBtn').src = '../images/project 2/mic.png';
        audioOn = true;
    }
    // Mute the local audio source. Get the audio track from the local stream.
    localVideoStream.getAudioTracks()[0].enabled = audioOn;
}

function toggleOmaOpaVideo() {
    if (videoOn) {
        if (username == 'Rhys') { renderVideo = false; }
        document.getElementById('videoBtn').src = '../images/project 2/videoOff.png';
        videoOn = false;
    } else {
        if (username == 'Rhys') { renderVideo = true; }
        document.getElementById('videoBtn').src = '../images/project 2/camera.png';
        videoOn = true;
    }
    localVideoStream.getVideoTracks()[0].enabled = videoOn;
}

function toggleRhysVideo() {
    // If the video is off then there is a second div which has a video for handtracking.
    // Start the handtracking again if video is turned back on. This comes from handtrack.js
    if (renderVideo) {
        renderVideo = false;
        document.getElementById('videoBtn').src = '../images/project 2/videoOff.png';
    } else {
        renderVideo = true;
        startVideo();
        document.getElementById('videoBtn').src = '../images/project 2/camera.png';
    }
    localVideoStream.getVideoTracks()[0].enabled = renderVideo;
}

// If the end call button is clicked, it takes you back to p2 main page.
function endCall() {
    location.href = location.origin + '/pages/p2.html';
}