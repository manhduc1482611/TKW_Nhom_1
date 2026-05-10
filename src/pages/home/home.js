// HAMBURGER MENU
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  mobileNav.classList.toggle("open");
});

// HEADER SHADOW WHEN SCROLL
const header = document.querySelector(".site-header");

window.addEventListener("scroll", () => {

  if (window.scrollY > 20) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

});

// SCROLL REVEAL
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {

  reveals.forEach((item) => {

    const top = item.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (top < windowHeight - 100) {
      item.classList.add("visible");
    }

  });

}

window.addEventListener("scroll", revealOnScroll);

revealOnScroll();

// NEWSLETTER VALIDATION
const form = document.getElementById("newsletterForm");
const emailInput = document.getElementById("emailInput");
const formError = document.getElementById("formError");

form.addEventListener("submit", (e) => {

  e.preventDefault();

  const email = emailInput.value.trim();

  if (email === "") {
    formError.textContent = "Please enter email";
    return;
  }

  if (!email.includes("@")) {
    formError.textContent = "Invalid email";
    return;
  }

  formError.textContent = "";

  alert("Subscribed successfully!");

  form.reset();

});
// BANNER SLIDER

const slider = document.getElementById("slider");

const banners = document.querySelectorAll(".banner-img");

let currentBanner = 0;

let autoSlide;


// đổi banner
function changeBanner(){

  banners[currentBanner].classList.remove("active");

  currentBanner++;

  if(currentBanner >= banners.length){
    currentBanner = 0;
  }

  banners[currentBanner].classList.add("active");

}


// hover vào
slider.addEventListener("mouseenter", ()=>{

  autoSlide = setInterval(changeBanner, 1500);

});


// hover ra
slider.addEventListener("mouseleave", ()=>{

  clearInterval(autoSlide);

});