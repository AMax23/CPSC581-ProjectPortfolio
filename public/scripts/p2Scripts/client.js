// JavaScript source code for client-side websockets.

// When user clicks on call Rhys button...
function callRhys() {
    // Pass query parameter to differentiate between the 2 clients. This is Oma/Opa.
    location.href = location.origin + '/pages/p2Sender.html?client=client1';
}

// When user clicks on call Oma/Opa button...
function callOmaOpa() {
    // Pass query parameter to differentiate between the 2 clients. This is Rhys.
    location.href = location.origin + '/pages/p2Receiver.html?client=client2';
}