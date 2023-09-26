// Update img element with id "hero-img" with the random image on page load
window.onload = randomImage;
function randomImage() {
    var images = ["fall10x8.jpg", "beetle10x8.jpg", "lightHouse10x8.jpg"]
    var randomNum = Math.floor(Math.random() * images.length);
    var img = document.getElementById("hero-img");
    img.src = "res/imgs/" + images[randomNum];
}
