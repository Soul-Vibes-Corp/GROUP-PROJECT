// Initialize Firebase
const firebaseConfig = {
  // your firebase config here
};
firebase.initializeApp(firebaseConfig);

// Login Function
function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      alert('Login successful!');
      window.location.href = "chat.html";  // Redirect after login
    })
    .catch((error) => {
      alert(error.message);
    });
}

// Optional: Sign up function (same redirect after sign up)
function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert('Signup successful!');
      window.location.href = "chat.html";
    })
    .catch((error) => {
      alert(error.message);
    });
}

// Logout
function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "login.html";  // Redirect to login on logout
  });
}
