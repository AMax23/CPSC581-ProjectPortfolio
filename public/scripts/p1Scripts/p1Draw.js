// JavaScript source code


////////////////////////// BASIC P5 SET UP  ////////////////////////////////////////
function setup() {
    createCanvas(600, 400);
    background(255);
    mic = new p5.AudioIn();
    mic.start();
}

function draw() {
    touchStarted();
    startSketch();
}
/////////////////////////////////////////////////////////////////////////////////////////


function startSketch() {
    var volumeLevel = mic.getLevel(); // Read the amplitude (volume level).
    var soundLevel = volumeLevel * 300; // This volume level is between 0–1 which is too small.

    console.log('sound level: ' + soundLevel);
}

// This function is to fix the error on the Chrome browser:
// "The AudioContext was not allowed to start. It must be resumed(or created) after a user gesture on the page."
function touchStarted() {
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }
}