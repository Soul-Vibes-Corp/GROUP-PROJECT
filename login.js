// Initialize Firebase
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID"
};
firebase.initializeApp(firebaseConfig);

// Login function
function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Firebase Authentication - Login
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      // Redirect to chat page after successful login
      window.location.href = "chat.html";
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
}

// Signup function
function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Firebase Authentication - Sign up
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
      // Redirect to chat page after successful sign-up
      window.location.href = "chat.html";
    })
    .catch((error) => {
      alert("Signup failed: " + error.message);
    });
}
