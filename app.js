// Toggle dark mode
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
  localStorage.setItem('theme', current === 'dark' ? 'light' : 'dark');
}

// Load saved theme
(function() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

// Vote logic (localStorage-based)
function upvote(questionId, answerIndex) {
  const questions = JSON.parse(localStorage.getItem('questions') || '[]');
  questions.forEach(q => {
    if (q.id === questionId) {
      q.answers[answerIndex].votes = (q.answers[answerIndex].votes || 0) + 1;
    }
  });
  localStorage.setItem('questions', JSON.stringify(questions));
  location.reload();
}

function downvote(questionId, answerIndex) {
  const questions = JSON.parse(localStorage.getItem('questions') || '[]');
  questions.forEach(q => {
    if (q.id === questionId) {
      q.answers[answerIndex].votes = (q.answers[answerIndex].votes || 0) - 1;
    }
  });
  localStorage.setItem('questions', JSON.stringify(questions));
  location.reload();
}

// Delete Question
function deleteQuestion(id) {
  const code = prompt('Enter admin code to delete this question:');
  if (code !== '1997') {
    alert('Incorrect admin code. Deletion cancelled.');
    return;
  }

  let questions = JSON.parse(localStorage.getItem('questions') || '[]');
  questions = questions.filter(q => q.id !== id);
  localStorage.setItem('questions', JSON.stringify(questions));

  renderFeed?.();  // For homepage
  renderQuestions?.(); // For search filtered page
  renderYourQuestions?.(); // For profile page
}

// Assuming this function exists in app.js
function accessCodespace(id, password) {
  const codespace = JSON.parse(localStorage.getItem(`codespace_${id}`));
  if (!codespace) {
    alert("Codespace not found!");
    return;
  }
  if (codespace.password === password) {
    alert("Access granted!");
    // Load the codespace and allow editing
  } else {
    alert("Incorrect password!");
  }
}

// Highlight active nav link
(function highlightActiveNav() {
  const links = document.querySelectorAll('.nav-link');
  const currentPage = location.pathname.split('/').pop();

  links.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
})();


// Render user's own questions
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

renderYourQuestions();
