// Event Listeners
function initializeEventListeners() {
    // Mobile sidebar toggles
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => toggleSidebar('settings'));
    }
    
    if (modelBtn) {
        modelBtn.addEventListener('click', () => toggleSidebar('models'));
    }
    
    // Header model selector
    if (headerModelBtn) {
        headerModelBtn.addEventListener('click', () => toggleSidebar('models'));
    }
    
    // Close sidebar buttons
    if (closeSettings) {
        closeSettings.addEventListener('click', () => closeSidebar());
    }
    
    if (closeModels) {
        closeModels.addEventListener('click', () => closeSidebar());
    }
    
    // Overlay click to close
    if (overlay) {
        overlay.addEventListener('click', () => closeSidebar());
    }
    
    // Create button
    if (createBtn) {
        createBtn.addEventListener('click', handleGeneration);
    }
    
    // Model selection in sidebar
    document.querySelectorAll('.model-card').forEach(card => {
        card.addEventListener('click', function() {
            const modelId = this.dataset.model;
            if (modelId) {
                selectModel(modelId);
            }
        });
    });
    
    // Aspect ratio buttons
    document.querySelectorAll('.aspect-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.aspect-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Size buttons
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Number buttons
    document.querySelectorAll('.number-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.querySelector('i')) { // Not the dropdown button
                document.querySelectorAll('.number-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Glow effect for buttons
    document.querySelectorAll('.glow-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 2000);
        });
    });
    
    // Slider updates
    document.querySelectorAll('.slider').forEach(slider => {
        slider.addEventListener('input', function() {
            const valueSpan = this.parentNode.querySelector('.slider-value');
            if (valueSpan) {
                valueSpan.textContent = this.value;
            }
        });
    });
    
    // Upgrade buttons
    document.querySelectorAll('.upgrade-btn, .upgrade-plan-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            showToast('Upgrade', 'Redirecting to upgrade page...', 'info');
        });
    });
    
    // History buttons
    document.querySelectorAll('.history-btn, .add-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i').className;
            let message = 'Action completed!';
            
            if (icon.includes('magic')) {
                message = 'Prompt enhanced!';
            } else if (icon.includes('arrow-up')) {
                message = 'Image upscaled!';
            } else if (icon.includes('plus')) {
                message = 'Added to collection!';
            }
            
            showToast('Success', message, 'success');
        });
    });
}

// Dropdown functionality
function initializeDropdowns() {
    document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdownId = this.dataset.dropdown;
            const dropdown = document.getElementById(dropdownId);
            
            if (dropdown) {
                // Close other dropdowns
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    if (menu !== dropdown) {
                        menu.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('active');
                this.classList.toggle('active');
            }
        });
    });
    
    // Dropdown item selection
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            const dropdown = this.closest('.dropdown-menu');
            const trigger = document.querySelector(`[data-dropdown="${dropdown.id}"]`);
            const value = this.dataset.value || this.dataset.model;
            
            if (trigger && value) {
                // Update trigger text
                const span = trigger.querySelector('span:not(.model-name)');
                if (span && !this.dataset.model) {
                    span.textContent = this.textContent.trim();
                }
                
                // Handle model selection
                if (this.dataset.model) {
                    selectModel(this.dataset.model);
                }
                
                // Close dropdown
                dropdown.classList.remove('active');
                trigger.classList.remove('active');
                
                // Update selected state
                dropdown.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('selected'));
                this.classList.add('selected');
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('active');
        });
        document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
            trigger.classList.remove('active');
        });
    });
}

// Sidebar functions
function toggleSidebar(type) {
    closeSidebar(); // Close any open sidebar first
    
    const sidebar = type === 'settings' ? settingsSidebar : modelsSidebar;
    
    if (sidebar) {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeSidebar() {
    document.querySelectorAll('.sidebar').forEach(sidebar => {
        sidebar.classList.remove('active');
    });
    
    if (overlay) {
        overlay.classList.remove('active');
    }
    
    document.body.style.overflow = '';
}

// Model selection
function selectModel(modelId) {
    if (models[modelId]) {
        currentModel = modelId;
        updateModelDisplay();
        updateTokenCost();
        
        // Update model cards
        document.querySelectorAll('.model-card').forEach(card => {
            card.classList.remove('active');
            if (card.dataset.model === modelId) {
                card.classList.add('active');
            }
        });
        
        showToast('Model Selected', `Switched to ${models[modelId].name}`, 'success');
        closeSidebar();
    }
}

function updateModelDisplay() {
    const model = models[currentModel];
    if (!model) return;
    
    // Update header model selector
    if (headerModelBtn) {
        const img = headerModelBtn.querySelector('.model-icon');
        const span = headerModelBtn.querySelector('span');
        if (img) img.src = model.image;
        if (span) span.textContent = model.name;
    }
    
    // Update mobile model button
    if (modelBtn) {
        const img = modelBtn.querySelector('.model-preview-image');
        const span = modelBtn.querySelector('.model-name');
        if (img) img.src = model.image;
        if (span) span.textContent = model.name;
    }
    
    // Update dropdown displays
    document.querySelectorAll('[data-dropdown*="model"]').forEach(trigger => {
        const img = trigger.querySelector('.model-preview-image');
        const span = trigger.querySelector('span');
        if (img) img.src = model.image;
        if (span) span.textContent = model.name;
    });
}

function updateTokenCost() {
    const model = models[currentModel];
    if (!model) return;
    
    const costElements = document.querySelectorAll('.token-cost span');
    costElements.forEach(element => {
        element.textContent = model.cost;
    });
}
