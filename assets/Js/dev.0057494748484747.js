// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { firebaseConfig } from "./config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Elements
const signupForm = document.getElementById("signupForm");
const generateDevIDBtn = document.getElementById("generateDevID");
const copyDevIDBtn = document.getElementById("copyDevID");
const notification = document.getElementById("notification");
const modal = document.getElementById("idWarningModal");
const modalOkBtn = document.getElementById("modalOkBtn");
const submitBtn = document.querySelector("button.btn-primary");

const confirmInfoModal = document.getElementById("confirmInfoModal");
const confirmEmail = document.getElementById("confirmEmail");
const confirmOrg = document.getElementById("confirmOrg");
const confirmDevID = document.getElementById("confirmDevID");
const confirmModalBtn = document.getElementById("confirmModalBtn");
const preloader = document.getElementById("preloader");

// State
let devIDGenerated = false;
let devIDCopied = false;

function showPreloader() {
  preloader.classList.remove("hidden");
}
function hidePreloader() {
  preloader.classList.add("hidden");
}

// Generate Developer ID
function generateRandomDevID() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "LUMIX-";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

generateDevIDBtn.addEventListener("click", () => {
  if (devIDGenerated) {
    showNotification("Developer ID already generated. Please copy it.", "info");
    return;
  }
  const newID = generateRandomDevID();
  document.getElementById("developerID").value = newID;
  devIDGenerated = true;
  devIDCopied = false;
  showNotification("Developer ID generated. Please copy it to continue.", "info");
});

copyDevIDBtn.addEventListener("click", () => {
  const devID = document.getElementById("developerID").value.trim();
  if (!devID) {
    showNotification("No Developer ID to copy.", "error");
    return;
  }

  navigator.clipboard.writeText(devID).then(() => {
    devIDCopied = true;
    showNotification("Developer ID copied to clipboard!", "success");
  });
});

function showCopyWarningModal() {
  modal.classList.remove("hidden");
  modalOkBtn.onclick = () => {
    modal.classList.add("hidden");
    showNotification("Now click the copy icon to proceed.", "info");
  };
}

function getFriendlyFirebaseErrorMessage(error) {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "This email is already registered.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    default:
      return "Unexpected error occurred. Please try again.";
  }
}

function showNotification(message, type = "error", duration = 4000) {
  notification.textContent = message;
  notification.style.backgroundColor =
    type === "success" ? "#23d160" :
    type === "info" ? "#3273dc" : "#ff3860";
  notification.classList.remove("hidden");
  setTimeout(() => {
    notification.classList.add("hidden");
  }, duration);
}

// Password toggle
const passwordInput = document.getElementById("password");
const passwordToggleIcon = document.createElement("i");
passwordToggleIcon.className = "fa fa-eye password-toggle";
passwordToggleIcon.style.position = "absolute";
passwordToggleIcon.style.right = "20px";
passwordToggleIcon.style.top = "65%";
passwordToggleIcon.style.transform = "translateY(-50%)";
passwordToggleIcon.style.cursor = "pointer";
passwordToggleIcon.style.color = "#7b5cff";
passwordToggleIcon.title = "Show/Hide Password";

const passwordInputGroup = passwordInput.parentElement;
passwordInputGroup.style.position = "relative";
passwordInputGroup.appendChild(passwordToggleIcon);

passwordToggleIcon.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    passwordToggleIcon.className = "fa fa-eye-slash password-toggle";
  } else {
    passwordInput.type = "password";
    passwordToggleIcon.className = "fa fa-eye password-toggle";
  }
});

// Form submit
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = passwordInput.value.trim();
  const orgName = document.getElementById("orgName").value.trim();
  const developerID = document.getElementById("developerID").value.trim();

  if (!email || !password || !orgName || !developerID) {
    showNotification("Please fill in all fields.", "error");
    return;
  }

  if (!devIDCopied) {
    showCopyWarningModal();
    return;
  }

  submitBtn.disabled = true;
  showPreloader();

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "developers", user.uid), {
      email,
      orgName,
      developerID,
      createdAt: serverTimestamp(),
    });

    confirmEmail.textContent = email;
    confirmOrg.textContent = orgName;
    confirmDevID.textContent = developerID;
    confirmInfoModal.classList.remove("hidden");

    confirmModalBtn.onclick = () => {
      confirmModalBtn.disabled = true;
      confirmInfoModal.classList.add("hidden");
      showNotification("Account created! Redirecting...", "success");
      setTimeout(() => {
        window.location.href = "dev-login.html";
      }, 1200);
    };

  } catch (error) {
    const message = getFriendlyFirebaseErrorMessage(error);
    showNotification(message, "error");
    console.error("Signup Error:", error);
  } finally {
    submitBtn.disabled = false;
    hidePreloader();
  }
});
