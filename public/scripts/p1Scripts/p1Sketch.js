// JavaScript source code

var mic;
//var capture;
var cTracker;
var positions;
var userLine;

var face;

//// === full facemesh 468 points ===
//var VTX = VTX468;

//// select the right triangulation based on vertices
//var TRI = VTX == VTX7 ? TRI7 : (VTX == VTX33 ? TRI33 : (VTX == VTX68 ? TRI68 : TRI468))

//var MAX_FACES = 1; //default 10

////var facemeshModel = null; // this will be loaded with the facemesh model
////// WARNING: do NOT call it 'model', because p5 already has something called 'model'

//var videoDataLoaded = false; // is webcam capture ready?

//var statusText = "Loading facemesh model...";

//var myFaces = []; // faces detected in this browser
//// currently facemesh only supports single face, so this will be either empty or singleton

//var capture; // webcam capture, managed by p5.js


//// Load the MediaPipe facemesh model assets.
//facemesh.load().then(function (_model) {
//    console.log("model initialized.")
//    statusText = "Model loaded."
//    facemeshModel = _model;
//})

////////////////////////// BASIC P5 SET UP ////////////////////////////////////////
function setup() {
    var canvasWidth = displayWidth;
    var canvasHeight = displayHeight;
    let cnv = createCanvas(canvasWidth, canvasHeight);
    cnv.touchStarted(userStartAudio);

    background(0); // Black

    // Set up video
    capture = createCapture(VIDEO);
    capture.size(canvasWidth, canvasHeight);

    //// this is to make sure the capture is loaded before asking facemesh to take a look
    //// otherwise facemesh will be very unhappy
    //capture.elt.onloadeddata = function () {
    //    console.log("video initialized");
    //    videoDataLoaded = true;
    //}


    face = new Face(capture);
    face.init();

    capture.hide();


    ////////// Set up face tracker
    ////////cTracker = new clm.tracker();
    ////////cTracker.init();
    ////////cTracker.start(capture.elt);

    ////////face = new Face();

    //////////// Create and start an Audio input
    //////////mic = new p5.AudioIn();
    //////////mic.start();

    ////////// Initialize mic and start it.
    ////////mic = new Microphone();
    ////////mic.init();

    ////////// The line will start from the center of the canvas.
    ////////var lineX = canvasWidth / 2;
    ////////var lineY = canvasHeight / 2;
    ////////var prevLineX = lineX;
    ////////var prevLineY = lineY;
    ////////// Create new instance of line.
    ////////userLine = new Line(lineX, lineY, prevLineX, prevLineY);
}

function draw() {
    //translate(displayWidth, 0);
    //scale(-1.0, 1.0);
    //videoStuff();

    //drawLine();

    //drawface();

    face.show();

    //console.log(a.volume);

    //print(mic.getVolumeLevel() + ', ' + mic.getFreqBin());
}
///////////////////////////////////////////////////////////////////////////////////

function drawface() {
    // Flip the canvas so that we get a mirror image
    translate(displayWidth, 0);
    scale(-1.0, 1.0);
    //image(capture, 0, 0, width, height);
    //background(220);
    face.show(cTracker);
}

function drawLine() {
    var volumeLevel = mic.getVolumeLevel(); // Read the amplitude (volume level).
    //var soundLevel = volumeLevel * 100; // This volume level is between 0–1 which is too small.
    var soundLevel = map(volumeLevel, 0, 60, 0, 20); // Trial and error gave me these numbers.
    //print(volumeLevel, soundLevel);
    userLine.show();
    userLine.move(soundLevel);
}

//// draw a face object returned by facemesh
//function drawFaces(faces, filled) {

//    for (var i = 0; i < faces.length; i++) {
//        const keypoints = faces[i].scaledMesh;
//        //console.log('keypoints = ' + keypoints.length);
//        for (var j = 0; j < keypoints.length; j++) {
//            const [x, y, z] = keypoints[j];
//            var newX = map(x, 0, 640, 0, width);
//            var newY = map(y, 0, 480, 0, height);
//            //console.log(x);
//            circle(newX, newY, 2);
//            //push();
//            ////strokeWeight(3);
//            ////text(j, x, y);
//            //pop()
//        }

//        //for (var j = 0; j < TRI.length; j += 3) {
//        //    var a = keypoints[TRI[j]];
//        //    var b = keypoints[TRI[j + 1]];
//        //    var c = keypoints[TRI[j + 2]];

//        //    if (filled) {
//        //        var d = [(a[0] + b[0] + c[0]) / 6, (a[1] + b[1] + c[1]) / 6];
//        //        var color = get(...d);
//        //        fill(color);
//        //        noStroke();
//        //    }
//        //    triangle(
//        //        a[0], a[1],
//        //        b[0], b[1],
//        //        c[0], c[1],
//        //    )
//        //}
//    }
//}

//// reduces the number of keypoints to the desired set 
//// (VTX7, VTX33, VTX68, etc.)
//function packFace(face, set) {
//    var ret = {
//        scaledMesh: [],
//    }
//    for (var i = 0; i < set.length; i++) {
//        var j = set[i];
//        ret.scaledMesh[i] = [
//            face.scaledMesh[j][0],
//            face.scaledMesh[j][1],
//            face.scaledMesh[j][2],
//        ]
//    }
//    return ret;
//}

//function aaa() {
//    //translate(displayWidth, 0);
//    //scale(-1.0, 1.0);
//    strokeJoin(ROUND); //otherwise super gnarly

//    if (facemeshModel && videoDataLoaded) { // model and video both loaded, 
//        facemeshModel.pipeline.maxFaces = MAX_FACES;
//        facemeshModel.estimateFaces(capture.elt).then(function (_faces) {
//            // we're faceling an async promise
//            // best to avoid drawing something here! it might produce weird results due to racing
//            myFaces = _faces.map(x => packFace(x, VTX)); // update the global myFaces object with the detected faces

//            // console.log(myFaces);
//            //if (!myFaces.length) {
//            //    // haven't found any faces
//            //    statusText = "Show some faces!"
//            //} else {
//            //    // display the confidence, to 3 decimal places
//            //    statusText = "Confidence: " + (Math.round(_faces[0].faceInViewConfidence * 1000) / 1000);

//            //}

//        })
//    }

//    //background(200);

//    // first draw the debug video and annotations
//    //push();
//    //scale(3); // downscale the webcam capture before drawing, so it doesn't take up too much screen sapce
//    //console.log('Caputre size = ' + capture.width + ', ' + capture.height);
//    image(capture, 0, 0, capture.width, capture.height);
//    //noFill();
//    //stroke(0, 255, 0);
//    //drawFaces(myFaces); // draw my face skeleton
//    //pop();


//    // now draw all the other users' faces (& drawings) from the server
//    //push()

//    //scale(2);
//    //strokeWeight(3);
//    //noFill();
//    fill(0, 255, 0);
//    drawFaces(myFaces);
//    //pop();

//    //push();
//    //fill(255, 0, 0);
//    //text(statusText, 2, 60);
//    //pop();
//}