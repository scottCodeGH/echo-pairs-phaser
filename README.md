# Echo Pairs 🎮

Echo Pairs is a casual, browser-based memory matching game built with TypeScript and Phaser. Players flip over cards to find matching pairs in a colorful, animated grid designed for quick, satisfying sessions. With randomized layouts, snappy flip animations, and light audio/visual feedback, Echo Pairs delivers a polished, replayable puzzle experience that runs smoothly on desktop and mobile browsers.

## Features

- **Classic Memory Gameplay**: Find all 8 pairs of matching cards in a 4x4 grid
- **Beautiful Animations**: Smooth card flip effects and celebratory animations
- **Performance Tracking**: Move counter and timer to challenge yourself
- **Star Rating System**: Earn up to 3 stars based on your performance
- **Responsive Design**: Adapts to different screen sizes for desktop and mobile play
- **Sound Effects**: Procedurally generated audio feedback for flips, matches, and victories
- **Randomized Layouts**: Every game is different with shuffled card positions
- **Quick Sessions**: Complete a game in just a few minutes

## Tech Stack

- **Phaser 3**: Fast 2D HTML5 game framework
- **TypeScript**: Type-safe game development
- **Vite**: Lightning-fast build tool and dev server
- **Web Audio API**: Dynamic sound generation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd echo-pairs-phaser
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist/` directory. You can preview the production build with:

```bash
npm run preview
```

## How to Play

1. **Start**: Click the "PLAY" button on the main menu
2. **Flip Cards**: Click any card to flip it over and reveal its icon
3. **Find Matches**: Click a second card to find its matching pair
4. **Match**: If the cards match, they stay face-up
5. **Mismatch**: If they don't match, they flip back after a moment
6. **Win**: Match all 8 pairs to complete the game
7. **Replay**: Try to beat your score with fewer moves and less time!

## Game Controls

- **Mouse/Touch**: Click or tap cards to flip them
- **Menu Button**: Return to the main menu at any time during gameplay
- **Play Again**: Restart the game from the win screen
- **Responsive**: The game automatically scales to fit your screen

## Project Structure

```
echo-pairs-phaser/
├── src/
│   ├── main.ts              # Game entry point
│   ├── config.ts            # Game configuration
│   ├── objects/
│   │   └── Card.ts          # Card class with flip animations
│   └── scenes/
│       ├── MenuScene.ts     # Main menu
│       ├── GameScene.ts     # Main game scene
│       └── WinScene.ts      # Victory screen
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite build configuration
```

## Game Scenes

### MenuScene
- Animated title and floating particles
- Play button to start the game
- Instructions and credits

### GameScene
- 4x4 grid of interactive cards
- Real-time move counter and timer
- Card matching logic
- Return to menu button

### WinScene
- Congratulations message with confetti
- Performance statistics (moves and time)
- Star rating (1-3 stars based on performance)
- Play Again and Menu buttons

## Customization

You can easily customize the game by editing `src/config.ts`:

```typescript
export const GAME_CONFIG = {
  GRID_ROWS: 4,              // Number of rows
  GRID_COLS: 4,              // Number of columns
  CARD_WIDTH: 100,           // Card width in pixels
  CARD_HEIGHT: 140,          // Card height in pixels
  CARD_SPACING: 20,          // Space between cards
  FLIP_DURATION: 300,        // Card flip animation speed (ms)
  MATCH_DELAY: 500,          // Delay before matched cards animate (ms)
  MISMATCH_DELAY: 1000,      // Delay before mismatched cards flip back (ms)
};
```

You can also change the card icons in `src/scenes/GameScene.ts`:

```typescript
private readonly icons = [
  '🍎', '🍊', '🍋', '🍌',
  '🍇', '🍓', '🍒', '🍑',
];
```

## Performance Ratings

The game awards stars based on your performance:

- **3 Stars (AMAZING!)**: Complete in 20 or fewer moves and 60 seconds or less
- **2 Stars (GREAT!)**: Complete in 30 or fewer moves and 90 seconds or less
- **1 Star (GOOD JOB!)**: Complete the game

## Browser Compatibility

Echo Pairs works on all modern browsers that support:
- ES2020 JavaScript features
- HTML5 Canvas
- Web Audio API

Tested on:
- Chrome/Edge (v90+)
- Firefox (v88+)
- Safari (v14+)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

Potential features for future versions:
- Multiple difficulty levels (3x3, 5x5, 6x6 grids)
- Different card themes (animals, numbers, shapes)
- Local high score tracking
- Background music
- Sound on/off toggle
- Hint system
- Daily challenges
- Multiplayer mode

## License

MIT

## Credits

Built with Phaser 3 and TypeScript. Card icons are emoji characters for universal compatibility.
