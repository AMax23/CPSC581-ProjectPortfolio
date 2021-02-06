// JavaScript source code for snake constructor.

function Snake(posX, posY) {
    this.x = posX;
    this.y = posY;
    this.speed = 1;
    this.alive = true;

    this.show = function (img) {
        image(img, this.x, this.y, img.width / 5, img.height / 5);
    };

    this.move = function () {
        this.y = this.y + this.speed;
    };
}

