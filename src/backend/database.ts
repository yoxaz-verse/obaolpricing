// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrHxPIR7IZiQw-lFtZrHaTjbpTL5wTQ6M",
  authDomain: "obaolpricing.firebaseapp.com",
  projectId: "obaolpricing",
  storageBucket: "obaolpricing.firebasestorage.app",
  messagingSenderId: "742133500061",
  appId: "1:742133500061:web:f12d5805e6e25488fa2c74",
  measurementId: "G-H7DVCRRFV0",
};

/*const firebaseConfig = {

  apiKey: "AIzaSyDgohZ6izgV6oyeQdqsYilI_aCXIYMSNmw",

  authDomain: "sebco-1db08.firebaseapp.com",

  projectId: "sebco-1db08",

  storageBucket: "sebco-1db08.appspot.com",

  messagingSenderId: "871816575742",

  appId: "1:871816575742:web:20e01a4034bf0d61f843af",

  measurementId: "G-FG6PYYLKWK"

};*/
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = isSupported().then((yes) =>
  yes ? getAnalytics(app) : null
);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
