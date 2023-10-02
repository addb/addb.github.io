// Update img element with id "hero-img" with the random image on page load
const images = ["fall10x8.jpg", "beetle10x8.jpg", "lightHouse10x8.jpg"]

function displayRandomHeroImage() {
    const randomNum = Math.floor(Math.random() * images.length);
    const img = document.getElementById("hero-img");
    img.src = "res/imgs/" + images[randomNum];
}

