// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyBMBAMrtVD--ZAH3DnxEEGtx8Qiy60IgK8",
  authDomain: "webexchanges-9fdec.firebaseapp.com",
  projectId: "webexchanges-9fdec",
  storageBucket: "webexchanges-9fdec.firebasestorage.app",
  messagingSenderId: "534177524384",
  appId: "1:534177524384:web:828dafdb2e7d8c3a6837c5",
  measurementId: "G-RM5M3XLZ7Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
