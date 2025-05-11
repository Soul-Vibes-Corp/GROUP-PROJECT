// script.js

// Your repo details
const GITHUB_USER = 'soulvibescorp';
const REPO_NAME = 'GROUP-PROJECT';
const ISSUE_NUMBER = 1;  // Your created issue number
const TOKEN = 'YOUR_GITHUB_TOKEN_HERE'; // Replace this ONLY for testing privately

// --- Login Functions ---
function login() {
    const username = document.getElementById('usernameInput').value.trim();
    if (username.length < 3) {
        alert('Username must be at least 3 characters');
        return;
    }
    localStorage.setItem('chatUsername', username);
    window.location.href = 'chat.html';
}

function logout() {
    localStorage.removeItem('chatUsername');
    window.location.href = 'index.html';
}

function editUsername() {
    const newUsername = prompt('Enter new username:');
    if (newUsername && newUsername.trim().length >= 3) {
        localStorage.setItem('chatUsername', newUsername.trim());
        document.getElementById('currentUsername').innerText = `Username: ${newUsername}`;
    } else {
        alert('Username must be at least 3 characters');
    }
}

// --- Chat Functions ---
async function sendMessage() {
    const username = localStorage.getItem('chatUsername') || 'Anonymous';
    const message = document.getElementById('messageInput').value.trim();
    if (message.length === 0) return;

    const fullMessage = `**${username}:** ${message}`;

    const url = `https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/issues/${ISSUE_NUMBER}/comments`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `token ${TOKEN}`,
            'Accept': 'application/vnd.github+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ body: fullMessage })
    });

    if (response.ok) {
        document.getElementById('messageInput').value = '';
        loadMessages();
    } else {
        alert('Error sending message. Please try again.');
    }
}

async function loadMessages() {
    const url = `https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/issues/${ISSUE_NUMBER}/comments`;
    const response = await fetch(url);
    const comments = await response.json();

    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML = '';

    comments.forEach(comment => {
        const div = document.createElement('div');
        div.classList.add('chat-message');
        div.innerHTML = marked.parse(comment.body); // allows Markdown rendering
        chatBox.appendChild(div);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
}

// --- On Chat Page Load ---
if (window.location.pathname.includes('chat.html')) {
    const username = localStorage.getItem('chatUsername');
    if (!username) window.location.href = 'index.html';
    document.getElementById('currentUsername').innerText = `Username: ${username}`;
    loadMessages();
    setInterval(loadMessages, 5000); // auto-refresh every 5 sec
}
