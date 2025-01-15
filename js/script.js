// script.js

// Board setup
const board = document.querySelector(".board");
const player1Button = document.getElementById("player1Button");
const player2Button = document.getElementById("player2Button");
const dicePopup = document.getElementById("dicePopup");
const popupDice = document.getElementById("popupDice");
const playerTurnDisplay = document.getElementById("playerTurn");

// Board positions
const boardSize = 100;
const snakes = {
  16: 6,
  46: 25,
  49: 11,
  62: 19,
  64: 60,
  74: 53,
  89: 68,
  92: 88,
  95: 75,
  99: 80,
};
const ladders = {
  2: 38,
  7: 14,
  8: 31,
  15: 26,
  21: 42,
  28: 84,
  36: 44,
  51: 67,
  71: 91,
  78: 98,
  87: 94,
};

// Players
let players = [
  { name: "Player 1", position: 0 },
  { name: "Player 2", position: 0 },
];
let currentPlayerIndex = 0;

// Create board
for (let i = boardSize; i > 0; i--) {
  const cell = document.createElement("div");
  cell.textContent = i;

  if (snakes[i]) cell.classList.add("snake");
  if (ladders[i]) cell.classList.add("ladder");

  board.appendChild(cell);
}

// Roll dice logic

// Roll dice logic
let currentPlayer = 0; // 0 untuk Player 1, 1 untuk Player 2

function rollDiceForPlayer(playerIndex) {
  dicePopup.classList.remove("hidden");
  popupDice.textContent = ""; // Reset angka dadu

  let animationCount = 0; // Hitungan animasi
  const maxAnimationCount = 10; // Jumlah iterasi angka acak

  // Animasi angka acak pada dadu
  const interval = setInterval(() => {
    popupDice.textContent = Math.floor(Math.random() * 6) + 1;
    animationCount++;

    if (animationCount >= maxAnimationCount) {
      clearInterval(interval); // Hentikan animasi
      const diceRoll = Math.floor(Math.random() * 6) + 1;
      popupDice.textContent = diceRoll; // Tampilkan angka akhir
      movePlayer(playerIndex, diceRoll); // Pindahkan pemain berdasarkan angka dadu
      checkWin(); // Periksa apakah ada yang menang

      setTimeout(() => dicePopup.classList.add("hidden"), 1000); // Sembunyikan popup setelah 1 detik

      // Aturan jika angka 6
      if (diceRoll === 6) {
        alert(`Player ${playerIndex + 1} mendapatkan angka 6! Lempar lagi.`);
        // Jangan ubah giliran jika angka 6
        // Pastikan tampilan giliran tetap pada pemain yang sama
        updateTurnIndicator();  // Menyegarkan tampilan giliran
        return; // Giliran tetap pada pemain yang sama
      }

      // Jika bukan angka 6, ubah giliran
      currentPlayer = (currentPlayer + 1) % 2;
      updateTurnIndicator(); // Ubah tampilan giliran
    }
  }, 100); // Perubahan angka setiap 100ms
}

// Fungsi untuk memperbarui tombol berdasarkan giliran
function updateTurnIndicator() {
  playerTurnDisplay.textContent = `Giliran: ${players[currentPlayer].name}`; // Update giliran
  if (currentPlayer === 0) {
    player1Button.disabled = false;
    player2Button.disabled = true;
  } else {
    player1Button.disabled = true;
    player2Button.disabled = false;
  }
}

// Panggilan pertama kali saat game dimulai
updateTurnIndicator();

// Move player
function movePlayer(playerIndex, diceRoll) {
  const player = players[playerIndex];
  player.position += diceRoll;

  if (player.position > boardSize) {
    player.position = boardSize; // Cap at max position
  }

  // Check for snakes or ladders
  if (snakes[player.position]) {
    player.position = snakes[player.position];
  } else if (ladders[player.position]) {
    player.position = ladders[player.position];
  }

  updateBoard();
  switchTurn();
}

// Update board
function updateBoard() {
  const cells = document.querySelectorAll(".board div");
  cells.forEach((cell) => (cell.style.backgroundColor = ""));

  players.forEach((player, index) => {
    const playerCell = cells[boardSize - player.position];
    if (playerCell) {
      playerCell.style.backgroundColor = index === 0 ? "red" : "blue";
    }
  });
}

// Switch turn
function switchTurn() {
  currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
  playerTurnDisplay.textContent = `Giliran: ${players[currentPlayerIndex].name}`;
}

// Check win
function checkWin() {
  const player = players[currentPlayerIndex];
  if (player.position === boardSize) {
    alert(`${player.name} wins!`);
    resetGame();
  }
}

// Reset game
function resetGame() {
  players = [
    { name: "Player 1", position: 0 },
    { name: "Player 2", position: 0 },
  ];
  currentPlayerIndex = 0;
  updateBoard();
  updateTurnIndicator();
}

// Event listeners
player1Button.addEventListener("click", () => rollDiceForPlayer(0));
player2Button.addEventListener("click", () => rollDiceForPlayer(1));
