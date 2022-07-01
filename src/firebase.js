// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-oft1LdI7bEXcB_6WlhEZAoLSrgrSF9g",
  authDomain: "internship-be-zen.firebaseapp.com",
  projectId: "internship-be-zen",
  storageBucket: "internship-be-zen.appspot.com",
  messagingSenderId: "834060648997",
  appId: "1:834060648997:web:58ddef2a5742f1815435cc",
  measurementId: "G-KD98F0QJFF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
