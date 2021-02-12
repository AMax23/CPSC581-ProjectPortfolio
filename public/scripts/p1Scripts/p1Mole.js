// JavaScript source code. Function constructor for Moles.

function Mole(posX, posY, img) {

    this.x = posX;
    this.y = posY;
    this.img = img;
    this.speed = 2;
    this.hit = false;
    this.extraCanvas = createGraphics(100, 50); // This size is from trial and error to see what works best.
    this.bound = 50; // The point at which the mole is fully out or all in.
    this.hideY = this.bound;

    this.show = function () {
        /* This is a buffer canvas drawn on top of the original one with a smaller size.
         * The moles are drawn on this canvas instead of the main to show the effect on hiding
         * Once the mole goes out of its canvas it is not shown which makes it look like it went in the hole.
         */
        this.extraCanvas.image(this.img, 0, this.hideY, this.img.width / 7, this.img.height / 7);
        image(this.extraCanvas, this.x, this.y); // Put this extra canvas exactly where the hole is so its aligned.

        if (this.hideY == 0) {
            this.hideY = 0;
        } else {
            this.hideY = this.hideY - this.speed;
        }
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
