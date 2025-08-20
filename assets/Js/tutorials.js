document.addEventListener("DOMContentLoaded", () => {
  // Tutorial Search & Filter
  const searchInput = document.getElementById("tutorialSearch");
  const categoryFilter = document.getElementById("categoryFilter");
  const tutorialCards = document.querySelectorAll(".tutorial-card");

  function filterTutorials() {
    const searchText = searchInput.value.toLowerCase();
    const category = categoryFilter.value;

    tutorialCards.forEach(card => {
      const title = card.querySelector("h3").textContent.toLowerCase();
      const matchesSearch = title.includes(searchText);
      const matchesCategory = category === "all" || card.dataset.category === category;

      card.style.display = (matchesSearch && matchesCategory) ? "block" : "none";
    });
  }

  searchInput.addEventListener("input", filterTutorials);
  categoryFilter.addEventListener("change", filterTutorials);

  // Chat interface logic
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");

  // Predefined responses based on keywords
  const botResponses = [
    {
      keywords: ["/image generation", "generate image", "create image"],
      reply: "To generate an image, use the command `/generate [your prompt]`. For example: `/generate a futuristic city at sunset`."
    },
    {
      keywords: ["/models", "models", "ai models", "flux", "precision", "realistic vision"],
      reply: "Lumix offers multiple models: Flux Schnell (fast & creative), Flux Dev (experimental), Precision (high accuracy), Realistic Vision (photorealistic), MeinaMix (anime style), and Counterfeit V3 (balanced). Choose one based on your needs!"
    },
    {
      keywords: ["/coins", "coins", "credits", "limits"],
      reply: "Lumix uses a coin system. Each generation costs coins based on the model and resolution. Coins refresh daily and can be purchased or earned during special events."
    },
    {
      keywords: ["/api", "developer", "integration", "api"],
      reply: "Our API lets developers integrate Lumix into apps with secure authentication and multiple endpoints for generation, model listing, and user management."
    },
    {
      keywords: ["/prompt", "prompts", "how to prompt", "prompt tips"],
      reply: "Effective prompts are clear, descriptive, and specific. Include styles, lighting, and desired art direction to get the best results. For example: 'A vibrant fantasy forest with glowing mushrooms, ultra-detailed, 4K'."
    },
    {
      keywords: ["help", "support", "how to", "tutorials"],
      reply: "Explore our tutorials section for step-by-step guides on using Lumix, crafting prompts, and integrating the API. You can also ask me any question right here!"
    },
    {
      keywords: ["hello", "hi", "hey"],
      reply: "Hello! I’m Lumix AI Assistant. Ask me anything about Lumix image generation, models, or tutorials."
    },
    {
      keywords: ["thank you", "thanks", "thx"],
      reply: "You’re welcome! If you have more questions, just ask."
    },
    {
      keywords: ["default"],
      reply: "Sorry, I didn’t quite get that. Try commands like `/image generation`, `/models`, or ask for help."
    }
  ];

  // Append message to chat
  function addMessage(content, sender = "bot") {
    const messageEl = document.createElement("div");
    messageEl.classList.add("chat-message", sender);

    const contentEl = document.createElement("div");
    contentEl.classList.add("message-content");
    contentEl.textContent = content;

    messageEl.appendChild(contentEl);
    chatMessages.appendChild(messageEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // On form submit
  chatForm.addEventListener("submit", e => {
    e.preventDefault();
    const userText = chatInput.value.trim();
    if (!userText) return;

    // Show user message
    addMessage(userText, "user");

    // Clear input
    chatInput.value = "";

    // Find matching response
    let response = "";
    const lowerText = userText.toLowerCase();

    for (const resp of botResponses) {
      if (resp.keywords.some(kw => lowerText.includes(kw))) {
        response = resp.reply;
        break;
      }
    }

    // If no match, use default
    if (!response) {
      response = botResponses.find(r => r.keywords.includes("default")).reply;
    }

    // Simulate typing delay
    setTimeout(() => {
      addMessage(response, "bot");
    }, 600);
  });

  // Greet user on page load
  addMessage("Hi! I’m Lumix AI Assistant. Type commands like /image generation or ask me about models and tutorials.");
});