// JavaScript source code. Function constructor for Moles.

function Mole(posX, posY, img) {

    this.x = posX;
    this.y = posY;
    this.moleBounds = {
        'topLeftX': 0,
        'topLeftY': 0,
        'topRightX': 0,
        'topRightY': 0,
        'bottomLeftX': 0,
        'bottomLeftY': 0,
        'bottomRightX': 0,
        'bottomRightY': 0
    };
    this.out = false;
    this.active = false;
    this.img = img;
    this.bombImg = bombImg;
    this.speed = 10;
    this.hit = false;
    this.extraCanvas = createGraphics(100, 100); // This size is from trial and error to see what offset works best.
    this.bound = 50; // The point at which the mole is fully out or all in.
    this.hideY = this.bound;
    this.imageOffsetY = 50;
    this.imageOffsetX = 15;
    this.canvasOffsetY = 50;
    this.moleOffsetX = 0;
    this.moleOffsetY = 0;
    this.moleSizeDivider = 9; // How much to divide the image width and height by.
    this.moleSize = 'small'; // Either big or small mole.

    this.show = function (whatToShow, moleSize) {
        this.moleSize = moleSize;
        // Depending on the mole size, the image placement changes.
        // This only applies to moles so if it is a bomb the third if will override the values back to 0.
        if (moleSize == 'big') {
            this.moleOffsetX = -2;
            this.moleOffsetY = -32;
            this.moleSizeDivider = 5;
            this.bound = 85; // The point at which the large mole is fully hidden.
        } else if (moleSize == 'small') {
            this.moleOffsetX = 15;
            this.moleOffsetY = 0;
            this.moleSizeDivider = 9;
            this.bound = 50; // The point at which the small mole is fully hidden.
        }

        // 0 = Mole, 1 = bomb
        // I didn't wanna create a new class for bombs so im reusing this Mole one.
        // The images have different offsets so now i need to do this crazy thing.
        if (whatToShow == 1) {
            this.bound = 60; // The point at which the bomb is fully hidden.
            this.imageOffsetY = 35;
            this.canvasOffsetY = 50;
            this.imageOffsetX = 15;
            // This only applies to moles. Set values back to default.
            this.moleOffsetX = 0;
            this.moleOffsetY = 0;
            this.moleSizeDivider = 7;
            this.moleSize = 'small'; // The bomb should behave the same way a small mole does (used for the volumeThreshold).
            this.img = this.bombImg;
        } else if (whatToShow == 0){
            this.imageOffsetY = 50;
            this.canvasOffsetY = 50;
            this.imageOffsetX = 0;
            this.img = img;
        }

        /* This is a buffer canvas drawn on top of the original one with a smaller size.
         * The moles are drawn on this canvas instead of the main to show the effect of hiding and coming out.
         * Once the mole goes out of its canvas it is not shown which makes it look like it went in the hole.
         */
        this.extraCanvas.clear();
        //this.extraCanvas.background(0);
        this.extraCanvas.image(this.img, 0 + this.imageOffsetX + this.moleOffsetX, this.hideY + this.imageOffsetY + this.moleOffsetY, this.img.width / this.moleSizeDivider, this.img.height / this.moleSizeDivider);
        //image(this.extraCanvas, this.x, this.y - this.imageOffsetY); // Put this extra canvas exactly where the hole is so its aligned.

        if (this.hideY <= 0) {
            this.hideY = 0;
            this.out = true;
        } else {
            this.hideY = this.hideY - this.speed;
        }

        this.setBounds();

        return this.out; // If the mole is fully shown then return true, else false.
    }

    this.hide = function () {
        // Same logic as showing the mole but now we are going down.
        this.extraCanvas.clear();
        //this.extraCanvas.background(0);
        this.extraCanvas.image(this.img, 0 + this.imageOffsetX + this.moleOffsetX, this.hideY + this.imageOffsetY + this.moleOffsetY, this.img.width / this.moleSizeDivider, this.img.height / this.moleSizeDivider);
        //image(this.extraCanvas, this.x, this.y - this.imageOffset);

        if (this.hideY >= this.bound) {
            this.hideY = this.bound;
            this.out = false;
        } else {
            this.hideY = this.hideY + this.speed;
        }

        return this.out;
    }

    this.setBounds = function () {
        this.moleBounds.bottomLeftX = this.x + 15;
        this.moleBounds.bottomLeftY = this.y + 40;
        this.moleBounds.topLeftX = this.x + 15;
        this.moleBounds.topLeftY = this.y;
        this.moleBounds.topRightX = this.x + 60;
        this.moleBounds.topRightY = this.y;
        this.moleBounds.bottomRightX = this.x + 60;
        ////////////////////////////////////////////////////////////
        // Testing boundaries. Trial and error gave these numbers
        //push();
        //this.moleBounds.bottomRightY = this.y + 40;
        //fill(255, 255, 0);
        //rect(this.moleBounds.bottomLeftX, this.moleBounds.bottomLeftY, 10, 10);
        //fill(255, 0, 0);
        //rect(this.moleBounds.topLeftX, this.moleBounds.topLeftY, 10, 10);
        //fill(0, 255, 0);
        //rect(this.moleBounds.topRightX, this.moleBounds.topRightY, 10, 10);
        //fill(255, 0, 255);
        //rect(this.moleBounds.bottomRightX, this.moleBounds.bottomRightY, 10, 10);
        //pop();
        ////////////////////////////////////////////////////////////
    }
}
