// JavaScript source code

function Mole(posX, posY, img) {

    this.x = posX;
    this.y = posY;
    this.img = img;
    this.speed = 1;
    this.hit = false;
    this.extraCanvas = createGraphics(100, 50);
    this.bound = 50;
    this.hideY = this.bound;

    this.show = function () {
        //this.extraCanvas.background(0);
        this.extraCanvas.image(this.img, 0, this.hideY, this.img.width / 7, this.img.height / 7);

        image(this.extraCanvas, this.x, this.y);
        //console.log('mole height = ' + img.height / 7);

        if (this.hideY == 0) {
            this.hideY = 0;
        } else {
            this.hideY = this.hideY - 1;
        }
        //image(this.img, this.x, this.y, this.img.width / 7, this.img.height / 7);
    }

    this.hide = function () {
        //this.extraCanvas.background(0);
        this.extraCanvas.image(this.img, 0, this.hideY, this.img.width / 7, this.img.height / 7);
        image(this.extraCanvas, this.x, this.y);
        //console.log('mole height = ' + img.height / 7);

        if (this.hideY >= this.bound) {
            this.y = this.bound;
        } else {
            this.hideY = this.hideY + 1;
        }
    }

}
