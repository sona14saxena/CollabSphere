import { initializeApp } from 'firebase/app';
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVpMr9PhymYBprmyZO9eAZJZ5QEXwBp0Y",
  authDomain: "collabsphere-bcee5.firebaseapp.com",
  projectId: "collabsphere-bcee5",
  storageBucket: "collabsphere-bcee5.firebasestorage.app",
  messagingSenderId: "452926313704",
  appId: "1:452926313704:web:261156d3c5d39f84f9e55d"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const githubProvider = new GithubAuthProvider();
const googleProvider = new GoogleAuthProvider();

export { auth, db, storage, githubProvider, googleProvider };