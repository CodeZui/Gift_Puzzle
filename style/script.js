const board = document.getElementById("puzzle-board");
const piecesContainer = document.getElementById("pieces-container");
const resetBtn = document.getElementById("reset");
const progressFill = document.getElementById("progress-fill");
const progressText = document.getElementById("progress-text");
const successAnimation = document.getElementById("success-animation");

const imageSrc = "./style/AnhGhep.jpg"; 
const pieceCount = 4;
let draggedPiece = null;

function startGame() {
  updateProgress();
}

function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < pieceCount * pieceCount; i++) {
    const slot = document.createElement("div");
    slot.classList.add("slot");
    slot.dataset.index = i;
    slot.addEventListener("dragover", dragOver);
    slot.addEventListener("drop", drop);
    slot.addEventListener("dragenter", dragEnter);
    slot.addEventListener("dragleave", dragLeave);
    board.appendChild(slot);
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createPieces() {
  piecesContainer.innerHTML = "";
  const indices = shuffle([...Array(pieceCount * pieceCount).keys()]);
  indices.forEach((i) => {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.setAttribute("draggable", true);
    piece.dataset.index = i;
    const x = i % pieceCount;
    const y = Math.floor(i / pieceCount);
    piece.style.backgroundImage = `url(${imageSrc})`;
    
    const pieceSize = getPieceSize();
    const boardSize = getBoardSize();
    piece.style.backgroundPosition = `-${x * pieceSize}px -${y * pieceSize}px`;
    piece.style.backgroundSize = `${boardSize}px ${boardSize}px`;
    
    piece.addEventListener("dragstart", dragStart);
    piece.addEventListener("dragend", dragEnd);
    piecesContainer.appendChild(piece);
  });
}

function getPieceSize() {
  return window.innerWidth <= 360 ? 45 : 
          window.innerWidth <= 480 ? 50 : 
          window.innerWidth <= 768 ? 60 : 70;
}

function getBoardSize() {
  return window.innerWidth <= 360 ? 180 : 
          window.innerWidth <= 480 ? 200 : 
          window.innerWidth <= 768 ? 240 : 280;
}

function dragStart(e) {
  draggedPiece = e.target;
  e.target.classList.add("dragging");
}

function dragEnd(e) {
  e.target.classList.remove("dragging");
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
  if (e.target.classList.contains("slot")) {
    e.target.classList.add("drag-over");
  }
}

function dragLeave(e) {
  if (e.target.classList.contains("slot")) {
    e.target.classList.remove("drag-over");
  }
}

function drop(e) {
  e.preventDefault();
  const dropZone = e.target;
  dropZone.classList.remove("drag-over");
  
  if (dropZone.classList.contains("slot")) {
    if (dropZone.firstChild) {
      piecesContainer.appendChild(dropZone.firstChild);
    }
    dropZone.appendChild(draggedPiece);
    updateProgress();
    checkWin();
  }
}

function updateProgress() {
  const slots = document.querySelectorAll(".slot");
  let correct = 0;
  slots.forEach((slot, i) => {
    const piece = slot.firstElementChild;
    if (piece && piece.dataset.index == i) {
      correct++;
    }
  });
  
  const percentage = Math.round((correct / (pieceCount * pieceCount)) * 100);
  progressFill.style.width = `${percentage}%`;
  progressText.textContent = `${percentage}%`;
}

function checkWin() {
  const slots = document.querySelectorAll(".slot");
  let correct = 0;
  slots.forEach((slot, i) => {
    const piece = slot.firstElementChild;
    if (piece && piece.dataset.index == i) {
      correct++;
    }
  });

  if (correct === pieceCount * pieceCount) {
    setTimeout(() => {
      showSuccessModal();
    }, 500);
  }
}

function showSuccessModal() {
  successAnimation.classList.add("show");
}

function closeSuccessModal() {
  successAnimation.classList.remove("show");
}

piecesContainer.addEventListener("dragover", dragOver);
piecesContainer.addEventListener("drop", (e) => {
  e.preventDefault();
  if (draggedPiece) {
    piecesContainer.appendChild(draggedPiece);
    updateProgress();
    checkWin();
  }
});

resetBtn.addEventListener("click", () => {
  createBoard();
  createPieces();
  startGame();
});

window.addEventListener("resize", () => {
  createPieces();
});

createBoard();
createPieces();
startGame();