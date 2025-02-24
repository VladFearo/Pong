import Game from "./Game.js";

// Initialize the game
window.onload = () => {
  const canvas = document.querySelector("canvas");
  const startBtn = document.getElementById("startButton");
  const resetBtn = document.getElementById("resetButton");
  const game = new Game(canvas);
  game.start();

  startBtn.addEventListener("click", () => {
    game.startGame();
    startBtn.disabled = true;
    resetBtn.disabled = false;
  });

  resetBtn.addEventListener("click", () => {
    game.reset();
    startBtn.disabled = false;
    resetBtn.disabled = true;
  });
};
