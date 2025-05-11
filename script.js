// Firebase Config
const firebaseConfig = {
   apiKey: "AIzaSyA0tfVT75kWle3uwz1HouHRQdEWyzW1YNU",
  authDomain: "chat-code-forum.firebaseapp.com",
  projectId: "chat-code-forum",
  storageBucket: "chat-code-forum.firebasestorage.app",
  messagingSenderId: "496765673859",
  appId: "1:496765673859:web:6c2e6695be447d6e32d6b6",
  measurementId: "G-XJKWXHF8WN"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ========== Auth Functions ==========

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch(error => alert(error.message));
}

function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const username = document.getElementById('username').value;

  if (!username) {
    alert("Please enter a username for Sign Up.");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(cred => {
      // Save username to Firestore under user UID
      return db.collection('users').doc(cred.user.uid).set({
        username: username
      });
    })
    .then(() => {
      window.location.href = "index.html";
    })
    .catch(error => alert(error.message));
}

function logout() {
  auth.signOut()
    .then(() => {
      window.location.href = "login.html";
    });
}

// ========== Protect Routes & Show Username ==========
auth.onAuthStateChanged(user => {
  const path = window.location.pathname;

  if (user) {
    if (path.includes('index.html')) {
      // Load username from Firestore
      db.collection('users').doc(user.uid).get()
        .then(doc => {
          const username = doc.data().username || "Anonymous";
          document.getElementById('user-name').innerText = `Welcome, ${username}!`;
        });
    }
  } else {
    // If not logged in, force back to login.html
    if (path.includes('index.html')) {
      window.location.href = "login.html";
    }
  }
});

// ========== Send Message ==========
function sendMessage() {
  const messageInput = document.getElementById('chat-message');
  const message = messageInput.value.trim();

  if (message !== "") {
    const chatBox = document.getElementById('chat-box');
    const userName = document.getElementById('user-name').innerText;

    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `
      <span class="message-user">${userName}:</span>
      <span class="message-text">${message}</span>
    `;

    chatBox.appendChild(messageElement);
    messageInput.value = "";
  }
}

// ========== Edit Username ==========
function editUsername() {
  const newUsername = prompt("Enter your new username:");
  if (newUsername) {
    const user = auth.currentUser;
    db.collection('users').doc(user.uid).update({
      username: newUsername
    }).then(() => {
      document.getElementById('user-name').innerText = `Welcome, ${newUsername}!`;
      alert("Username updated!");
    });
  }
}
