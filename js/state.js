export const gameState = {
  cards: [],
  selectedCardIds: [],
  attempts: 0,
  matchedPairs: 0,
  isLocked: false,
};

export function resetGameState(nextCards) {
  gameState.cards = nextCards;
  gameState.selectedCardIds = [];
  gameState.attempts = 0;
  gameState.matchedPairs = 0;
  gameState.isLocked = false;
}
