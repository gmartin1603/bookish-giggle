import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const fallbackConfig = {
  apiKey: "AIzaSyCelAccvshw9mbBgJ_T55yao6tBuy7zLVo",
  authDomain: "farm-report-86ac2.firebaseapp.com",
  projectId: "farm-report-86ac2",
  storageBucket: "farm-report-86ac2.appspot.com",
  messagingSenderId: "1035453646204",
  appId: "1:1035453646204:web:0afc537ef2d4c3e36410f9"
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || fallbackConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || fallbackConfig.projectId,
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || fallbackConfig.storageBucket,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || fallbackConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || fallbackConfig.appId
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
