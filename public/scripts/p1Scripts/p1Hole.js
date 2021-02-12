// Function constructor for holes.

function Hole(posX, posY, img) {
    this.x = posX;
    this.y = posY;
    this.img = img;

    this.show = function () {
        image(img, this.x, this.y, this.img.width / 7, this.img.height / 7);
    }
}