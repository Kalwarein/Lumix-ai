// Firebase App Configuration
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    sendPasswordResetEmail as firebaseSendPasswordResetEmail
} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Email/Password Sign In
async function signInWithEmailPassword(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error("Error signing in with email/password:", error);
        return { 
            success: false, 
            error: error.message || "Failed to sign in" 
        };
    }
}

// Google Sign In
async function signInWithGoogle() {
    try {
        const userCredential = await signInWithPopup(auth, googleProvider);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error("Error signing in with Google:", error);
        return { 
            success: false, 
            error: error.message || "Failed to sign in with Google" 
        };
    }
}

// Sign Out
async function signOut() {
    try {
        await firebaseSignOut(auth);
        return { success: true };
    } catch (error) {
        console.error("Error signing out:", error);
        return { 
            success: false, 
            error: error.message || "Failed to sign out" 
        };
    }
}

// Auth State Observer
function initAuthStateObserver(callback) {
    return onAuthStateChanged(auth, (user) => {
        callback(user);
    });
}

// Get Current User
function getCurrentUser() {
    return auth.currentUser;
}

// Password Reset
async function sendPasswordResetEmail(email) {
    try {
        await firebaseSendPasswordResetEmail(auth, email);
        return { success: true };
    } catch (error) {
        console.error("Error sending password reset email:", error);
        return { 
            success: false, 
            error: error.message || "Failed to send password reset email" 
        };
    }
}

// Export all auth functions
export {
    signInWithEmailPassword,
    signInWithGoogle,
    signOut,
    sendPasswordResetEmail,
    initAuthStateObserver,
    getCurrentUser
}; 