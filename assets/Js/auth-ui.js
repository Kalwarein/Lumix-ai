import { 
    signInWithEmailPassword, 
    signInWithGoogle, 
    signOut, 
    sendPasswordResetEmail 
} from './auth.js';

// Loading state management
function setLoading(isLoading) {
    const submitButton = document.querySelector('button[type="submit"]');
    const loadingSpinner = document.getElementById('loading-spinner');
    
    if (submitButton) {
        submitButton.disabled = isLoading;
        submitButton.innerHTML = isLoading ? 
            '<svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Processing...' : 
            'Sign In';
    }
    
    if (loadingSpinner) {
        loadingSpinner.style.display = isLoading ? 'block' : 'none';
    }
}

// Error handling
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        setTimeout(() => {
            errorDiv.classList.add('hidden');
        }, 5000);
    }
}

// Success handling
function showSuccess(message) {
    const successDiv = document.getElementById('success-message');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.classList.remove('hidden');
        setTimeout(() => {
            successDiv.classList.add('hidden');
        }, 5000);
    }
}

// Sign In Form Handler
document.addEventListener('DOMContentLoaded', () => {
    // Sign In Form
    const signInForm = document.querySelector('form');
    if (signInForm) {
        signInForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            setLoading(true);
            
            try {
                const email = document.querySelector('input[type="text"]').value;
                const password = document.querySelector('input[type="password"]').value;
                
                const result = await signInWithEmailPassword(email, password);
                if (result.success) {
                    showSuccess('Sign in successful!');
                    window.location.href = 'onboarding.html';
                } else {
                    showError(result.error);
                }
            } catch (error) {
                console.error('Sign in error:', error);
                showError(error.message);
            } finally {
                setLoading(false);
            }
        });
    }

    // Google Sign In Button
    const googleSignInBtn = document.querySelector('button:contains("Sign in with Google")');
    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', async () => {
            setLoading(true);
            try {
                const result = await signInWithGoogle();
                if (result.success) {
                    showSuccess('Sign in with Google successful!');
                    window.location.href = 'app.lumix.html';
                } else {
                    showError(result.error);
                }
            } catch (error) {
                console.error('Google sign in error:', error);
                showError(error.message);
            } finally {
                setLoading(false);
            }
        });
    }

    // Password Reset Form
    const resetForm = document.getElementById('reset-password-form');
    if (resetForm) {
        resetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.querySelector('input[type="text"]').value;
            
            try {
                const result = await sendPasswordResetEmail(email);
                if (result.success) {
                    alert('Password reset email sent! Please check your inbox.');
                } else {
                    alert(result.error);
                }
            } catch (error) {
                console.error('Password reset error:', error);
                alert('Failed to send reset email. Please try again.');
            }
        });
    }

    // Sign Out Button
    const signOutBtn = document.getElementById('sign-out-btn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', async () => {
            try {
                const result = await signOut();
                if (result.success) {
                    window.location.href = 'signin.html';
                } else {
                    alert(result.error);
                }
            } catch (error) {
                console.error('Sign out error:', error);
                alert('Failed to sign out. Please try again.');
            }
        });
    }
}); 
