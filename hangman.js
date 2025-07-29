// Hangman Game Logic for hangman.html

// --- CONFIGURABLE WORDS & HINTS ---
const WORDS = [
  { word: 'HODL', hint: 'Crypto diamond hands.' },
  { word: 'FUD', hint: 'Negative market vibes.' },
  { word: 'FOMO', hint: 'You feel this when price pumps.' },
  { word: 'MOON', hint: 'Destination for rockets.' },
  { word: 'REKT', hint: 'Not what you want after a trade.' },
  { word: 'BAGHOLDER', hint: 'Left holding these after a dump.' },
  { word: 'WHALE', hint: 'Moves the market with a splash.' },
  { word: 'SHILL', hint: 'Promoting, sometimes too much.' },
  { word: 'PUMP', hint: 'Up only, for now.' },
  { word: 'DUMP', hint: 'Down only, for now.' },
  { word: 'DEGEN', hint: 'YOLO trader.' },
  { word: 'LAMBO', hint: 'Crypto dream car, but not a car.' },
  { word: 'WEN', hint: 'Impatient question.' },
  { word: 'WAGMI', hint: 'Optimistic crypto chant.' },
  { word: 'NGMI', hint: 'Pessimistic crypto chant.' },
  { word: 'APE', hint: 'Buys in with little research.' },
  { word: 'PEPE', hint: 'Green meme, not a frog (or is it?).' },
  { word: 'DOGE', hint: 'Much wow.' },
  { word: 'SHIBA', hint: 'Another dog, not DOGE.' },
  { word: 'BONK', hint: 'What you do to Brett, or a sound.' },
  { word: 'BRETT', hint: 'He’s not Pepe, but close.' },
  { word: 'CHAD', hint: 'Alpha male meme.' },
  { word: 'JEET', hint: 'Sells early, regrets later.' },
  { word: 'CHART', hint: 'You read this to trade.' },
  { word: 'MEME', hint: 'Internet currency.' },
  { word: 'HYPE', hint: 'Builds before a launch.' },
  { word: 'BOT', hint: 'Not a human trader.' },
  { word: 'GROK', hint: 'To understand, but deeper.' },
  { word: 'BONKING', hint: 'Continuous action, not just once.' },
  { word: 'XORIGINALS', hint: 'Exclusive, but not obvious.' },
  { word: 'MATT FURIE', hint: 'He drew a famous frog.' }
];
const MAX_WRONG = 10;
const HINT_AFTER = 9;
const TIMER_START = 60; // seconds

// --- DOM ELEMENTS ---
const timerEl = document.getElementById('hangman-timer');
const scoreEl = document.getElementById('hangman-score');
const brettImg = document.getElementById('hangman-brett-img');
const wordEl = document.getElementById('hangman-word');
const hintEl = document.getElementById('hangman-hint');
const keyboardEl = document.getElementById('hangman-keyboard');
const resetBtn = document.getElementById('hangman-reset-btn');
const popupOverlay = document.getElementById('hangman-popup-overlay');
const popupScore = document.getElementById('hangman-popup-score');
const popupBtn = document.getElementById('hangman-popup-btn');
const wrongCountEl = document.getElementById('hangman-wrong-count');
const plusOneEl = document.getElementById('hangman-plusone');
const rulesOverlay = document.getElementById('hangman-rules-overlay');
const rulesBtn = document.getElementById('hangman-rules-btn');
const popupTitle = document.getElementById('hangman-popup-title');
const popupXBtn = document.getElementById('hangman-popup-x-btn');

// --- GAME STATE ---
let currentWordIdx = 0;
let currentWord = '';
let currentHint = '';
let guessed = [];
let wrong = 0;
let score = 0;
let timer = TIMER_START;
let timerInterval = null;
let gameActive = true;

// --- IMAGE PATHS ---
const SHADY_BRETT = 'assets/Shady Brett.svg';
const ANGRY_BRETT = 'assets/Angry Brett.svg';

// --- AUDIO ---
const chadAudio = new Audio('assets/CHAD AUDIO.mp3');
const jeetAudio = new Audio('assets/JEET AUDIO.mp3');
chadAudio.volume = 0.8;
jeetAudio.volume = 0.8;

function playChadAudio() {
  chadAudio.currentTime = 0;
  chadAudio.play();
}
function playJeetAudio() {
  jeetAudio.currentTime = 0;
  jeetAudio.play();
}

// --- UTILS ---
function shuffleWords() {
  // Fisher-Yates shuffle
  for (let i = WORDS.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [WORDS[i], WORDS[j]] = [WORDS[j], WORDS[i]];
  }
}

function pickNextWord() {
  currentWordIdx = (currentWordIdx + 1) % WORDS.length;
  currentWord = WORDS[currentWordIdx].word.toUpperCase();
  currentHint = WORDS[currentWordIdx].hint;
}

function displayWord() {
  let display = '';
  for (let char of currentWord) {
    if (char === ' ') {
      display += '  ';
    } else if (guessed.includes(char)) {
      display += char + ' ';
    } else {
      display += '_ ';
    }
  }
  wordEl.textContent = display.trim();
}

function displayKeyboard() {
  keyboardEl.innerHTML = '';
  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i);
    const btn = document.createElement('button');
    btn.className = 'hangman-key';
    btn.textContent = letter;
    btn.disabled = guessed.includes(letter) || !gameActive;
    btn.addEventListener('click', () => handleGuess(letter));
    keyboardEl.appendChild(btn);
  }
}

