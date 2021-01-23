const gameContainer = document.getElementById("game");

const scoreCard = document.querySelector('#score p');

/* Empty Global Array to log events */
const eventLog = [];

/* A flag to check if click events should run */
let noClick = false;
let gameStart = false;
let guessCount = 0;
let cardsMatched = 0;

const COLORS = [
  "Salmon",
  "PaleTurquoise",
  "PaleGreen",
  "PeachPuff",
  "Orchid",
  "#ad5cad",
  "Salmon",
  "PaleTurquoise",
  "PaleGreen",
  "PeachPuff",
  "Orchid",
  "#ad5cad"
];

function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

let shuffledColors = shuffle(COLORS);

function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    const newDiv = document.createElement('div');
    newDiv.classList.add(color);
    newDiv.addEventListener('click', handleCardClick);
    gameContainer.append(newDiv);
  }
}

/* Logs the event target into the eventLog */
function logEvent(target) {
  eventLog.push(target);
}

/* Clears elements in the eventLog */
function clearEventLog() {
  eventLog.length = 0;
}

/* Checks if the target already contains the 'clicked' id.
Throws an exception if true */
function checkIdExists(target) {
  if (target.id === 'clicked') {
    throw 'You already selected this card!';
  }
}

function handleCardClick(event) {
  /* If noClick is true, prevent any clicks from running this code */
  if (noClick) return;

  let target = event.target;
  /* Flip over the card */
  target.style.backgroundColor = target.classList;
  /* Increment the guess count and update the score */

  try {
    checkIdExists(target);
    target.setAttribute('id', 'clicked');
    logEvent(target);
  } catch(error) {
    target.removeAttribute('id');
    target.removeAttribute('style');
    clearEventLog();
    alert(error);
    scoreCard.innerText = `Your Score: ${guessCount}`;
    return;
  }

  guessCount += 1

  if (eventLog.length === 2) {
    /* While two cards are in play, 
    prevent any further clicks */
    noClick = true;
    const firstCard = eventLog[0];
    const secondCard = eventLog[1];
    if (firstCard.className === secondCard.className) {
      firstCard.removeEventListener('click', handleCardClick);
      secondCard.removeEventListener('click', handleCardClick);
      clearEventLog();
      noClick = false;
      cardsMatched += 2;
    } else {
      setTimeout(function() {
        firstCard.removeAttribute('style');
        secondCard.removeAttribute('style');
        firstCard.removeAttribute('id');
        secondCard.removeAttribute('id');
        clearEventLog();
        noClick = false;
      }, 1500);
    }
  }
  scoreCard.innerText = `Your Score: ${guessCount}`;
  if (cardsMatched === COLORS.length) {
    playAgain();
  }
}

const start = document.getElementById('start');

if (!gameStart) {
  const bestScore = document.querySelector('#bestscore p');
  if (localStorage.length !== 0) {
    bestScore.innerText = `Best Score: ${getBestScore()}`;
  }
  start.addEventListener('click', function startGame() {
    gameStart = true;
    createDivsForColors(shuffledColors);
    start.removeEventListener('click', startGame);
    start.remove();
  });
}

function playAgain() {
  const buttonLocation = document.querySelector('#button');
  const newGame = document.createElement('button');
  const bestScore = document.querySelector('#bestscore p');
  newGame.innerText = 'Play Again?';
  buttonLocation.append(newGame);

  newGame.addEventListener('click', function restartGame() {
    saveScore();
    bestScore.innerText = `Best Score: ${getBestScore()}`;
    cardsMatched = 0;
    guessCount = 0;
    gameContainer.innerHTML = '';
    scoreCard.innerHTML = 'Your Score: 0';
    shuffle(COLORS);
    createDivsForColors(shuffledColors);
    newGame.removeEventListener('click', restartGame);
    newGame.remove();
  });
}

function saveScore() {
  if (localStorage.length !== 0) {
    const savedScore = getBestScore();
    if (guessCount < savedScore) {
      localStorage.removeItem('Best Score');
      localStorage.setItem('Best Score', guessCount);
    }
  } else {
    localStorage.setItem('Best Score', guessCount);
  }
}

function getBestScore() {
  return localStorage.getItem('Best Score');
}


