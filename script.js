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

// Logout function
function logout() {
  firebase.auth().signOut().then(() => {
    // Redirect to login page after logout
    window.location.href = "login.html";
  }).catch((error) => {
    alert("Logout failed: " + error.message);
  });
}

// Send message function (Chat)
function sendMessage() {
  const message = document.getElementById('chat-message').value;
  const user = firebase.auth().currentUser;

  if (message !== "") {
    // Save message to Firestore (or handle GitHub Issues here)
    const db = firebase.firestore();
    db.collection("messages").add({
      message: message,
      user: user.displayName || user.email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      document.getElementById('chat-message').value = ""; // clear message input
      displayMessages(); // Refresh the chat box
    }).catch((error) => {
      alert("Error sending message: " + error.message);
    });
  }
}

// Display messages in the chat box
function displayMessages() {
  const db = firebase.firestore();
  const chatBox = document.getElementById('chat-box');
  
  db.collection("messages").orderBy("timestamp", "asc").get().then((querySnapshot) => {
    chatBox.innerHTML = ""; // Clear existing messages
    querySnapshot.forEach((doc) => {
      const messageData = doc.data();
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message");
      messageDiv.innerHTML = `<strong>${messageData.user}</strong>: ${messageData.message}`;
      chatBox.appendChild(messageDiv);
    });
  }).catch((error) => {
    alert("Error fetching messages: " + error.message);
  });
}

// Firebase listener for initial load
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // Display username after login
    const userName = user.displayName || user.email;
    document.getElementById('chat-with').textContent = userName;
    displayMessages(); // Load existing chat messages
  } else {
    // Redirect to login if not logged in
    window.location.href = "login.html";
  }
});
