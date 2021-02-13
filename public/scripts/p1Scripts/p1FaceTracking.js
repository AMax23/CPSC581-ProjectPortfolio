// JavaScript source code for Face constructor.
// This uses the FaceMesh package to get and draw face points.

function Face(capture) {

    this.currX;
    this.currY;

    this.hammerBounds = {
        'topLeftX': 0,
        'topLeftY': 0,
        'topRightX': 0,
        'topRightY': 0,
        'bottomLeftX': 0,
        'bottomLeftY': 0,
        'bottomRightX': 0,
        'bottomRightY': 0
    };

    // Using only 1 keypoint which is the bare minimum for better performance.
    this.VTX = [10]; // This is some point on the face. // VTX468 = new Array(468).fill(0).map((x, i) => i); = full facemesh 468 points.

    this.faceKeypoint = 10; // https://github.com/ManuelTS/augmentedFaceMeshIndices/blob/master/Front.jpg
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

            // **** The x and y coords are from the video capture which has size 640 x 480 (default for laptops?) ****
            // When i change this size manually its not aligned anymore.
            // So i am just mapping it to the display width and height so its accurate.
            this.currX = map(x, 0, capture.width, 0, width);
            this.currY = map(y, 0, capture.height, 0, height);

            //Initially for a bit the x and y might be undefined because the camera is still initializing.
            if (this.currX != undefined) {
                push();
                fill(255, 255, 0);
                this.hammerBounds.bottomRightX = this.currX - 70;
                this.hammerBounds.bottomRightY = this.currY + 40;
                ellipse(this.hammerBounds.bottomRightX, this.hammerBounds.bottomRightY, 10, 10);
                fill(255, 0, 0);
                this.hammerBounds.bottomLeftX = this.currX - 20;
                this.hammerBounds.bottomLeftY = this.currY + 60;
                ellipse(this.hammerBounds.bottomLeftX, this.hammerBounds.bottomLeftY, 10, 10);
                fill(0, 255, 0);
                this.hammerBounds.topLeftX = this.currX - 10;
                this.hammerBounds.topLeftY = this.currY + 30;
                ellipse(this.hammerBounds.topLeftX, this.hammerBounds.topLeftY, 10, 10);
                fill(255, 0, 255);
                this.hammerBounds.topRightX = this.currX - 70;
                this.hammerBounds.topRightY = this.currY + 10;
                ellipse(this.hammerBounds.topRightX, this.hammerBounds.topRightY, 10, 10);
                pop();
            }
            ///////////////////////
            // Testing
            //stroke(0);
            //rect(this.currX - img.width / 7, this.currY, img.width / 7, img.height / 7);
            //push();
            //fill(255, 0, 0);
            //ellipse(this.currX , this.currY, 10, 10);
            //console.log('x and y in face = ' + this.currX + ', ' + this.currY);
            //pop();
            ///////////////////////
            image(img, this.currX - img.width / 7, this.currY, img.width / 7, img.height / 7); // Make the image smaller for mobile devices
        }

        // For testing only. Draw a dot for each keypoint and a red dot for the image.
        //for (var i = 0; i < faces.length; i++) {
        //    const keypoints = faces[i].scaledMesh;
        //    for (var j = 0; j < keypoints.length; j++) {
        //        const [x, y, z] = keypoints[j];
        //        var newX = map(x, 0, capture.width, 0, width);
        //        var newY = map(y, 0, capture.height, 0, height);
        //        if (this.VTX[j] == this.faceKeypoint) {
        //            push();
        //            fill(255, 0, 0);
        //            circle(newX, newY, 20);
        //            pop();
        //        } else {
        //            circle(newX, newY, 2);
        //        }
        //    }
        //}
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
        push();
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
        pop();
    }

    this.getPos = function () {
        return {
            'x': this.currX,
            'y': this.currY
        }
    }
}