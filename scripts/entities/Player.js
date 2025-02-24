export default class Player {
  constructor(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.velocityY = 0;
    this.score = 0;
  }

  reset() {
    this.score = 0;
    this.velocityY = 0;
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
