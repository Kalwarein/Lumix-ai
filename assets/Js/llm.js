// Show popup only once per browser session
window.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("llmPopupShown")) {
    document.getElementById("popup").style.display = "flex";
    localStorage.setItem("llmPopupShown", "true");
  }
});

// Close popup
function closePopup() {
  document.getElementById("popup").style.display = "none";
}

// Copy code when clicked
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("copyable")) {
    navigator.clipboard.writeText(e.target.innerText).then(() => {
      e.target.innerText = "Copied!";
      setTimeout(() => {
        e.target.innerText = "LLM-1000-REWARD";
      }, 1500);
    });
  }
});