class Box {
    constructor(x, y, w, h) {
        let options = {
            friction: 0.3,
            restitution: 0.6
        };
        this.body = Bodies.rectangle(x, y, w, h, options);
        this.w = w;
        this.h = h;

        this.r = random(255); // r is a random number between 0 - 255
        this.g = random(100, 200); // g is a random number betwen 100 - 200
        this.b = random(100); // b is a random number between 0 - 100
        this.a = random(200, 255); // a is a random number between 200 - 255

        this.boxColour = color(random(255), random(255), random(255));

        World.add(world, this.body);
    }

    show() {
        let pos = this.body.position;
        let angle = this.body.angle;
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        strokeWeight(1);
        stroke(255);
        fill(this.boxColour);
        rect(0, 0, this.w, this.h);
        pop();
    }
}