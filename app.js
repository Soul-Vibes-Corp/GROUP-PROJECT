// app.js
function toggleTheme() {
  document.body.classList.toggle('dark');
}

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
