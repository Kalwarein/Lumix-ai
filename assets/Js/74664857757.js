document.addEventListener('DOMContentLoaded', () => {
    const promptInput = document.getElementById('promptInput');
    const generateBtn = document.getElementById('generateBtn');
    const generatedImage = document.getElementById('generatedImage');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const errorFeedback = document.getElementById('errorFeedback');
    const downloadBtn = document.getElementById('downloadBtn');
    const shareBtn = document.getElementById('shareBtn');

    // New UI Elements for Settings Sidebar
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsSidebar = document.getElementById('settingsSidebar');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const applySettingsBtn = document.getElementById('applySettingsBtn');
    const styleOptionBtns = document.querySelectorAll('.style-option-btn');
    const aspectRatioBtns = document.querySelectorAll('.aspect-ratio-btn');
    const negativePromptInput = document.getElementById('negativePromptInput');
    const guidanceScaleSlider = document.getElementById('guidanceScale');
    const guidanceScaleValueSpan = document.getElementById('guidanceScaleValue');
    const creativityStrengthSlider = document.getElementById('creativityStrength');
    const creativityStrengthValueSpan = document.getElementById('creativityStrengthValue');
    const seedInput = document.getElementById('seedInput');

    // New UI Elements for Model Modal
    const modelSelectBtn = document.getElementById('modelSelectBtn');
    const modelModal = document.getElementById('modelModal');
    const closeModelModalBtn = document.getElementById('closeModelModalBtn');
    const modelOptionBtns = document.querySelectorAll('.model-option-btn');
    const currentModelDisplay = document.getElementById('currentModelDisplay');
    const selectedModelInput = document.getElementById('selectedModel'); // Hidden input for actual model value

    let currentImageBlob = null; // To store the generated image blob for download/share

    // State variables for settings
    let selectedStyle = '';
    let selectedAspectRatio = '1:1'; // Default aspect ratio
    let currentNegativePrompt = '';
    let currentGuidanceScale = parseFloat(guidanceScaleSlider.value);
    let currentCreativityStrength = parseFloat(creativityStrengthSlider.value);
    let currentSeed = '';

    // --- Dynamic API Configuration based on selected model ---
    const API_MODELS_CONFIG = {
        'flux': {
            url: 'https://api.siputzx.my.id/api/ai/flux',
            method: 'GET', // As per your provided URL structure
            promptKey: 'prompt', // Query parameter name for the prompt
            imageOutputType: 'directBlob', // Assuming the API returns the image binary directly
            headers: {} // No specific headers needed for GET usually
        },
        'stable-diffusion': {
            url: 'https://api.siputzx.my.id/api/ai/stable-diffusion',
            method: 'GET', // As per your provided URL structure
            promptKey: 'prompt', // Query parameter name for the prompt
            imageOutputType: 'directBlob', // Assuming the API returns the image binary directly
            headers: {}
        },
        // Add more models and their API configurations here
        'default_text_to_image': {
            url: 'YOUR_DEFAULT_API_ENDPOINT_HERE', // REMEMBER to fill this if you use this model
            method: 'POST',
            promptKey: 'prompt',
            styleKey: 'style',
            aspectRatioKey: 'aspect_ratio',
            negativePromptKey: 'negative_prompt',
            guidanceScaleKey: 'guidance_scale',
            creativityStrengthKey: 'creativity_strength',
            seedKey: 'seed',
            imageOutputType: 'jsonUrl', // Or 'jsonBase64', or 'directBlob'
            getImageFromResponse: (data) => data.imageUrl || data.result?.url || data.image_url,
            headers: { 'Content-Type': 'application/json' }
        },
        'photorealistic_v2': {
             url: 'YOUR_PHOTO_API_ENDPOINT_HERE',
             method: 'POST',
             promptKey: 'text',
             imageOutputType: 'jsonUrl',
             getImageFromResponse: (data) => data.url,
             headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer YOUR_API_KEY' }
        },
        // ... add configurations for other models like anime_diffusion, cartoon_dream, api1_model_a etc.
        // For each, define its 'url', 'method', 'promptKey', 'imageOutputType', and 'headers'
        // If it's a GET request, make sure it just takes 'promptKey'.
        // If it's a POST request, you can include all advanced parameters.
    };
    // --- END API_MODELS_CONFIG ---

    // --- UI State Management ---
    function showLoading(message = "Generating your image...") {
        loadingIndicator.querySelector('p').textContent = message;
        loadingIndicator.classList.remove('hidden');
        generatedImage.classList.add('hidden');
        errorFeedback.classList.add('hidden');
        generatedImage.nextElementSibling.classList.add('hidden'); // Hide "no image" message
        currentImageBlob = null;
    }

    function hideLoading() {
        loadingIndicator.classList.add('hidden');
    }

    function showGeneratedImage(src) {
        generatedImage.src = src;
        generatedImage.classList.remove('hidden');
        generatedImage.nextElementSibling.classList.add('hidden'); // Hide "no image" message
        errorFeedback.classList.add('hidden');
    }

    function showError(message) {
        errorFeedback.textContent = message;
        errorFeedback.classList.remove('hidden');
        generatedImage.classList.add('hidden');
        generatedImage.nextElementSibling.classList.remove('hidden'); // Show "no image" message if error
        currentImageBlob = null;
    }

    // --- Prompt Textarea Auto-Resize ---
    function updateTextareaHeight() {
        const wrapper = promptInput.parentElement;
        wrapper.dataset.replicatedValue = promptInput.value + '\n';
    }

    // --- Dynamic Filename Generation ---
    function generateRandomNumberString(length) {
        let result = '';
        const characters = '0123456789';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    // --- Settings Sidebar Logic ---
    settingsBtn.addEventListener('click', () => {
        settingsSidebar.classList.remove('hidden');
        setTimeout(() => settingsSidebar.classList.add('visible'), 10); // Small delay for transition
    });

    closeSettingsBtn.addEventListener('click', () => {
        settingsSidebar.classList.remove('visible');
        setTimeout(() => settingsSidebar.classList.add('hidden'), 400); // Hide after transition
    });

    applySettingsBtn.addEventListener('click', () => {
        // Update current settings from inputs
        currentNegativePrompt = negativePromptInput.value.trim();
        currentGuidanceScale = parseFloat(guidanceScaleSlider.value);
        currentCreativityStrength = parseFloat(creativityStrengthSlider.value);
        currentSeed = seedInput.value.trim(); // Can be empty string

        // Close the sidebar
        settingsSidebar.classList.remove('visible');
        setTimeout(() => settingsSidebar.classList.add('hidden'), 400);
    });

    // Style selection
    styleOptionBtns.forEach(button => {
        button.addEventListener('click', () => {
            styleOptionBtns.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            selectedStyle = button.dataset.style;
        });
    });

    // Aspect Ratio selection
    aspectRatioBtns.forEach(button => {
        button.addEventListener('click', () => {
            aspectRatioBtns.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            selectedAspectRatio = button.dataset.ratio;
        });
    });

    // Sliders value display
    guidanceScaleSlider.addEventListener('input', () => {
        guidanceScaleValueSpan.textContent = guidanceScaleSlider.value;
    });
    creativityStrengthSlider.addEventListener('input', () => {
        creativityStrengthValueSpan.textContent = parseFloat(creativityStrengthSlider.value).toFixed(2);
    });

    // --- Model Selection Modal Logic ---
    modelSelectBtn.addEventListener('click', () => {
        modelModal.classList.remove('hidden');
        setTimeout(() => modelModal.classList.add('visible'), 10);
    });

    closeModelModalBtn.addEventListener('click', () => {
        modelModal.classList.remove('visible');
        setTimeout(() => modelModal.classList.add('hidden'), 300);
    });

    modelOptionBtns.forEach(button => {
        button.addEventListener('click', () => {
            modelOptionBtns.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');

            // Update the displayed model name and the hidden input value
            currentModelDisplay.textContent = button.dataset.displayName;
            selectedModelInput.value = button.dataset.model;

            // Close the modal
            modelModal.classList.remove('visible');
            setTimeout(() => modelModal.classList.add('hidden'), 300);
        });
    });

    // Set initial selected model on page load
    const initialModelId = selectedModelInput.value;
    const initialModelButton = document.querySelector(`.model-option-btn[data-model="${initialModelId}"]`);
    if (initialModelButton) {
        initialModelButton.classList.add('selected');
        currentModelDisplay.textContent = initialModelButton.dataset.displayName;
    } else {
        // Fallback if initial model in HTML is not found in buttons
        currentModelDisplay.textContent = 'Select Model';
    }


    // --- Main Generation Logic ---
    generateBtn.addEventListener('click', async () => {
        const userPrompt = promptInput.value.trim();
        const selectedModelKey = selectedModelInput.value;
        const currentModelConfig = API_MODELS_CONFIG[selectedModelKey];

        if (!userPrompt) {
            showError('Please enter a prompt to generate an image!');
            return;
        }

        if (!currentModelConfig) {
            showError(`Error: No API configuration found for model '${selectedModelKey}'.`);
            return;
        }

        if (!currentModelConfig.url || currentModelConfig.url.includes('YOUR_')) {
            showError(`API Endpoint for model '${selectedModelKey}' is not configured. Please open script.js and fill in API_MODELS_CONFIG details.`);
            return;
        }

        showLoading('Sending prompt to AI...');

        try {
            // Construct the final prompt based on selected style
            let finalPrompt = userPrompt;
            if (selectedStyle && currentModelConfig.styleKey) { // Only apply style prefix if API supports it
                finalPrompt = `${selectedStyle} styled ${userPrompt}`;
            }

            let requestUrl = currentModelConfig.url;
            let requestOptions = {
                method: currentModelConfig.method,
                headers: currentModelConfig.headers || {}
            };

            if (currentModelConfig.method === 'GET') {
                // For GET requests, parameters are in the URL
                const params = new URLSearchParams();
                params.append(currentModelConfig.promptKey, finalPrompt);
                // Flux and Stable Diffusion APIs provided seem to be simple GET requests
                // with only a prompt. If they support other parameters via GET, add them here.
                // Example: if (currentModelConfig.aspectRatioKey && selectedAspectRatio) params.append(currentModelConfig.aspectRatioKey, selectedAspectRatio);

                requestUrl = `${requestUrl}?${params.toString()}`;

            } else { // Assuming POST for other models
                const requestBody = {
                    [currentModelConfig.promptKey]: finalPrompt,
                };

                // Add optional parameters if the specific model's config supports them
                if (currentModelConfig.aspectRatioKey && selectedAspectRatio) {
                    requestBody[currentModelConfig.aspectRatioKey] = selectedAspectRatio;
                }
                if (currentModelConfig.negativePromptKey && currentNegativePrompt) {
                    requestBody[currentModelConfig.negativePromptKey] = currentNegativePrompt;
                }
                if (currentModelConfig.guidanceScaleKey !== undefined) {
                    requestBody[currentModelConfig.guidanceScaleKey] = currentGuidanceScale;
                }
                if (currentModelConfig.creativityStrengthKey !== undefined) {
                    requestBody[currentModelConfig.creativityStrengthKey] = currentCreativityStrength;
                }
                if (currentModelConfig.seedKey && currentSeed) {
                    requestBody[currentModelConfig.seedKey] = parseInt(currentSeed, 10);
                }
                // Add the model key itself if the API expects it in the body for POST
                if (currentModelConfig.modelKey) {
                     requestBody[currentModelConfig.modelKey] = selectedModelKey;
                }

                requestOptions.body = JSON.stringify(requestBody);
            }

            const response = await fetch(requestUrl, requestOptions);

            if (!response.ok) {
                let errorDetails = `HTTP error! Status: ${response.status} ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    errorDetails = errorData.message || JSON.stringify(errorData, null, 2) || errorDetails;
                } catch (e) {
                    const textError = await response.text();
                    errorDetails += ` - ${textError.substring(0, 200)}... (Raw Response)`;
                }
                throw new Error(`API Error: ${errorDetails}`);
            }

            let generatedImageUrl;
            if (currentModelConfig.imageOutputType === 'directBlob') {
                currentImageBlob = await response.blob();
                generatedImageUrl = URL.createObjectURL(currentImageBlob);
            } else if (currentModelConfig.imageOutputType === 'jsonUrl') {
                const data = await response.json();
                generatedImageUrl = currentModelConfig.getImageFromResponse(data);
                if (!generatedImageUrl) {
                    throw new Error('API response did not contain a valid image URL. Check getImageFromResponse in API_MODELS_CONFIG for the selected model.');
                }
                // Fetch the image to get its blob for download/share
                const imageResponse = await fetch(generatedImageUrl);
                if (!imageResponse.ok) throw new Error('Failed to fetch generated image from URL provided by API.');
                currentImageBlob = await imageResponse.blob();
            } else if (currentModelConfig.imageOutputType === 'jsonBase64') {
                const data = await response.json();
                const base64Image = currentModelConfig.getImageFromResponse(data);
                if (!base64Image) {
                    throw new Error('API response did not contain a valid Base64 image string. Check getImageFromResponse in API_MODELS_CONFIG for the selected model.');
                }
                const byteCharacters = atob(base64Image);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                let mimeType = 'image/jpeg';
                if (base64Image.startsWith('/9j/')) mimeType = 'image/jpeg';
                else if (base64Image.startsWith('iVBORw0KGgo')) mimeType = 'image/png';
                else if (base64Image.startsWith('R0lGODlh')) mimeType = 'image/gif';
                else if (base64Image.startsWith('UklGR')) mimeType = 'image/webp';
                currentImageBlob = new Blob([byteArray], { type: mimeType });
                generatedImageUrl = URL.createObjectURL(currentImageBlob);
            } else {
                throw new Error(`Unsupported imageOutputType for model '${selectedModelKey}'. Please check script.js.`);
            }

            showGeneratedImage(generatedImageUrl);

            if (generatedImageUrl.startsWith('blob:')) {
                generatedImage.onload = () => {
                    setTimeout(() => URL.revokeObjectURL(generatedImageUrl), 500);
                    generatedImage.onload = null;
                };
            }

        } catch (error) {
            console.error('Image generation error:', error);
            showError(`Generation failed: ${error.message}. Please check console for more details.`);
        } finally {
            hideLoading();
        }
    });

    // --- Download and Share Functionality ---
    downloadBtn.addEventListener('click', async () => {
        if (!currentImageBlob) {
            alert('No image to download!');
            return;
        }

        let fileExtension = 'png';
        if (currentImageBlob.type.includes('jpeg') || currentImageBlob.type.includes('jpg')) fileExtension = 'jpg';
        else if (currentImageBlob.type.includes('gif')) fileExtension = 'gif';
        else if (currentImageBlob.type.includes('webp')) fileExtension = 'webp';

        const filename = `Lumixai_Image_${generateRandomNumberString(15)}.${fileExtension}`;

        const a = document.createElement('a');
        a.href = URL.createObjectURL(currentImageBlob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    });

    shareBtn.addEventListener('click', async () => {
        if (!currentImageBlob) {
            alert('No image to share!');
            return;
        }

        let fileExtension = 'png';
        if (currentImageBlob.type.includes('jpeg') || currentImageBlob.type.includes('jpg')) fileExtension = 'jpg';
        else if (currentImageBlob.type.includes('gif')) fileExtension = 'gif';
        else if (currentImageBlob.type.includes('webp')) fileExtension = 'webp';

        const filename = `Lumixai_Image_${generateRandomNumberString(15)}.${fileExtension}`;

        const filesArray = [
            new File([currentImageBlob], filename, { type: currentImageBlob.type })
        ];

        if (navigator.canShare && navigator.canShare({ files: filesArray })) {
            try {
                await navigator.share({
                    files: filesArray,
                    title: `LumixAI Image: ${promptInput.value.trim() || 'Generated Image'}`,
                    text: 'Check out this AI-generated by the ai Sandi developed!',
                });
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Error sharing image:', error);
                    alert(`Failed to share image: ${error.message}.`);
                }
            }
        } else {
            alert('Your browser does not support sharing files directly. Please download the image instead.');
        }
    });

    // --- Initial Setup and Event Listeners ---
    promptInput.addEventListener('input', updateTextareaHeight);

    // Initial value display for sliders
    guidanceScaleValueSpan.textContent = guidanceScaleSlider.value;
    creativityStrengthValueSpan.textContent = parseFloat(creativityStrengthSlider.value).toFixed(2);

    // Set initial selected aspect ratio
    const initialAspectRatioButton = document.querySelector(`.aspect-ratio-btn[data-ratio="${selectedAspectRatio}"]`);
    if (initialAspectRatioButton) {
        initialAspectRatioButton.classList.add('selected');
    }
});
