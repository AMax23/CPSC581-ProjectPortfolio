// P5 JavaScript source code for the main sketch.

if (!window.location.href.toString().includes("https://")) { alert(`You will need "https://" to view this.`) }

var capture; // Video managed by P5
var face; // For face tracking

var hammerImg;
var hammerHitImg;

var mic;
var volumeLevel;


////////////////////////// BASIC P5 SET UP ////////////////////////////////////////
function setup() {
    var canvasWidth = displayWidth;
    var canvasHeight = displayHeight;
    let cnv = createCanvas(canvasWidth, canvasHeight);
    cnv.id('gameCanvas');
    cnv.touchStarted(userStartAudio);

    //background(0); // Black

    hammerImg = loadImage('../images/project 1/thorsHammer.png'); // Load the image
    hammerHitImg = loadImage('../images/project 1/thorsHammerHit.png'); // Load the image

    // Set up video
    capture = createCapture(VIDEO);
    //capture.size(canvasWidth, canvasHeight);
    capture.hide();

    // Initialize face tracker.
    face = new Face(capture);
    face.init();

    // Initialize mic and start it.
    mic = new Microphone();
    mic.init();
}

function draw() {
    background(0); // Black
    hammer();
}
///////////////////////////////////////////////////////////////////////////////////

function hammer() {
    var volumeThreshold = 15;
    volumeLevel = mic.getVolumeLevel(); // Read the amplitude (volume level).
    //console.log('volume level = ' + volumeLevel);

    if (volumeLevel > volumeThreshold) {
        face.show(hammerHitImg);
    } else {
        face.show(hammerImg);
    }
}

//// This function fires on every resize of the browser window.
//function windowResized() {
//    resizeCanvas(windowWidth, windowHeight);
//}