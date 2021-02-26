// JavaScript source code for the Mic constructor.

function Microphone() {

    this.volume = 0;
    this.freqBin = 0;
    this.FFT_SIZE = 1024; // Power of 2, between 32 and max unsigned integer
    this.constraints = { audio: true };
    this.whackSound = new Audio('../sounds/project 1/whackSound.wav');
    this.bombSound = new Audio('../sounds/project 1/bombSound.wav');
    this.gameMusic = new Audio('../sounds/project 1/moonBaseSound.mp3');
    this.audioPermission = false;

    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();

    var self = this;

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
        navigator.mediaDevices.getUserMedia(self.constraints)
            .then(function (stream) {
                self.mic = self.audioContext.createMediaStreamSource(stream);
                self.mic.connect(self.analyser);
                //self.analyser.connect(self.audioContext.destination); // Output mic input to device speakers. Testing.
                // Needed to activate sound on mobile devices the first time (especially ios).
                // User clicks somewhere on the page (probably the start button and then play a sound)
                document.getElementById('body').onclick = function () {
                    if (!self.audioPermission) {
                        self.audioPermission = true;
                        self.whackSound.play();
                        self.whackSound.currentTime = 0;
                        // Play the bomb sound the first time user clicks.
                        // This is just so the bomb sound works in game.
                        self.bombSound.volume = 0;
                        self.bombSound.play();
                        self.bombSound.currentTime = 0;
                    }
                }
                self.beginRecording();
            })
            //.catch(function (err) {
            //    console.log('Error: ' + err);
            //});
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

        setInterval(checkAudio, 60); // Match with the FPS for the canvas update otherwise there is a lag.
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