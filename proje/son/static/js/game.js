console.log("Game.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  addEventListeners();
});

/*
    const currentPath = window.location.pathname; // Mevcut URL yolu
    const currentPage = currentPath.split('/').pop();


*/


const gameState = {
  isGameRunning: false,
};

const results = document.getElementById("results");
const settings = document.getElementById("settings");
const paddle1 = document.getElementById("paddle1");
const paddle2 = document.getElementById("paddle2");
const paddle3 = document.getElementById("paddle3");
const ball = document.getElementById("ball");
const player1ScoreDisplay = document.getElementById("player1Score");
const player2ScoreDisplay = document.getElementById("player2Score");
const player3ScoreDisplay = document.getElementById("player3Score");
const firstPlaceDisplay = document.getElementById("firstPlace");
const secondPlaceDisplay = document.getElementById("secondPlace");
const thirdPlaceDisplay = document.getElementById("thirdPlace");

let players = [];
let currentMatch = 1;
let winner1 = "";
let winner2 = "";
let loser1 = "";
let loser2 = "";

console.log("Game.js loaded11111");
let paddle1Y = 150;
let paddle2Y = 150;
let ballX = 390;
let ballY = 190;
let ballSpeedX = 5;
let ballSpeedY = 5;
let player1Score = 0;
let player2Score = 0;
let player3Score = 0;
let player1Name = "";
let player2Name = "";
let player3Name = "";
// let currentMatch = 1;
// let winner1 = '';
// let winner2 = '';
let champion = "";
let thirdPlace = "";
// let players = [];
let losers = [];
let gameInterval;
let isPaused = true;
let isSinglePlayer = false;
let isGamePaused = false;

function addEventListeners() {
  console.log("addEventListeners çalışıyor");

  console.log("-----------------");

  const buttons = [
    { id: "startMatches", action: () => startMatches() },
    { id: "pauseGame", action: () => togglePause() },
    { id: "restartGame", action: () => resetGame() },
    { id: "saveSettings", action: () => saveSettings() },
    { id: "startbero", action: () => startbero() },
    { id: "startberoMulti", action: () => startberoMulti() },
  ];

  buttons.forEach(({ id, action }) => {
    const button = document.getElementById(id);
    if (button) {
      button.addEventListener("click", action);
      //console.log(`Button ${id} için event listener eklendi.`);
    } else {
      //console.warn(`${id} butonu bulunamadı.`);
    }
  });
}

function startbero() {
  console.log("berostart çalıştı");

  if (!gameState.isGameRunning) {
    // İlk kez başlatılıyorsa topu sıfırla
    resetBall();
    gameState.isGameRunning = true;
  }

  isSinglePlayer = true;
  players[1] = "AI";
  togglePause();
}

function startberoMulti() {
  console.log("berostart çalıştı");
  startTournament();
}

function startTournament() {
  isSinglePlayer = false;
  startMatches();
  console.log("Tournament Modu Başlatıldı");
}

