document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const sidebarNavLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const mobileSidebarNavLinks = document.querySelectorAll('.mobile-sidebar-drawer .nav-link');
    const pageContents = document.querySelectorAll('.page-content');
    const currentPageTitle = document.getElementById('current-page-title');

    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileSidebarDrawer = document.getElementById('mobile-sidebar-drawer');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    const overlay = document.getElementById('overlay');

    // API Key Buttons (existing)
    const copyApiKeyBtn = document.getElementById('copyApiKeyBtn');
    const rotateApiKeyBtn = document.getElementById('rotateApiKeyBtn');
    const revokeApiKeyBtn = document.getElementById('revokeApiKeyBtn');
    const currentApiKeyDisplay = document.getElementById('currentApiKey');
    const generateNewKeyBtn = document.getElementById('generateNewKeyBtn');

    // Other Buttons (mocked functionality - existing & new)
    const upgradePlanBtn = document.getElementById('upgradePlanBtn');
    const downloadReportBtn = document.getElementById('downloadReportBtn');
    const managePaymentBtn = document.getElementById('managePaymentBtn');
    const changePlanBtn = document.getElementById('changePlanBtn');
    const viewAllInvoicesBtn = document.getElementById('viewAllInvoicesBtn');
    const createTicketBtn = document.getElementById('createTicketBtn');
    const logoutBtn = document.getElementById('logoutBtn'); // Desktop
    const logoutBtnMobile = document.getElementById('logoutBtnMobile'); // Mobile
    const notificationIcon = document.getElementById('notificationIcon');
    const themeToggleIcon = document.getElementById('themeToggleIcon');
    const userAvatarDropdown = document.getElementById('userAvatarDropdown');


    // --- New Page Specific Buttons/Elements ---

    // Team Management
    const inviteMemberBtn = document.getElementById('inviteMemberBtn');
    const memberEditBtns = document.querySelectorAll('#team-management-page .member-actions .fa-pen');
    const memberRemoveBtns = document.querySelectorAll('#team-management-page .member-actions .fa-user-times');

    // Integrations
    const integrationConnectBtns = document.querySelectorAll('#integrations-page .integration-card .action-btn');
    const exploreMoreIntegrationsBtn = document.querySelector('#integrations-page .generate-key-btn');

    // Webhooks
    const addWebhookBtn = document.getElementById('addWebhookBtn');
    const webhookEditBtns = document.querySelectorAll('#webhooks-page .webhook-actions .fa-pen');
    const webhookDeleteBtns = document.querySelectorAll('#webhooks-page .webhook-actions .fa-trash-alt');
    const webhookTestBtns = document.querySelectorAll('#webhooks-page .webhook-actions .action-btn:last-child'); // The "Test" button

    // Models
    const modelUseBtns = document.querySelectorAll('#models-page .model-card .action-btn');
    const modelDetailBtns = document.querySelectorAll('#models-page .model-card .secondary-btn');
    const modelCategorySelect = document.getElementById('model-category');

    // Templates
    const copyCodeBtns = document.querySelectorAll('.copy-code-btn');
    const buyTemplateBtns = document.querySelectorAll('.buy-template-btn');

    // Settings
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const enable2FABtn = document.getElementById('enable2FABtn');
    const saveNotificationsBtn = document.getElementById('saveNotificationsBtn');
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');


    // --- Helper Functions ---

    // Function to close the mobile sidebar drawer and remove overlay
    const closeMobileDrawer = () => {
        mobileSidebarDrawer.classList.remove('open');
        overlay.style.display = 'none';
        document.body.style.overflow = ''; // Restore scroll
    };

    // Function to update main content based on selected page
    const loadPageContent = (pageName) => {
        // Remove active class from all pages
        pageContents.forEach(page => {
            page.classList.remove('active-page');
        });

        // Add active class to the selected page
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active-page');
            // Update the header title
            currentPageTitle.textContent = pageName.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }

        // Re-render charts for the active page if they exist
        // (Chart.js needs context when its container becomes visible)
        if (pageName === 'dashboard') {
            renderDailyApiChart();
            renderEndpointPieChart();
        } else if (pageName === 'usage-analytics') {
            renderMonthlyTrendChart();
            renderDailyEndpointBreakdownChart();
        }
        // No charts on other new pages yet, but if added, they'd go here.
    };

    // Function to activate/deactivate sidebar links
    const activateNavLink = (clickedLink) => {
        // Deactivate all links
        sidebarNavLinks.forEach(link => link.classList.remove('active'));
        mobileSidebarNavLinks.forEach(link => link.classList.remove('active'));

        // Activate the clicked link (for both sidebars if present)
        const pageToActivate = clickedLink.dataset.page;
        document.querySelectorAll(`.nav-link[data-page="${pageToActivate}"]`).forEach(link => {
            link.classList.add('active');
        });
    };


    // --- Event Listeners for Sidebar Navigation ---

    // Desktop sidebar links
    sidebarNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageName = link.dataset.page;
            loadPageContent(pageName);
            activateNavLink(link);
        });
    });

    // Mobile sidebar links (inside the drawer)
    mobileSidebarNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageName = link.dataset.page;
            loadPageContent(pageName);
            activateNavLink(link);
            closeMobileDrawer(); // Close drawer on mobile after clicking a link
        });
    });

    // --- Mobile Sidebar Drawer Toggle ---
    hamburgerMenu.addEventListener('click', () => {
        mobileSidebarDrawer.classList.add('open');
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling background
    });

    closeDrawerBtn.addEventListener('click', closeMobileDrawer);
    overlay.addEventListener('click', closeMobileDrawer);


    // --- Button Functionality (Mocked API Calls/Actions) ---

    // API Key Management
    if (copyApiKeyBtn) {
        copyApiKeyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(currentApiKeyDisplay.textContent)
                .then(() => alert('API Key copied to clipboard!'))
                .catch(err => console.error('Failed to copy API Key:', err));
        });
    }

    if (rotateApiKeyBtn) {
        rotateApiKeyBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to rotate your API key? The old key will be invalidated.')) {
                // Simulate API call to backend
                const newKey = 'sk-lumix_' + Math.random().toString(36).substring(2, 22) + Math.random().toString(36).substring(2, 10);
                currentApiKeyDisplay.textContent = newKey;
                alert('API Key rotated successfully! Please update your applications.');
                // In a real app, you'd disable the old key on the server
            }
        });
    }

    if (revokeApiKeyBtn) {
        revokeApiKeyBtn.addEventListener('click', () => {
            if (confirm('WARNING: Are you sure you want to revoke this API key? This action cannot be undone and will break existing integrations using this key.')) {
                // Simulate API call to backend
                currentApiKeyDisplay.textContent = 'Key Revoked. Generate a new key if needed.';
                alert('API Key revoked! Your applications using this key will no longer function.');
                // Disable buttons after revoke, until a new key is generated
                copyApiKeyBtn.disabled = true;
                rotateApiKeyBtn.disabled = true;
                revokeApiKeyBtn.disabled = true;
            }
        });
    }

    if (generateNewKeyBtn) {
        generateNewKeyBtn.addEventListener('click', () => {
            // Simulate API call to backend
            const brandNewKey = 'sk-lumix_' + Math.random().toString(36).substring(2, 22) + Math.random().toString(36).substring(2, 10);
            currentApiKeyDisplay.textContent = brandNewKey;
            alert('A new API Key has been generated!');
            // Re-enable buttons
            copyApiKeyBtn.disabled = false;
            rotateApiKeyBtn.disabled = false;
            revokeApiKeyBtn.disabled = false;
        });
    }

    // Other Dashboard/Billing Buttons
    if (upgradePlanBtn) {
        upgradePlanBtn.addEventListener('click', () => {
            alert('Redirecting to Upgrade Plans page!');
            loadPageContent('billing');
            activateNavLink(document.querySelector('.nav-link[data-page="billing"]'));
        });
    }

    if (downloadReportBtn) {
        downloadReportBtn.addEventListener('click', () => {
            alert('Generating and downloading usage report...');
        });
    }

    if (managePaymentBtn) {
        managePaymentBtn.addEventListener('click', () => {
            alert('Opening payment methods management portal...');
        });
    }

    if (changePlanBtn) {
        changePlanBtn.addEventListener('click', () => {
            alert('Taking you to the plan change options...');
        });
    }

    if (viewAllInvoicesBtn) {
        viewAllInvoicesBtn.addEventListener('click', () => {
            alert('Loading all historical invoices...');
        });
    }

    if (createTicketBtn) {
        createTicketBtn.addEventListener('click', () => {
            alert('Opening new support ticket form...');
        });
    }

    // Top Bar Icons
    if (notificationIcon) {
        notificationIcon.addEventListener('click', () => {
            alert('Showing latest notifications!');
        });
    }

    if (themeToggleIcon) {
        themeToggleIcon.addEventListener('click', () => {
            alert('Theme toggle activated! (Visual changes not fully implemented in this demo)');
            // Example: document.body.classList.toggle('light-mode');
        });
    }

    if (userAvatarDropdown) {
        userAvatarDropdown.addEventListener('click', () => {
            alert('User dropdown menu (profile, settings, logout) would appear here!');
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            alert('Logging out...');
            // In a real app, this would clear session/token and redirect to login
        });
    }
    if (logoutBtnMobile) {
        logoutBtnMobile.addEventListener('click', () => {
            alert('Logging out...');
            closeMobileDrawer();
        });
    }


    // --- New Page Button Actions ---

    // Team Management
    if (inviteMemberBtn) {
        inviteMemberBtn.addEventListener('click', () => {
            const email = prompt("Enter email for new team member:");
            if (email) {
                const role = prompt(`Assign role for ${email} (Admin, Developer, Viewer):`);
                if (role) {
                    alert(`Invitation sent to ${email} with role: ${role}!`);
                }
            }
        });
    }
    memberEditBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const memberName = e.target.closest('.member-entry').querySelector('.member-info span').textContent.split('(')[0].trim();
            alert(`Editing member: ${memberName} (Simulated)`);
        });
    });
    memberRemoveBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const memberName = e.target.closest('.member-entry').querySelector('.member-info span').textContent.split('(')[0].trim();
            if (confirm(`Are you sure you want to remove ${memberName}?`)) {
                alert(`${memberName} removed! (Simulated)`);
                e.target.closest('.member-entry').remove(); // Visually remove
            }
        });
    });

    // Integrations
    integrationConnectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const integrationName = e.target.closest('.integration-card').querySelector('h3').textContent;
            alert(`Initiating connection/configuration for ${integrationName}... (Simulated)`);
        });
    });
    if (exploreMoreIntegrationsBtn) {
        exploreMoreIntegrationsBtn.addEventListener('click', () => {
            alert('Redirecting to the Lumix AI Integrations Marketplace! (Simulated)');
        });
    }

    // Webhooks
    if (addWebhookBtn) {
        addWebhookBtn.addEventListener('click', () => {
            const webhookUrl = prompt("Enter the URL for your new webhook endpoint:");
            if (webhookUrl) {
                alert(`Webhook to ${webhookUrl} added successfully! (Simulated)`);
            }
        });
    }
    webhookEditBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const webhookName = e.target.closest('.webhook-entry').querySelector('.webhook-info strong').textContent.trim();
            alert(`Editing webhook: ${webhookName} (Simulated)`);
        });
    });
    webhookDeleteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const webhookName = e.target.closest('.webhook-entry').querySelector('.webhook-info strong').textContent.trim();
            if (confirm(`Are you sure you want to delete the webhook "${webhookName}"?`)) {
                alert(`Webhook "${webhookName}" deleted! (Simulated)`);
                e.target.closest('.webhook-entry').remove();
            }
        });
    });
    webhookTestBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const webhookName = e.target.closest('.webhook-entry').querySelector('.webhook-info strong').textContent.trim();
            alert(`Sending a test event to "${webhookName}"... Check your endpoint logs! (Simulated)`);
        });
    });


    // Models
    if (modelCategorySelect) {
        modelCategorySelect.addEventListener('change', (e) => {
            alert(`Filtering models by category: ${e.target.value} (Simulated filter)`);
            // In a real app, you'd filter the displayed model cards based on this value
        });
    }
    modelUseBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modelName = e.target.closest('.model-card').querySelector('h3').textContent;
            alert(`Selected model: "${modelName}". Redirecting to API playground/code editor with this model pre-selected. (Simulated)`);
        });
    });
    modelDetailBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modelName = e.target.closest('.model-card').querySelector('h3').textContent;
            alert(`Loading detailed information for model: "${modelName}". (Simulated)`);
        });
    });

    // Templates (Code Copy & "Acquire/Use")
    copyCodeBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const codeBlock = e.target.closest('.code-block-wrapper').querySelector('pre code');
            if (codeBlock) {
                try {
                    await navigator.clipboard.writeText(codeBlock.textContent);
                    alert('Code copied to clipboard!');
                    // Optionally provide visual feedback on the button itself
                    e.target.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => {
                        e.target.innerHTML = '<i class="fas fa-copy"></i> Copy';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy code:', err);
                    alert('Failed to copy code. Please copy manually.');
                }
            }
        });
    });

    buyTemplateBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const templateTitle = e.target.closest('.template-card').querySelector('h3').textContent;
            alert(`You've "acquired" and are ready to use the template: "${templateTitle}"! This would typically involve saving it to your account or opening it in an IDE. (Simulated)`);
        });
    });


    // Settings
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', () => {
            const userName = document.getElementById('userName').value;
            alert(`Profile saved! Name: ${userName} (Simulated)`);
        });
    }
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', () => {
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            if (newPassword && newPassword === confirmPassword) {
                alert('Password changed successfully! (Simulated)');
                document.getElementById('currentPassword').value = '';
                document.getElementById('newPassword').value = '';
                document.getElementById('confirmPassword').value = '';
            } else {
                alert('Passwords do not match or are empty.');
            }
        });
    }
    if (enable2FABtn) {
        enable2FABtn.addEventListener('click', () => {
            alert('Initiating 2-Factor Authentication setup... (Simulated: QR code or setup steps would appear)');
        });
    }
    if (saveNotificationsBtn) {
        saveNotificationsBtn.addEventListener('click', () => {
            alert('Notification preferences saved! (Simulated)');
        });
    }
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', () => {
            if (confirm('ABSOLUTELY FINAL WARNING: This action is irreversible and will delete all your data. Are you absolutely sure?')) {
                alert('Account deletion initiated... (Simulated: redirection to a confirmation or login page)');
                // In a real app, this would log out and trigger backend deletion
            }
        });
    }


    // --- Chart.js Integrations ---
    let dailyApiChartInstance, endpointPieChartInstance, monthlyTrendChartInstance, dailyEndpointBreakdownChartInstance;

    // Daily API Requests Line Chart
    const renderDailyApiChart = () => {
        const dailyApiCtx = document.getElementById('dailyApiChart');
        if (!dailyApiCtx) return; // Exit if element not found

        // Destroy existing chart instance if it exists to prevent re-rendering issues
        if (dailyApiChartInstance) {
            dailyApiChartInstance.destroy();
        }

        dailyApiChartInstance = new Chart(dailyApiCtx, {
            type: 'line',
            data: {
                labels: ['Jul 21', 'Jul 22', 'Jul 23', 'Jul 24', 'Jul 25', 'Jul 26', 'Jul 27'],
                datasets: [{
                    label: 'API Calls',
                    data: [500, 750, 600, 900, 1200, 1500, 1234], // Example data
                    borderColor: 'rgb(232, 77, 243)', // Primary Pink
                    backgroundColor: 'rgba(232, 77, 243, 0.2)',
                    tension: 0.4, // Smooth line
                    fill: true,
                    pointBackgroundColor: 'white',
                    pointBorderColor: 'var(--primary-purple)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'var(--text-muted)'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'var(--text-muted)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: 'var(--primary-pink)',
                        borderWidth: 1
                    }
                }
            }
        });
    };

    // Endpoint Distribution Pie Chart
    const renderEndpointPieChart = () => {
        const endpointPieCtx = document.getElementById('endpointPieChart');
        if (!endpointPieCtx) return;

        if (endpointPieChartInstance) {
            endpointPieChartInstance.destroy();
        }

        endpointPieChartInstance = new Chart(endpointPieCtx, {
            type: 'doughnut',
            data: {
                labels: ['/generate', '/enhance', '/upscale', '/info'],
                datasets: [{
                    data: [45, 30, 20, 5],
                    backgroundColor: [
                        'rgba(232, 77, 243, 0.8)', // Primary Pink
                        'rgba(123, 92, 255, 0.8)', // Primary Purple
                        'rgba(255, 165, 0, 0.8)', // Orange for contrast
                        'rgba(0, 200, 255, 0.8)' // Light Blue for contrast
                    ],
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: 'var(--text-color)'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: 'var(--primary-pink)',
                        borderWidth: 1
                    }
                }
            }
        });
    };

    // Monthly API Call Trend (for Usage Analytics page)
    const renderMonthlyTrendChart = () => {
        const monthlyTrendCtx = document.getElementById('monthlyTrendChart');
        if (!monthlyTrendCtx) return;

        if (monthlyTrendChartInstance) {
            monthlyTrendChartInstance.destroy();
        }

        monthlyTrendChartInstance = new Chart(monthlyTrendCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Monthly API Calls',
                    data: [20000, 25000, 30000, 28000, 35000, 40000, 25678],
                    backgroundColor: [
                        'rgba(123, 92, 255, 0.7)',
                        'rgba(232, 77, 243, 0.7)',
                        'rgba(123, 92, 255, 0.7)',
                        'rgba(232, 77, 243, 0.7)',
                        'rgba(123, 92, 255, 0.7)',
                        'rgba(232, 77, 243, 0.7)',
                        'rgba(123, 92, 255, 0.7)'
                    ],
                    borderColor: [
                        'rgb(123, 92, 255)',
                        'rgb(232, 77, 243)',
                        'rgb(123, 92, 255)',
                        'rgb(232, 77, 243)',
                        'rgb(123, 92, 255)',
                        'rgb(232, 77, 243)',
                        'rgb(123, 92, 255)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'var(--text-muted)'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'var(--text-muted)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: 'var(--primary-pink)',
                        borderWidth: 1
                    }
                }
            }
        });
    };

    // Daily Breakdown by Endpoint (for Usage Analytics page)
    const renderDailyEndpointBreakdownChart = () => {
        const dailyEndpointBreakdownCtx = document.getElementById('dailyEndpointBreakdownChart');
        if (!dailyEndpointBreakdownCtx) return;

        if (dailyEndpointBreakdownChartInstance) {
            dailyEndpointBreakdownChartInstance.destroy();
        }

        dailyEndpointBreakdownChartInstance = new Chart(dailyEndpointBreakdownCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: '/generate',
                        data: [200, 250, 220, 300, 400, 350, 280],
                        borderColor: 'rgb(232, 77, 243)',
                        backgroundColor: 'rgba(232, 77, 243, 0.1)',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: '/enhance',
                        data: [100, 120, 150, 110, 180, 200, 160],
                        borderColor: 'rgb(123, 92, 255)',
                        backgroundColor: 'rgba(123, 92, 255, 0.1)',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: '/upscale',
                        data: [50, 70, 60, 80, 90, 100, 70],
                        borderColor: 'rgb(255, 165, 0)',
                        backgroundColor: 'rgba(255, 165, 0, 0.1)',
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'var(--text-muted)'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        stacked: true, // Stack lines to show total usage
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'var(--text-muted)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: 'var(--text-color)'
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: 'var(--primary-pink)',
                        borderWidth: 1
                    }
                }
            }
        });
    };


    // Initial page load and chart rendering
    loadPageContent('dashboard');
    // Ensure initial charts are rendered
    renderDailyApiChart();
    renderEndpointPieChart();

    // Handle window resize for chart responsiveness
    window.addEventListener('resize', () => {
        // Redraw charts if their respective pages are active to ensure proper rendering
        if (document.getElementById('dashboard-page').classList.contains('active-page')) {
            renderDailyApiChart();
            renderEndpointPieChart();
        } else if (document.getElementById('usage-analytics-page').classList.contains('active-page')) {
            renderMonthlyTrendChart();
            renderDailyEndpointBreakdownChart();
        }
    });

    // Dummy links for documentation and support pages (already handled by HTML direct links or JS alerts)
    const supportAndDocLinks = [
        'faqLink', 'communityForumLink', 'contactSupportLink', 'bugReportLink', 'statusPageLink', 'rateLimitsLink'
    ];
    supportAndDocLinks.forEach(id => {
        const link = document.getElementById(id);
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent actual navigation
                // For links that target _blank, the HTML already handles it.
                // For these, we'll just simulate with an alert.
                const linkText = e.currentTarget.querySelector('h3') ? e.currentTarget.querySelector('h3').textContent : 'this section';
                alert(`Navigating to: ${linkText} (simulated)`);
            });
        }
    });

});
