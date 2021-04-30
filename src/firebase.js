import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBSzOed08QfKS-iDC7RVB51IdQmm8LkBNA",
    authDomain: "proyecto1-99d0d.firebaseapp.com",
    databaseURL: "https://proyecto1-99d0d-default-rtdb.firebaseio.com",
    projectId: "proyecto1-99d0d",
    storageBucket: "proyecto1-99d0d.appspot.com",
    messagingSenderId: "276722915811",
    appId: "1:276722915811:web:1964f3afabdcc94952a8d6"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
 
    const db = firebase.firestore();
    const auth = firebase.auth();

    export {db , auth}