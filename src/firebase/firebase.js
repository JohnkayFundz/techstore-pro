import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAVn9nreDDFPcOdX4tVhlZSw_gmrt5Jwfs",
  authDomain: "e-commerce-campaign-88713.firebaseapp.com",
  databaseURL: "https://e-commerce-campaign-88713-default-rtdb.firebaseio.com",
  projectId: "e-commerce-campaign-88713",
  storageBucket: "e-commerce-campaign-88713.firebasestorage.app",
  messagingSenderId: "540645861253",
  appId: "1:540645861253:web:94c51576911ea8e05646ec",
  measurementId: "G-BSEL0PT365",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const analytics =
  typeof window !== "undefined"
    ? getAnalytics(app)
    : null;

export default app;