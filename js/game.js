import { PAIR_MISMATCH_DELAY, STORAGE_KEY } from "./config.js";
import { fruitCatalog } from "./fruits.js";
import { gameState, resetGameState } from "./state.js";
import {
  updateScoreboard,
  setMessage,
  renderBoard,
  saveBestScore,
  showClearDialog,
} from "./ui.js";

export function startNewGame() {
  resetGameState(buildDeck());
  updateScoreboard(gameState.attempts, gameState.matchedPairs, fruitCatalog.length);
  setMessage("Click a card to reveal a fruit image.", false);
  renderBoard(gameState.cards, handleCardClick);
}

export function handleCardClick(cardId) {
  if (gameState.isLocked) {
    return;
  }

  const card = getCardById(cardId);
  if (!card || card.isFaceUp || card.isMatched) {
    return;
  }

  revealCard(cardId);
  gameState.selectedCardIds.push(cardId);
  renderBoard(gameState.cards, handleCardClick);

  if (gameState.selectedCardIds.length === 1) {
    setMessage("Pick one more card to find the same fruit image.", false);
    return;
  }

  gameState.attempts += 1;
  updateScoreboard(gameState.attempts, gameState.matchedPairs, fruitCatalog.length);
  resolveSelection();
}

function buildDeck() {
  const duplicatedCards = fruitCatalog.flatMap((fruit) => [
    createCard(fruit),
    createCard(fruit),
  ]);

  return shuffleCards(duplicatedCards);
}

function createCard(fruit) {
  return {
    id: createCardId(fruit.key),
    fruitKey: fruit.key,
    label: fruit.label,
    image: fruit.image,
    backColor: fruit.back,
    isFaceUp: false,
    isMatched: false,
  };
}

function createCardId(prefix) {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return `${prefix}-${window.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function shuffleCards(cards) {
  const nextCards = [...cards];

  for (let index = nextCards.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [nextCards[index], nextCards[randomIndex]] = [nextCards[randomIndex], nextCards[index]];
  }

  return nextCards;
}

function getCardById(cardId) {
  return gameState.cards.find((card) => card.id === cardId);
}

function revealCard(cardId) {
  const card = getCardById(cardId);
  if (card) {
    card.isFaceUp = true;
  }
}

function hideCard(cardId) {
  const card = getCardById(cardId);
  if (card) {
    card.isFaceUp = false;
  }
}

function resolveSelection() {
  const [firstId, secondId] = gameState.selectedCardIds;
  const firstCard = getCardById(firstId);
  const secondCard = getCardById(secondId);

  if (!firstCard || !secondCard) {
    gameState.selectedCardIds = [];
    return;
  }

  if (firstCard.fruitKey === secondCard.fruitKey) {
    markPairAsMatched(firstCard, secondCard);
    return;
  }

  scheduleMismatchReset(firstId, secondId);
}

function markPairAsMatched(firstCard, secondCard) {
  firstCard.isMatched = true;
  secondCard.isMatched = true;
  gameState.selectedCardIds = [];
  gameState.matchedPairs += 1;

  updateScoreboard(gameState.attempts, gameState.matchedPairs, fruitCatalog.length);
  renderBoard(gameState.cards, handleCardClick);

  if (gameState.matchedPairs === fruitCatalog.length) {
    handleClear();
    return;
  }

  setMessage("Matched. Keep going.", true);
}

function scheduleMismatchReset(firstId, secondId) {
  gameState.isLocked = true;
  setMessage("Different image. Remember the positions.", false);

  window.setTimeout(() => {
    hideCard(firstId);
    hideCard(secondId);
    gameState.selectedCardIds = [];
    gameState.isLocked = false;
    renderBoard(gameState.cards, handleCardClick);
  }, PAIR_MISMATCH_DELAY);
}

function handleClear() {
  saveBestScore(STORAGE_KEY, gameState.attempts);
  setMessage("All 8 identical fruit image pairs matched.", true);
  showClearDialog(gameState.attempts);
}
