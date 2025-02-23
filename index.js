class Player {
  constructor(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.velocityY = 0;
  }

  update(deltaTime, boardHeight) {
    this.y += this.velocityY * deltaTime;
    // Clamp the player's position so it stays within the canvas bounds
    this.y = Math.max(0, Math.min(this.y, boardHeight - this.height));
  }

  draw(ctx) {
    ctx.fillStyle = "#222831";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.boardWidth = 800;
    this.boardHeight = 500;
    this.canvas.width = this.boardWidth;
    this.canvas.height = this.boardHeight;
    this.keys = {};

    // Create players
    const playerWidth = 20;
    const playerHeight = 80;
    const speed = 300; // pixels per second
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
  }

  draw() {
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.boardWidth, this.boardHeight);
    // Draw both players
    this.player1.draw(this.ctx);
    this.player2.draw(this.ctx);
  }

  loop(timestamp) {
    const deltaTime = (timestamp - this.lastTime) / 1000; // Convert ms to seconds
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
}

window.onload = () => {
  const canvas = document.querySelector("canvas");
  const game = new Game(canvas);
  game.start();
};
