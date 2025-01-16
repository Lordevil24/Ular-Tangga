// Board setup
const board = document.getElementById("board");
const player1Button = document.getElementById("player1Button");
const player2Button = document.getElementById("player2Button");
const dicePopup = document.getElementById("dicePopup");
const popupDice = document.getElementById("popupDice");
const playerTurnDisplay = document.getElementById("playerTurn");
const startGameButton = document.getElementById("startGameButton");

// Board positions
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
const players = [
  { name: "Player 1", position: 0 },
  { name: "Player 2", position: 0 },
];
let currentPlayer = 0;
const boardSize = 100;

for (let i = 0; i < boardSize; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");

  const row = Math.floor(i / 10);
  const col = i % 10;

  // Pola zig-zag numbering
  const number = row % 2 === 0 
    ? 100 - (row * 10 + col) 
    : 100 - (row * 10 + (9 - col));

  cell.setAttribute("data-number", number); // Tambahkan angka ke data-number
  board.appendChild(cell);
}

function rollDiceForPlayer(playerIndex) {
  // Tampilkan popup dadu
  dicePopup.classList.remove("hidden");
  popupDice.textContent = ""; // Kosongkan angka untuk memulai animasi

  // Tambahkan kelas animasi
  popupDice.classList.add("rolling");

  // Angka acak untuk dadu
  let diceRoll = Math.floor(Math.random() * 6) + 1;

  // Setelah animasi selesai, tampilkan hasil angka dadu
  setTimeout(() => {
    popupDice.classList.remove("rolling");
    popupDice.textContent = diceRoll; // Tampilkan angka di elemen dadu

    setTimeout(() => {
      // Sembunyikan popup setelah angka ditampilkan
      dicePopup.classList.add("hidden");
      movePlayer(playerIndex, diceRoll);

      if (diceRoll === 6) {
        // Notifikasi ketika mendapatkan angka 6
        Swal.fire({
          title: "Angka 6!",
          text: `${players[playerIndex].name} mendapatkan angka 6! Giliranmu dilanjutkan.`,
          icon: "success",
          confirmButtonText: "Lanjutkan",
        }).then(() => {
          updateTurnIndicator();
          checkWin();
        });
      } else {
        currentPlayer = (currentPlayer + 1) % 2; // Pindahkan giliran
        updateTurnIndicator();
        checkWin();
      }
    }, 1000); // Waktu untuk menunjukkan hasil dadu sebelum popup hilang
  }, 1000); // Durasi animasi
}

function showDicePopup() {
  const dicePopup = document.getElementById('dicePopup');
  const popupDice = document.getElementById('popupDice');

  // Menampilkan popup dadu
  dicePopup.classList.remove('hidden');

  // Mengacak angka dari 1 hingga 6
  let count = 0;
  const interval = setInterval(() => {
    const randomNumber = Math.floor(Math.random() * 6) + 1;
    popupDice.textContent = randomNumber;
    count++;

    if (count === 10) { // Menghentikan animasi setelah 10 kali
      clearInterval(interval);
      const finalNumber = Math.floor(Math.random() * 6) + 1;
      popupDice.textContent = finalNumber; // Menampilkan angka final
    }
  }, 100);
}

// Menyembunyikan popup setelah animasi selesai
setTimeout(() => {
  document.getElementById('dicePopup').classList.add('hidden');
}, 2000); // 2 detik

function getCellIndex(position) {
  // Menghitung baris dan kolom berdasarkan posisi
  const row = Math.floor((100 - position) / 10);  // Mulai dari bawah ke atas
  const col = (100 - position) % 10; // Kolom dihitung dari bawah

  // Zig-zag: baris genap dari kiri ke kanan, baris ganjil dari kanan ke kiri
  if (row % 2 === 0) {
    return (row * 10) + col; // Baris genap (kiri ke kanan)
  } else {
    return (row * 10) + (9 - col); // Baris ganjil (kanan ke kiri)
  }
}


