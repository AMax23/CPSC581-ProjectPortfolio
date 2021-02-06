// JavaScript source code for when the user hovers over the button.
// This is just so the user knows what to do in case they get stuck.

var btnClicked = false;
var buttonContainer = $("#mainDiv");
var speechBubble = $("#SpeechBubble");
var button = $("#btnPaddle");
var numOfClicks = 0;
// List of instruction messages for the player.
var messages = ["Hi! I'm Lena. You have to help me catch the cats."
              , "You can also shoot snakes by clicking the button."
              , "If you hit the snakes, the cats fall slower."
              , "If the snakes get to you first, then you lose points."
              , "You can click and drag me. Double click to start!"
];

// If the button is already double clicked, then don't need to show help message.
button.dblclick(function () {
    btnClicked = true;
    speechBubble.hide();
});

// Hide the speech bubble if user clicks outside of it.
$(document).click(function () {
    if (!btnClicked && numOfClicks > 0) {
        speechBubble.css({
            "animation-name": "hideSpeech",
            "animation-duration": "0.1s"
        });
    }
});

// The functions that are executed when the mouse enters and leaves the over button.
buttonContainer.click(
    function () {
        if (!btnClicked) {
            //for (var i = 0; i < 4; i++) {
            //speechBubble.text(messages[i]);

            speechBubble.css({
                //"animation-delay": "5.25s",
                "animation-name": "speechAnimate",
                "animation-duration": "1s",
                //"animation-delay": "4s",
                //"animation-name": "hideSpeech",
                //"animation-duration": "0.1s"
            });
        }
        speechBubble.text(messages[numOfClicks]);
        numOfClicks++;
        if (numOfClicks == messages.length) { numOfClicks = 0; }
        //console.log(numOfClicks);

        // This is so this button element does not reach the other elements.
        event.stopPropagation();
    }
    //,
    //    function () {
    //        speechBubble.css({
    //            "animation-name": "hideSpeech",
    //            "animation-duration": "0.1s"
    //        });

    //        //    // Change help message after the user sees the first one.
    //        //    if (hover) {
    //        //        speechBubble.text(message1);
    //        //        hover = false;
    //        //    } else {
    //        //        speechBubble.text(message2);
    //        //        hover = true;
    //        //    }
    //        //}
    //    }

);