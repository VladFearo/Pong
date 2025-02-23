class Player {
  constructor(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.velocityY = 0;
    this.score = 0; // Add score tracking
  }

  update(deltaTime, boardHeight) {
    this.y += this.velocityY * deltaTime;
    this.y = Math.max(0, Math.min(this.y, boardHeight - this.height));
  }

  draw(ctx) {
    ctx.fillStyle = "#222831";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Draw score
    ctx.fillStyle = "#222831";
    ctx.font = "48px Arial";
    ctx.textAlign = this.x < 400 ? "left" : "right";
    ctx.fillText(this.score.toString(), this.x < 400 ? 50 : 750, 50);
  }
}

class Ball {
  constructor(x, y, radius, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speedX = speedX;
    this.speedY = speedY;
    this.baseSpeed = 200; // Base speed for resetting
  }

  reset(boardWidth, boardHeight) {
    this.x = boardWidth / 2;
    this.y = boardHeight / 2;
    // Randomize direction
    const angle = (Math.random() * Math.PI) / 4 - Math.PI / 8; // ±22.5 degrees
    const direction = Math.random() > 0.5 ? 1 : -1;
    this.speedX = Math.cos(angle) * this.baseSpeed * direction;
    this.speedY = Math.sin(angle) * this.baseSpeed;
  }

  update(deltaTime, boardWidth, boardHeight, player1, player2) {
    this.x += this.speedX * deltaTime;
    this.y += this.speedY * deltaTime;

    // Bounce off top and bottom
    if (this.y - this.radius < 0 || this.y + this.radius > boardHeight) {
      this.speedY = -this.speedY;
      this.y =
        this.y - this.radius < 0 ? this.radius : boardHeight - this.radius;
    }

    // Score points and reset ball
    if (this.x - this.radius < 0) {
      player2.score++;
      this.reset(boardWidth, boardHeight);
    } else if (this.x + this.radius > boardWidth) {
      player1.score++;
      this.reset(boardWidth, boardHeight);
    }

    // Paddle collisions with improved bounce angles
    if (
      this.x - this.radius < player1.x + player1.width &&
      this.x + this.radius > player1.x &&
      this.y > player1.y &&
      this.y < player1.y + player1.height
    ) {
      // Calculate relative intersection point (-0.5 to 0.5)
      const relativeIntersectY = player1.y + player1.height / 2 - this.y;
      const normalizedIntersectY = relativeIntersectY / (player1.height / 2);
      const bounceAngle = (normalizedIntersectY * Math.PI) / 3; // Max 60° angle

      // Update velocities
      const speed = Math.sqrt(
        this.speedX * this.speedX + this.speedY * this.speedY
      );
      this.speedX = Math.cos(bounceAngle) * speed;
      this.speedY = -Math.sin(bounceAngle) * speed;

      // Prevent sticking
      this.x = player1.x + player1.width + this.radius;
    }

    if (
      this.x + this.radius > player2.x &&
      this.x - this.radius < player2.x + player2.width &&
      this.y > player2.y &&
      this.y < player2.y + player2.height
    ) {
      const relativeIntersectY = player2.y + player2.height / 2 - this.y;
      const normalizedIntersectY = relativeIntersectY / (player2.height / 2);
      const bounceAngle = (normalizedIntersectY * Math.PI) / 3;

      const speed = Math.sqrt(
        this.speedX * this.speedX + this.speedY * this.speedY
      );
      this.speedX = -Math.cos(bounceAngle) * speed;
      this.speedY = -Math.sin(bounceAngle) * speed;

      // Prevent sticking
      this.x = player2.x - this.radius;
    }
  }

  draw(ctx) {
    ctx.fillStyle = "#eeeeee";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
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

    this.isPlaying = false;

    const ballRadius = 10; // Define ball radius
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

    // Draw "Press Start" message when not playing
    if (!this.isPlaying) {
      this.ctx.fillStyle = "#222831";
      this.ctx.font = "24px Arial";
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        "Press Start to Play!",
        this.boardWidth / 2,
        this.boardHeight / 2 + 50
      );
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
      this.isPlaying = true;
      this.ball.reset(this.boardWidth, this.boardHeight);
    }
  }
}

// Initialize the game
window.onload = () => {
  const canvas = document.querySelector("canvas");
  const startBtn = document.getElementById("startButton");
  const game = new Game(canvas);
  game.start();

  startBtn.addEventListener("click", () => {
    game.startGame();
    startBtn.disabled = true;
  });
};
