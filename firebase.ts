// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD36WKsiaC9YKTrilAmsaoI1dO6JLejAa8",
  authDomain: "notion-clone-6b6b0.firebaseapp.com",
  projectId: "notion-clone-6b6b0",
  storageBucket: "notion-clone-6b6b0.firebasestorage.app",
  messagingSenderId: "555114181861",
  appId: "1:555114181861:web:9c872b9646d24482cc500c",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
