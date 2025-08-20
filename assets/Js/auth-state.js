// auth-state.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const app = initializeApp(window.firebaseConfig);
const auth = getAuth(app);

const ctaButton = document.getElementById("cta-button");
const popup = document.getElementById("auth-popup");
const popupMsg = document.getElementById("auth-message");
const closeBtn = document.getElementById("auth-close");

onAuthStateChanged(auth, user => {
  if (user) {
    const displayName = user.displayName || "User";
    const email = user.email;

    ctaButton.textContent = "Launch App";
    ctaButton.href = "app.lumix.html";

    // Show popup if showPopup=true in localStorage and popup not already shown
    if (localStorage.getItem("showPopup") === "true" && localStorage.getItem("popupShown") !== "true") {
      setTimeout(() => {
        popupMsg.innerHTML = `Welcome back <strong>${displayName}</strong> (${email})`;
        popup.classList.remove("hidden");
        localStorage.setItem("popupShown", "true");
      }, 3000);
    }

  } else {
    ctaButton.textContent = "Sign In";
    ctaButton.href = "auth.html";
  }p
})

// When CTA button is clicked, set flag to show popup on future visits
ctaButton.addEventListener("click", () => {
  if (!localStorage.getItem("showPopup")) {
    localStorage.setItem("showPopup", "true");
    localStorage.removeItem("popupShown"); // Reset popupShown so it can show next time
  }
});

closeBtn.addEventListener("click", () => popup.classList.add("hidden"));mmqq