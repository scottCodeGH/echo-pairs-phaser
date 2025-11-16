import Phaser from 'phaser';
import { Card } from '../objects/Card';
import { GAME_CONFIG } from '../config';

export class GameScene extends Phaser.Scene {
  private cards: Card[] = [];
  private flippedCards: Card[] = [];
  private canFlip: boolean = true;
  private matchedPairs: number = 0;
  private moves: number = 0;
  private startTime: number = 0;
  private timerText!: Phaser.GameObjects.Text;
  private movesText!: Phaser.GameObjects.Text;
  private timerEvent?: Phaser.Time.TimerEvent;

  // Card icons (emojis for visual appeal)
  private readonly icons = [
    '🍎', '🍊', '🍋', '🍌',
    '🍇', '🍓', '🍒', '🍑',
  ];

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background
    this.createBackground();

    // Title
    this.add.text(width / 2, 40, 'ECHO PAIRS', {
      fontSize: '36px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // UI Elements
    this.createUI();

    // Create card grid
    this.createCardGrid();

    // Start timer
    this.startTime = Date.now();
    this.timerEvent = this.time.addEvent({
      delay: 100,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });

    // Create simple sound effects (using Web Audio API via Phaser)
    this.createSoundEffects();
  }

  private createBackground(): void {
    const { width, height } = this.cameras.main;

    // Gradient background
    const gradient = this.add.graphics();
    gradient.fillGradientStyle(0x3498db, 0x3498db, 0x2980b9, 0x2980b9, 1);
    gradient.fillRect(0, 0, width, height);

    // Animated circles in background
    for (let i = 0; i < 10; i++) {
      const circle = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.Between(20, 50),
        0xffffff,
        0.05
      );

      this.tweens.add({
        targets: circle,
        alpha: 0.1,
        scale: 1.2,
        duration: Phaser.Math.Between(2000, 4000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  private createUI(): void {
    const { width } = this.cameras.main;

    // Moves counter
    this.movesText = this.add.text(50, 90, 'Moves: 0', {
      fontSize: '24px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold',
    });

    // Timer
    this.timerText = this.add.text(width - 50, 90, 'Time: 0:00', {
      fontSize: '24px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(1, 0);

    // Menu button
    this.createMenuButton();
  }

  private createMenuButton(): void {
    const button = this.add.container(50, 40);

    const bg = this.add.graphics();
    bg.fillStyle(0xe74c3c, 1);
    bg.fillRoundedRect(-40, -15, 80, 30, 5);

    const text = this.add.text(0, 0, 'MENU', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    button.add([bg, text]);
    button.setSize(80, 30);
    button.setInteractive(
      new Phaser.Geom.Rectangle(-40, -15, 80, 30),
      Phaser.Geom.Rectangle.Contains
    );

    button.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(0xc0392b, 1);
      bg.fillRoundedRect(-40, -15, 80, 30, 5);
    });

    button.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0xe74c3c, 1);
      bg.fillRoundedRect(-40, -15, 80, 30, 5);
    });

    button.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }

  private createCardGrid(): void {
    const { width, height } = this.cameras.main;

    // Create pairs array
    const pairs: { pairId: number; icon: string }[] = [];
    for (let i = 0; i < 8; i++) {
      pairs.push({ pairId: i, icon: this.icons[i] });
      pairs.push({ pairId: i, icon: this.icons[i] });
    }

    // Shuffle the pairs
    Phaser.Utils.Array.Shuffle(pairs);

    // Calculate grid positioning
    const totalWidth =
      GAME_CONFIG.GRID_COLS * GAME_CONFIG.CARD_WIDTH +
      (GAME_CONFIG.GRID_COLS - 1) * GAME_CONFIG.CARD_SPACING;
    const totalHeight =
      GAME_CONFIG.GRID_ROWS * GAME_CONFIG.CARD_HEIGHT +
      (GAME_CONFIG.GRID_ROWS - 1) * GAME_CONFIG.CARD_SPACING;

    const startX = (width - totalWidth) / 2 + GAME_CONFIG.CARD_WIDTH / 2;
    const startY = (height - totalHeight) / 2 + GAME_CONFIG.CARD_HEIGHT / 2 + 40;

    // Create cards
    let cardIndex = 0;
    for (let row = 0; row < GAME_CONFIG.GRID_ROWS; row++) {
      for (let col = 0; col < GAME_CONFIG.GRID_COLS; col++) {
        const x = startX + col * (GAME_CONFIG.CARD_WIDTH + GAME_CONFIG.CARD_SPACING);
        const y = startY + row * (GAME_CONFIG.CARD_HEIGHT + GAME_CONFIG.CARD_SPACING);

        const { pairId, icon } = pairs[cardIndex];
        const card = new Card(this, x, y, cardIndex, pairId, icon);

        card.on('pointerdown', () => this.onCardClicked(card));

        this.cards.push(card);
        cardIndex++;
      }
    }

    // Entrance animation
    this.cards.forEach((card, index) => {
      card.setAlpha(0);
      card.setScale(0);
      this.tweens.add({
        targets: card,
        alpha: 1,
        scale: 1,
        duration: 300,
        delay: index * 50,
        ease: 'Back.easeOut',
      });
    });
  }

  private onCardClicked(card: Card): void {
    if (!this.canFlip || card.isFlipped || card.isMatched) {
      return;
    }

    // Flip the card
    card.flip();
    this.flippedCards.push(card);

    // Check if two cards are flipped
    if (this.flippedCards.length === 2) {
      this.canFlip = false;
      this.moves++;
      this.movesText.setText(`Moves: ${this.moves}`);

      this.time.delayedCall(GAME_CONFIG.FLIP_DURATION, () => {
        this.checkMatch();
      });
    }
  }

  private checkMatch(): void {
    const [card1, card2] = this.flippedCards;

    if (card1.pairId === card2.pairId) {
      // Match found!
      this.time.delayedCall(GAME_CONFIG.MATCH_DELAY, () => {
        card1.setMatched();
        card2.setMatched();

        this.matchedPairs++;
        this.flippedCards = [];
        this.canFlip = true;

        // Check if game is won
        if (this.matchedPairs === 8) {
          this.onGameWon();
        }
      });
    } else {
      // No match - flip back
      this.time.delayedCall(GAME_CONFIG.MISMATCH_DELAY, () => {
        card1.flip();
        card2.flip();

        this.time.delayedCall(GAME_CONFIG.FLIP_DURATION, () => {
          this.flippedCards = [];
          this.canFlip = true;
        });
      });
    }
  }

  private updateTimer(): void {
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    this.timerText.setText(`Time: ${minutes}:${seconds.toString().padStart(2, '0')}`);
  }

  private onGameWon(): void {
    // Stop timer
    if (this.timerEvent) {
      this.timerEvent.destroy();
    }

    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);

    // Play win sound (if available)
    try {
      if (this.sound.get('win')) {
        this.sound.play('win', { volume: 0.5 });
      }
    } catch (error) {
      // Silently ignore sound errors
    }

    // Transition to win scene
    this.time.delayedCall(1000, () => {
      this.scene.start('WinScene', {
        moves: this.moves,
        time: elapsed,
      });
    });
  }

  private createSoundEffects(): void {
    // Create simple beep sounds using Web Audio API
    // Wrapped in try-catch to prevent errors from blocking game
    try {
      if (!this.sound.get('flip')) {
        this.createTone('flip', 400, 0.1);
      }

      if (!this.sound.get('match')) {
        this.createTone('match', 600, 0.2);
      }

      if (!this.sound.get('win')) {
        this.createTone('win', 800, 0.3);
      }
    } catch (error) {
      console.warn('Sound creation failed, continuing without sound:', error);
    }
  }

  private createTone(key: string, frequency: number, duration: number): void {
    try {
      // Get or create audio context
      const audioContext = this.sound.context as AudioContext;
      if (!audioContext) {
        console.warn('No audio context available');
        return;
      }

      const sampleRate = audioContext.sampleRate;
      const numSamples = Math.floor(sampleRate * duration);
      const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
      const channelData = buffer.getChannelData(0);

      // Generate sine wave with exponential decay
      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        channelData[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-3 * t);
      }

      // Create a base sound (silent) and store the buffer for later use
      // We'll play it manually using the Web Audio API
      (this.sound as any)[key + '_buffer'] = buffer;
    } catch (error) {
      console.warn(`Failed to create tone '${key}':`, error);
    }
  }
}
