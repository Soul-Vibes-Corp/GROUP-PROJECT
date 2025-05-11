// ✅ CONFIGURE YOUR FIREBASE APP HERE ↓↓↓ (replace with your Firebase project config)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

let currentUser = null;
let chattingWith = null;

// Auth Functions
function signup() {
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;
  auth.createUserWithEmailAndPassword(email, pass).catch(alert);
}

function login() {
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;
  auth.signInWithEmailAndPassword(email, pass).catch(alert);
}

function logout() {
  auth.signOut();
}

// Profile
function updateProfile() {
  const username = document.getElementById('username').value;
  const file = document.getElementById('profile-pic').files[0];
  const uid = auth.currentUser.uid;

  if (file) {
    const ref = storage.ref('profiles/' + uid);
    ref.put(file).then(() => {
      ref.getDownloadURL().then(url => {
        db.collection('users').doc(uid).set({ username, profilePic: url });
      });
    });
  } else {
    db.collection('users').doc(uid).set({ username });
  }
}

function loadUsers() {
  db.collection('users').onSnapshot(snapshot => {
    const list = document.getElementById('users-list');
    list.innerHTML = '';
    snapshot.forEach(doc => {
      if (doc.id !== currentUser.uid) {
        const data = doc.data();
        const li = document.createElement('li');
        li.textContent = data.username || doc.id;
        li.onclick = () => openChat(doc.id, data.username);
        list.appendChild(li);
      }
    });
  });
}

// Chat
function openChat(uid, username) {
  chattingWith = uid;
  document.getElementById('chat-with').textContent = username;
  document.getElementById('chat-section').classList.remove('hidden');
  listenForMessages();
}

function sendMessage() {
  const text = document.getElementById('chat-message').value;
  document.getElementById('chat-message').value = '';
  const messagesRef = db.collection('chats').doc(getChatId()).collection('messages');
  messagesRef.add({
    sender: currentUser.uid,
    text,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
}

function listenForMessages() {
  const chatBox = document.getElementById('chat-box');
  db.collection('chats').doc(getChatId()).collection('messages').orderBy('timestamp')
    .onSnapshot(snapshot => {
      chatBox.innerHTML = '';
      snapshot.forEach(doc => {
        const data = doc.data();
        const div = document.createElement('div');
        div.className = 'message';
        div.textContent = (data.sender === currentUser.uid ? 'Me: ' : 'Them: ') + data.text;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
      });
    });
}

function getChatId() {
  return currentUser.uid < chattingWith ? currentUser.uid + '_' + chattingWith : chattingWith + '_' + currentUser.uid;
}

// Code Sharing
function shareCode() {
  const code = document.getElementById('code-snippet').value;
  db.collection('codes').add({
    code,
    owner: currentUser.uid,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
}

function loadCodes() {
  db.collection('codes').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
    const container = document.getElementById('shared-codes');
    container.innerHTML = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      const pre = document.createElement('pre');
      const codeElem = document.createElement('code');
      codeElem.className = 'language-javascript';
      codeElem.textContent = data.code;
      pre.appendChild(codeElem);
      container.appendChild(pre);
      Prism.highlightElement(codeElem);
    });
  });
}

// Auth State Listener
auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    document.getElementById('profile-section').classList.remove('hidden');
    document.getElementById('users-section').classList.remove('hidden');
    document.getElementById('code-section').classList.remove('hidden');
    loadUsers();
    loadCodes();
    loadMyProfile();
  } else {
    currentUser = null;
    document.getElementById('profile-section').classList.add('hidden');
    document.getElementById('users-section').classList.add('hidden');
    document.getElementById('chat-section').classList.add('hidden');
    document.getElementById('code-section').classList.add('hidden');
  }
});

function loadMyProfile() {
  const uid = auth.currentUser.uid;
  db.collection('users').doc(uid).get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      document.getElementById('my-profile-info').innerHTML =
        `<strong>Username:</strong> ${data.username || ''}<br>
         <img src="${data.profilePic || ''}" width="100">`;
    }
  });
}
