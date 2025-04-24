import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBXOiVCGhUl2kL8LvrfPMLjK3xz-F1pvYg",
  authDomain: "cineminha-login-logout.firebaseapp.com",
  projectId: "cineminha-login-logout",
  storageBucket: "cineminha-login-logout.firebasestorage.app",
  messagingSenderId: "203792167301",
  appId: "1:203792167301:web:a8d5689f32415279a6d4ec",
  measurementId: "G-B61Z57HMYJ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
