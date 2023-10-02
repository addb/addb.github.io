// Update img element with id "hero-img" with the random image on page load
const imageArray = ["res/imgs/fall10X8.jpg", "res/imgs/beetle10X8.jpg", "res/imgs/lightHouse10X8.jpg"]

function randomImgLoader() {
    const randomNum = Math.floor(Math.random() * imageArray.length);
    document.getElementById("hero-img").src = imageArray[randomNum];
}

document.addEventListener('DOMContentLoaded', function () {
    randomImgLoader();
});

