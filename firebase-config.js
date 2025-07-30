// Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8hWrr4XE5B8wPAe9bnoqeUJoZxFvfsbw",
  authDomain: "formfluent-bfcc5.firebaseapp.com",
  databaseURL: "https://formfluent-bfcc5-default-rtdb.firebaseio.com",
  projectId: "formfluent-bfcc5",
  storageBucket: "formfluent-bfcc5.firebasestorage.app",
  messagingSenderId: "880258666290",
  appId: "1:880258666290:web:68fcef8509174e5168512b",
  measurementId: "G-3D155H11V7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = firebase.auth();

// Initialize Firebase Realtime Database
const database = firebase.database();