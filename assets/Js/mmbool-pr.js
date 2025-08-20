const firebaseConfig = {
    apiKey: "AIzaSyDFs7kW7GXwYEDjk2EKpEYj3YA_OLyEr-0",
    authDomain: "lumix-ai.firebaseapp.com",
    projectId: "lumix-ai",
    storageBucket: "lumix-ai.firebasestorage.app",
    messagingSenderId: "231557385044",
    appId: "1:231557385044:web:f95260915344a4e5a616c1",
    measurementId: "G-BWL87QY8QV"
  };
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();