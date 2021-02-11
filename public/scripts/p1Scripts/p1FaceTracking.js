// JavaScript source code for Face constructor.
// This uses the FaceMesh package to get and draw face points.

function Face(capture) {

    this.currX;
    this.currY;
    this.prevX = this.currX;
    this.prevY = this.currY;

    // Using only 1 keypoint which is the bare minimum for better performance.
    this.VTX = [151]; // This is the keypoint for the forehead; // VTX468 = new Array(468).fill(0).map((x, i) => i); = full facemesh 468 points.

    this.faceKeypoint = 151; // Forehead https://github.com/ManuelTS/augmentedFaceMeshIndices/blob/master/Front.jpg
    this.faceKeypointIndex = this.VTX.indexOf(this.faceKeypoint);

    this.MAX_FACES = 1; // Default 10

    this.facemeshModel = null; // This will be loaded with the facemesh model.

    this.videoReady = false;

    this.myFaces = []; // Faces detected in the browser. Currently facemesh only supports single face.

    self = this;

    // Initialize the facemesh model and make sure the video is on.
    this.init = function () {

        tf.setBackend('wasm'); // GPU accelerated WebGL backend for TensorFlow.js, faster CPU execution

        // Load the MediaPipe facemesh model assets.
        facemesh.load().then(function (_model) {
            console.log("Model initialized")
            self.facemeshModel = _model;
        })

        // This is to make sure the capture is loaded before asking facemesh to take a look.
        capture.elt.onloadeddata = function () {
            console.log("Video initialized");
            self.videoReady = true;
        }
    }

    // Draw a face object returned by facemesh.
    this.drawFaces = function (faces, img) {

        if (faces.length > 0) {

            const keypoints = faces[0].scaledMesh;
            var [x, y, z] = keypoints[this.faceKeypointIndex];

            this.prevX = this.currX;
            this.prevY = this.currY;

            // **** The x and y coords are from the video capture which has size 640 x 480 (default for laptops?) ****
            // When i change this size manually its not aligned anymore.
            // So i am just mapping it to the display width and height so its accurate.
            this.currX = map(x, 0, capture.width, 0, width);
            this.currY = map(y, 0, capture.height, 0, height);

            if (this.prevX != undefined && this.prevY != undefined && this.currX != undefined && this.currY != undefined) {
                // Testing 
                //stroke(0);
                //rect(this.currX, this.currY, img.width / 4, img.height / 4);
                image(img, this.currX, this.currY, img.width / 4, img.height / 4);

            }
        }

        // For testing only. Draw a dot for each keypoint and a red dot for the image.
        for (var i = 0; i < faces.length; i++) {
            const keypoints = faces[i].scaledMesh;
            for (var j = 0; j < keypoints.length; j++) {
                const [x, y, z] = keypoints[j];
                var newX = map(x, 0, capture.width, 0, width);
                var newY = map(y, 0, capture.height, 0, height);
                if (this.VTX[j] == this.faceKeypoint) {
                    push();
                    fill(255, 0, 0);
                    circle(newX, newY, 2);
                    pop();

                } else {
                    circle(newX, newY, 2);
                }

            }
        }
    }

    // Reduces the number of keypoints to the desired set 
    // (VTX7, VTX33, VTX68, etc.)
    this.packFace = function (face, set) {
        var ret = {
            scaledMesh: [],
        }
        for (var i = 0; i < set.length; i++) {
            var j = set[i];
            ret.scaledMesh[i] = [
                face.scaledMesh[j][0],
                face.scaledMesh[j][1],
                face.scaledMesh[j][2],
            ]
        }
        return ret;
    }

    this.show = function (img) {
        // Flip the image
        translate(displayWidth, 0);
        scale(-1.0, 1.0);

        // Model and video both loaded
        if (this.facemeshModel && this.videoReady) {
            this.facemeshModel.pipeline.maxFaces = this.MAX_FACES;
            this.facemeshModel.estimateFaces(capture.elt).then(function (_faces) {
                // We're faceling an async promise
                // Best to avoid drawing something here! it might produce weird results due to racing
                self.myFaces = _faces.map(x => self.packFace(x, self.VTX)); // Update the global myFaces object with the detected faces
            })
        }

        // For debugging
        //image(capture, 0, 0, capture.width, capture.height);

        this.drawFaces(this.myFaces, img);
    }
}