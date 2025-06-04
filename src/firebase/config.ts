import { initializeApp } from 'firebase/app';
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUJsf5WMlfwU9vHymKAzt24RVDBARG8ac",
  authDomain: "collabsphere-4554f.firebaseapp.com",
  databaseURL: "https://collabsphere-4554f-default-rtdb.firebaseio.com",
  projectId: "collabsphere-4554f",
  storageBucket: "collabsphere-4554f.firebasestorage.app",
  messagingSenderId: "889492947340",
  appId: "1:889492947340:web:0963bb4610986664cf96a9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const githubProvider = new GithubAuthProvider();
const googleProvider = new GoogleAuthProvider();

export { auth, db, storage, githubProvider, googleProvider };