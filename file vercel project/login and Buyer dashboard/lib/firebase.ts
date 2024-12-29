import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC2B1ES2UAg5gef8tA9yP9yyT_K31iSuCA",
  authDomain: "sandandgrit-70d87.firebaseapp.com",
  projectId: "sandandgrit-70d87",
  storageBucket: "sandandgrit-70d87.firebasestorage.app",
  messagingSenderId: "188190516572",
  appId: "1:188190516572:web:33868ff482d5aeca9a0d99"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

