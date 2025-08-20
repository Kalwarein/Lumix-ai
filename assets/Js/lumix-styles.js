document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle functionality
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    
    // Function to check if device is mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Function to handle sidebar visibility
    function handleSidebarVisibility() {
        if (isMobile()) {
            sidebar.classList.remove('active');
        } else {
            sidebar.classList.remove('active');
            sidebar.style.transform = '';
        }
    }
    
    // Toggle sidebar on button click
    sidebarToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        sidebar.classList.toggle('active');
        console.log('Sidebar toggle clicked, active state:', sidebar.classList.contains('active'));
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (isMobile() && 
            sidebar.classList.contains('active') && 
            !sidebar.contains(event.target) && 
            event.target !== sidebarToggle) {
            sidebar.classList.remove('active');
        }
    });
    
    // Handle resize events
    window.addEventListener('resize', handleSidebarVisibility);
    
    // Initialize sidebar state
    handleSidebarVisibility();
    
    // More button functionality
    const moreToolsBtn = document.getElementById('more-tools-btn');
    const hiddenTools = document.querySelectorAll('.hidden-tool');
    
    moreToolsBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Toggle visibility of hidden tools
        hiddenTools.forEach(tool => {
            if (tool.style.display === 'flex') {
                tool.style.display = 'none';
            } else {
                tool.style.display = 'flex';
            }
        });
        
        // Change the More button text and icon
        const iconElement = this.querySelector('i');
        const textElement = this.querySelector('span');
        
        if (iconElement.classList.contains('fa-ellipsis-h')) {
            iconElement.classList.remove('fa-ellipsis-h');
            iconElement.classList.add('fa-times');
            textElement.textContent = 'Less';
        } else {
            iconElement.classList.remove('fa-times');
            iconElement.classList.add('fa-ellipsis-h');
            textElement.textContent = 'More';
        }
    });
    
    // Image Modal Functionality
    const galleryItems = document.querySelectorAll('.gallery-item');
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const closeModal = document.querySelector('.close-modal');
    const likeBtn = document.querySelector('.like-btn');
    const downloadBtn = document.querySelector('.download-btn');
    
    // Add click events to gallery items
    galleryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Don't open modal if clicking on action buttons
            if (e.target.closest('.gallery-action')) {
                e.stopPropagation();
                return;
            }
            
            const imgSrc = this.querySelector('img').src;
            modalImage.src = imgSrc;
            imageModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        });
        
        // Add specific click handlers for gallery actions
        const likeAction = item.querySelector('.like-action');
        if (likeAction) {
            likeAction.addEventListener('click', function(e) {
                e.stopPropagation();
                const icon = this.querySelector('i');
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    icon.style.color = '#ff4d8f';
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    icon.style.color = '';
                }
            });
        }
        
        const downloadAction = item.querySelector('.download-action');
        if (downloadAction) {
            downloadAction.addEventListener('click', function(e) {
                e.stopPropagation();
                const imgSrc = item.querySelector('img').src;
                const link = document.createElement('a');
                link.href = imgSrc;
                link.download = 'leonardo-ai-image.jpg';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }
    });
    
    // Close modal when clicking the X
    closeModal.addEventListener('click', function() {
        imageModal.style.display = 'none';
        document.body.style.overflow = ''; // Re-enable scrolling
    });
    
    // Close modal when clicking outside the image
    imageModal.addEventListener('click', function(event) {
        if (event.target === imageModal) {
            imageModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // Like button functionality
    likeBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        const icon = this.querySelector('i');
        if (this.classList.contains('active')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
        }
    });
    
    // Download button functionality
    downloadBtn.addEventListener('click', function() {
        const link = document.createElement('a');
        link.href = modalImage.src;
        link.download = 'leonardo-ai-image.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    
    // Category and Filter Functionality
    const categoryButtons = document.querySelectorAll('.filter-btn[data-category]');
    const filterButtons = document.querySelectorAll('.filter-btn[data-filter]');
    
    // Function to filter gallery items
    function filterGallery() {
        const activeCategory = document.querySelector('.filter-btn[data-category].active').dataset.category;
        const activeFilter = document.querySelector('.filter-btn[data-filter].active').dataset.filter;
        
        galleryItems.forEach(item => {
            const itemCategory = item.dataset.category;
            const itemFilter = item.dataset.filter;
            
            // Show item if it matches both category and filter, or if category is "all"
            if ((activeCategory === 'all' || itemCategory === activeCategory) && 
                (activeFilter === 'all' || itemFilter === activeFilter)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Add click event to category buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all category buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Filter gallery
            filterGallery();
        });
    });
    
    // Add click event to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Filter gallery
            filterGallery();
        });
    });
    
    // Initialize gallery filtering
    filterGallery();
    
    // Add Image Functionality
    const addImageBtn = document.getElementById('add-image-btn');
    const addImageModal = document.getElementById('add-image-modal');
    const addImageForm = document.getElementById('add-image-form');
    const closeAddImageModal = addImageModal.querySelector('.close-modal');
    
    // Open add image modal
    addImageBtn.addEventListener('click', function() {
        addImageModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    // Close add image modal
    closeAddImageModal.addEventListener('click', function() {
        addImageModal.style.display = 'none';
        document.body.style.overflow = '';
    });
    
    // Close modal when clicking outside
    addImageModal.addEventListener('click', function(event) {
        if (event.target === addImageModal) {
            addImageModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // Handle image upload
    const imageUpload = document.getElementById('image-upload');
    let uploadedImageUrl = '';
    
    imageUpload.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedImageUrl = e.target.result;
                //
            }
            reader.readAsDataURL(file);
        }
    });
    
    // Handle form submission
    addImageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const category = document.getElementById('category').value;
        const filter = document.getElementById('filter').value;
        
        // Create new gallery item
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.dataset.category = category;
        galleryItem.dataset.filter = filter;
        galleryItem.innerHTML = `
            <img src="${uploadedImageUrl}" alt="User uploaded image">
            <div class="gallery-overlay">
                <div class="gallery-actions">
                    <button class="gallery-action like-action">
                        <i class="far fa-heart"></i>
                    </button>
                    <button class="gallery-action download-action">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Add click event to open modal
        galleryItem.addEventListener('click', function(e) {
            // Don't open modal if clicking on action buttons
            if (e.target.closest('.gallery-action')) {
                e.stopPropagation();
                return;
            }
            
            modalImage.src = uploadedImageUrl;
            imageModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        });
        
        // Add specific click handlers for gallery actions
        const likeAction = galleryItem.querySelector('.like-action');
        likeAction.addEventListener('click', function(e) {
            e.stopPropagation();
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#ff4d8f';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
            }
        });
        
        const downloadAction = galleryItem.querySelector('.download-action');
        downloadAction.addEventListener('click', function(e) {
            e.stopPropagation();
            const link = document.createElement('a');
            link.href = uploadedImageUrl;
            link.download = 'user-uploaded-image.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
        
        // Append new item to gallery
        const galleryGrid = document.getElementById('gallery-grid');
        galleryGrid.appendChild(galleryItem);
        
        // Re-filter gallery
        filterGallery();
        
        // Close modal and reset form
        addImageModal.style.display = 'none';
        document.body.style.overflow = '';
        addImageForm.reset();
        uploadedImageUrl = '';
    });
    
    // Image lazy loading
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Add smooth scrolling for filter containers
    const filterContainers = document.querySelectorAll('.filters-row, .category-filters');
    filterContainers.forEach(container => {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        container.addEventListener('mousedown', (e) => {
            isDown = true;
            container.classList.add('active');
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });
        
        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.classList.remove('active');
        });
        
        container.addEventListener('mouseup', () => {
            isDown = false;
            container.classList.remove('active');
        });
        
        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        });
    });
    
    // Keyboard navigation for modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && imageModal.style.display === 'block') {
            imageModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
});


  const loadingBar = document.getElementById("loading-bar");
  let width = 0;
  const interval = setInterval(() => {
    if (width >= 100) {
      clearInterval(interval);
      // Hide preloader, show app
      document.getElementById("preloader").style.display = "none";
      document.getElementById("app").style.display = "block";
    } else {
      width += 2.5; // 2.5 * 40 = 100 over 4 seconds
      loadingBar.style.width = width + "%";
    }
  }, 100);

function toggleUserDropdown() {
  const dropdown = document.getElementById("userDropdownMenu");
  dropdown.classList.toggle("hidden");
}

// Hide dropdown when clicking outside
window.addEventListener("click", function(event) {
  const profile = document.querySelector(".user-profile");
  const dropdown = document.getElementById("userDropdownMenu");

  if (!profile.contains(event.target)) {
    dropdown.classList.add("hidden");
  }
});
