// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBZTpp6M5StYnAAY2MeW9X_lWqmw1asEnM",
  authDomain: "ux-jobs-4e6ee.firebaseapp.com",
  projectId: "ux-jobs-4e6ee",
  storageBucket: "ux-jobs-4e6ee.firebasestorage.app",
  messagingSenderId: "5734498973",
  appId: "1:5734498973:web:be825c655452197d708a74",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };
