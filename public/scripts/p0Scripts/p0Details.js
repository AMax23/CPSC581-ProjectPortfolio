
// For animating the slide caption
$(document).ready(function () {

    $(".carousel-caption h5").addClass('animated slideInLeft');

    $(".carousel-caption p").addClass('animated slideInRight');

    // Numbers all the 20 images
    $('.totalImagesNumber').each(function (i, obj) {
        obj.innerHTML  = i+1 + ' ' + ' / 20';
    });
});


