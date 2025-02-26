export default class Ball {
  constructor(x, y, radius, baseSpeed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.baseSpeed = baseSpeed;
    this.resetSpeed();
  }

  resetSpeed() {
    const angle = (Math.random() * Math.PI) / 4 - Math.PI / 8;
    const direction = Math.random() > 0.5 ? 1 : -1;
    this.speedX = Math.cos(angle) * this.baseSpeed * direction;
    this.speedY = Math.sin(angle) * this.baseSpeed;
  }

  reset(boardWidth, boardHeight) {
    this.x = boardWidth / 2;
    this.y = boardHeight / 2;
    this.resetSpeed();
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
