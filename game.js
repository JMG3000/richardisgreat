const arena = document.querySelector('#arena');
const star = document.querySelector('#star');
const scoreOutput = document.querySelector('#score');
const message = document.querySelector('#message');
const reset = document.querySelector('#reset');

let score = 0;
let moveTimer;
const cheers = ['Nice catch!', 'Stellar!', 'Richard wins again!', 'Cosmic!', 'Too quick!'];

function moveStar() {
  const padding = 48;
  const x = padding + Math.random() * Math.max(0, arena.clientWidth - padding * 2);
  const y = padding + Math.random() * Math.max(0, arena.clientHeight - padding * 2);
  star.style.left = `${x}px`;
  star.style.top = `${y}px`;
}

async function saveScore() {
  try {
    const response = await fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score })
    });
    if (!response.ok) throw new Error('Score rejected');
  } catch {
    message.textContent = 'Still stellar — score saved locally.';
  }
}

star.addEventListener('click', () => {
  score += 1;
  scoreOutput.textContent = score;
  message.textContent = cheers[(score - 1) % cheers.length];
  moveStar();
  clearTimeout(moveTimer);
  moveTimer = setTimeout(moveStar, 850);
  saveScore();
});

reset.addEventListener('click', () => {
  score = 0;
  scoreOutput.textContent = '0';
  message.textContent = 'Ready when you are, Richard.';
  clearTimeout(moveTimer);
  star.style.left = '50%';
  star.style.top = '50%';
  star.focus();
});
