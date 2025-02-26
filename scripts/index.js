import Game from "./Game.js";

// Initialize the game
window.onload = () => {
  const canvas = document.querySelector("canvas");
  const startBtn = document.getElementById("startButton");
  const resetBtn = document.getElementById("resetButton");
  const speedContainer = document.querySelector(".speed-container");

  // Game mode controls
  const modeSelector = document.getElementById("gameMode");
  const aiDifficultyContainer = document.getElementById(
    "aiDifficultyContainer"
  );
  const aiDifficultySelector = document.getElementById("aiDifficulty");
  const onlineContainer = document.getElementById("onlineContainer");
  const serverAddressInput = document.getElementById("serverAddress");
  const connectBtn = document.getElementById("connectButton");
  const disconnectBtn = document.getElementById("disconnectButton");
  const gameSetupControls = document.getElementById("gameSetupControls");

  // Initialize game
  const game = new Game(canvas);

  // Set game speed
  let selectedSpeed = "normal";
  document.querySelectorAll('input[name="speed"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      selectedSpeed = e.target.value;
      game.setSpeed(selectedSpeed);
    });
  });

  game.setSpeed(selectedSpeed);
  game.start();

  // Handle game mode changes
  if (modeSelector) {
    modeSelector.addEventListener("change", (e) => {
      const mode = e.target.value;

      // Prevent selecting online multiplayer
      if (mode === "onlineMultiplayer") {
        // Set back to previous mode
        modeSelector.value =
          game.currentMode.constructor.name === "SinglePlayerMode"
            ? "singlePlayer"
            : "localMultiplayer";

        alert("Online multiplayer is coming in a future update!");
        return;
      }

      // Set the game mode
      game.setGameMode(mode);

      // Show/hide AI difficulty based on selected mode
      const aiDifficultyContainer = document.getElementById(
        "aiDifficultyContainer"
      );
      if (aiDifficultyContainer) {
        aiDifficultyContainer.style.display =
          mode === "singlePlayer" ? "flex" : "none";
      }

      // Update UI based on selected mode
      updateGameInstructions(mode);

      // Reset game when changing modes
      if (game.isPlaying) {
        game.reset();
        startBtn.disabled = false;
        resetBtn.disabled = true;
      }
    });
  }

  // Function to update game instructions
  function updateGameInstructions(mode) {
    const instructions = document.getElementById("gameInstructions");
    if (instructions) {
      if (mode === "singlePlayer") {
        instructions.innerHTML = "Use W and S keys to control your paddle.";
      } else if (mode === "localMultiplayer") {
        instructions.innerHTML =
          "Player 1: Use W and S keys.<br>Player 2: Use Up and Down arrows.";
      }
    }
  }

  // Handle AI difficulty changes
  if (aiDifficultySelector) {
    aiDifficultySelector.addEventListener("change", (e) => {
      game.setAIDifficulty(e.target.value);
    });
  }

  // Handle server connection
  if (connectBtn) {
    connectBtn.addEventListener("click", () => {
      const serverUrl = serverAddressInput.value;
      game.connectToServer(serverUrl);
      connectBtn.disabled = true;
      disconnectBtn.disabled = false;
      serverAddressInput.disabled = true;
    });
  }

  if (disconnectBtn) {
    disconnectBtn.addEventListener("click", () => {
      game.disconnectFromServer();
      connectBtn.disabled = false;
      disconnectBtn.disabled = true;
      serverAddressInput.disabled = false;
    });
  }

  // Function to update UI based on game mode
  function updateUIForGameMode(mode) {
    // Show/hide appropriate controls
    if (aiDifficultyContainer) {
      aiDifficultyContainer.style.display =
        mode === "singlePlayer" ? "block" : "none";
    }

    if (onlineContainer) {
      onlineContainer.style.display =
        mode === "onlineMultiplayer" ? "block" : "none";
    }

    // Show/hide speed controls (not available in online mode)
    if (speedContainer) {
      speedContainer.style.display =
        mode === "onlineMultiplayer" ? "none" : "block";
    }

    // Update game instructions
    const instructions = document.getElementById("gameInstructions");
    if (instructions) {
      if (mode === "singlePlayer") {
        instructions.innerHTML = "Use W and S keys to control your paddle.";
      } else if (mode === "localMultiplayer") {
        instructions.innerHTML =
          "Player 1: Use W and S keys.<br>Player 2: Use Up and Down arrows.";
      } else if (mode === "onlineMultiplayer") {
        instructions.innerHTML = "Connect to a server to play online.";
      }
    }
  }

  startBtn.addEventListener("click", () => {
    game.startGame();
    startBtn.disabled = true;
    resetBtn.disabled = false;

    // Hide the setup controls when the game starts
    if (gameSetupControls) {
      gameSetupControls.classList.add("hidden");
    }
  });

  resetBtn.addEventListener("click", () => {
    game.reset();
    startBtn.disabled = false;
    resetBtn.disabled = true;

    // Show the setup controls when the game is reset
    if (gameSetupControls) {
      gameSetupControls.classList.remove("hidden");
    }
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
