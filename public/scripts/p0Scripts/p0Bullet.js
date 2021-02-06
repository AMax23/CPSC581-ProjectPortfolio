// JavaScript source code for game.
// This is a constructor function for a bullet.

function Bullet(posX, posY) {
    this.x = posX;
    this.y = posY;
    this.speed = 10;
    this.shot = false;

    this.show = function () {
        fill(color("#48ff00"));
        rect(this.x, this.y, 5, 30);
    };

    this.move = function () {
        this.y = this.y - this.speed;
    };
}




