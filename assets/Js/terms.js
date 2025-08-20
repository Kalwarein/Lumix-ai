// Collapsible sections toggle
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.section');

  sections.forEach(section => {
    const header = section.querySelector('.section-header');
    const content = section.querySelector('.section-content');
    const toggleBtn = header.querySelector('.toggle-btn');

    // Initially collapse all sections except Introduction
    if (section.id !== 'introduction') {
      content.classList.add('collapsed');
      toggleBtn.textContent = '+';
    } else {
      toggleBtn.textContent = '−';
    }

    header.addEventListener('click', () => {
      const isCollapsed = content.classList.contains('collapsed');
      if (isCollapsed) {
        content.classList.remove('collapsed');
        toggleBtn.textContent = '−';
      } else {
        content.classList.add('collapsed');
        toggleBtn.textContent = '+';
      }
    });
  });

  // Smooth scroll for TOC links
  const tocLinks = document.querySelectorAll('.toc a');
  tocLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElem = document.getElementById(targetId);
      if (targetElem) {
        targetElem.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
});