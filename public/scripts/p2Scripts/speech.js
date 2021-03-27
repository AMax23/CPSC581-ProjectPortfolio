// JavaScript source code

window.onload = (event) => {
    init();
};

// more documentation available at
// https://github.com/tensorflow/tfjs-models/tree/master/speech-commands

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/B0FR-Z0vc/";

let letterSpoken = 'A';

async function createModel() {
    const checkpointURL = URL + "model.json"; // model topology
    const metadataURL = URL + "metadata.json"; // model metadata

    const recognizer = speechCommands.create(
        "BROWSER_FFT", // fourier transform type, not useful to change
        undefined, // speech commands vocabulary feature, not useful for your models
        checkpointURL,
        metadataURL);

    // check that model and metadata are loaded via HTTPS requests.
    await recognizer.ensureModelLoaded();

    return recognizer;
}

async function init() {
    const recognizer = await createModel();
    const classLabels = recognizer.wordLabels(); // get class labels

    //const labelContainer = document.getElementById("label-container");
    //for (let i = 0; i < classLabels.length; i++) {
    //    labelContainer.appendChild(document.createElement("div"));
    //}

    // listen() takes two arguments:
    // 1. A callback function that is invoked anytime a word is recognized.
    // 2. A configuration object with adjustable fields
    recognizer.listen(result => {
        let scores = result.scores; // probability of prediction for each class
        // render the probability scores per class
        //for (let i = 0; i < classLabels.length; i++) {
        //    const classPrediction = classLabels[i] + ": " + result.scores[i].toFixed(2);
        //    labelContainer.childNodes[i].innerHTML = classPrediction;
        //}

        // Everytime the model evaluates a result it will return the scores array
        // Based on this data we will build a new array with each word and it's corresponding score
        scores = Array.from(scores).map((s, i) => ({ score: s, letter: classLabels[i] }));

        // After that we sort the array by scode descending
        scores.sort((s1, s2) => s2.score - s1.score);

        // The letter with the highest score. Remove background noise.
        letterSpoken = scores[0].letter;// == "Background Noise" ? scores[1].letter : scores[0].letter;

        //console.log(letterSpoken);

    }, {
        includeSpectrogram: true, // in case listen should return result.spectrogram
        probabilityThreshold: 0.75,
        invokeCallbackOnNoiseAndUnknown: true,
        overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
    });

    // Stop the recognition in 5 seconds.
    //setTimeout(() => recognizer.stopListening(), 5000);
}