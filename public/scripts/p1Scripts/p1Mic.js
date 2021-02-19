// JavaScript source code for the Mic constructor.

function Microphone() {

    this.volume = 0;
    this.freqBin = 0;
    this.FFT_SIZE = 1024; // Power of 2, between 32 and max unsigned integer
    this.constraints = { audio: true };
    this.whackSound = new Audio('../sounds/project 1/whackSound.wav');

    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();

    var self = this;

    //window.addEventListener('load', init, false);

    this.init = function () {
        try {
            this.startMic();
        }
        catch (e) {
            console.error(e);
            alert('Web Audio API is not supported in this browser');
        }
    }

    this.startMic = function () {

        navigator.getUserMedia(self.constraints, processSound, error);

        function processSound(stream) {
            self.mic = self.audioContext.createMediaStreamSource(stream);
            self.mic.connect(self.analyser);
            //document.getElementById('body').onclick = function () {
            //    self.audioContext.resume();
            //    console.log('Mic started');
            //    //document.getElementById('startBtn').style.display = 'none';
            //}
            self.beginRecording();
        }

        function error() {
            console.log('Error: ' + arguments);
        }
    }

    this.beginRecording = function () {
        // The AudioContext was not allowed to start. It must be resumed (or created) after a user gesture on the page.
        // This is to fix the error on Chrome browsers.
        self.audioContext.resume();
        self.analyser.fftSize = self.FFT_SIZE;
        var bufferLength = self.analyser.fftSize;

        var freqBinDataArray = new Uint8Array(bufferLength);

        var checkAudio = function () {
            self.analyser.getByteFrequencyData(freqBinDataArray);
            self.volume = self.getRMS(freqBinDataArray);
            self.freqBin = self.getIndexOfMax(freqBinDataArray);
        }

        setInterval(checkAudio, 30); // Match with the FPS for the canvas update otherwise there is a lag.
    }

    this.getRMS = function (spectrum) {
        var rms = 0;
        for (var i = 0; i < spectrum.length; i++) {
            rms += spectrum[i] * spectrum[i];
        }
        rms /= spectrum.length;
        rms = Math.sqrt(rms);
        return rms;
    }

    this.getIndexOfMax = function (array) {
        return array.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
    }

    this.getVolumeLevel = function () {
        return self.volume;
    }

    this.getFreqBin = function () {
        return self.freqBin;
    }
};