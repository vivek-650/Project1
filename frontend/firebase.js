// Import the Firebase modules you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1LCcIS7igwiGhSukJ_-BANiB8sYLR06U",
  authDomain: "project1-1c8cb.firebaseapp.com",
  projectId: "project1-1c8cb",
  storageBucket: "project1-1c8cb.appspot.com", // Corrected storage bucket URL
  messagingSenderId: "23973861942",
  appId: "1:23973861942:web:3d9cf80c2e4ab70c635697",
  measurementId: "G-BFYX6Q0WYC",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
