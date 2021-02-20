// JavaScript source code

function Hammer(x, y) {
    this.x = x;
    this.y = y;
    this.maxSpeed = 20;
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

        //console.log('x = ' + rotationY + ' Y = ' + rotationX);

        // Device tilt to move the hammer.
        this.x += map(rotationY, -10, 10, -this.maxSpeed, this.maxSpeed);
        this.y += map(rotationX, 20, 35, -this.maxSpeed, this.maxSpeed);

        // P5 system variable deviceOrientation returns the orientation of the device.
        // The x and y will need to be swapped if the device is in landscape mode.
        if (deviceOrientation == 'landscape') {
            let temp = this.y;
            this.y = this.x;
            this.x = temp;
        }

        //////////////////////////////////
        // temp mouse for testing on laptop.
        //this.x = mouseX;
        //this.y = mouseY;
        //////////////////////////////////

        // Make sure that the image stays inside the canvas.
        this.x = constrain(this.x, img.width / 7, width);
        this.y = constrain(this.y, 10, height - img.height / 7);

        //rect(this.x - img.width / 5, this.y, img.width / 5, img.height / 5);
        image(img, this.x - img.width / 7, this.y, img.width / 7, img.height / 7); // Make the image smaller for mobile devices
    }

    // This is for setting the bounds of the hammer everytime it moves it will be different.
    // These numbers came from trial and error :)
    this.setBounds = function () {
        //Initially for a bit the x and y might be undefined because the camera is still initializing.
        if (this.x != undefined) {
            push();
            this.hammerBounds.bottomLeftX = this.x - 70;
            this.hammerBounds.bottomLeftY = this.y + 40;
            this.hammerBounds.topLeftX = this.x - 65;
            this.hammerBounds.topLeftY = this.y + 10;
            this.hammerBounds.topRightX = this.x - 10;
            this.hammerBounds.topRightY = this.y + 30;
            this.hammerBounds.bottomRightX = this.x - 20;
            this.hammerBounds.bottomRightY = this.y + 60;

            // Testing bounds. Draw and see.
            //fill(255, 255, 0);
            //ellipse(this.hammerBounds.bottomLeftX, this.hammerBounds.bottomLeftY, 10, 10);
            //fill(255, 0, 0);
            //ellipse(this.hammerBounds.topLeftX, this.hammerBounds.topLeftY, 10, 10);
            //fill(0, 255, 0);
            //ellipse(this.hammerBounds.topRightX, this.hammerBounds.topRightY, 10, 10);
            //fill(255, 0, 255);
            //ellipse(this.hammerBounds.bottomRightX, this.hammerBounds.bottomRightY, 10, 10);

            pop();
        }
    }

    this.requestOrientationPermission = function () {
        // This is needed for IOS devices. Permission to access device orientation.
        // https://krpano.com/forum/wbb/index.php?page=Thread&threadID=17044
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            document.body.addEventListener('click', function () {
                DeviceOrientationEvent.requestPermission()
                    .then(function () {
                        console.log('DeviceOrientationEvent, DeviceMotionEvent enabled');
                    })
                    .catch(function (error) {
                        alert('DeviceOrientationEvent, DeviceMotionEvent not enabled', error);
                    })
            }, { once: true });
            return;
        }
    }
}