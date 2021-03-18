// JavaScript source code

////////////////////////// BASIC P5 SET UP ////////////////////////////////////////
function preload() {

}

function setup() {
    let canvasDiv = document.getElementById('mainCanvas');
    let canvasWidth = canvasDiv.offsetWidth;
    let canvasHeight = canvasDiv.offsetHeight;
    let cnv = createCanvas(canvasWidth, canvasHeight);
    // Put p5 canvas in the right div on main page.
    cnv.parent("mainCanvas");


    // Handle socket message coming in:
    //webSocket.onmessage = (event) => {
    //    //console.log('Message from server!!');
    //    //let incomingData = JSON.parse(event.data);

    //    //if (incomingData.type == "mouseClient") {
    //    //    newDrawing(incomingData);
    //    //}
    //};

}

function draw() {

    //fill(255, 255, 255);
    //rect(mouseX, mouseY, 100, 300);


}
///////////////////////////////////////////////////////////////////////////////////

function mouseDragged() {
    var data = {
        type: 'mouseDrag',
        username: username,
        x: mouseX,
        y: mouseY
    }

    // Send the x and y coords to the server.
    webSocket.send(JSON.stringify(data));

    fill(255, 250, 0);
    ellipse(mouseX, mouseY, 30, 30);
}

function newDrawing(data) {
    // Draw the iamge for the receiver. Change the colour of the fill so you can tell who's who.
    fill(255, 0, 255);
    ellipse(data.x, data.y, 30, 30);
    //console.log('New drawing ' + data.x + ', ' + data.y);
}