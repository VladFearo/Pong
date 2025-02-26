import GameMode from "./GameMode.js";

export default class OnlineMultiplayerMode extends GameMode {
  constructor(game) {
    super(game);
    this.socket = null;
    this.roomId = null;
    this.isHost = false;
    this.playerNumber = 0; // 0 = not assigned, 1 = player1, 2 = player2
    this.connected = false;
  }

  init() {
    // This will be implemented when we add Socket.io
    console.log("Online multiplayer not yet implemented");
  }

  connect(serverUrl) {
    // Placeholder for Socket.io connection
    console.log("Would connect to", serverUrl);
    this.connected = false;
    // In the future, we would implement:
    // this.socket = io(serverUrl);
    // this.setupSocketListeners();
  }

  handleInput(deltaTime) {
    // For online mode, we only handle local player input
    // and send it to the server
    if (!this.connected || this.playerNumber === 0) {
      return;
    }

    let input = null;

    if (this.playerNumber === 1) {
      if (this.game.keys["KeyW"]) {
        input = "up";
      } else if (this.game.keys["KeyS"]) {
        input = "down";
      } else {
        input = "stop";
      }
    } else if (this.playerNumber === 2) {
      if (this.game.keys["ArrowUp"]) {
        input = "up";
      } else if (this.game.keys["ArrowDown"]) {
        input = "down";
      } else {
        input = "stop";
      }
    }

    if (input && this.socket) {
      // In the future, we would send input to server:
      // this.socket.emit('playerInput', { input });
    }
  }

  update(deltaTime) {
    // For online mode, most updates come from the server
    // Local physics are just for prediction, server has final say

    // Currently does nothing since we have no server connection
    if (!this.connected) {
      return;
    }

    // Update player positions based on local input for responsiveness
    // (would be reconciled with server updates in the future)
    this.game.player1.update(deltaTime, this.game.boardHeight);
    this.game.player2.update(deltaTime, this.game.boardHeight);
  }

  reset() {
    // For online mode, reset is typically triggered by the server
    this.game.player1.reset();
    this.game.player2.reset();
  }

  cleanup() {
    // Clean up Socket.io connection if it exists
    if (this.socket) {
      // In the future:
      // this.socket.disconnect();
      this.socket = null;
    }
    this.connected = false;
    this.roomId = null;
    this.playerNumber = 0;
  }
}
