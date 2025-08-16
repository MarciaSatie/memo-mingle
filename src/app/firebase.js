// src/app/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics"; // no isSupported import
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB7r7ioo_QMZjFWr8kCsL9qlLkGmQp8j-k",
  authDomain: "memo-mingle.firebaseapp.com",
  projectId: "memo-mingle",
  storageBucket: "memo-mingle.appspot.com",
  messagingSenderId: "143322484772",
  appId: "1:143322484772:web:ae513c99c23195c79f08b1",
  measurementId: "G-1BBTPF9BCD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let analytics = null;

// Only initialize analytics in the browser
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics, isSupported }) => {
    isSupported().then((supported) => {
      if (supported) analytics = getAnalytics(app);
    });
  });
}

export { app, db, auth, analytics };
