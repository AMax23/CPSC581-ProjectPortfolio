// Function constructor for holes.

function Hole(posX, posY, img) {
    this.x = posX;
    this.y = posY;
    this.img = img;
    //this.extraCanvas = createGraphics(100, 200);

    this.show = function () {
        //this.extraCanvas.clear();

        //this.extraCanvas.image(this.img, 0, 0, this.img.width / 7, this.img.height / 7);
        //image(this.extraCanvas, this.x, this.y);
        image(img, this.x, this.y, this.img.width / 7, this.img.height / 7);
    }
}