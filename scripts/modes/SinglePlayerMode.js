import GameMode from "./GameMode.js";
import { GAME_CONFIG } from "../config/gameConfig.js";

export default class SinglePlayerMode extends GameMode {
  constructor(game) {
    super(game);
    this.difficulty = "normal";
    this.reactionTimer = 0;
    this.targetY = 0;
    this.predictedY = 0;

    // These will be set from config in setDifficulty
    this.reactionTime = 0;
    this.aiAccuracy = 0;
    this.aiSpeed = 0;
  }

  init() {
    // Configure AI based on difficulty
    this.setDifficulty(this.difficulty);
  }

  setDifficulty(level) {
    this.difficulty = level;

    // Get AI parameters from config
    const aiConfig =
      GAME_CONFIG.AI_DIFFICULTY[level] || GAME_CONFIG.AI_DIFFICULTY.normal;

    this.reactionTime = aiConfig.REACTION_TIME;
    this.aiAccuracy = aiConfig.ACCURACY;
    this.aiSpeed = this.game.player2.speed * aiConfig.SPEED_MULTIPLIER;
  }

  handleInput(deltaTime) {
    // Only handle player 1 (human) input
    if (this.game.keys["KeyW"]) {
      this.game.player1.velocityY = -this.game.player1.speed;
    } else if (this.game.keys["KeyS"]) {
      this.game.player1.velocityY = this.game.player1.speed;
    } else {
      this.game.player1.velocityY = 0;
    }
  }

  update(deltaTime) {
    // Update human player position
    this.game.player1.update(deltaTime, this.game.boardHeight);

    // Update AI behavior
    this.updateAI(deltaTime);

    // Update AI player position
    this.game.player2.update(deltaTime, this.game.boardHeight);
  }

  updateAI(deltaTime) {
    const ball = this.game.ball;
    const player2 = this.game.player2;

    // Only update AI decision making periodically (based on reaction time)
    this.reactionTimer += deltaTime;
    if (this.reactionTimer >= this.reactionTime) {
      this.reactionTimer = 0;

      // Only react if ball is moving toward AI side
      if (ball.speedX > 0) {
        // Predict where ball will intersect with AI paddle's x position
        const distanceToAI = player2.x - ball.x;
        const timeToReach = distanceToAI / ball.speedX;
        this.predictedY = ball.y + ball.speedY * timeToReach;

        // Add some inaccuracy based on AI difficulty
        const maxError = this.game.boardHeight * (1 - this.aiAccuracy);
        const error = (Math.random() * 2 - 1) * maxError;
        this.targetY = this.predictedY + error;

        // Keep within board boundaries
        this.targetY = Math.max(
          player2.height / 2,
          Math.min(this.targetY, this.game.boardHeight - player2.height / 2)
        );
      }
    }

    // Move AI paddle toward the predicted position using AI speed
    const paddleCenter = player2.y + player2.height / 2;

    // Only move if sufficiently far from target to avoid jitter
    if (Math.abs(paddleCenter - this.targetY) > 10) {
      if (paddleCenter < this.targetY) {
        player2.velocityY = this.aiSpeed;
      } else {
        player2.velocityY = -this.aiSpeed;
      }
    } else {
      player2.velocityY = 0;
    }
  }

  reset() {
    // Reset both players
    this.game.player1.reset();
    this.game.player2.reset();
    this.reactionTimer = 0;
  }
}
