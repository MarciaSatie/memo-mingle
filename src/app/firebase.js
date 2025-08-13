// src/app/firebase.js

// Import the functions you need from the Firebase SDKs
import { initializeApp } from 'firebase/app'; // <--- YOU NEED THIS ONE!
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics'; // <--- AND THIS ONE!
import { getAuth } from 'firebase/auth'; // <--- AND THIS ONE!

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7r7ioo_QMZjFWr8kCsL9qlLkGmQp8j-k",
  authDomain: "memo-mingle.firebaseapp.com",
  projectId: "memo-mingle",
  storageBucket: "memo-mingle.appspot.com",
  messagingSenderId: "143322484772",
  appId: "1:143322484772:web:ae513c99c23195c79f08b1",
  measurementId: "G-1BBTPF9BCD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Export all the initialized services
export { app, analytics, db, auth };
