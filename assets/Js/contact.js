// Wait until DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const preloader = document.getElementById("preloader");
  const popup = document.getElementById("popup");
  const closePopupBtn = document.getElementById("closePopup");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Gather values
    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const subject = form.querySelector("#subject").value;
    const message = form.querySelector("#message").value.trim();

    // Validate
    if (!name || !email || !subject || !message) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      // Show preloader
      preloader.style.display = "flex";

      // Add to Firestore collection 'contact_reports'
      await db.collection("contact_reports").add({
        name,
        email,
        subject,
        message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });

      // Reset form
      form.reset();

      // Hide preloader
      preloader.style.display = "none";

      // Show popup
      popup.style.display = "flex";
    } catch (err) {
      console.error("Error submitting contact form:", err);
      alert("Failed to send message, please try again later.");
      preloader.style.display = "none";
    }
  });

  closePopupBtn.addEventListener("click", () => {
    popup.style.display = "none";
  });
});