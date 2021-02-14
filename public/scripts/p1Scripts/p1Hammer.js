// JavaScript source code

function Hammer(x, y) {
    this.x = x;
    this.y = y;
    this.maxSpeed = 50;
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

    this.show = function (img) {

        this.setBounds();

        this.x += map(rotationY, -180, 180, -this.maxSpeed, this.maxSpeed);
        this.y += map(rotationX, -180, 180, -this.maxSpeed, this.maxSpeed);

        //////////////////////////////////
        //// temp mouse for testing on laptop.
        //this.x = mouseX;
        //this.y = mouseY;
        //////////////////////////////////

        // Make sure that the image stays inside the canvas.
        this.x = constrain(this.x, 100, width - 10);
        this.y = constrain(this.y, 10, height - 100);

        //rect(this.x - img.width / 7, this.y, img.width / 7, img.height / 7);
        image(img, this.x - img.width / 7, this.y, img.width / 7, img.height / 7); // Make the image smaller for mobile devices
    }

    // This is for setting the bounds of the hammer everytime it moves it will be different.
    // These numbers came from trial and error :)
    this.setBounds = function () {
        //Initially for a bit the x and y might be undefined because the camera is still initializing.
        if (this.x != undefined) {
            push();
            //fill(255, 255, 0);
            this.hammerBounds.bottomLeftX = this.x - 70;
            this.hammerBounds.bottomLeftY = this.y + 40;
            //ellipse(this.hammerBounds.bottomLeftX, this.hammerBounds.bottomLeftY, 10, 10);
            //fill(255, 0, 0);
            this.hammerBounds.topLeftX = this.x - 65;
            this.hammerBounds.topLeftY = this.y + 10;
            //ellipse(this.hammerBounds.topLeftX, this.hammerBounds.topLeftY, 10, 10);
            //fill(0, 255, 0);
            this.hammerBounds.topRightX = this.x - 10;
            this.hammerBounds.topRightY = this.y + 30;
            //ellipse(this.hammerBounds.topRightX, this.hammerBounds.topRightY, 10, 10);
            //fill(255, 0, 255);
            this.hammerBounds.bottomRightX = this.x - 20;
            this.hammerBounds.bottomRightY = this.y + 60;
            //ellipse(this.hammerBounds.bottomRightX, this.hammerBounds.bottomRightY, 10, 10);
            pop();
        }
    }

}
