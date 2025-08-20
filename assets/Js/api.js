document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.features-grid');
  const cards = container.querySelectorAll('.feature-card');
  const gap = 24; // 1.5rem gap = 24px
  const cardWidth = 250 + gap; // card width + gap between cards
  let scrollPosition = 0;

  function autoScroll() {
    scrollPosition += cardWidth;
    if (scrollPosition >= container.scrollWidth) {
      scrollPosition = 0;
    }
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  }

  let interval = setInterval(autoScroll, 3500);

  container.addEventListener('mouseenter', () => clearInterval(interval));
  container.addEventListener('mouseleave', () => {
    interval = setInterval(autoScroll, 3500);
  });
});