export const GAME_CONFIG = {
  BOARD_WIDTH: 800,
  BOARD_HEIGHT: 500,
  WINNING_SCORE: 5,
  PLAYER_WIDTH: 20,
  PLAYER_HEIGHT: 80,
  PLAYER_SPEED: 500,
  BALL_RADIUS: 10,
  BALL_SPEED: 400,
  COLORS: {
    PLAYER: "#222831",
    BALL: "#eeeeee",
    CENTER_LINE: "#222831",
  },
  AI_DIFFICULTY: {
    easy: {
      REACTION_TIME: 0.5, // Seconds before AI reacts
      ACCURACY: 0.6, // How accurate AI prediction is (0-1)
      SPEED_MULTIPLIER: 0.7, // Multiplier for paddle speed
    },
    normal: {
      REACTION_TIME: 0.3,
      ACCURACY: 0.8,
      SPEED_MULTIPLIER: 1.0,
    },
    hard: {
      REACTION_TIME: 0.1,
      ACCURACY: 0.95,
      SPEED_MULTIPLIER: 1.2,
    },
  },
};
