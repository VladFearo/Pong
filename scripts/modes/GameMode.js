export default class GameMode {
  constructor(game) {
    this.game = game;
  }

  init() {}
  handleInput(deltaTime) {
    throw new Error("GameMode.handleInput() must be implemented by subclass");
  }

  update(deltaTime) {
    throw new Error("GameMode.update() must be implemented by subclass");
  }

  reset() {
    throw new Error("GameMode.reset() must be implemented by subclass");
  }

  cleanup() {}
}
