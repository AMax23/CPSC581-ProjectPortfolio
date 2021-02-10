// JavaScript source code

function Face() {
    this.positions;
    this.currX;
    this.currY;
    this.prevX = this.currX;
    this.prevY = this.currY;
    this.nose;

    this.show = function (cTracker) {

        // Positions of the tracked facial features as a 2D array
        this.positions = cTracker.getCurrentPosition();

        // Iterate through all the positions and draw little circles on them.
        if (this.positions) {
            //this.positions.forEach(pos => {
            //    fill(255, 0, 0);
            //    noStroke();
            //    circle(pos[0], pos[1], 3);
            //});

            //console.log(this.positions);

            // Eye points from clmtrackr: https://github.com/auduno/clmtrackr
            //const leftEye = {
            //    outline: [23, 63, 24, 64, 25, 65, 26, 66].forEach(pos => {
            //        this.getPoint(pos);
            //    }),
            //    //map(this.getPoint),
            //    center: this.getPoint(27),
            //    top: this.getPoint(24),
            //    bottom: this.getPoint(26)
            //};

            //const rightEye = {
            //    outline: [28, 67, 29, 68, 30, 69, 31, 70].forEach(pos => {
            //        this.getPoint(pos);
            //    }),
            //    //map(this.getPoint),
            //    center: this.getPoint(32),
            //    top: this.getPoint(29),
            //    bottom: this.getPoint(31)
            //};

            this.nose = {
                center: this.getPoint(62)
            };



            this.drawNose(this.nose);

            //const irisColor = color(255);
            //this.drawNose(leftEye, irisColor);
            //const irisColor2 = color(100);

            //this.drawNose(rightEye, irisColor2);
            //console.log('done drawing');


            //const eye1 = createVector(positions[27][0], positions[27][1]);
            //const eye2 = createVector(positions[23][0], positions[23][1]);

            //console.log('eye distance = ' + eye1.sub(eye2).mag());
        } else {
            console.log('not ready');
        }
    }

    this.getPoint = function (index) {
        return createVector(this.positions[index][0], this.positions[index][1]);
    }

    this.drawNose = function (nose) {

        console.log('drawing');

        this.prevX = this.currX;
        this.prevY = this.currY;

        this.currX = nose.center.x;
        this.currY = nose.center.y;

        //background(0);
        //noFill();
        //stroke(255, 0.4);
        ////drawNoseOutline(eye);

        //const irisRadius = min(eye.center.dist(eye.top), eye.center.dist(eye.bottom));
        //const irisSize = irisRadius * 2;
        //noStroke();
        //fill(irisColor);
        //ellipse(eye.center.x, eye.center.y, irisSize, irisSize);

        //const pupilSize = irisSize / 3;
        //fill(0, 0.6);
        //ellipse(eye.center.x, eye.center.y, pupilSize, pupilSize);
        //fill(255);
        ////ellipse(nose.center.x, nose.center.y, 2, 2);

        stroke(255);
        //stroke(255);
        strokeWeight(2);
        line(this.prevX, this.prevY, this.currX, this.currY)

    }
}