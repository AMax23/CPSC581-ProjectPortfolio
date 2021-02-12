// JavaScript source code

function Mole(posX, posY, img) {

    this.x = posX;
    this.y = posY;
    this.img = img;
    this.hit = false;

    this.show = function () {
        image(img, this.x, this.y, this.img.width / 7, this.img.height / 7);
    }

    this.hide = function () {

    }

}
