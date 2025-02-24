# Pong Game

A classic Pong game implementation using vanilla JavaScript and HTML5 Canvas. This two-player game features a modern design, score tracking, and responsive controls.

## Features

- Two-player gameplay
- Smooth paddle movement with frame-rate independence
- Score tracking
- Advanced ball physics with angle-based paddle rebounds
- Win condition at 5 points
- Responsive design with clear visual feedback
- Center line and score display
- Start/reset game functionality

## How to Play

1. Open `index.html` in a modern web browser
2. Click the "Start Game" button to begin
3. Controls:
   - Player 1 (Left Paddle):
     - W: Move Up
     - S: Move Down
   - Player 2 (Right Paddle):
     - ↑ (Up Arrow): Move Up
     - ↓ (Down Arrow): Move Down
4. First player to score 5 points wins
5. Click "Start Game" to play again after a game ends

## Project Structure

```
pong-game/
│
├── index.html          # Main HTML file
├── index.js           # Game logic and classes
└── styles.css         # Game styling
```

### File Details

#### index.html
Contains the basic structure of the game including:
- Canvas element for game rendering
- Start button
- Game instructions
- Required script and style links

#### index.js
Contains all game logic divided into three main classes:
- `Player`: Handles paddle movement and scoring
- `Ball`: Manages ball physics and collision detection
- `Game`: Controls game state and main game loop

#### styles.css
Contains styling for:
- Game canvas
- Start button
- Instructions text
- Overall layout

## Technical Implementation

### Game Physics
- Frame-rate independent movement
- Dynamic ball angles based on paddle hit location
- Collision detection for paddles and boundaries
- Ball speed remains constant during gameplay

### Scoring System
- Points awarded when ball passes paddle
- Score display in top corners
- Game ends at 5 points
- Automatic reset functionality

### Animation
- Smooth game loop using requestAnimationFrame
- Consistent 60 FPS target
- Efficient canvas clearing and redrawing

## Browser Support

Works in all modern browsers that support HTML5 Canvas:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Future Improvements

Potential enhancements that could be added:
- Sound effects
- Power-ups
- AI opponent option
- Mobile touch controls
- Customizable paddle/ball colors
- Adjustable winning score
- Network multiplayer

## Development

To modify the game:

1. Clone the repository
2. Make changes to the relevant files
3. Test in a web browser
4. No build process required

For local development, using a local web server is recommended to avoid CORS issues.

## Credits

Created as a modern implementation of the classic Pong game, originally developed by Atari in 1972.
