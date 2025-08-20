const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {
  const type = passwordInput.getAttribute("type");
  if (type === "password") {
    passwordInput.setAttribute("type", "text");
    togglePassword.textContent = "Hide";
  } else {
    passwordInput.setAttribute("type", "password");
    togglePassword.textContent = "Show";
  }
});

function showNotification(message, type) {
  const notification = document.getElementById('notification');
  const notificationMessage = document.getElementById('notification-message');
  const icon = notification.querySelector('i');

  notificationMessage.textContent = message;
  notification.classList.remove('success', 'error');
  notification.classList.add(type);
  icon.className = 'fas ' + (type === 'success' ? 'fa-check-circle' : 'fa-times-circle');
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

function showButtonSpinner(btn) {
  if (btn.classList.contains('btn-loading')) return;
  btn.classList.add('btn-loading');
  btn.disabled = true;
}

function hideButtonSpinner(btn) {
  btn.classList.remove('btn-loading');
  btn.disabled = false;
}