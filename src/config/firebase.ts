import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC6HJPJOaDE_wWikKZGSuhQlFKm7czkKLo",
  authDomain: "shifttier-2.firebaseapp.com",
  projectId: "shifttier-2",
  storageBucket: "shifttier-2.firebasestorage.app",
  messagingSenderId: "472178332186",
  appId: "1:472178332186:web:9d0afb6c657e17c6e0b7a3",
  measurementId: "G-2FM0D16LNR",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;