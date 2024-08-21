// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ai-trip-planner-c1039.firebaseapp.com",
  projectId: "ai-trip-planner-c1039",
  storageBucket: "ai-trip-planner-c1039.appspot.com",
  messagingSenderId: "673766327031",
  appId: "1:673766327031:web:05c0dd714fc010c0db89f2",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
