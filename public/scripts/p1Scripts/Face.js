// JavaScript source code

//const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

// Grab elements, create settings, etc.
var video = document.getElementsByClassName('input_video')[0];

var cameraFrame;


function show(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    //canvasCtx.drawImage(
    //    results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
            drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION,
                { color: '#C0C0C070', lineWidth: 1 });
            drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, { color: '#FF3030' });
            drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, { color: '#FF3030' });
            drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, { color: '#30FF30' });
            drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, { color: '#30FF30' });
            drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, { color: '#E0E0E0' });
            drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, { color: 'purple' });
            console.log(landmarks[10].x + ', ' + landmarks[10].y);
        }
    }
    canvasCtx.restore();
}

const faceMesh = new FaceMesh({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    }
});

faceMesh.setOptions({
    maxNumFaces: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

faceMesh.onResults(show);

//const camera = new Camera(videoElement, {
//    onFrame: async () => {
//        console.log('okokok');
//        await faceMesh.send({ image: videoElement });
//    },
//    width: 1280,
//    height: 720
//});
//camera.start();

// Get access to the camera!
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
        //video.src = window.URL.createObjectURL(stream);
        console.log('ooohhhh');
        video.srcObject = stream;
        aaa();
    });

}
video.play();

async function aaa() {
    return new Promise((resolve, reject) => {
        console.log('in promise');
        bbb();
    });
}


async function bbb() {
    var a = async() => {
        faceMesh.send({ image: video });
    }
    setInterval(a, 30);
}

