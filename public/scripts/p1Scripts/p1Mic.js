
function Microphone() {

    this.mic;
    this.volume = 0;
    this.FFT_SIZE = 1024;
    this.constraints = { audio: true };
    this.volume;
    this.freqBin;

    var self = this;
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = self.audioContext.createAnalyser();


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
            document.getElementById('clear').onclick = function () {
                self.audioContext.resume();
            }
            self.beginRecording();
        }

        function error() {
            console.log('Error: ' + arguments);
        }

    }

    this.beginRecording = function () {
        self.analyser.fftSize = self.FFT_SIZE; // Power of 2, between 32 and max unsigned integer
        var bufferLength = self.analyser.fftSize;

        var freqBinDataArray = new Uint8Array(bufferLength);

        var checkAudio = function () {
            self.analyser.getByteFrequencyData(freqBinDataArray);

            console.log('Volume: ' + self.getRMS(freqBinDataArray));
            console.log('Freq Bin: ' + self.getIndexOfMax(freqBinDataArray));
            //console.log(freqBinDataArray);
        }

        setInterval(checkAudio, 64);
    }

    this.getRMS = function (spectrum) {
        var rms = 0;
        for (var i = 0; i < spectrum.length; i++) {
            rms += spectrum[i] * spectrum[i];
        }
        rms /= spectrum.length;
        rms = Math.sqrt(rms);
        self.volume = rms;
        return rms;
    }

    this.getIndexOfMax = function (array) {
        return array.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
    }

    //return self.volume;

};