function displayHint() {
  if (wrong >= HINT_AFTER) {
    hintEl.style.display = 'block';
    hintEl.textContent = 'Hint: ' + currentHint;
  } else {
    hintEl.style.display = 'none';
  }
}

function displayWrongCount() {
  wrongCountEl.textContent = `Wrong: ${wrong} / ${MAX_WRONG}`;
}

function updateScore() {
  scoreEl.textContent = 'Score: ' + score;
  popupScore.textContent = 'Score: ' + score;
}

function updateTimer() {
  const min = String(Math.floor(timer / 60)).padStart(2, '0');
  const sec = String(timer % 60).padStart(2, '0');
  timerEl.textContent = `Time Left: ${min}:${sec}`;
}

function setBrettImage(src, fade = true) {
  if (fade) {
    brettImg.style.opacity = 0;
    setTimeout(() => {
      brettImg.src = src;
      brettImg.style.opacity = 1;
    }, 200);
  } else {
    brettImg.src = src;
  }
}

function showAngryBrett() {
  setBrettImage(ANGRY_BRETT);
  setTimeout(() => setBrettImage(SHADY_BRETT), 1000);
}

function showPopup() {
  popupOverlay.style.display = 'flex';
}

function hidePopup() {
  popupOverlay.style.display = 'none';
}

// Show rules overlay before game starts
let gameStarted = false;
function showRules() {
  rulesOverlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function hideRules() {
  rulesOverlay.style.display = 'none';
  document.body.style.overflow = '';
  gameStarted = true;
  resetGame(true);
}
rulesBtn.addEventListener('click', hideRules);
showRules();

function endGame() {
  gameActive = false;
  clearInterval(timerInterval);
  showPopup();
  displayKeyboard();
  // Show final score clearly
  popupTitle.textContent = 'Game Over';
  popupScore.textContent = 'Final Score: ' + score;
  popupXBtn.style.display = 'block';
}

function resetGame(full = false) {
  if (!gameStarted) return;
  if (full) {
    score = 0;
    shuffleWords();
    currentWordIdx = -1;
    timer = TIMER_START;
  }
  pickNextWord();
  guessed = [];
  wrong = 0;
  gameActive = true;
  setBrettImage(SHADY_BRETT, false);
  hidePopup();
  displayWord();
  displayKeyboard();
  displayHint();
  displayWrongCount();
  updateScore();
  updateTimer();
  if (full) {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (!gameActive) return;
      timer--;
      updateTimer();
      if (timer <= 0) {
        timer = 0;
        updateTimer();
        endGame();
      }
    }, 1000);
  }
}

function showPlusOne() {
  plusOneEl.classList.remove('show');
  void plusOneEl.offsetWidth; // force reflow for animation restart
  plusOneEl.classList.add('show');
  setTimeout(() => {
    plusOneEl.classList.remove('show');
  }, 700);
}

function handleGuess(letter) {
  if (!gameActive || guessed.includes(letter)) return;
  guessed.push(letter);
  if (currentWord.includes(letter)) {
    // Award 1 point for each new correct letter guessed
    score++;
    updateScore();
    showPlusOne();
    displayWord();
    if (currentWord.split('').every(c => c === ' ' || guessed.includes(c))) {
      // Word solved
      // Add 30 seconds to timer, max 5 minutes
      timer = Math.min(timer + 30, 300);
      updateTimer();
      playChadAudio();
      setTimeout(() => {
        resetGame();
      }, 900);
    }
  } else {
    wrong++;
    showAngryBrett();
    displayHint();
    displayWrongCount();
    if (wrong >= MAX_WRONG) {
      // Out of guesses, move to next word, do not end game
      playJeetAudio();
      setTimeout(() => {
        resetGame();
      }, 1200);
      return;
    }
  }
  displayKeyboard();
}

resetBtn.addEventListener('click', () => resetGame(true));
popupBtn.addEventListener('click', () => resetGame(true));

// Optionally, add a click handler for the X button (opens X with score prefilled)
popupXBtn.addEventListener('click', function() {
  const scoreText = `I scored ${score} in Brett Hangman! Try to beat me!`;
  const gameLink = window.location.origin + window.location.pathname;
  const hashtags = '#Brett #BrettOnBonk #HangOnMate';
  const tweetText = `${scoreText}\n\nTry it yourself ${gameLink}\n\n${hashtags}`;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
  window.open(url, '_blank');
});

// --- MUSIC BUTTON ---
// Add music button to page
// const musicBtn = document.createElement('button');
// musicBtn.id = 'music-toggle-btn';
// musicBtn.textContent = 'Play Music';
// musicBtn.style.position = 'fixed';
// musicBtn.style.top = '1.2rem';
// musicBtn.style.left = '1.2rem';
// musicBtn.style.zIndex = '3001';
// document.body.appendChild(musicBtn);

// const bgMusic = new Audio('assets/Brett Song.mp3');
// bgMusic.loop = true;
// bgMusic.volume = 0.7;
// let musicPlaying = false;

// musicBtn.addEventListener('click', function() {
//   if (musicPlaying) {
//     bgMusic.pause();
//     musicBtn.textContent = 'Play Music';
//     musicPlaying = false;
//   } else {
//     bgMusic.play();
//     musicBtn.textContent = 'Pause Music';
//     musicPlaying = true;
//   }
// });
// // Optional: Pause music when leaving or reloading page
// window.addEventListener('beforeunload', () => {
//   bgMusic.pause();
//   musicPlaying = false;
//   musicBtn.textContent = 'Play Music';
// });

// --- INIT ---
shuffleWords();
currentWordIdx = -1;
resetGame(true); 