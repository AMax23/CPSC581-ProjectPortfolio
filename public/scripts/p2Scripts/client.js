// JavaScript source code for client-side websockets.

// When user clicks on call Rhys button...
function callRhys() {
    console.log('Call Rhys button clicked.');
    location.href = location.origin + '/pages/p2Sender.html';
}

// When user clicks on call Oma/Opa button...
function callOmaOpa() {
    console.log('Call Oma/Opa button clicked.');
    location.href = location.origin + '/pages/p2Receiver.html';
}