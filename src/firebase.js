import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Sənin Firebase layihənin real konfiqurasiya məlumatları:
const firebaseConfig = {
  apiKey: "AIzaSyCxhrG3KY0ZhCelfIDqzntz6rBTfS7Y92w",
  authDomain: "taxtadan-suvenir.firebaseapp.com",
  projectId: "taxtadan-suvenir",
  storageBucket: "taxtadan-suvenir.firebasestorage.app",
  messagingSenderId: "327010037281",
  appId: "1:327010037281:web:05396c0e86b92e4626bd60",
  measurementId: "G-SX4RGMLS4Z"
};

// Firebase-i başladırıq
const app = initializeApp(firebaseConfig);

// Verilənlər bazasını (Firestore) digər fayllarda istifadə etmək üçün ixrac edirik
export const db = getFirestore(app);