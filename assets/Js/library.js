const statusFeed = document.getElementById('status-feed');
const app = document.getElementById('app');
const unsupported = document.getElementById('unsupported-screen');

const commentDialog = document.getElementById('comment-dialog');
const commentInput = document.getElementById('comment-input');
const commentSubmit = document.getElementById('comment-submit');
const commentCancel = document.getElementById('comment-cancel');

let autoScrollInterval = null;
let autoScrollPaused = false;
const autoScrollDelay = 3000; // ms
let pressTimer = null;

// Check device: mobile/tablet incl. iPad, exclude desktop
function isMobileOrTablet() {
  const ua = navigator.userAgent.toLowerCase();

  const isDesktopOS =
    ua.includes('windows nt') ||
    ua.includes('macintosh') ||
    (ua.includes('linux') && !ua.includes('android'));

  if (isDesktopOS) return false;

  const isMobileOrTablet =
    ua.includes('iphone') ||
    ua.includes('ipad') ||
    ua.includes('android') ||
    ua.includes('mobile') ||
    ua.includes('tablet');

  const maxWidth = 1024;
  const screenOk = window.innerWidth <= maxWidth;

  return isMobileOrTablet && screenOk;
}

function showUnsupportedMessage() {
  unsupported.style.display = 'flex';
  app.style.display = 'none';
}

function showApp() {
  unsupported.style.display = 'none';
  app.style.display = 'flex';
}

function startAutoScroll() {
  if (autoScrollInterval) clearInterval(autoScrollInterval);

  const statusItem = document.querySelector('.status-item');
  if (!statusItem) return;

  const gapPx = parseInt(getComputedStyle(statusFeed).gap) || 16;
  const scrollAmount = statusItem.offsetWidth + gapPx;

  autoScrollInterval = setInterval(() => {
    if (!autoScrollPaused) {
      if (statusFeed.scrollLeft + statusFeed.clientWidth >= statusFeed.scrollWidth) {
        statusFeed.scrollLeft = 0;
      } else {
        statusFeed.scrollLeft += scrollAmount;
      }
    }
  }, autoScrollDelay);
}

function pauseAutoScroll() {
  autoScrollPaused = true;
}

function resumeAutoScroll() {
  autoScrollPaused = false;
}

function scrollLeft() {
  const statusItem = document.querySelector('.status-item');
  if (!statusItem) return;
  const gapPx = parseInt(getComputedStyle(statusFeed).gap) || 16;
  const scrollAmount = statusItem.offsetWidth + gapPx;

  statusFeed.scrollLeft = Math.max(0, statusFeed.scrollLeft - scrollAmount);
}

function scrollRight() {
  const statusItem = document.querySelector('.status-item');
  if (!statusItem) return;
  const gapPx = parseInt(getComputedStyle(statusFeed).gap) || 16;
  const scrollAmount = statusItem.offsetWidth + gapPx;

  statusFeed.scrollLeft = Math.min(
    statusFeed.scrollWidth - statusFeed.clientWidth,
    statusFeed.scrollLeft + scrollAmount
  );
}

function likeToggle(btn, statusItem) {
  const liked = statusItem.getAttribute('data-liked') === 'true';
  if (liked) {
    btn.classList.remove('liked');
    statusItem.setAttribute('data-liked', 'false');
    btn.innerHTML = '<i class="far fa-heart"></i>';
  } else {
    btn.classList.add('liked');
    statusItem.setAttribute('data-liked', 'true');
    btn.innerHTML = '<i class="fas fa-heart"></i>';
  }
}

function handleShare(statusItem) {
  const imgSrc = statusItem.querySelector('img').src;
  const username = statusItem.dataset.username;
  if (navigator.share) {
    navigator
      .share({
        title: 'Lumix Image',
        text: `Image by ${username}`,
        url: imgSrc,
      })
      .catch(() => alert('Sharing canceled or failed.'));
  } else {
    navigator.clipboard
      .writeText(imgSrc)
      .then(() => alert('Image URL copied to clipboard!'))
      .catch(() => alert('Copy failed.'));
  }
}

function handleDownload(statusItem) {
  let imgSrc = statusItem.querySelector('img').src;
  const randomString = Math.random().toString(36).substring(2, 8);
  const separator = imgSrc.includes('?') ? '&' : '?';
  imgSrc = `${imgSrc}${separator}cacheBuster=${randomString}`;

  const a = document.createElement('a');
  a.href = imgSrc;
  a.download = `lumix-image-${randomString}.jpg`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function handleUpscale() {
  alert('Upscale feature coming soon!');
}

function showCommentDialog() {
  commentDialog.classList.remove('hidden');
  commentInput.value = '';
  commentInput.focus();
  pauseAutoScroll();
}

function hideCommentDialog() {
  commentDialog.classList.add('hidden');
  resumeAutoScroll();
}

function submitComment() {
  const comment = commentInput.value.trim();
  if (comment) {
    alert('Comment submitted:\n' + comment);
    // TODO: Save/display comment in DB or UI
  }
  hideCommentDialog();
}

function setupEventListeners() {
  statusFeed.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const statusItem = btn.closest('.status-item');
    if (!statusItem) return;

    if (btn.classList.contains('like-btn')) {
      likeToggle(btn, statusItem);
    } else if (btn.classList.contains('share-btn')) {
      handleShare(statusItem);
    } else if (btn.classList.contains('download-btn')) {
      handleDownload(statusItem);
    } else if (btn.classList.contains('upscale-btn')) {
      handleUpscale();
    }
  });

  // Long press (touch/mouse) to pause auto scroll
  statusFeed.addEventListener('touchstart', () => {
    pressTimer = setTimeout(pauseAutoScroll, 500);
  });
  statusFeed.addEventListener('touchend', () => {
    clearTimeout(pressTimer);
    resumeAutoScroll();
  });

  statusFeed.addEventListener('mousedown', () => {
    pressTimer = setTimeout(pauseAutoScroll, 500);
  });
  statusFeed.addEventListener('mouseup', () => {
    clearTimeout(pressTimer);
    resumeAutoScroll();
  });

  // Click left/right side of feed to scroll
  statusFeed.addEventListener('click', (e) => {
    if (e.target !== statusFeed) return;
    const rect = statusFeed.getBoundingClientRect();
    const x = e.clientX;
    if (x < rect.left + rect.width / 3) {
      scrollLeft();
    } else if (x > rect.left + (2 * rect.width) / 3) {
      scrollRight();
    }
  });

  // Detect scroll up gesture on touch to open comment dialog
  let lastTouchY = null;
  statusFeed.addEventListener('touchstart', (e) => {
    lastTouchY = e.touches[0].clientY;
  });
  statusFeed.addEventListener('touchmove', (e) => {
    if (!lastTouchY) return;
    const currentY = e.touches[0].clientY;
    if (lastTouchY - currentY > 80) {
      showCommentDialog();
      lastTouchY = null;
    }
  });

  // ESC key closes comment dialog
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !commentDialog.classList.contains('hidden')) {
      hideCommentDialog();
    }
  });

  commentSubmit.addEventListener('click', submitComment);
  commentCancel.addEventListener('click', hideCommentDialog);
}

window.addEventListener('resize', () => {
  if (!isMobileOrTablet()) {
    showUnsupportedMessage();
  } else {
    showApp();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  if (!isMobileOrTablet()) {
    showUnsupportedMessage();
  } else {
    showApp();
    startAutoScroll();
    setupEventListeners();
  }
});