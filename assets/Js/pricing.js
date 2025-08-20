document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const billingToggle = document.getElementById("billing-toggle")
  const pricingCards = document.querySelector(".pricing-cards")
  const scrollLeftBtn = document.querySelector(".scroll-left")
  const scrollRightBtn = document.querySelector(".scroll-right")
  const monthlyPrices = document.querySelectorAll(".price.monthly")
  const yearlyPrices = document.querySelectorAll(".price.yearly")
  const yearlyFeatures = document.querySelectorAll(".yearly-feature")

  // Initialize
  monthlyPrices.forEach((price) => price.classList.add("active"))

  // SVG gradient for popular plan icon
  const svgNS = "http://www.w3.org/2000/svg"
  const defs = document.createElementNS(svgNS, "defs")
  const gradient = document.createElementNS(svgNS, "linearGradient")
  gradient.setAttribute("id", "popular-gradient")
  gradient.setAttribute("x1", "0%")
  gradient.setAttribute("y1", "0%")
  gradient.setAttribute("x2", "100%")
  gradient.setAttribute("y2", "100%")

  const stop1 = document.createElementNS(svgNS, "stop")
  stop1.setAttribute("offset", "0%")
  stop1.setAttribute("stop-color", "#8e44ad")

  const stop2 = document.createElementNS(svgNS, "stop")
  stop2.setAttribute("offset", "100%")
  stop2.setAttribute("stop-color", "#3498db")

  gradient.appendChild(stop1)
  gradient.appendChild(stop2)
  defs.appendChild(gradient)

  const popularIcon = document.querySelector(".pricing-card.popular .plan-icon")
  if (popularIcon) {
    popularIcon.appendChild(defs)
  }

  // Toggle billing cycle
  billingToggle.addEventListener("change", function () {
    if (this.checked) {
      // Yearly
      monthlyPrices.forEach((price) => {
        price.classList.remove("active")
        price.style.display = "none"
      })

      yearlyPrices.forEach((price) => {
        price.style.display = "flex"
        setTimeout(() => {
          price.classList.add("active")
        }, 50)
      })

      yearlyFeatures.forEach((feature) => {
        feature.style.display = "flex"
        setTimeout(() => {
          feature.classList.add("active")
        }, 150)
      })

      // Enhance yearly plan icons
      document.querySelectorAll(".plan-icon").forEach((icon) => {
        icon.style.filter = "drop-shadow(0 0 12px rgba(142, 68, 173, 0.8))"
      })
    } else {
      // Monthly
      yearlyPrices.forEach((price) => {
        price.classList.remove("active")
        price.style.display = "none"
      })

      monthlyPrices.forEach((price) => {
        price.style.display = "flex"
        setTimeout(() => {
          price.classList.add("active")
        }, 50)
      })

      yearlyFeatures.forEach((feature) => {
        feature.classList.remove("active")
        setTimeout(() => {
          feature.style.display = "none"
        }, 300)
      })

      // Reset icons
      document.querySelectorAll(".plan-icon").forEach((icon) => {
        icon.style.filter = "drop-shadow(0 0 8px rgba(142, 68, 173, 0.6))"
      })
    }
  })

  // Horizontal scrolling with buttons
  scrollLeftBtn.addEventListener("click", () => {
    pricingCards.scrollBy({
      left: -320,
      behavior: "smooth",
    })
  })

  scrollRightBtn.addEventListener("click", () => {
    pricingCards.scrollBy({
      left: 320,
      behavior: "smooth",
    })
  })

  // Show/hide scroll buttons based on scroll position
  pricingCards.addEventListener("scroll", () => {
    if (pricingCards.scrollLeft <= 10) {
      scrollLeftBtn.style.opacity = "0.5"
    } else {
      scrollLeftBtn.style.opacity = "1"
    }

    if (pricingCards.scrollLeft + pricingCards.clientWidth >= pricingCards.scrollWidth - 10) {
      scrollRightBtn.style.opacity = "0.5"
    } else {
      scrollRightBtn.style.opacity = "1"
    }
  })

  // Trigger scroll event to set initial button states
  pricingCards.dispatchEvent(new Event("scroll"))

  // Add lazy load animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  document.querySelectorAll(".pricing-card").forEach((card) => {
    observer.observe(card)
  })

  // Add snap-to-center effect for mobile scrolling
  let isScrolling
  pricingCards.addEventListener("scroll", () => {
    window.clearTimeout(isScrolling)
    isScrolling = setTimeout(() => {
      const cardWidth = 300 // Approximate card width + gap
      const scrollPosition = pricingCards.scrollLeft
      const targetPosition = Math.round(scrollPosition / cardWidth) * cardWidth

      if (Math.abs(scrollPosition - targetPosition) > 10) {
        pricingCards.scrollTo({
          left: targetPosition,
          behavior: "smooth",
        })
      }
    }, 150)
  })

  // Add subtle background animation
  const createStars = () => {
    const container = document.querySelector("body")
    const starCount = 50

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div")
      star.classList.add("star")
      star.style.width = `${Math.random() * 2 + 1}px`
      star.style.height = star.style.width
      star.style.left = `${Math.random() * 100}%`
      star.style.top = `${Math.random() * 100}%`
      star.style.animationDuration = `${Math.random() * 3 + 2}s`
      star.style.animationDelay = `${Math.random() * 2}s`

      const style = document.createElement("style")
      style.textContent = `
        .star {
          position: fixed;
          background-color: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          pointer-events: none;
          z-index: -1;
          animation: twinkle ease-in-out infinite;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.7; }
        }
      `

      document.head.appendChild(style)
      container.appendChild(star)
    }
  }

  createStars()
})
