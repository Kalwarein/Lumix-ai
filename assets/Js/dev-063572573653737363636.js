import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { firebaseConfig } from "./config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Elements
const signinForm = document.getElementById("signinForm");
const notification = document.getElementById("notification");
const loaderOverlay = document.getElementById("loaderOverlay");

function showNotification(message, type = "error", duration = 4000) {
  notification.textContent = message;
  notification.style.backgroundColor =
    type === "success" ? "#23d160" : type === "info" ? "#3273dc" : "#ff3860";
  notification.classList.remove("hidden");

  setTimeout(() => notification.classList.add("hidden"), duration);
}

function getFriendlyFirebaseErrorMessage(error) {
  switch (error.code) {
    case "auth/user-not-found":
      return "No user found with this email.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/invalid-email":
      return "Please enter a valid email.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Try again later.";
    default:
      return "Sign-in failed. Please try again.";
  }
}

// ✅ 1. Redirect if already logged in
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Check developer ID in Firestore
    const docRef = doc(db, "developers", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Redirect to dashboard if valid
      window.location.href = "dev-dashboard.html";
    } else {
      // Logout if no developer profile
      await signOut(auth);
    }
  }
});

// ✅ 2. Sign in with persistent session
signinForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const developerID = document.getElementById("developerID").value.trim();

  if (!email || !password || !developerID) {
    showNotification("Please fill in all fields.", "error");
    return;
  }

  loaderOverlay.classList.remove("hidden"); // Show loader

  try {
    // Enable persistent session
    await setPersistence(auth, browserLocalPersistence);

    // Sign in user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Verify developer profile
    const docRef = doc(db, "developers", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      showNotification("Developer profile not found. Contact support.", "error");
      await signOut(auth);
      return;
    }

    const data = docSnap.data();

    // Validate Developer ID
    if (data.developerID !== developerID) {
      showNotification("Incorrect Developer ID.", "error");
      await signOut(auth);
      return;
    }

    // ✅ Success
    showNotification("Signed in successfully!", "success");

    setTimeout(() => {
      window.location.href = "dev-dashboard.html";
    }, 1200);
  } catch (error) {
    console.error(error);
    showNotification(getFriendlyFirebaseErrorMessage(error), "error");
  } finally {
    loaderOverlay.classList.add("hidden");
  }
});