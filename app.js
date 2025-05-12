// ================================
// Theme toggle & persistence
// ================================
function toggleTheme() {
  const root = document.documentElement;
  const currentTheme = root.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  root.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Apply saved theme on page load
(function applySavedTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
})();

// ================================
// Navigation active link highlight
// ================================
(function highlightActiveNav() {
  const links = document.querySelectorAll('.nav-link');
  const currentPage = location.pathname.split('/').pop();

  links.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
})();

// ================================
// Voting logic (upvote / downvote)
// ================================
function updateVote(questionId, answerIndex, change) {
  const questions = JSON.parse(localStorage.getItem('questions') || '[]');
  questions.forEach(q => {
    if (q.id === questionId) {
      q.answers[answerIndex].votes = (q.answers[answerIndex].votes || 0) + change;
    }
  });
  localStorage.setItem('questions', JSON.stringify(questions));
  location.reload();
}

function upvote(questionId, answerIndex) {
  updateVote(questionId, answerIndex, 1);
}

function downvote(questionId, answerIndex) {
  updateVote(questionId, answerIndex, -1);
}

// ================================
// Delete question (admin code)
// ================================
function deleteQuestion(id) {
  const code = prompt('Enter admin code to delete this question:');
  if (code !== '1997') {
    alert('Incorrect admin code. Deletion cancelled.');
    return;
  }

  let questions = JSON.parse(localStorage.getItem('questions') || '[]');
  questions = questions.filter(q => q.id !== id);
  localStorage.setItem('questions', JSON.stringify(questions));

  renderFeed?.();          // Home feed
  renderQuestions?.();     // Search page
  renderYourQuestions?.(); // Profile page
}

// ================================
// Codespace access
// ================================
function accessCodespace(id, password) {
  const codespace = JSON.parse(localStorage.getItem(`codespace_${id}`));
  if (!codespace) {
    alert("Codespace not found!");
    return;
  }
  if (codespace.password === password) {
    alert("Access granted!");
    // You can add logic here to load the codespace content for editing
  } else {
    alert("Incorrect password!");
  }
}

// ================================
// Render user's own questions (Profile page)
// ================================
function renderYourQuestions() {
  const yourQ = document.getElementById('yourQuestions');
  const name = localStorage.getItem('username');
  const questions = JSON.parse(localStorage.getItem('questions') || '[]');
  const mine = questions.filter(q => q.author === name);

  yourQ.innerHTML = '';

  if (!name) {
    yourQ.innerHTML = '<p><em>Enter your name to see your questions.</em></p>';
    return;
  }

  if (mine.length === 0) {
    yourQ.innerHTML = '<p><em>No questions posted yet.</em></p>';
    return;
  }

  mine.forEach(q => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <h3>${q.title}</h3>
      <p>${q.description}</p>
      <small><strong>${q.answers.length}</strong> answers</small>
      <button onclick="deleteQuestion('${q.id}')">Delete</button>
    `;
    yourQ.appendChild(div);
  });
}

// Automatically call this if #yourQuestions exists (profile page)
if (document.getElementById('yourQuestions')) {
  renderYourQuestions();
}
