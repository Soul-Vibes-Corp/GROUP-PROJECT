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
