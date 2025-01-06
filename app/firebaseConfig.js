import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Firebase Firestore modülü
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyCyOvVYs32po_KGtYY13F86QDcUtOBD2KA",
    authDomain: "mobile-project-e9dd5.firebaseapp.com",
    projectId: "mobile-project-e9dd5",
    storageBucket: "mobile-project-e9dd5.firebasestorage.app",
    messagingSenderId: "436801953933",
    appId: "1:436801953933:ios:d23ca83cffd0b62b4702c4",
  };

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Authentication servisini al
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage };

export default app;