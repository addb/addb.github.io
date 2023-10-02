// Update img element with id "hero-img" with the random image on page load
const imageArray = ["res/imgs/fall10x8.jpg", "res/imgs/beetle10x8.jpg", "res/imgs/lightHouse10x8.jpg"]

window.onload = () => displayRandomHeroImage(imageArray);

function displayRandomHeroImage(imageArray) {
    const randomNum = Math.floor(Math.random() * imageArray.length);
    document.getElementById("hero-img").src = imageArray[randomNum];
}

