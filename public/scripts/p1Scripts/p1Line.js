// JavaScript source code for the line constructor.

function Line(posX, posY, prevX, prevY) {
    this.width = posX;
    this.height = posY;
    this.x = posX;
    this.y = posY;
    this.prevX = prevX;
    this.prevY = prevY;
    // Assign a random RGB colour when instantiated.
    //this.colourR = random(255);
    //this.colourG = random(255);
    //this.colourB = random(255);
    this.userColour = document.getElementById('color'); // Whatever the user selects from the colour choices.
    this.lineWeight = document.getElementById('weight');

    // Draw a line with the x and y coords.
    this.show = function () {
        //stroke(this.colourR, this.colourG, this.colourB);
        stroke(this.userColour.value);
        //stroke(255);
        strokeWeight(this.lineWeight.value);
        line(this.prevX, this.prevY, this.x, this.y);
    };

    // Move the x and y coords of the line.
    this.move = function (soundLevel) {

        // Prev x and y coords become current.
        this.prevX = this.x;
        this.prevY = this.y;

        var val = floor(random(4)); // Generate random number between 0 and 3.

        // For now the direction is random but the lenght is based off the user sound input.
        if (val == 0) {
            this.x = this.x + soundLevel;
        } else if (val == 1) {
            this.y = this.y + soundLevel;
        } else if (val == 2) {
            this.x = this.x - soundLevel;
        } else {
            this.y = this.y - soundLevel;
        }

        // Make sure that the line stays inside the canvas.
        this.x = constrain(this.x, 10, width - 10);
        this.y = constrain(this.y, 10, height - 10);
    }

}

