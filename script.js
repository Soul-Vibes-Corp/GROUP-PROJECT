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

// Log Out Function
function logout() {
  auth.signOut().then(() => {
    alert("Logged out successfully!");
    window.location.href = "login.html"; // Redirect to login page
  }).catch((error) => {
    alert(error.message); // Show error message if any
  });
}

// Function to send message in chat
function sendMessage() {
  const message = document.getElementById('chat-message').value;
  if (message !== "") {
    const user = firebase.auth().currentUser;
    db.collection('messages').add({
      uid: user.uid,
      displayName: user.displayName,
      message: message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      document.getElementById('chat-message').value = "";
    }).catch((error) => {
      alert(error.message); // Show error message if any
    });
  }
}

// Fetch and display messages in real-time
function fetchMessages() {
  const chatBox = document.getElementById('chat-box');
  db.collection('messages').orderBy('timestamp').onSnapshot((querySnapshot) => {
    chatBox.innerHTML = ''; // Clear chat box before re-rendering
    querySnapshot.forEach((doc) => {
      const messageData = doc.data();
      const messageElement = document.createElement('div');
      messageElement.classList.add('message');
      
      const userName = document.createElement('span');
      userName.classList.add('message-user');
      userName.textContent = `${messageData.displayName}: `;
      
      const messageText = document.createElement('span');
      messageText.classList.add('message-text');
      messageText.textContent = messageData.message;
      
      messageElement.appendChild(userName);
      messageElement.appendChild(messageText);
      chatBox.appendChild(messageElement);
      chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
    });
  });
}

// Fetch messages when on chat page
if (window.location.pathname === "/chat.html") {
  fetchMessages();
}