function openSettings() {
  console.log("Ayarlar Menüsü Açıldı");
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("Sayfa yüklendi!");
  const currentPath = window.location.pathname; // Mevcut URL yolu
  const currentPage = currentPath.split("/").pop();

  if (currentPage === "game-multi") {
    console.log("1m", isSinglePlayer);
    player1Name = document.getElementById("player12").innerHTML;
    player2Name = document.getElementById("player22").value;
    player3Name = document.getElementById("player32").value;

    players = [player1Name, player2Name, player3Name];
    shuffle(players);

    player1Name = players[0];
    player2Name = players[1];
    player3Name = players[2];

    player1NameDisplay.innerText = player1Name;
    player2NameDisplay.innerText = player2Name;

    startTournament();
  }

  if (currentPage === "game-single") {
    player1Name = document.getElementById("player1Name").innerHTML;
    player2Name = "Computer";

    player1NameDisplay.innerText = player1Name;
    player2NameDisplay.innerText = player2Name;

    startbero();
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////

function startMatches() {
  console.log("Start matches button clicked");

  // Oyuncu isimlerini al
  players = [
    document.getElementById("player12").innerHTML,
    document.getElementById("player22").value,
    document.getElementById("player32").value, // olamdı sil
  ];
  shuffle(players); // Oyuncuları karıştır
  console.log("Shuffled players:", players);

  // İlk iki oyuncuyu seç
  let player1Name = players[0];
  let player2Name = players[1];

  // Oyuncu isimlerini güncelle
  let player1NameDisplay = document.getElementById("player1Name");
  let player2NameDisplay = document.getElementById("player2Name");

  if (player1NameDisplay && player2NameDisplay) {
    player1NameDisplay.innerText = player1Name;
    player2NameDisplay.innerText = player2Name;
  } else {
    console.error("Display elements are not defined correctly");
  }

  // Oyunu başlat
  resetGame();
  togglePause();
}

////////////////////////////////////////////////////////////////////////////////////////////////

function saveSettings() {
  console.log("Save settings button clicked");

  const paddle1 = document.getElementById("paddle1");
  const paddle2 = document.getElementById("paddle2");
  const ball = document.getElementById("ball");
  const paddle1Color = document.getElementById("paddle1Color").value;
  const paddle2Color = document.getElementById("paddle2Color").value;
  const ballColor = document.getElementById("ballColor").value;

  paddle1.style.backgroundColor = paddle1Color;
  paddle2.style.backgroundColor = paddle2Color;
  ball.style.backgroundColor = ballColor;
}
////////////////////////////////////////////////////////////////////////////////////////////////
function togglePause() {
  console.log("Pause game button clicked");
  if (!isPaused) {
    // Pause
    clearInterval(gameInterval);
    console.log("Game paused");
  } else {
    console.log("Game is already paused, no action needed");
    startGame();
  }
  isPaused = !isPaused; // Pause durumunu etkinleştir
  isGamePaused = isPaused;
}

// function togglePause() {
//   console.log("Pause game button clicked");
//   if (isPaused) {
//     console.log("Pause if");
//     startGame();
//   } else {
//     clearInterval(gameInterval);
//     console.log("pause else");
//   }
//   isPaused = !isPaused;
//   isGamePaused = isPaused;
// }

////////////////////////////////////////////////////////////////////////////////////////////////

// Oyun başlatma fonksiyonu
function startGame() {
  console.log("Game started");
  if (gameInterval) {
    clearInterval(gameInterval);
  }
  document.addEventListener("keydown", movePaddles);
  gameInterval = setInterval(updateGame, 1000 / 60);
}

// Diğer fonksiyonlar (movePaddles, updateGame, vb.) burada kalacak...

// Oyun yüklendiğinde olay dinleyicilerini ekle

let paddleSpeed = 0; // Paddle'ın mevcut hızı
const maxPaddleSpeed = 20; // Maksimum hız
const acceleration = 0.2; // Hızlanma oranı
const deceleration = 0.3; // Yavaşlama oranı
const maxPaddleY = 290; // Paddle için maksimum Y konumu
const minPaddleY = 13; // Paddle için minimum Y konumu

let isKeyWPressed = false;
let isKeySPressed = false;
let isKeyArrowUpPressed = false;
let isKeyArrowDownPressed = false;

document.addEventListener("keydown", (e) => {
  if (e.key === "w") {
    isKeyWPressed = true;
  } else if (e.key === "s") {
    isKeySPressed = true;
  }
  if (e.key === "p")
    togglePause();
  if (e.key === "r")
    resetGame();

  if (!isSinglePlayer) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      isKeyArrowUpPressed = true;
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      isKeyArrowDownPressed = true;
    }
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "w") {
    isKeyWPressed = false;
  } else if (e.key === "s") {
    isKeySPressed = false;
  }

  if (!isSinglePlayer) {
    if (e.key === "ArrowUp") {
      isKeyArrowUpPressed = false;
    } else if (e.key === "ArrowDown") {
      isKeyArrowDownPressed = false;
    }
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////
// function movePaddles() {
//   const paddle1 = document.getElementById("paddle1");
//   const paddle2 = document.getElementById("paddle2");

//   if (isGamePaused) return;
//   // Paddle1 hareketi
//   if (isKeyWPressed && paddle1Y > minPaddleY) {
//     paddle1Y -= maxPaddleSpeed; // Yukarı hareket et
//   } else if (isKeySPressed && paddle1Y < maxPaddleY) {
//     paddle1Y += maxPaddleSpeed; // Aşağı hareket et
//   }

//   // Paddle2 hareketi (tek oyunculu değilse)
//   if (!isSinglePlayer) {
//     if (isKeyArrowUpPressed && paddle2Y > minPaddleY) {
//       paddle2Y -= maxPaddleSpeed; // Yukarı hareket et
//     } else if (isKeyArrowDownPressed && paddle2Y < maxPaddleY) {
//       paddle2Y += maxPaddleSpeed; // Aşağı hareket et
//     }
//   }

//   // Paddle konumunu güncelle
//   paddle1.style.top = paddle1Y + "px";
//   paddle2.style.top = paddle2Y + "px";
// }
function movePaddles() {
    const paddle1 = document.getElementById("paddle1");
    const paddle2 = document.getElementById("paddle2");
  
    if (isGamePaused) return;
  
    // Paddle1 hareketi
    if (isKeyWPressed && paddle1Y > minPaddleY) {
      paddle1Y -= maxPaddleSpeed; // Yukarı hareket et
    } else if (isKeySPressed && paddle1Y < maxPaddleY) {
      paddle1Y += maxPaddleSpeed; // Aşağı hareket et
    }
  
    // Paddle2 hareketi (tek oyunculu değilse)
    if (!isSinglePlayer) {
      if (isKeyArrowUpPressed && paddle2Y > minPaddleY) {
        paddle2Y -= maxPaddleSpeed; // Yukarı hareket et
      } else if (isKeyArrowDownPressed && paddle2Y < maxPaddleY) {
        paddle2Y += maxPaddleSpeed; // Aşağı hareket et
      }
    }
  
    // Paddle konumunu sınırla
    paddle1Y = Math.max(minPaddleY, Math.min(paddle1Y, maxPaddleY));
    paddle2Y = Math.max(minPaddleY, Math.min(paddle2Y, maxPaddleY));
  
    // Paddle konumunu güncelle
    paddle1.style.top = paddle1Y + "px";
    paddle2.style.top = paddle2Y + "px";
  }
  

////////////////////////////////////////////////////////////////////////////////////////////////
function updateGame() {
  const ball = document.getElementById("ball");
  const player1ScoreDisplay = document.getElementById("player1Score");
  const player2ScoreDisplay = document.getElementById("player2Score");

  // Eğer öğelerden biri eksikse, fonksiyonu sonlandır
  if (!ball || !player1ScoreDisplay || !player2ScoreDisplay) {
    console.error("Bir veya daha fazla öğe bulunamadı!");
    return;
  }
  const gameBoard = document.querySelector(".game-board");
  if (!gameBoard) {
    console.error("Game board element not found");
    return;
  }

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY <= 0 || ballY >= 380) {
    ballSpeedY = -ballSpeedY;
  }

  if (ballX <= 10 && ballY >= paddle1Y && ballY <= paddle1Y + 100) {
    ballSpeedX = -ballSpeedX;
    ballSpeedY = (ballY - (paddle1Y + 50)) * 0.3;
  } else if (ballX >= 770 && ballY >= paddle2Y && ballY <= paddle2Y + 100) {
    ballSpeedX = -ballSpeedX;
    ballSpeedY = (ballY - (paddle2Y + 50)) * 0.3;
  }

  if (ballX <= 0) {
    player2Score++;
    resetBall();
  } else if (ballX >= 780) {
    player1Score++;
    resetBall();
  }

  if ((player1Score === 5 || player2Score === 5) && !isSinglePlayer) {
    handleMatchEnd();
    return; // Maç bittiğinde güncellemeyi durdur
  } else if ((player1Score === 5 || player2Score === 5) && isSinglePlayer) {
    console.log("tek kişilik");
    singleMatchEnd();
    return;
  }

  if (isSinglePlayer) {
    moveComputerPaddle();
  }

  // Güncellemeler
  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";
  player1ScoreDisplay.innerText = player1Score;
  player2ScoreDisplay.innerText = player2Score;
}
////////////////////////////////////////////////////////////////////////////////////////////////
// function moveComputerPaddle() {
//   const paddle2 = document.getElementById("paddle2"); // Paddle2 öğesini burada tekrar seçiyoruz
//   if (!paddle2) {
//     console.error("Paddle2 element is not found");
//     return; // Eğer paddle2 yoksa fonksiyonu sonlandır
//   }

//   const paddleCenter = paddle2Y + 50;
//   const speed = 10; // AI'nin hızını artırmak için
//   if (paddleCenter < ballY - 10) {
//     paddle2Y += speed;
//   } else if (paddleCenter > ballY + 10) {
//     paddle2Y -= speed;
//   }
//   paddle2.style.top = paddle2Y + "px";
// }
function moveComputerPaddle() {
    const paddleHeight = 100;
    const paddle2 = document.getElementById("paddle2"); // Paddle2 öğesini burada tekrar seçiyoruz
    if (!paddle2) {
      console.error("Paddle2 element is not found");
      return; // Eğer paddle2 yoksa fonksiyonu sonlandır
    }
  
    const paddleCenter = paddle2Y + paddleHeight / 2; // Paddle'ın merkez noktası
    const speed = 10; // AI paddle'ın hızı
    if (paddleCenter < ballY - 10) {
      paddle2Y += speed;
    } else if (paddleCenter > ballY + 10) {
      paddle2Y -= speed;
    }
  
    // Paddle'ın y koordinatını sınırlama
    paddle2Y = Math.max(minPaddleY, Math.min(paddle2Y, maxPaddleY));
  
    // Paddle'ın stilini güncelle
    paddle2.style.top = paddle2Y + "px";
  }
  
////////////////////////////////////////////////////////////////////////////////////////////////
function resetBall() {
  const gameBoard = document.querySelector(".game-board");
  if (!gameBoard) {
    console.error("Game board element not found");
    return;
  }

  const boardWidth = gameBoard.clientWidth;
  const boardHeight = gameBoard.clientHeight;

  ballX = boardWidth / 2; // Tahtanın ortasına yatay olarak konumlandır
  ballY = boardHeight / 2; // Tahtanın ortasına dikey olarak konumlandır
  ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 5; // Rastgele bir başlangıç yönü
  ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * 5;
}
////////////////////////////////////////////////////////////////////////////////////////////////
// function pausebero() {
//   clearInterval(gameInterval);
//   isPaused = true;
// }
////////////////////////////////////////////////////////////////////////////////////////////////
function resetGame() {
  gameState.isGameRunning = false;
  player1Score = 0;
  player2Score = 0;
  resetBall();
  updateScoreDisplay();
}

function updateScoreDisplay() {
  const player1ScoreDisplay = document.getElementById("player1Score");
  const player2ScoreDisplay = document.getElementById("player2Score");
  if (player1ScoreDisplay && player2ScoreDisplay) {
    player1ScoreDisplay.innerText = player1Score;
    player2ScoreDisplay.innerText = player2Score;
  }
}

const player1NameDisplay = document.getElementById("player1Name");
const player2NameDisplay = document.getElementById("player2Name");
////////////////////////////////////////////////////////////////////////////////////////////////
function singleMatchEnd() {
  const player = players[0];
  const player1 = players[1];
  winner1 = player1Score === 5 ? player : player1;
  const loser = player1Score === 5 ? player1 : player;
  sendMatchResult(winner1);
  resetGame();
  alert(winner1 + " won the first match!");
}
/////////////////////////////////////////////////////////////////////////////////////////////////

function handleMatchEnd() {
  let player1Name = players[0];
  let player2Name = players[1];
  let player3Name = players[2];

  clearInterval(gameInterval);
  if (currentMatch === 1) {
    winnerp = player1Score === 5 ? player1Name : player2Name;
    const loser = player1Score === 5 ? player2Name : player1Name;
    losers.push(loser); // Kaybedeni listeye ekle
    currentMatch++;
    resetGame();
    alert(
      winnerp +
        " won the first match! Next match: " +
        winner1 +
        " vs " +
        player3Name
    );
    document.getElementById("player1Name").innerHTML = winner1;
    document.getElementById("player2Name").innerHTML = player3Name;
    startGame();
  } else if (currentMatch === 2) {
    const winner = player1Score === 5 ? winner1 : player3Name;
    const loser = player1Score === 5 ? player3Name : winner1;
    winner1 = winner; // Şampiyonu kaydet
    losers.push(loser); // Kaybedeni listeye ekle
    currentMatch++;
    resetGame();
    alert(
      winner +
        " is the champion! Next match: " +
        losers[0] +
        " vs " +
        losers[1] +
        " for 2nd place."
    );
    player1Name = losers[0];
    player2Name = losers[1];
    document.getElementById("player1Name").innerHTML = player1Name;
    document.getElementById("player2Name").innerHTML = player2Name;
    sendMatchResult(winner1);
    startGame();
  } else if (currentMatch === 3) {
    // Son maç: İki kaybeden (losers[0] vs losers[1])
    const [loser1, loser2] = losers;
    const secondPlace = player1Score === 5 ? loser1 : loser2;
    const thirdPlace = player1Score === 5 ? loser2 : loser1;
    
    displayResults(secondPlace, thirdPlace);
    alert(
      "Winner: " + winner1 + ", 2nd: " + secondPlace + ", 3rd: " + thirdPlace
    );
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////
function displayResults(secondPlace, thirdPlace) {
  const firstPlaceDisplay = document.getElementById("firstPlace");
  const secondPlaceDisplay = document.getElementById("secondPlace");
  const thirdPlaceDisplay = document.getElementById("thirdPlace");
  firstPlaceDisplay.innerText = "1st Place: " + champion;
  secondPlaceDisplay.innerText = "2nd Place: " + secondPlace;
  thirdPlaceDisplay.innerText = "3rd Place: " + thirdPlace;
}
////////////////////////////////////////////////////////////////////////////////////////////////
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////
window.initializeGame = function () {
  console.log("initializeGame çalıştı");
  if (typeof gameInterval !== "undefined") {
    clearInterval(gameInterval);
  }
  addEventListeners();
};

/////////////////////////////////////////////////////////////////////////////////////////////////
function getCookie(name) {
  return document.cookie.split("; ").reduce((value, current) => {
    const [key, val] = current.split("=");
    return key === name ? val : value;
  }, null);
}

async function sendMatchResult(winner) {
  const csrftoken = getCookie("csrf_token");
  const matchResult = { winner};
  console.log("Giden maç sonucu:", matchResult);

  try {
    const response = await fetch("/pingpong/save-result/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(matchResult),
    });

    console.log("Sunucu yanıt durumu:", response.status);

    if (!response.ok) {
      throw new Error(`Sunucu hatası! Durum: ${response.status}`);
    }

    const data = await response.json();
    console.log("JSON yanıt:", data);

    if (data.success) {
      console.log("Maç sonucu başarıyla kaydedildi:", data);
    } else {
      console.error("Sunucu yanıtında hata:", data.error);
    }
  } catch (error) {
    console.error("Fetch isteği hatası:", error.message);
  }
}
