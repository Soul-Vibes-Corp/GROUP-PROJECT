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

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

const signUpForm = document.getElementById('sign-up-form');

signUpForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const name = document.getElementById('full-name').value;
  const dob = document.getElementById('dob').value;
  const profilePicture = document.getElementById('profile-picture').files[0];
  
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(name + "@gmail.com", "defaultpassword"); // Generate user email
    const user = userCredential.user;
    
    // Upload profile picture to Firebase Storage
    const storageRef = storage.ref('profile_pictures/' + user.uid);
    await storageRef.put(profilePicture);
    const pictureURL = await storageRef.getDownloadURL();
    
    // Store user data in Firestore
    await db.collection('users').doc(user.uid).set({
      fullName: name,
      dateOfBirth: dob,
      profilePicture: pictureURL
    });
    
    // Redirect to the chat page
    window.location.href = "index.html";
    
  } catch (error) {
    console.error("Error signing up: ", error);
  }
});

const auth = firebase.auth();
const db = firebase.firestore();

const chatBox = document.getElementById('chat-box');
const chatMessageInput = document.getElementById('chat-message');
const sendButton = document.getElementById('send-btn');
const userName = document.getElementById('user-name');
const userProfilePic = document.getElementById('user-profile-pic');

// Ensure the user is authenticated
auth.onAuthStateChanged(async (user) => {
  if (user) {
    // Fetch user profile data
    const userDoc = await db.collection('users').doc(user.uid).get();
    const userData = userDoc.data();
    userName.textContent = userData.fullName;
    userProfilePic.src = userData.profilePicture;

    // Load chat history
    const chatRef = db.collection('chats');
    chatRef.orderBy('timestamp').onSnapshot(snapshot => {
      chatBox.innerHTML = ''; // Clear the chat box
      snapshot.forEach(doc => {
        const msgData = doc.data();
        const messageElement = document.createElement('div');
        messageElement.textContent = `${msgData.userName}: ${msgData.message}`;
        chatBox.appendChild(messageElement);
      });
    });

    // Send new messages
    sendButton.addEventListener('click', async () => {
      const message = chatMessageInput.value;
      if (message) {
        await db.collection('chats').add({
          userName: userData.fullName,
          message: message,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        chatMessageInput.value = ''; // Clear input field
      }
    });
  } else {
    window.location.href = "login.html"; // Redirect to login if user is not authenticated
  }
});
