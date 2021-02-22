// JavaScript source code

// JavaScript source code. Function constructor for Moles.

function Bomb(posX, posY, img) {

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
    this.speed = 10;
    this.hit = false;
    this.extraCanvas = createGraphics(100, 100); // This size is from trial and error to see what works best.
    this.bound = 60; // The point at which the mole is fully out or all in.
    this.hideY = this.bound;
    this.imageOffsetY = 35;
    this.canvasOffsetY = 50;


    this.show = function () {
        /* This is a buffer canvas drawn on top of the original one with a smaller size.
         * The moles are drawn on this canvas instead of the main to show the effect of hiding and coming out.
         * Once the mole goes out of its canvas it is not shown which makes it look like it went in the hole.
         */
        this.extraCanvas.clear();
        //this.extraCanvas.background(0);
        this.extraCanvas.image(this.img, 0 + 15, this.hideY + this.imageOffsetY, this.img.width / 7, this.img.height / 7);
        //image(this.extraCanvas, this.x, this.y - canvasOffsetY); // Put this extra canvas exactly where the hole is so its aligned.
        //image(bombImg, holes[0].x + 15, holes[0].y - 30, bombImg.width / 6, bombImg.height / 6);


        if (this.hideY <= 0) {
            this.hideY = 0;
            this.out = true;
        } else {
            this.hideY = this.hideY - this.speed;
        }

        //this.setBounds();

        return this.out; // If the mole is fully shown then return true, else false.
    }

    this.hide = function () {
        // Same logic as showing the mole but now we are going down.
        this.extraCanvas.clear();
        this.extraCanvas.image(this.img, 0, this.hideY + this.imageOffset, this.img.width / 7, this.img.height / 7);
        //image(this.extraCanvas, this.x, this.y - this.imageOffset);

        if (this.hideY >= this.bound) {
            this.hideY = this.bound;
            this.out = false;
            //this.hit = false; // If the mole is back in, then 'reset'.
        } else {
            this.hideY = this.hideY + this.speed;
        }

        return this.out;
    }
}