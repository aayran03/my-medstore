// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDaZx961icmje8n539IqtH3tVcPj9MlN4s",
  authDomain: "medshop-8bfd2.firebaseapp.com",
  projectId: "medshop-8bfd2",
  storageBucket: "medshop-8bfd2.firebasestorage.app",
  messagingSenderId: "515283066266",
  appId: "1:515283066266:web:864661d42e652547ec6e23",
  measurementId: "G-G6SLFG67SR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { RecaptchaVerifier, signInWithPhoneNumber };
