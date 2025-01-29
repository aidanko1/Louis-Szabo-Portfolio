// ====================
// SIDEBAR TOGGLE
// ====================
const openSidebar = document.getElementById("openSidebar");
const closeSidebar = document.getElementById("closeSidebar");
const sidebar = document.getElementById("sidebar");

openSidebar?.addEventListener("click", () => {
  sidebar?.classList.add("active");
});

closeSidebar?.addEventListener("click", () => {
  sidebar?.classList.remove("active");
});

// ====================
// HEADER SCROLL DETECTION
// ====================
const header = document.querySelector("header");
const carousel = document.querySelector(".carousel");
const icon = document.querySelector(".hamburger-icon");

window.addEventListener("scroll", () => {
  if (!carousel) return; // Prevent errors if carousel is missing
  const carouselTop = carousel.getBoundingClientRect().top;
  if (carouselTop <= -carousel.offsetHeight) {
    header.classList.add("scrolled");
    icon.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
    icon.classList.remove("scrolled");
  }
});

// ====================
// MAIN CAROUSEL (BUTTON NAVIGATION + AUTO SCROLL)
// ====================
const carouselItems = document.querySelectorAll(".carousel-item");
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");
const carouselInner = document.querySelector(".carousel-inner");

let currentIndex = 0;
const totalItems = carouselItems.length;

// Function to move the carousel
function moveToIndex(index) {
  if (!carouselInner) return;
  currentIndex = (index + totalItems) % totalItems; // Ensures looping behavior
  carouselInner.style.transform = `translateX(-${currentIndex * 100}vw)`;
}

// Button Click Events
prevButton?.addEventListener("click", () => moveToIndex(currentIndex - 1));
nextButton?.addEventListener("click", () => moveToIndex(currentIndex + 1));

// Auto-scroll every 5 seconds
setInterval(() => moveToIndex(currentIndex + 1), 5000);

// ====================
// HIDE LINKS ON SCROLL
// ====================
const buttons = document.querySelectorAll(".carousel-link");

window.addEventListener("scroll", () => {
  if (buttons.length === 0) return;
  const headerBottom = header.getBoundingClientRect().bottom;
  const buttonTop = buttons[0].getBoundingClientRect().top;
  buttons.forEach((button) =>
    button.classList.toggle("hidden", headerBottom >= buttonTop)
  );
});

// ====================
// NEWS CAROUSEL (TOUCH + BUTTON NAVIGATION)
// ====================
const newsCarousel = document.querySelector(".news-carousel");
const newsPrevBtn = document.querySelector(".news-prev");
const newsNextBtn = document.querySelector(".news-next");

if (newsCarousel) {
  let newsItems = document.querySelectorAll(".news-carousel-item");
  let newsItemWidth = getItemWidth();

  function getItemWidth() {
    return newsItems.length > 0
      ? newsItems[0].getBoundingClientRect().width
      : 0;
  }

  function scrollNewsCarousel(direction) {
    let newScrollPos = newsCarousel.scrollLeft + direction * newsItemWidth;
    newsCarousel.scrollTo({ left: newScrollPos, behavior: "smooth" });
  }

  // Button Navigation
  newsNextBtn?.addEventListener("click", () => scrollNewsCarousel(1));
  newsPrevBtn?.addEventListener("click", () => scrollNewsCarousel(-1));

  // Touch Dragging Support
  let isDragging = false;
  let startX, scrollLeft;

  newsCarousel.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.pageX - newsCarousel.offsetLeft;
    scrollLeft = newsCarousel.scrollLeft;
    newsCarousel.classList.add("dragging");
  });

  newsCarousel.addEventListener("mouseleave", () => {
    isDragging = false;
    newsCarousel.classList.remove("dragging");
  });

  newsCarousel.addEventListener("mouseup", () => {
    isDragging = false;
    newsCarousel.classList.remove("dragging");
  });

  newsCarousel.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - newsCarousel.offsetLeft;
    const walk = (x - startX) * 1.5;
    newsCarousel.scrollLeft = scrollLeft - walk;
  });

  // Snap to item after scrolling
  function snapToItem() {
    let scrollPosition = newsCarousel.scrollLeft;
    let newPosition =
      Math.round(scrollPosition / newsItemWidth) * newsItemWidth;
    newsCarousel.scrollTo({ left: newPosition, behavior: "smooth" });
  }

  newsCarousel.addEventListener("scroll", () => {
    clearTimeout(newsCarousel.snapTimeout);
    newsCarousel.snapTimeout = setTimeout(snapToItem, 150);
  });

  // ======= FIX SCROLL WIDTH ON RESIZE =======
  window.addEventListener("resize", () => {
    newsItemWidth = getItemWidth(); // Update item width when screen resizes
    snapToItem(); // Re-align to nearest item
  });
}
