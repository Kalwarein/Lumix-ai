// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDFs7kW7GXwYEDjk2EKpEYj3YA_OLyEr-0",
    authDomain: "lumix-ai.firebaseapp.com",
    projectId: "lumix-ai",
    storageBucket: "lumix-ai.appspot.com", // fixed this line
    messagingSenderId: "231557385044",
    appId: "1:231557385044:web:f95260915344a4e5a616c1",
    measurementId: "G-BWL87QY8QV"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const analytics = firebase.analytics();

// Enable persistence for offline Firestore support
db.enablePersistence()
    .catch((err) => {
        if (err.code === 'failed-precondition') {
            console.warn('Persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
            console.warn('Browser does not support persistence.');
        }
    });

// Rate limiter object (unchanged)
const rateLimiter = {
    attempts: {},
    maxAttempts: 10,
    timeWindow: 15 * 60 * 1000, // 15 minutes
    
    checkLimit: function(action) {
        const now = Date.now();
        const userIP = 'IP'; // placeholder
        const key = `${action}_${userIP}`;
        
        // Clean up old attempts
        this.attempts = Object.fromEntries(
            Object.entries(this.attempts).filter(([_, data]) => 
                now - data.timestamp < this.timeWindow
            )
        );
        
        if (!this.attempts[key]) {
            this.attempts[key] = { count: 1, timestamp: now };
            return true;
        }
        
        if (this.attempts[key].count >= this.maxAttempts) {
            const timeLeft = Math.ceil(
                (this.timeWindow - (now - this.attempts[key].timestamp)) / 1000 / 60
            );
            throw new Error(`Too many attempts. Please try again in ${timeLeft} minutes.`);
        }
        
        this.attempts[key].count++;
        return true;
    }
};

// Auth state observer with analytics
auth.onAuthStateChanged((user) => {
    if (user) {
        analytics.logEvent('user_signed_in', {
            uid: user.uid,
            emailVerified: user.emailVerified
        });
        
        const userRef = db.collection('users').doc(user.uid);
        userRef.set({
            email: user.email,
            displayName: user.displayName || "",
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            emailVerified: user.emailVerified
        }, { merge: true })
        .catch(console.error);
        
    } else {
        analytics.logEvent('user_signed_out');

        // Redirect to signin if on protected page
        if (window.location.pathname.includes('/app.lumix.html')) {
            window.location.href = 'signin.html';
        }
    }
});

// Set persistence based on "remember me" flag
(async () => {
    const rememberMe = localStorage.getItem('rememberMe');
    try {
        if (rememberMe === 'true') {
            await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            console.log('Auth persistence set to LOCAL');
        } else {
            await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
            console.log('Auth persistence set to SESSION');
        }
    } catch (err) {
        console.error('Error setting auth persistence:', err);
    }
})();

export { auth, db, rateLimiter };