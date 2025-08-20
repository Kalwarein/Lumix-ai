const popup = document.getElementById('popup-message');
let loading = false;           // if any button is loading
let currentLoadingBtn = null;  // which button is loading
let redirectTimeout = null;    // timeout ID for redirect

document.querySelectorAll('.image-btn').forEach(button => {
  button.addEventListener('click', function (e) {
    e.preventDefault();

    if (loading) {
      // Another button is loading, stop it and show popup

      // Reset previous button UI
      resetButton(currentLoadingBtn);

      // Clear redirect timeout for previous button
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
        redirectTimeout = null;
      }

      loading = false;
      currentLoadingBtn = null;

      showPopup();
      return; // ignore this click to prevent multiple loading
    }

    loading = true;
    currentLoadingBtn = button;

    // Mark as loading
    button.classList.add('loading');

    // Hide image if present
    const img = button.querySelector('img');
    if (img) img.style.display = 'none';

    // Clear text and add spinner
    button.innerHTML = '<span class="spinner"></span>';

    // Get URL
    const url = button.getAttribute('href');

    // Redirect after 4 seconds
    redirectTimeout = setTimeout(() => {
      loading = false;
      currentLoadingBtn = null;
      redirectTimeout = null;
      window.location.href = url;
    }, 4000);
  });
});

function resetButton(button) {
  if (!button) return;

  // Remove loading class
  button.classList.remove('loading');

  // Reset inner HTML to original text + icon if possible
  // We assume original HTML is stored in dataset to restore, else minimal fallback

  // For simplicity: reload page is the easiest, but you want no reload
  // So restore the content manually:

  // To do this, let's store original content in a data attribute on page load

  const originalHTML = button.getAttribute('data-original-html');
  if (originalHTML) {
    button.innerHTML = originalHTML;
  }

  // Show image again if present
  const img = button.querySelector('img');
  if (img) img.style.display = '';
}

// On page load, store original HTML of each button for resetting
window.addEventListener('load', () => {
  document.querySelectorAll('.image-btn').forEach(button => {
    button.setAttribute('data-original-html', button.innerHTML);
  });
});

function showPopup() {
  popup.classList.add('show');

  setTimeout(() => {
    popup.classList.remove('show');
  }, 2000);
}