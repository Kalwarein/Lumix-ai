import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDFs7kW7GXwYEDjk2EKpEYj3YA_OLyEr-0",
  authDomain: "lumix-ai.firebaseapp.com",
  projectId: "lumix-ai",
  storageBucket: "lumix-ai.appspot.com",
  messagingSenderId: "231557385044",
  appId: "1:231557385044:web:f95260915344a4e5a616c1",
  measurementId: "G-BWL87QY8QV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("reportForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = true;
  submitBtn.classList.add("loading");

  const email = document.getElementById("email").value.trim();
  const username = document.getElementById("username").value.trim();
  const reportType = document.getElementById("reportType").value;
  const description = document.getElementById("description").value.trim();
  const deviceInfo = document.getElementById("deviceInfo").value.trim();
  const pageUrl = document.getElementById("pageUrl").value.trim();

  try {
    await addDoc(collection(db, "bugReports"), {
      email,
      username,
      reportType,
      description,
      deviceInfo,
      pageUrl,
      timestamp: serverTimestamp()
    });

    sendEmailConfirmation(email);
    document.getElementById("reportForm").reset();
    showPopup("Thanks! Bug report submitted.");
  } catch (err) {
    alert("Error submitting report: " + err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove("loading");
  }
});

function sendEmailConfirmation(userEmail) {
  fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: "your_service_id",
      template_id: "your_template_id",
      user_id: "your_user_id",
      template_params: {
        to_email: userEmail,
        message: "Thanks for reporting a bug on Lumix AI. We'll review and get back to you shortly!"
      }
    })
  }).then(res => {
    if (!res.ok) console.warn("Email not sent");
  });
}

function showPopup(message) {
  const popup = document.getElementById("popup");
  popup.textContent = message;
  popup.style.display = "block";
  popup.style.animation = "none"; // Reset animation
  popup.offsetHeight; // Trigger reflow
  popup.style.animation = null; // Restart animation

  setTimeout(() => {
    popup.style.display = "none";
  }, 3000);
}