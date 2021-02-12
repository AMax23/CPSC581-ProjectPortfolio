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
    this.img = img;
    this.speed = 2;
    this.hit = false;
    this.extraCanvas = createGraphics(100, 50); // This size is from trial and error to see what works best.
    this.bound = 50; // The point at which the mole is fully out or all in.
    this.hideY = this.bound;

    this.show = function () {
        /* This is a buffer canvas drawn on top of the original one with a smaller size.
         * The moles are drawn on this canvas instead of the main to show the effect of hiding and coming out.
         * Once the mole goes out of its canvas it is not shown which makes it look like it went in the hole.
         */
        this.extraCanvas.clear();
        this.extraCanvas.image(this.img, 0, this.hideY, this.img.width / 7, this.img.height / 7);
        image(this.extraCanvas, this.x, this.y); // Put this extra canvas exactly where the hole is so its aligned.

        if (this.hideY == 0) {
            this.hideY = 0;
        } else {
            this.hideY = this.hideY - this.speed;
        }

        ////////////////////////////////////////////////////////////
        // Testing boundaries. Trial and error gave these numbers
        push();
        // Flip the image
        translate(displayWidth, 0);
        scale(-1.0, 1.0);
        fill(255, 255, 0);
        this.moleBounds.bottomRightX = this.x + 40;
        this.moleBounds.bottomRightY = this.y + 30;
        rect(this.moleBounds.bottomRightX, this.moleBounds.bottomRightY, 10, 10);
        fill(255, 0, 0); this.y
        this.moleBounds.bottomLeftX = this.x + 70;
        this.moleBounds.bottomLeftY = this.y + 30;
        rect(this.moleBounds.bottomLeftX, this.moleBounds.bottomLeftY, 10, 10);
        fill(0, 255, 0); this.y
        this.moleBounds.topLeftX = this.x + 70;
        this.moleBounds.topLeftY = this.y;
        rect(this.moleBounds.topLeftX, this.moleBounds.topLeftY, 10, 10);
        fill(255, 0, 255); this.y
        this.moleBounds.topRightX = this.x + 40;
        this.moleBounds.topRightY = this.y;
        rect(this.moleBounds.topRightX, this.moleBounds.topRightY, 10, 10);
        pop();
        ////////////////////////////////////////////////////////////
    }

    this.hide = function () {
        // Same logic as showing the mole but now we are going down.
        this.extraCanvas.image(this.img, 0, this.hideY, this.img.width / 7, this.img.height / 7);
        image(this.extraCanvas, this.x, this.y);

        if (this.hideY >= this.bound) {
            this.y = this.bound;
        } else {
            this.hideY = this.hideY + this.speed;
        }
    }
}