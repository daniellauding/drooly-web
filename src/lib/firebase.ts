import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCwP0w894sxwbxwPwCMR7_i6i8Cowdt2dA",
  authDomain: "drooly.firebaseapp.com",
  projectId: "drooly",
  storageBucket: "drooly.appspot.com",
  messagingSenderId: "727727122836",
  appId: "1:727727122836:web:582334a12d884d0ab2c781",
  measurementId: "G-YKZBQKZ7TK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);