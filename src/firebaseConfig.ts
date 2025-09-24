// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDk97UjNItRQbkzHNomlKrqMunTKtBDGOA",
  authDomain: "hackathon1-malika.firebaseapp.com",
  projectId: "hackathon1-malika",
  storageBucket: "hackathon1-malika.firebasestorage.app",
  messagingSenderId: "926962330053",
  appId: "1:926962330053:web:5f3505754865901736c3ac",
  measurementId: "G-64H2PP7FNK",
};

// Inisialisasi Firebase
export const app = initializeApp(firebaseConfig);

// Optional: analytics (hanya kalau browser support)
export const analytics = (async () => {
  if (await isSupported()) {
    return getAnalytics(app);
  }
  return null;
})();
