# Pong Game
A classic Pong game implementation using vanilla JavaScript and HTML5 Canvas with multiple game modes and customizable settings.

## Features
- Multiple game modes:
  - Two-player local multiplayer
  - Single-player vs AI with adjustable difficulty
  - Online multiplayer (coming soon)
- Smooth paddle movement with frame-rate independence
- Score tracking
- Advanced ball physics with angle-based paddle rebounds
- Win condition at 5 points
- Responsive design with clear visual feedback
- Center line and score display
- Adjustable game speed (slow, normal, fast)
- Start/reset game functionality
- Configurable AI difficulty (easy, normal, hard)

## How to Play
Hosted on: https://github.com/VladFearo/Pong
1. Open `index.html` in a modern web browser
2. Select your preferred game mode
3. Adjust difficulty or speed settings as desired
4. Click the "Start Game" button to begin
5. Controls:
   - Player 1 (Left Paddle):
     - W: Move Up
     - S: Move Down
   - Player 2 (Right Paddle) / AI:
     - ↑ (Up Arrow): Move Up
     - ↓ (Down Arrow): Move Down
6. First player to score 5 points wins
7. Click "Reset" to return to the setup screen

## Project Structure
```
pong-game/
│
├── index.html          # Main HTML file
├── styles.css          # Game styling
├── scripts/
│   ├── index.js        # Entry point and UI handlers
│   ├── Game.js         # Main game controller
│   ├── entities/
│   │   ├── Ball.js     # Ball physics and collision
│   │   └── Player.js   # Paddle controls and scoring
│   ├── modes/
│   │   ├── GameMode.js           # Base class for game modes
│   │   ├── LocalMultiplayerMode.js  # Two-player implementation
│   │   ├── SinglePlayerMode.js   # AI opponent implementation
│   │   └── OnlineMultiplayerMode.js # Online play (placeholder)
│   └── config/
│       └── gameConfig.js  # Game constants and configuration
```

### File Details
#### index.html
Contains the game interface including:
- Canvas element for game rendering
- Game mode selection controls
- AI difficulty settings
- Game speed controls
- Start/reset buttons
- Game instructions

#### styles.css
Contains styling for:
- Game canvas and visuals
- Control panels and buttons
- Game mode selection interfaces
- Responsive layout and animations

#### Game.js
Central controller that:
- Manages the game loop and state
- Switches between game modes
- Handles ball physics and scoring
- Controls game flow (start, reset, win conditions)

#### Modes
The game uses a flexible mode system:
- `GameMode.js`: Base class defining the interface for all modes
- `LocalMultiplayerMode.js`: Standard two-player gameplay
- `SinglePlayerMode.js`: Implements AI opponent with configurable difficulty
- `OnlineMultiplayerMode.js`: Structure for future online multiplayer

## Technical Implementation
### Game Physics
- Frame-rate independent movement
- Dynamic ball angles based on paddle hit location
- Collision detection for paddles and boundaries
- Ball speed adjustable via game settings

### AI Implementation
- Predictive algorithm that anticipates ball trajectory
- Three difficulty levels affecting:
  - Reaction time
  - Prediction accuracy
  - Paddle speed

### Architecture
- Object-oriented design with class inheritance
- Modular code organization with ES6 modules
- Centralized configuration in gameConfig.js
- Event-driven UI with responsive controls

## Browser Support
Works in all modern browsers that support HTML5 Canvas and ES6:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Future Improvements
Planned enhancements:
- Implementation of online multiplayer using Socket.io
- Sound effects and music
- Power-ups and special game modes
- Mobile touch controls
- Customizable paddle/ball colors
- Adjustable winning score

## Development
To modify the game:
1. Clone the repository
2. Make changes to the relevant files
3. Test in a web browser
4. No build process required

For local development, using a local web server is recommended to avoid CORS issues.

## Credits
Created as a modern implementation of the classic Pong game, originally developed by Atari in 1972.
