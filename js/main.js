import { STORAGE_KEY } from "./config.js";
import { startNewGame } from "./game.js";
import { bindStaticEvents, closeClearDialog, loadBestScore } from "./ui.js";

function init() {
  loadBestScore(STORAGE_KEY);
  bindStaticEvents({
    onNewGame: startNewGame,
    onRestart: handleRestart,
  });
  startNewGame();
}

function handleRestart() {
  closeClearDialog();
  startNewGame();
}

init();
