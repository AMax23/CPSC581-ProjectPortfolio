
function Face(capture) {

    this.currX;
    this.currY;
    this.prevX = this.currX;
    this.prevY = this.currY;
    this.userColour = document.getElementById('color'); // Whatever the user selects from the colour choices.
    this.lineWeight = document.getElementById('weight');

    // === full facemesh 468 points ===
    this.VTX = VTX468;

    // select the right triangulation based on vertices
    //var TRI = VTX == VTX7 ? TRI7 : (VTX == VTX33 ? TRI33 : (VTX == VTX68 ? TRI68 : TRI468))

    this.MAX_FACES = 1; //default 10

    this.facemeshModel = null; // this will be loaded with the facemesh model
    // WARNING: do NOT call it 'model', because p5 already has something called 'model'

    this.videoDataLoaded = false; // is webcam capture ready?

    //var statusText = "Loading facemesh model...";

    this.myFaces = []; // faces detected in this browser
    // currently facemesh only supports single face, so this will be either empty or singleton

    self = this;

    this.init = function () {

        // Load the MediaPipe facemesh model assets.
        facemesh.load().then(function (_model) {
            console.log("model initialized.")
            statusText = "Model loaded."
            self.facemeshModel = _model;
        })

        // this is to make sure the capture is loaded before asking facemesh to take a look
        // otherwise facemesh will be very unhappy
        capture.elt.onloadeddata = function () {
            console.log("video initialized");
            self.videoDataLoaded = true;
        }
    }

    // Draw a face object returned by facemesh
    this.drawFaces = function (faces, hammerImg) {

        var faceKeypoint = 108; // Forehead

        if (faces.length > 0) {

            const keypoints = faces[0].scaledMesh;
            var [x, y, z] = keypoints[faceKeypoint];

            this.prevX = this.currX;
            this.prevY = this.currY;

            // The x and y coords are from the video capture which has size 640 x 480 (default for laptops)
            // When i change this size manually its not aligned anymore.
            // So i am just mapping it to the display width and height so its accurate.
            this.currX = map(x, 0, 640, 0, width);
            this.currY = map(y, 0, 480, 0, height);
            //console.log(x);
            //circle(this.currX, this.currY, 10);
            //fill(255, 0, 0);
            //strokeWeight(10);
            //line(100, 100, 200, 400);

            //console.log('line points = ' + this.prevX + ', ' + this.prevY + ', ' + this.currX + ', ' + this.currY);

            if (this.prevX != undefined && this.prevY != undefined && this.currX != undefined && this.currY != undefined) {
                //stroke(255);//this.userColour.value);
                ////stroke(255);
                //strokeWeight(2);//this.lineWeight.value);
                //line(this.prevX, this.prevY, this.currX, this.currY);
                //circle(this.currX, this.currY, 2);
                image(hammerImg, this.currX, this.currY, hammerImg.width / 4, hammerImg.height / 4);

            }

            //rect(10, 100, 5, 5);    
        }

            for (var i = 0; i < faces.length; i++) {
                //console.log(faces[].scaledMesh[10]);
                const keypoints = faces[i].scaledMesh;
                //console.log('keypoints = ' + keypoints.length);
                for (var j = 0; j < keypoints.length; j++) {
                    const [x, y, z] = keypoints[j];
                    var newX = map(x, 0, 640, 0, width);
                    var newY = map(y, 0, 480, 0, height);
                    //console.log(x);
                    if (j == faceKeypoint) {
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

    // reduces the number of keypoints to the desired set 
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

    this.show = function (mallet) {
        // Flip the image
        translate(displayWidth, 0);
        scale(-1.0, 1.0);

        //console.log(displayWidth);

        strokeJoin(ROUND); //otherwise super gnarly

        if (this.facemeshModel && this.videoDataLoaded) { // model and video both loaded, 
            this.facemeshModel.pipeline.maxFaces = this.MAX_FACES;
            this.facemeshModel.estimateFaces(capture.elt).then(function (_faces) {
                // we're faceling an async promise
                // best to avoid drawing something here! it might produce weird results due to racing
                self.myFaces = _faces.map(x => self.packFace(x, self.VTX)); // update the global myFaces object with the detected faces
                //console.log('Ok ay');
            })
        }

        //background(0);
        //image(capture, 0, 0, capture.width, capture.height);

        //fill(255, 0, 0);
        this.drawFaces(this.myFaces, mallet);
        //rect(150, 100, 20, 200);
        //stroke(255);
        //line(100, 100, 200, 400);



        //if (this.myFaces.length > 0) {

        //    const keypoints = this.myFaces[0].scaledMesh;
        //    var [x, y, z] = keypoints[4];

        //    this.prevX = this.currX;
        //    this.prevY = this.currY;

        //    this.currX = map(x, 0, 640, 0, width);
        //    this.currY = map(y, 0, 480, 0, height);
        //    //console.log(x);
        //    //circle(this.currX, this.currY, 10);
        //    //fill(255, 0, 0);
        //    //strokeWeight(10);
        //    line(100, 100, 200, 400);

        //    //console.log('line points = ' + this.prevX + ', ' + this.prevY + ', ' + this.currX + ', ' + this.currY);

        //    //if (this.prevX != undefined && this.prevY != undefined && this.currX != undefined && this.currY != undefined) {
        //    //    noStroke();
        //    //    line(this.prevX, this.prevY, this.currX, this.currY);
        //    //}

        //}
    }
}