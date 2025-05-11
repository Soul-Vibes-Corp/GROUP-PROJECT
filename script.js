// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyA0tfVT75kWle3uwz1HouHRQdEWyzW1YNU",
  authDomain: "chat-code-forum.firebaseapp.com",
  projectId: "chat-code-forum",
  storageBucket: "chat-code-forum.firebasestorage.app",
  messagingSenderId: "496765673859",
  appId: "1:496765673859:web:6c2e6695be447d6e32d6b6",
  measurementId: "G-XJKWXHF8WN"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Function to handle Sign Up
function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  if (email !== "" && password !== "") {
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Sign Up successful, redirect to profile page
        alert("Sign Up Successful!");
        window.location.href = "profile.html"; // Redirect to profile page
      })
      .catch((error) => {
        alert(error.message); // Show error message if any
      });
  } else {
    alert("Please enter email and password");
  }
}

// Function to handle Log In
function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (email !== "" && password !== "") {
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Log In successful, redirect to chat forum
        alert("Login Successful!");
        window.location.href = "chat.html"; // Redirect to chat page
      })
      .catch((error) => {
        alert(error.message); // Show error message if any
      });
  } else {
    alert("Please enter email and password");
  }
}

// Function to handle Log Out
function logout() {
  auth.signOut().then(() => {
    alert("Logged out successfully!");
    window.location.href = "login.html"; // Redirect to login page
  }).catch((error) => {
    alert(error.message); // Show error message if any
  });
}

// Function to update user profile (username and picture)
function updateProfile() {
  const user = firebase.auth().currentUser;
  const username = document.getElementById('username').value;
  const profilePic = document.getElementById('profile-pic').files[0];

  if (username !== "") {
    user.updateProfile({
      displayName: username
    }).then(() => {
      alert("Profile updated successfully!");
      saveProfilePic(profilePic);
    }).catch((error) => {
      alert(error.message);
    });
  } else {
    alert("Please enter a username");
  }
}

// Function to save profile picture to Firebase Storage
function saveProfilePic(profilePic) {
  if (profilePic) {
    const storageRef = firebase.storage().ref();
    const picRef = storageRef.child(`profile_pics/${firebase.auth().currentUser.uid}.jpg`);

    picRef.put(profilePic).then(() => {
      picRef.getDownloadURL().then((url) => {
        firebase.auth().currentUser.updateProfile({
          photoURL: url
        }).then(() => {
          alert("Profile picture uploaded!");
        }).catch((error) => {
          alert(error.message);
        });
      });
    }).catch((error) => {
      alert(error.message);
    });
  }
}

// Function to display all messages in the chat forum
function displayMessages() {
  const chatBox = document.getElementById('chat-box');

  db.collection("messages").orderBy("timestamp", "asc").onSnapshot((querySnapshot) => {
    chatBox.innerHTML = ""; // Clear existing messages

    querySnapshot.forEach((doc) => {
      const messageData = doc.data();
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message");
      messageDiv.innerHTML = `<strong>${messageData.user}</strong>: ${messageData.message}`;
      chatBox.appendChild(messageDiv);
    });
  });
}

// Function to send a message to the Firestore database
function sendMessage() {
  const message = document.getElementById('chat-message').value;
  const user = firebase.auth().currentUser;

  if (message !== "") {
    db.collection("messages").add({
      message: message,
      user: user.displayName || user.email, // Use displayName if available, else email
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      document.getElementById('chat-message').value = ""; // Clear the input field
      displayMessages(); // Refresh the chat
    }).catch((error) => {
      alert("Error sending message: " + error.message);
    });
  }
}

// Function to handle username setting on first login
function setUsername() {
  const user = firebase.auth().currentUser;
  const username = document.getElementById('username').value;

  if (username && user) {
    user.updateProfile({ displayName: username })
      .then(() => {
        alert("Username set successfully!");
        window.location.href = "chat.html"; // Redirect to chat page
      }).catch((error) => {
        alert(error.message);
      });
  }
}

// On page load, check if user is authenticated
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is logged in, show the chat or profile page
    if (window.location.pathname.includes("chat.html")) {
      displayMessages(); // Display chat messages if on the chat page
    }
    // You can add other page redirects based on authentication state here
  } else {
    // User is not logged in, redirect to login page
    if (!window.location.pathname.includes("login.html")) {
      window.location.href = "login.html";
    }
  }
});
