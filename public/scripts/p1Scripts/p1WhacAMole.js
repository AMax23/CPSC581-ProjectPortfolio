

var capture; // VIdeo managed by P5
var face; // For face tracking

var hammerImg;
var hammerHitImg;


////////////////////////// BASIC P5 SET UP ////////////////////////////////////////
function setup() {
    var canvasWidth = displayWidth;
    var canvasHeight = displayHeight;
    let cnv = createCanvas(canvasWidth, canvasHeight);
    cnv.touchStarted(userStartAudio);

    //background(0); // Black

    hammerImg = loadImage('../images/project 1/thorsHammer.png'); // Load the image
    hammerHitImg = loadImage('../images/project 1/thorsHammerHit.png'); // Load the image

    // Set up video
    capture = createCapture(VIDEO);
    capture.size(canvasWidth, canvasHeight);

    capture.hide();


    //// this is to make sure the capture is loaded before asking facemesh to take a look
    //// otherwise facemesh will be very unhappy
    //capture.elt.onloadeddata = function () {
    //    console.log("video initialized");
    //    videoDataLoaded = true;
    //}


    face = new Face(capture);
    face.init();



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

    //image(malletImg, 10, 10, malletImg.width / 4, malletImg.height / 4);

    background(0);

    face.show(hammerImg);


}
///////////////////////////////////////////////////////////////////////////////////