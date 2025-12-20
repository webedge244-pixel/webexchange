// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7W1vl26mxABF3oyvpS7z6uPESTMIJJmg",
  authDomain: "midnight-1cf59.firebaseapp.com",
  projectId: "midnight-1cf59",
  storageBucket: "midnight-1cf59.firebasestorage.app",
  messagingSenderId: "622759681121",
  appId: "1:622759681121:web:91ee8d8d75350c9d7d1e20",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
