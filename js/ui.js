import { BOARD_SIZE } from "./config.js";

const boardElement = document.querySelector("#memory-board");
const tryCountElement = document.querySelector("#try-count");
const pairCountElement = document.querySelector("#pair-count");
const bestScoreElement = document.querySelector("#best-score");
const messageElement = document.querySelector("#message");
const shuffleButton = document.querySelector("#shuffle-button");
const clearDialog = document.querySelector("#clear-dialog");
const resultText = document.querySelector("#result-text");
const restartButton = document.querySelector("#restart-button");

export function bindStaticEvents({ onNewGame, onRestart }) {
  shuffleButton.addEventListener("click", onNewGame);
  restartButton.addEventListener("click", onRestart);
}

export function renderBoard(cards, onCardClick) {
  boardElement.innerHTML = "";
  boardElement.style.setProperty("--board-size", String(BOARD_SIZE));

  cards.forEach((card) => {
    boardElement.appendChild(createCardButton(card, onCardClick));
  });
}

function createCardButton(card, onCardClick) {
  const button = document.createElement("button");
  button.className = "memory-card";
  button.type = "button";
  button.dataset.id = card.id;
  button.style.setProperty("--card-accent", card.backColor);
  button.setAttribute("aria-label", `${card.label} card`);
  button.setAttribute("aria-pressed", String(card.isFaceUp));

  if (card.isMatched) {
    button.classList.add("is-matched");
    button.disabled = true;
  }

  if (card.isFaceUp || card.isMatched) {
    button.classList.add("is-face-up");
    button.innerHTML = `
      <span class="card-face" aria-hidden="true">
        <img src="${card.image}" alt="${card.label}">
      </span>
    `;
  } else {
    button.innerHTML = `
      <span class="card-back" aria-hidden="true">
        <span class="card-mark"></span>
      </span>
    `;
  }

  if (!card.isMatched) {
    button.addEventListener("click", () => onCardClick(card.id));
  }

  return button;
}

export function updateScoreboard(attempts, matchedPairs, totalPairs) {
  tryCountElement.textContent = String(attempts);
  pairCountElement.textContent = `${matchedPairs} / ${totalPairs}`;
}

export function setMessage(text, isSuccess) {
  messageElement.textContent = text;
  messageElement.classList.toggle("success", isSuccess);
}

export function loadBestScore(storageKey) {
  const savedBestScore = window.localStorage.getItem(storageKey);
  bestScoreElement.textContent = savedBestScore ?? "-";
}

export function saveBestScore(storageKey, attempts) {
  const previousBestScore = Number(window.localStorage.getItem(storageKey));

  if (!previousBestScore || attempts < previousBestScore) {
    window.localStorage.setItem(storageKey, String(attempts));
    bestScoreElement.textContent = String(attempts);
  }
}

export function showClearDialog(attempts) {
  resultText.textContent = `You cleared all 8 pairs in ${attempts} attempts.`;
  clearDialog.showModal();
}

export function closeClearDialog() {
  clearDialog.close();
}
