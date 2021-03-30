// JavaScript source code
/* 
 *  Derived from Aidan Lincoln's Handtrack to leds
 *  Aidan Lincoln aidanlincoln@nyu.edu
 *  ITP/NYU
 *  Handtrack.js victordibia
 *  https://github.com/victordibia/handtrack.js/
 */

// The reason i am not putting this in the same div as the local video is 
const video = document.getElementById("localVideoHandTrack");
const canvas = document.getElementById("myCanvas");

// Turn video on or off
let renderVideo = true;

let videoLoaded = true;
let model = null;
let xCord;
let yCord;
let xCord2;
let yCord2;

const modelParams = {
    flipHorizontal: true,  // flip e.g for video  
    maxNumBoxes: 2,        // maximum number of boxes to detect
    iouThreshold: 0.07,     // ioU threshold for non-max suppression
    scoreThreshold: 0.60,   // confidence threshold for predictions.
}

// Load the model.
handTrack.load(modelParams).then(lmodel => {
    // Detect objects in the image.
    model = lmodel;
    startVideo();
});

function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        if (status) {
            videoLoaded = true;
            runDetection();
        }
    });
}

function runDetection() {
    model.detect(video).then(predictions => {
        if (predictions[0]) {
            let bboxX = predictions[0].bbox[0] + predictions[0].bbox[2] / 2;
            let bboxY = predictions[0].bbox[1] + predictions[0].bbox[3] / 2;
            xCord = bboxX;
            yCord = bboxY;
            if (predictions[1]) {
                let bboxX2 = predictions[1].bbox[0] + predictions[1].bbox[2] / 2;
                let bboxY2 = predictions[1].bbox[1] + predictions[1].bbox[3] / 2;
                xCord2 = bboxX2;
                yCord2 = bboxY2;
            }
            else {
                xCord2 = null;
                yCord2 = null;
            }
        }
        else {
            xCord = null;
            yCord = null;
            xCord2 = null;
            yCord2 = null;
        }
        if (videoLoaded && renderVideo && rhysPermissionToDestroy) {
            requestAnimationFrame(runDetection);
        }
    });
}