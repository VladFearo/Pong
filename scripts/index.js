import Game from "./Game.js";

// Initialize the game
window.onload = () => {
  const canvas = document.querySelector("canvas");
  const startBtn = document.getElementById("startButton");
  const resetBtn = document.getElementById("resetButton");
  const speedContainer = document.querySelector(".speed-container");
  let selectedSpeed = "normal";
  document.querySelectorAll('input[name="speed"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      selectedSpeed = e.target.value;
    });
  });
  const game = new Game(canvas);
  game.setSpeed(selectedSpeed);
  game.start();

  startBtn.addEventListener("click", () => {
    game.startGame();
    startBtn.disabled = true;
    resetBtn.disabled = false;
    speedContainer.style.display = "none";
  });

  resetBtn.addEventListener("click", () => {
    game.reset();
    startBtn.disabled = false;
    resetBtn.disabled = true;
    speedContainer.style.display = "block";
  });

  const slowRadio = document.querySelector("#slow");
  const normalRadio = document.querySelector("#normal");
  const fastRadio = document.querySelector("#fast");

  slowRadio.addEventListener("change", () => handleSpeedChange(game, "slow"));
  normalRadio.addEventListener("change", () =>
    handleSpeedChange(game, "normal")
  );
  fastRadio.addEventListener("change", () => handleSpeedChange(game, "fast"));

  // Function to handle speed change
  function handleSpeedChange(game, speed) {
    console.log(`Selected speed: ${speed}`);
    game.setSpeed(speed); // Assuming your Game class has a setSpeed method
  }
};
