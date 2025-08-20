const faqData = [
  {
    category: "Getting Started",
    question: "How do I sign up and start using Lumix?",
    answer:
      "To get started, visit the Lumix homepage and click 'Sign Up'. After verifying your email, you can start generating images using free credits.",
  },
  {
    category: "Creator Program",
    question: "How can I become a Lumix Creator?",
    answer:
      "To become a Creator, go to your dashboard and click 'Apply to Creator Program'. Once approved, you can sell images, prompts, or models and earn from users.",
  },
  {
    category: "Payments & Billing",
    question: "What payment methods are supported?",
    answer:
      "We support credit/debit cards, PayPal, crypto (USDT, BTC), and regional mobile payments in some countries.",
  },
  {
    category: "Credits & Usage",
    question: "How are credits calculated and used?",
    answer:
      "Each image costs 1–3 credits depending on resolution and model. Credits reset monthly, or you can buy top-ups anytime.",
  },
  {
    category: "Image Generation",
    question: "Why am I getting the 'generation failed' error?",
    answer:
      "This happens due to either malformed prompts, server overload, or using blocked keywords. Try simplifying your prompt.",
  },
  {
    category: "Image Generation",
    question: "How can I make more realistic AI images?",
    answer:
      "Use prompt keywords like 'photorealistic', 'ultra high resolution', and include camera angles or lens types (e.g., 50mm, bokeh, natural lighting).",
  },
  {
    category: "Licensing & Commercial Use",
    question: "Can I use Lumix images commercially?",
    answer:
      "Yes. Unless the image contains protected characters or trademarks, you are free to use Lumix-generated content commercially.",
  },
  {
    category: "Community & Publishing",
    question: "How do I publish my images to the public gallery?",
    answer:
      "After generating an image, click 'Publish'. Only images with safe content and proper tagging will be accepted by moderators.",
  },
  {
    category: "Account Management",
    question: "How do I delete or deactivate my account?",
    answer:
      "Go to Settings > Privacy > Delete Account. This action is permanent and all data/images will be removed after 14 days.",
  },
  {
    category: "Payments & Billing",
    question: "How do I upgrade or cancel my subscription?",
    answer:
      "Go to Settings > Billing > Subscription. Click ‘Change Plan’ to upgrade, downgrade or cancel.",
  },
  {
    category: "Mobile App",
    question: "Can I access Lumix from my mobile phone?",
    answer:
      "Yes. Lumix is fully mobile-optimized and installable as a PWA. Native apps for Android/iOS are coming soon.",
  },
  {
    category: "Security & Privacy",
    question: "How does Lumix protect my data?",
    answer:
      "We use industry-standard encryption and never share your personal data without permission. Enable 2FA for extra security.",
  },
  {
    category: "Troubleshooting",
    question: "Why is the site slow or unresponsive?",
    answer:
      "During peak hours, heavy traffic can cause slowdowns. We recommend using the site during off-peak hours or upgrading to Pro for priority servers.",
  },
  {
    category: "Contact Support",
    question: "How do I contact Lumix support?",
    answer:
      "Use the 'Contact Support' button in the footer or email support@lumix.ai. Expect a response within 24–48 hours.",
  },
];

// Globals
const faqContainer = document.getElementById("faqContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

let currentCategory = "All";
let currentSearch = "";

// Extract unique categories from faqData
const categories = ["All", ...new Set(faqData.map((item) => item.category))];

// Build category filter buttons
function buildCategoryButtons() {
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.classList.toggle("active", cat === currentCategory);
    btn.addEventListener("click", () => {
      currentCategory = cat;
      updateActiveCategory();
      renderFAQs();
    });
    categoryFilter.appendChild(btn);
  });
}

function updateActiveCategory() {
  Array.from(categoryFilter.children).forEach((btn) => {
    btn.classList.toggle("active", btn.textContent === currentCategory);
  });
}

// Render FAQs based on search and category filters
function renderFAQs() {
  faqContainer.innerHTML = "";

  let filtered = faqData.filter((item) => {
    const matchesCategory =
      currentCategory === "All" || item.category === currentCategory;

    const search = currentSearch.toLowerCase();

    const matchesSearch =
      item.question.toLowerCase().includes(search) ||
      item.answer.toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    faqContainer.innerHTML =
      '<p style="text-align:center; color:#888; margin-top: 2rem;">No results found.</p>';
    return;
  }

  filtered.forEach((item) => {
    const details = document.createElement("details");
    details.className = "faq-item";

    const summary = document.createElement("summary");
    summary.textContent = item.question;

    const p = document.createElement("p");
    p.textContent = item.answer;

    details.appendChild(summary);
    details.appendChild(p);

    faqContainer.appendChild(details);
  });
}

// Search input handler
searchInput.addEventListener("input", (e) => {
  currentSearch = e.target.value.trim();
  renderFAQs();
});

// Initialize
buildCategoryButtons();
renderFAQs();