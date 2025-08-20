const menuToggle = document.getElementById('menu-toggle');
const sidePanel = document.getElementById('side-panel');
const menuIcon = document.getElementById('menu-icon');

menuToggle.addEventListener('click', () => {
  sidePanel.style.display = sidePanel.style.display === 'block' ? 'none' : 'block';
  menuIcon.classList.toggle('fa-arrow-right');
  menuIcon.classList.toggle('fa-arrow-left');
});

// Simple fade-in on scroll animation for steps
document.addEventListener('DOMContentLoaded', () => {
  const steps = document.querySelectorAll('.hiw-step');

  function onScroll() {
    const windowBottom = window.innerHeight + window.scrollY;
    steps.forEach(step => {
      if (windowBottom > step.offsetTop + 100) {
        step.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', onScroll);
  onScroll(); // trigger on load in case visible already
});

(() => {
  const slider = document.querySelector('.gallery-slider');
  const leftBtn = document.querySelector('.nav-arrow.left');
  const rightBtn = document.querySelector('.nav-arrow.right');
  const progress = document.querySelector('.gallery-progress');
  const cards = slider.querySelectorAll('.gallery-card');
  const cardCount = cards.length;
  let isDragging = false, startX, scrollLeft;

  // Create dots for progress nav
  for (let i = 0; i < cardCount; i++) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.setAttribute('aria-label', `Go to artwork ${i + 1}`);
    dot.addEventListener('click', () => {
      cards[i].scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'center'});
    });
    progress.appendChild(dot);
  }

  const dots = progress.querySelectorAll('button');

  // Update dots based on scroll position
  function updateDots() {
    let closestIndex = 0;
    let closestDistance = Infinity;
    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const sliderRect = slider.getBoundingClientRect();
      const distance = Math.abs(rect.left - sliderRect.left - sliderRect.width / 2 + rect.width / 2);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    });
    dots.forEach((dot, i) => {
      dot.setAttribute('aria-selected', i === closestIndex ? 'true' : 'false');
    });
  }

  slider.addEventListener('scroll', () => {
    updateDots();
  });

  // Navigation buttons scroll by card width
  function scrollByCardWidth(direction) {
    const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight);
    slider.scrollBy({
      left: direction * cardWidth,
      behavior: 'smooth'
    });
  }

  leftBtn.addEventListener('click', () => scrollByCardWidth(-1));
  rightBtn.addEventListener('click', () => scrollByCardWidth(1));

  // Keyboard accessible nav for arrows
  [leftBtn, rightBtn].forEach(btn => {
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        btn.click();
      }
    });
  });

  // Mouse drag / touch swipe
  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    slider.classList.add('dragging');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });
  slider.addEventListener('mouseleave', () => {
    isDragging = false;
    slider.classList.remove('dragging');
  });
  slider.addEventListener('mouseup', () => {
    isDragging = false;
    slider.classList.remove('dragging');
  });
  slider.addEventListener('mousemove', (e) => {
    if(!isDragging) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (startX - x);
    slider.scrollLeft = scrollLeft + walk;
  });

  // Touch events
  slider.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });
  slider.addEventListener('touchend', () => {
    isDragging = false;
  });
  slider.addEventListener('touchmove', (e) => {
    if(!isDragging) return;
    const x = e.touches[0].pageX - slider.offsetLeft;
    const walk = (startX - x);
    slider.scrollLeft = scrollLeft + walk;
  });

  // Initialize dots highlight
  updateDots();
})();

document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.pricing-wrapper');
  const container = document.querySelector('.pricing-cards');
  const leftBtn = wrapper.querySelector('.pricing-arrow.left');
  const rightBtn = wrapper.querySelector('.pricing-arrow.right');

  // Scroll amount per click
  const scrollAmount = 300;

  leftBtn.addEventListener('click', () => {
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  rightBtn.addEventListener('click', () => {
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  // Drag / Swipe support
  let isDown = false;
  let startX;
  let scrollLeft;

  container.addEventListener('mousedown', (e) => {
    isDown = true;
    container.classList.add('dragging');
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener('mouseleave', () => {
    isDown = false;
    container.classList.remove('dragging');
  });

  container.addEventListener('mouseup', () => {
    isDown = false;
    container.classList.remove('dragging');
  });

  container.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-fast multiplier
    container.scrollLeft = scrollLeft - walk;
  });

  // Touch events for mobile
  container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  });
});
  // Toggle dropdown on button click
  document.querySelectorAll('.dropdown-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const dropdown = button.nextElementSibling;

      // Close all other dropdowns first (optional)
      document.querySelectorAll('.dropdown-content').forEach(dc => {
        if (dc !== dropdown) dc.style.display = 'none';
      });

      // Toggle current dropdown
      if (dropdown.style.display === 'flex' || dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
        button.querySelector('i.fa-chevron-down').style.transform = 'rotate(0deg)';
      } else {
        dropdown.style.display = 'flex';
        button.querySelector('i.fa-chevron-down').style.transform = 'rotate(180deg)';
      }
    });
  });
  
   const hamburger = document.querySelector(".hamburger");
    const drawer = document.querySelector(".mobile-drawer");
    const closeDrawer = document.querySelector(".close-drawer");

    hamburger.onclick = () => drawer.classList.add("show");
    closeDrawer.onclick = () => drawer.classList.remove("show");
  </script>
  <script>
     // Accordion toggle logic
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      const answer = document.getElementById(button.getAttribute('aria-controls'));

      // Close all answers (optional: for single open accordion at a time)
      document.querySelectorAll('.faq-question').forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
        const ans = document.getElementById(btn.getAttribute('aria-controls'));
        ans.hidden = true;
      });

      if (!expanded) {
        button.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
      } else {
        button.setAttribute('aria-expanded', 'false');
        answer.hidden = true;
      }
    });

    // Keyboard accessibility: toggle on Enter or Space
    button.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
    });
  }); 