// Update board
// Update board
function updateBoard() {
  const cells = document.querySelectorAll(".board .cell");
  cells.forEach((cell) => {
    const playerCircle = cell.querySelector(".player-circle");
    if (playerCircle) {
      playerCircle.style.backgroundColor = "transparent"; // Reset warna lingkaran pemain
    }
  });

  players.forEach((player, index) => {
    if (player.position > 0) {
      const playerCellIndex = getCellIndex(player.position); // Dapatkan indeks zig-zag yang benar
      const playerCell = cells[playerCellIndex];
      let playerCircle = playerCell.querySelector(".player-circle");

      if (!playerCircle) {
        // Jika lingkaran pemain belum ada, buat dan tambahkan ke cell
        playerCircle = document.createElement("div");
        playerCircle.classList.add("player-circle");
        playerCell.appendChild(playerCircle);
      }

      // Tentukan warna lingkaran berdasarkan pemain (merah atau biru)
      playerCircle.style.backgroundColor = index === 0 ? "red" : "blue";

      // Pastikan lingkaran berada di tengah cell
      playerCircle.style.top = "50%";
      playerCircle.style.left = "50%";
      playerCircle.style.transform = "translate(-50%, -50%)";
    }
  });
}

function movePlayer(playerIndex, diceRoll) {
  const player = players[playerIndex];
  let targetPosition = player.position + diceRoll;

  // Cegah pemain melampaui boardSize
  if (targetPosition > boardSize) {
    targetPosition = player.position; // Tetap di posisi sekarang
  }

  // Animasi perpindahan pemain langkah demi langkah
  let step = player.position < targetPosition ? 1 : -1;

  const moveInterval = setInterval(() => {
    player.position += step;
    updateBoard(); // Update posisi pemain di board

    if (player.position === targetPosition) {
      clearInterval(moveInterval);

      // Periksa ular atau tangga setelah sampai
      if (snakes[player.position]) {
        player.position = snakes[player.position];
        Swal.fire({
          title: "Oh Tidak!",
          text: `${player.name} terkena ular dan turun ke bawah!`,
          icon: "error",
        }).then(() => {
          updateBoard();
        });
      } else if (ladders[player.position]) {
        player.position = ladders[player.position];
        Swal.fire({
          title: "Tangga!",
          text: `${player.name} sedang mendaki tangga! Kamu naik lebih cepat!`,
          icon: "success",
        }).then(() => {
          updateBoard();
        });
      }

      // Cek menang setelah selesai bergerak
      checkWin();
    }
  }, 300); // Interval waktu antar langkah
}


// Update turn indicator
function updateTurnIndicator() {
  playerTurnDisplay.textContent = `Giliran: ${players[currentPlayer].name}`;
  player1Button.disabled = currentPlayer !== 0;
  player2Button.disabled = currentPlayer !== 1;
}

// Check win
function checkWin() {
  if (players[currentPlayer].position === boardSize) {
    Swal.fire({
      title: `${players[currentPlayer].name} Menang!`,
      text: "Selamat! Kamu berhasil sampai ke garis finish.",
      icon: "success",
      confirmButtonText: "Main Lagi",
    }).then((result) => {
      if (result.isConfirmed) {
        resetGame();
      }
    });
  }
}

window.addEventListener('load', () => {
  const formContainer = document.getElementById('inputScreen');
  formContainer.classList.add('animate-in');
});

// Reset game
function resetGame() {
  players.forEach((player) => (player.position = 0));
  currentPlayer = 0;
  updateBoard();
  updateTurnIndicator();
}

// Start game logic
startGameButton.addEventListener("click", (e) => {
  e.preventDefault();
  const player1Name = document.getElementById("player1Name").value;
  const player2Name = document.getElementById("player2Name").value;

  if (player1Name === "" || player2Name === "") {
    Swal.fire({
      title: "Error!",
      text: "Pastikan kedua nama pemain diisi!",
      icon: "error",
      confirmButtonText: "Ok",
    });
    return;
  }

  players[0].name = player1Name;
  players[1].name = player2Name;

  document.getElementById("player1Label").textContent = player1Name;
  document.getElementById("player2Label").textContent = player2Name;

  document.getElementById("inputScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");

  Swal.fire({
    title: "Permainan Dimulai!",
    text: `${player1Name}, giliranmu pertama!`,
    icon: "success",
  });

  updateTurnIndicator();
});

// Event listeners for dice rolls
player1Button.addEventListener("click", () => rollDiceForPlayer(0));
player2Button.addEventListener("click", () => rollDiceForPlayer(1));

const audio = new Audio('audio/sound.mp3');
audio.loop = true;  // Musik berulang

// Fungsi untuk toggle play/pause
function toggleMusic() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}