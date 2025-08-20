    import { auth, db, rateLimiter } from './assets/js/firebase-init.js';

function showPreloader() {
    document.querySelector('.preloader')?.classList.add('show');
}
function hidePreloader() {
    document.querySelector('.preloader')?.classList.remove('show');
}
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const icon = notification.querySelector('i');

    notificationMessage.textContent = message;
    notification.classList.remove('success', 'error');
    notification.classList.add(type);
    icon.classList.remove('fa-check-circle', 'fa-times-circle');
    icon.classList.add(type === 'success' ? 'fa-check-circle' : 'fa-times-circle');
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

document.getElementById('signin-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        rateLimiter.checkLimit('signin');
        const submitBtn = e.target.querySelector('button[type="submit"]');
        showButtonSpinner(submitBtn);
        showPreloader();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // ✅ Always persist session — removed checkbox logic
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const uid = userCredential.user.uid;

        await db.collection('users').doc(uid).update({
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });

        showNotification('Signed in successfully!', 'success');

        setTimeout(() => {
            window.location.href = 'app.lumix.html'; // ✅ No more UID in URL
        }, 1000);
    } catch (error) {
        console.error('Error:', error);
        handleError(error);
    }
});

document.getElementById('google-signin').addEventListener('click', async () => {
    const submitBtn = document.querySelector('button[type="submit"]');
    try {
        rateLimiter.checkLimit('google_signin');
        showButtonSpinner(submitBtn);

        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);
        const uid = result.user.uid;

        const userDocRef = db.collection('users').doc(uid);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            const uniqueToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
            await userDocRef.set({
                email: result.user.email,
                displayName: result.user.displayName,
                photoURL: result.user.photoURL,
                emailVerified: result.user.emailVerified,
                lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                authProvider: 'google',
                dashboardToken: uniqueToken
            });
        } else {
            await userDocRef.update({
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
        }

        showNotification('Signed in successfully with Google!', 'success');
        setTimeout(() => {
            window.location.href = 'app.lumix.html'; // ✅ Secure redirect
        }, 1000);

    } catch (error) {
        console.error('Error:', error);
        handleError(error);
    }
});

// ✅ Auto redirect if already signed in
auth.onAuthStateChanged((user) => {
    if (user) {
        window.location.href = 'app.lumix.html';
    }
});

window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader?.classList.add('hidden');
    }, 4000);
});

function hideButtonSpinner(btn) {
    btn.classList.remove('btn-loading');
    btn.style.cursor = '';
    const spinner = btn.querySelector('.button-spinner');
    if (spinner) spinner.remove();
    btn.disabled = false;
}

function handleError(error) {
    let errorMessage = error.message;
    if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
    } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Wrong password. Try again.';
    } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Enter a valid email.';
    } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'Account disabled. Contact support.';
    } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Try again later.';
    }

    showNotification(errorMessage, 'error');
    const submitBtn = document.querySelector('button[type="submit"]');
    hideButtonSpinner(submitBtn);
    hidePreloader();
}