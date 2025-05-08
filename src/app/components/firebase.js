// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmMxC59i6EqeukCe6osD1deuWfgl9yuKw",
  authDomain: "news-api-f1a79.firebaseapp.com",
  projectId: "news-api-f1a79",
  storageBucket: "news-api-f1a79.firebasestorage.app",
  messagingSenderId: "497185017222",
  appId: "1:497185017222:web:7cd77d56e81df25258f007",
  measurementId: "G-8B5BVK52SE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, auth, analytics };