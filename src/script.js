
const hamburgerBtn = document.querySelector("#hamburger");
const lineone = document.querySelector(".one");
const linetwo = document.querySelector(".two");
const linethree = document.querySelector(".three");
const sideMenu = document.querySelector(".sideMenu");


hamburgerBtn.addEventListener("click", () => {
    hamburgerBtn.classList.toggle("active");
    
    if (hamburgerBtn.classList.contains("active")) {
        lineone.style.transform = "translateY(5px)  rotate(45deg)";
        linetwo.style.opacity = "0";
        linethree.style.transform = " translateY(-5px)  rotate(-45deg)";
        sideMenu.style.transform = "translateX(-200px)";
    }
    else {
        lineone.style.transform = "translateY(0) rotate(0)";
        linetwo.style.opacity = "1";
        linethree.style.transform =  "translateY(0) rotate(0)";
        sideMenu.style.transform = "translateX(0)"; // Added this to hide the menu again
    }
});
