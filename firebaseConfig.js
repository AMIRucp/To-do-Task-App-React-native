
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyAccWxIiPrAqmq5wHwxJiWrR919vXcgrmY",
  authDomain: "rays-27adf.firebaseapp.com",
  projectId: "rays-27adf",
  storageBucket: "rays-27adf.appspot.com",
  messagingSenderId: "227963090530",
  appId: "1:227963090530:web:10ab6cc448c4ffd220833b",
  measurementId: "G-534Z9T86F1"
};


const app = initializeApp(firebaseConfig);


const auth = getAuth(app);


const db = getFirestore(app);

export { auth, db };
