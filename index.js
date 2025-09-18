window.addEventListener("load", () => {
    const loadingScreen = document.querySelector(".loading-screen");
    const mainContent = document.querySelector(".main");

    setTimeout(() => {
      loadingScreen.style.display = "none"; 
      mainContent.style.display = "block";
      typeWriterEffect(); 
    }, 3500); 
  });

const cardContainer = document.getElementById("card-container");

const cardImages = Array.from({ length: 12 }, (_, i) => `images/card${i + 1}.jpeg`);
let cardsArray = [...cardImages, ...cardImages]; 

cardsArray = cardsArray.sort(() => Math.random() - 0.5);

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let score =0;

const scoreElement = document.getElementById("score");

function createCard(image) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-image", image);

    const front = document.createElement("div");
    front.classList.add("front");
    front.style.backgroundImage = `url(${image})`;

    const back = document.createElement("div");
    back.classList.add("back"); 
    
    card.appendChild(front);
    card.appendChild(back);
    card.addEventListener("click", flipCard);
    return card;
}

function flipCard() {
    if (lockBoard || this === firstCard) return;

    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        checkForMatch();
    }
}

function checkForMatch() {
    lockBoard = true;

    const isMatch = firstCard.getAttribute("data-image") === secondCard.getAttribute("data-image");

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

let matchedPairs = 0;

function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    score++;
    matchedPairs++;
    updateScore();
    resetBoard();
    checkWinCondition();
}

function checkWinCondition() {
    if (matchedPairs === cardsArray.length / 2) {
        stopTimer();
        displayWinMessage();
    }
}

function displayWinMessage() {
    const winMessage = document.createElement("h1");
    winMessage.textContent = "YOU WON !";
    winMessage.classList.add("win-message");
    titleElement.style.display = "none";
    document.body.insertBefore(winMessage, document.body.firstChild);
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
}


function initializeGame() {
    cardContainer.innerHTML = "";  
    shuffleCards();  
    cardsArray.forEach(image => {
        const card = createCard(image);  
        cardContainer.appendChild(card); 
    });
    resetScore();
    startTimer();
} 

function resetScore() {
    score = 0;
    updateScore();
}


function shuffleCards() {
   
    cardsArray = [...cardImages, ...cardImages];
    cardsArray = cardsArray.sort(() => Math.random() - 0.5);
}

const titleElement = document.getElementById("title");

const fullText = "Memory Game !";
let currentText = "";
let index = 0;

function typeWriterEffect() {
    currentText = "";
    index = 0;
    function typeNextLetter() {
    if (index < fullText.length) {
        currentText += fullText[index];
        titleElement.textContent = currentText;
        index++;
        setTimeout(typeNextLetter,150);
    } else {
        startBlinkEffect(); 
    }
  }
  typeNextLetter();
}

function startBlinkEffect() {
    let blinkCount = 0;
    const blinkInterval = setInterval(() => {
        titleElement.style.visibility =
            titleElement.style.visibility === "hidden" ? "visible" : "hidden";
        blinkCount++;

        if (blinkCount === 6) { 
            clearInterval(blinkInterval);
            titleElement.style.visibility = "visible"; 
        }
    }, 500); 
}

const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");

startButton.addEventListener("click", () => {
    startButton.disabled = true;  
    initializeGame(); 
});

restartButton.addEventListener("click", () => {
    resetGame(); 
    resetTimer();
    startTimer();
});

const timerElement = document.getElementById("timer");
let timer;
let seconds = 0;
let minutes = 0;
let gameStarted = false;

function startTimer() {
    if (gameStarted) return; 

    gameStarted = true;
    timer = setInterval(() => {
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
        timerElement.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer); 
    gameStarted = false;
}

function resetTimer() {
    seconds = 0;
    minutes = 0;
    timerElement.textContent = "00:00"; 
    stopTimer(); 
}

restartButton.addEventListener("click", () => {
    resetGame();  
});

function resetGame() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    matchedPairs = 0;
    const winMessage = document.querySelector(".win-message");
    if (winMessage) {
        winMessage.remove();
    }
    titleElement.style.display = "block";
    resetScore();
    initializeGame();
    resetTimer();
    typeWriterEffect();
    startTimer();
}
