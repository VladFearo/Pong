import Ball from "./entities/Ball.js";
import Player from "./entities/Player.js";
import { GAME_CONFIG } from "./config/gameConfig.js";
import LocalMultiplayerMode from "./modes/LocalMultiplayerMode.js";
import SinglePlayerMode from "./modes/SinglePlayerMode.js";
import OnlineMultiplayerMode from "./modes/OnlineMultiplayerMode.js";

export default class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.boardWidth = GAME_CONFIG.BOARD_WIDTH;
    this.boardHeight = GAME_CONFIG.BOARD_HEIGHT;
    this.canvas.width = this.boardWidth;
    this.canvas.height = this.boardHeight;
    this.keys = {};
    this.winningScore = GAME_CONFIG.WINNING_SCORE;
    this.isPlaying = false;
    this.currentSpeed = "normal";

    this.modes = {
      localMultiplayer: new LocalMultiplayerMode(this),
      singlePlayer: new SinglePlayerMode(this),
      onlineMultiplayer: new OnlineMultiplayerMode(this),
    };

    this.currentMode = this.modes.localMultiplayer;

    this.ball = this.createBall();

    this.player1 = new Player(
      10,
      this.boardHeight / 2 - GAME_CONFIG.PLAYER_HEIGHT / 2,
      GAME_CONFIG.PLAYER_WIDTH,
      GAME_CONFIG.PLAYER_HEIGHT,
      GAME_CONFIG.PLAYER_SPEED
    );
    this.player2 = new Player(
      this.boardWidth - GAME_CONFIG.PLAYER_WIDTH - 10,
      this.boardHeight / 2 - GAME_CONFIG.PLAYER_HEIGHT / 2,
      GAME_CONFIG.PLAYER_WIDTH,
      GAME_CONFIG.PLAYER_HEIGHT,
      GAME_CONFIG.PLAYER_SPEED
    );

    this.lastTime = 0;
    this.addEventListeners();
    this.currentMode.init();
  }

  setGameMode(modeName) {
    if (!this.modes[modeName]) {
      console.error(`Game mode "${modeName}" not found`);
      return false;
    }

    // Clean up existing mode if needed
    if (this.currentMode && typeof this.currentMode.cleanup === "function") {
      this.currentMode.cleanup();
    }

    // Set and initialize new mode
    this.currentMode = this.modes[modeName];
    this.currentMode.init();

    return true;
  }

  setAIDifficulty(level) {
    if (this.currentMode instanceof SinglePlayerMode) {
      this.currentMode.setDifficulty(level);
    }
  }

  createBall() {
    return new Ball(
      this.boardWidth / 2,
      this.boardHeight / 2,
      GAME_CONFIG.BALL_RADIUS,
      this.getSpeedValue(this.currentSpeed)
    );
  }

  getSpeedValue(speed) {
    switch (speed) {
      case "slow":
        return GAME_CONFIG.BALL_SPEED * 0.5;
      case "normal":
        return GAME_CONFIG.BALL_SPEED;
      case "fast":
        return GAME_CONFIG.BALL_SPEED * 2;
      default:
        return GAME_CONFIG.BALL_SPEED;
    }
  }

  setSpeed(speed) {
    this.currentSpeed = speed;
    const newSpeed = this.getSpeedValue(speed);

    if (this.ball) {
      // Preserve ball position, only update speed
      const currentDirectionX = Math.sign(this.ball.speedX);
      const currentDirectionY = Math.sign(this.ball.speedY);

      this.ball.baseSpeed = newSpeed;
      this.ball.speedX =
        Math.abs(this.ball.speedX) *
        currentDirectionX *
        (newSpeed / GAME_CONFIG.BALL_SPEED);
      this.ball.speedY =
        Math.abs(this.ball.speedY) *
        currentDirectionY *
        (newSpeed / GAME_CONFIG.BALL_SPEED);
    }
  }

  addEventListeners() {
    document.addEventListener("keydown", (event) => {
      this.keys[event.code] = true;
    });

    document.addEventListener("keyup", (event) => {
      this.keys[event.code] = false;
    });
  }

  checkWinner() {
    if (
      this.player1.score >= this.winningScore ||
      this.player2.score >= this.winningScore
    ) {
      this.isPlaying = false;

      // Show setup controls when game is over
      const gameSetupControls = document.getElementById("gameSetupControls");
      if (gameSetupControls) {
        gameSetupControls.classList.remove("hidden");
      }

      return true;
    }
    return false;
  }

  reset() {
    this.currentMode.reset();
    this.player1.reset();
    this.player2.reset();
    this.ball.reset(this.boardWidth, this.boardHeight);
    this.setSpeed(this.currentSpeed);
    this.isPlaying = false;
    this.ball = this.createBall();
  }

  update(deltaTime) {
    // Handle input and update through the current game mode
    if (this.currentMode) {
      this.currentMode.handleInput(deltaTime);
      this.currentMode.update(deltaTime);
    }

    if (this.isPlaying) {
      this.ball.update(
        deltaTime,
        this.boardWidth,
        this.boardHeight,
        this.player1,
        this.player2
      );

      // Check for winner after ball update
      if (this.checkWinner()) {
        const startBtn = document.getElementById("startButton");
        startBtn.disabled = false;
      }
    }
  }

  draw() {
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.boardWidth, this.boardHeight);

    // Draw center line
    this.ctx.setLineDash([5, 15]);
    this.ctx.beginPath();
    this.ctx.moveTo(this.boardWidth / 2, 0);
    this.ctx.lineTo(this.boardWidth / 2, this.boardHeight);
    this.ctx.strokeStyle = "#222831";
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Draw players and ball
    this.player1.draw(this.ctx);
    this.player2.draw(this.ctx);
    this.ball.draw(this.ctx);

    // Draw message when not playing
    if (!this.isPlaying) {
      this.ctx.fillStyle = "#222831";
      this.ctx.font = "24px Arial";
      this.ctx.textAlign = "center";

      if (this.player1.score >= this.winningScore) {
        this.ctx.fillText(
          "Player 1 Wins! Press Start to Play Again!",
          this.boardWidth / 2,
          this.boardHeight / 2 + 50
        );
      } else if (this.player2.score >= this.winningScore) {
        // Customize message based on game mode
        const winnerText =
          this.currentMode instanceof SinglePlayerMode
            ? "AI Wins! Press Start to Play Again!"
            : "Player 2 Wins! Press Start to Play Again!";

        this.ctx.fillText(
          winnerText,
          this.boardWidth / 2,
          this.boardHeight / 2 + 50
        );
      } else {
        this.ctx.fillText(
          "Press Start to Play!",
          this.boardWidth / 2,
          this.boardHeight / 2 + 50
        );
      }
    }
  }

  loop(timestamp) {
    const deltaTime = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    this.update(deltaTime);
    this.draw();

    requestAnimationFrame((time) => this.loop(time));
  }

  start() {
    requestAnimationFrame((timestamp) => {
      this.lastTime = timestamp;
      this.loop(timestamp);
    });
  }

  startGame() {
    if (!this.isPlaying) {
      this.ball = this.createBall();

      // Reset scores if a player has won
      if (
        this.player1.score >= this.winningScore ||
        this.player2.score >= this.winningScore
      ) {
        this.reset();
      }
      this.isPlaying = true;
      this.ball.reset(this.boardWidth, this.boardHeight);
    }
  }

  // Methods for online multiplayer
  connectToServer(serverUrl) {
    if (this.currentMode instanceof OnlineMultiplayerMode) {
      this.currentMode.connect(serverUrl);
    }
  }

  disconnectFromServer() {
    if (this.currentMode instanceof OnlineMultiplayerMode) {
      this.currentMode.cleanup();
    }
  }
}
