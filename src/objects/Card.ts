import Phaser from 'phaser';
import { GAME_CONFIG } from '../config';

export class Card extends Phaser.GameObjects.Container {
  private cardBack: Phaser.GameObjects.Graphics;
  private cardFront: Phaser.GameObjects.Graphics;
  private iconText: Phaser.GameObjects.Text;
  private _isFlipped: boolean = false;
  private _isMatched: boolean = false;
  public readonly cardId: number;
  public readonly pairId: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    cardId: number,
    pairId: number,
    icon: string
  ) {
    super(scene, x, y);
    this.cardId = cardId;
    this.pairId = pairId;

    // Create card back (face-down appearance)
    this.cardBack = this.createCardBack();
    this.add(this.cardBack);

    // Create card front (face-up appearance with icon)
    this.cardFront = this.createCardFront();
    this.iconText = this.createIcon(icon);
    this.add(this.cardFront);
    this.add(this.iconText);

    // Initially show only the back
    this.cardFront.setVisible(false);
    this.iconText.setVisible(false);

    // Make interactive
    this.setSize(GAME_CONFIG.CARD_WIDTH, GAME_CONFIG.CARD_HEIGHT);
    this.setInteractive(
      new Phaser.Geom.Rectangle(
        -GAME_CONFIG.CARD_WIDTH / 2,
        -GAME_CONFIG.CARD_HEIGHT / 2,
        GAME_CONFIG.CARD_WIDTH,
        GAME_CONFIG.CARD_HEIGHT
      ),
      Phaser.Geom.Rectangle.Contains
    );

    // Add hover effect
    this.on('pointerover', () => {
      if (!this._isFlipped && !this._isMatched) {
        this.scene.tweens.add({
          targets: this,
          scale: 1.05,
          duration: 150,
          ease: 'Power2',
        });
      }
    });

    this.on('pointerout', () => {
      if (!this._isFlipped && !this._isMatched) {
        this.scene.tweens.add({
          targets: this,
          scale: 1,
          duration: 150,
          ease: 'Power2',
        });
      }
    });

    scene.add.existing(this);
  }

  private createCardBack(): Phaser.GameObjects.Graphics {
    const graphics = this.scene.add.graphics();

    // Draw gradient-like effect with multiple rectangles
    const width = GAME_CONFIG.CARD_WIDTH;
    const height = GAME_CONFIG.CARD_HEIGHT;

    // Shadow
    graphics.fillStyle(0x000000, 0.2);
    graphics.fillRoundedRect(-width / 2 + 3, -height / 2 + 3, width, height, 10);

    // Main card background
    graphics.fillStyle(0x9b59b6, 1);
    graphics.fillRoundedRect(-width / 2, -height / 2, width, height, 10);

    // Border
    graphics.lineStyle(3, 0x8e44ad, 1);
    graphics.strokeRoundedRect(-width / 2, -height / 2, width, height, 10);

    // Pattern (small circles)
    graphics.fillStyle(0x8e44ad, 0.3);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 5; j++) {
        graphics.fillCircle(
          -width / 2 + 20 + i * 20,
          -height / 2 + 20 + j * 25,
          3
        );
      }
    }

    return graphics;
  }

  private createCardFront(): Phaser.GameObjects.Graphics {
    const graphics = this.scene.add.graphics();

    const width = GAME_CONFIG.CARD_WIDTH;
    const height = GAME_CONFIG.CARD_HEIGHT;

    // Shadow
    graphics.fillStyle(0x000000, 0.2);
    graphics.fillRoundedRect(-width / 2 + 3, -height / 2 + 3, width, height, 10);

    // Main card background (white/light)
    graphics.fillStyle(0xecf0f1, 1);
    graphics.fillRoundedRect(-width / 2, -height / 2, width, height, 10);

    // Border
    graphics.lineStyle(3, 0x3498db, 1);
    graphics.strokeRoundedRect(-width / 2, -height / 2, width, height, 10);

    return graphics;
  }

  private createIcon(icon: string): Phaser.GameObjects.Text {
    return this.scene.add.text(0, 0, icon, {
      fontSize: '48px',
      color: '#2c3e50',
    }).setOrigin(0.5);
  }

  public flip(onComplete?: () => void): void {
    if (this._isMatched) return;

    this._isFlipped = !this._isFlipped;

    // Play flip sound (if available)
    try {
      if (this.scene.sound.get('flip')) {
        this.scene.sound.play('flip', { volume: 0.3 });
      }
    } catch (error) {
      // Silently ignore sound errors
    }

    // First half of flip (shrink horizontally)
    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      duration: GAME_CONFIG.FLIP_DURATION / 2,
      ease: 'Power2',
      onComplete: () => {
        // Switch card face
        this.cardBack.setVisible(!this._isFlipped);
        this.cardFront.setVisible(this._isFlipped);
        this.iconText.setVisible(this._isFlipped);

        // Second half of flip (expand horizontally)
        this.scene.tweens.add({
          targets: this,
          scaleX: 1,
          duration: GAME_CONFIG.FLIP_DURATION / 2,
          ease: 'Power2',
          onComplete: () => {
            if (onComplete) onComplete();
          },
        });
      },
    });
  }

  public setMatched(): void {
    this._isMatched = true;

    // Play match sound (if available)
    try {
      if (this.scene.sound.get('match')) {
        this.scene.sound.play('match', { volume: 0.4 });
      }
    } catch (error) {
      // Silently ignore sound errors
    }

    // Celebratory animation
    this.scene.tweens.add({
      targets: this,
      scale: 1.2,
      duration: 200,
      yoyo: true,
      ease: 'Power2',
    });

    // Slight color change to indicate matched
    this.scene.tweens.add({
      targets: this,
      alpha: 0.8,
      duration: 300,
      ease: 'Power2',
    });
  }

  public get isFlipped(): boolean {
    return this._isFlipped;
  }

  public get isMatched(): boolean {
    return this._isMatched;
  }
}
