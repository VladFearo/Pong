import Ball from "./entities/Ball.js";
import Player from "./entities/Player.js";

export default class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.boardWidth = 800;
    this.boardHeight = 500;
    this.canvas.width = this.boardWidth;
    this.canvas.height = this.boardHeight;
    this.keys = {};
    this.winningScore = 5; // Add winning score constant

    this.isPlaying = false;

    const ballRadius = 10;
    this.ball = new Ball(
      this.boardWidth / 2,
      this.boardHeight / 2,
      ballRadius,
      0,
      0
    );

    const playerWidth = 20;
    const playerHeight = 80;
    const speed = 500;
    this.player1 = new Player(
      10,
      this.boardHeight / 2 - playerHeight / 2,
      playerWidth,
      playerHeight,
      speed
    );
    this.player2 = new Player(
      this.boardWidth - playerWidth - 10,
      this.boardHeight / 2 - playerHeight / 2,
      playerWidth,
      playerHeight,
      speed
    );

    this.lastTime = 0;
    this.addEventListeners();
  }

  addEventListeners() {
    document.addEventListener("keydown", (event) => {
      this.keys[event.key] = true;
    });

    document.addEventListener("keyup", (event) => {
      this.keys[event.key] = false;
    });
  }

  checkWinner() {
    if (
      this.player1.score >= this.winningScore ||
      this.player2.score >= this.winningScore
    ) {
      this.isPlaying = false;
      return true;
    }
    return false;
  }

  reset() {
    this.player1.reset();
    this.player2.reset();
    this.ball.reset(this.boardWidth, this.boardHeight);
    this.isPlaying = false;
  }

  update(deltaTime) {
    // Update player1 using "w" and "s"
    if (this.keys["w"]) {
      this.player1.velocityY = -this.player1.speed;
    } else if (this.keys["s"]) {
      this.player1.velocityY = this.player1.speed;
    } else {
      this.player1.velocityY = 0;
    }

    // Update player2 using "ArrowUp" and "ArrowDown"
    if (this.keys["ArrowUp"]) {
      this.player2.velocityY = -this.player2.speed;
    } else if (this.keys["ArrowDown"]) {
      this.player2.velocityY = this.player2.speed;
    } else {
      this.player2.velocityY = 0;
    }

    // Update player positions with frame-rate independence
    this.player1.update(deltaTime, this.boardHeight);
    this.player2.update(deltaTime, this.boardHeight);

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
        this.ctx.fillText(
          "Player 2 Wins! Press Start to Play Again!",
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
}
