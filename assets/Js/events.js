// File: ./assets/js/events.js
// Lumix Events 3.0 JS

// Data for events (to populate popup)
const eventsData = {
  1: {
    title: "Flux Schnell Unlimited",
    desc: "Unlimited generations for 3 days! Push Lumix to its max speed and enjoy creating without limits.",
    date: "Sept 01 - Sept 03, 2025",
    start: "2025-09-01T00:00:00",
    end: "2025-09-03T23:59:59",
  },
  2: {
    title: "Lumix Precision Launch",
    desc: "Try our most accurate and stable AI model with a 50% launch discount.",
    date: "Sept 05 - Sept 07, 2025",
    start: "2025-09-05T00:00:00",
    end: "2025-09-07T23:59:59",
  },
  3: {
    title: "Free Coin Giveaway",
    desc: "Get free Lumix coins during this limited-time event to try all models risk-free.",
    date: "Sept 10 - Sept 12, 2025",
    start: "2025-09-10T00:00:00",
    end: "2025-09-12T23:59:59",
  },
  4: {
    title: "MeinaMix Anime Weekend",
    desc: "Exclusive access to MeinaMix for all anime art lovers.",
    date: "Sept 15 - Sept 17, 2025",
    start: "2025-09-15T00:00:00",
    end: "2025-09-17T23:59:59",
  },
  5: {
    title: "Realistic Vision Promo",
    desc: "Ultra-realistic images unlocked free for 48 hours only.",
    date: "Sept 20 - Sept 22, 2025",
    start: "2025-09-20T00:00:00",
    end: "2025-09-22T23:59:59",
  },
  6: {
    title: "Creator Challenge",
    desc: "Show your skills and compete for Lumix rewards and recognition.",
    date: "Sept 25 - Sept 27, 2025",
    start: "2025-09-25T00:00:00",
    end: "2025-09-27T23:59:59",
  },
};

// Welcome Banner fade out after 3 seconds
window.addEventListener("DOMContentLoaded", () => {
  const welcome = document.getElementById("welcome-banner");
  setTimeout(() => {
    welcome.classList.add("fade-out");
    setTimeout(() => {
      welcome.style.display = "none";
    }, 1000);
  }, 3000);
});

// Elements
const triggers = document.querySelectorAll(".event-trigger");
const popup = document.getElementById("event-popup");
const popupClose = document.getElementById("popup-close");
const popupImg = document.getElementById("popup-img");
const popupTitle = document.getElementById("popup-title");
const popupDesc = document.getElementById("popup-desc");
const popupDate = document.getElementById("popup-date");
const popupCountdown = document.getElementById("popup-countdown");

// Show popup on trigger click
triggers.forEach(trigger => {
  trigger.addEventListener("click", () => {
    const id = trigger.dataset.id;
    const data = eventsData[id];
    if (!data) return;

    // All events use the same image now
    popupImg.src = "./assets/images/events/events-img.jpg";
    popupImg.alt = data.title;
    popupTitle.textContent = data.title;
    popupDesc.textContent = data.desc;
    popupDate.innerHTML = `<i class="fa-solid fa-calendar-days"></i> ${data.date}`;
    popup.dataset.start = data.start;
    popup.dataset.end = data.end;

    popup.classList.remove("hidden");
    updateCountdown();
  });

  // Keyboard accessibility
  trigger.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      trigger.click();
    }
  });
});

// Close popup
popupClose.addEventListener("click", () => {
  popup.classList.add("hidden");
});

// Countdown updater
function updateCountdown() {
  const now = Date.now();
  const start = new Date(popup.dataset.start).getTime();

  const diff = start - now;
  if (diff > 0) {
    popupCountdown.textContent = formatCountdown(diff) + " to start";
  } else {
    popupCountdown.textContent = "Starting Soon!";
  }
}

// Format countdown
function formatCountdown(ms) {
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return `${days}d ${hours}h ${minutes}m`;
}

// Update countdown every second
setInterval(() => {
  if (!popup.classList.contains("hidden")) {
    updateCountdown();
  }
}, 1000);