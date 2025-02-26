import GameMode from "./GameMode";

export default class LocalMultiplayerMode extends GameMode {
  constructor(game) {
    super(game);
  }

  handleInput(deltaTime) {
    // Player 1 (W/S keys)
    if (this.game.keys["KeyW"]) {
      this.game.player1.velocityY = -this.game.player1.speed;
    } else if (this.game.keys["KeyS"]) {
      this.game.player1.velocityY = this.game.player1.speed;
    } else {
      this.game.player1.velocityY = 0;
    }

    // Player 2 (Arrow keys)
    if (this.game.keys["ArrowUp"]) {
      this.game.player2.velocityY = -this.game.player2.speed;
    } else if (this.game.keys["ArrowDown"]) {
      this.game.player2.velocityY = this.game.player2.speed;
    } else {
      this.game.player2.velocityY = 0;
    }
  }

  update(deltaTime) {
    // Update player positions based on their velocities
    this.game.player1.update(deltaTime, this.game.boardHeight);
    this.game.player2.update(deltaTime, this.game.boardHeight);
  }

  reset() {
    // Reset both players
    this.game.player1.reset();
    this.game.player2.reset();
  }
}
