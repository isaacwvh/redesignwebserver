// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Replace with your own config from Firebase Console
const firebaseConfig = {
    apiKey: ,
    authDomain: "redesign-weight.firebaseapp.com",
    databaseURL: "https://redesign-weight-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "redesign-weight",
    storageBucket: "redesign-weight.firebasestorage.app",
    messagingSenderId: "326299298491",
    appId: "1:326299298491:web:a1931d5b76c94b53f7d79e",
    measurementId: "G-H09YGH2D7C"
  };

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
