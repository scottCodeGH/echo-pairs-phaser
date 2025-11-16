import Phaser from 'phaser';

interface WinSceneData {
  moves: number;
  time: number;
}

export class WinScene extends Phaser.Scene {
  private moves: number = 0;
  private time: number = 0;

  constructor() {
    super({ key: 'WinScene' });
  }

  init(data: WinSceneData): void {
    this.moves = data.moves;
    this.time = data.time;
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background
    const gradient = this.add.graphics();
    gradient.fillGradientStyle(0x2ecc71, 0x2ecc71, 0x27ae60, 0x27ae60, 1);
    gradient.fillRect(0, 0, width, height);

    // Celebration particles
    this.createConfetti();

    // Victory message with shadow
    const titleShadow = this.add.text(
      width / 2 + 3,
      height / 2 - 147,
      'CONGRATULATIONS!',
      {
        fontSize: '48px',
        fontFamily: 'Arial, sans-serif',
        color: '#000000',
        fontStyle: 'bold',
      }
    ).setOrigin(0.5).setAlpha(0.3);

    const title = this.add.text(width / 2, height / 2 - 150, 'CONGRATULATIONS!', {
      fontSize: '48px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Pulsing animation
    this.tweens.add({
      targets: title,
      scale: 1.1,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Success message
    this.add.text(width / 2, height / 2 - 90, 'You found all the pairs!', {
      fontSize: '24px',
      fontFamily: 'Arial, sans-serif',
      color: '#ecf0f1',
    }).setOrigin(0.5);

    // Stats container
    this.createStatsDisplay(width / 2, height / 2 - 20);

    // Performance rating
    const rating = this.calculateRating();
    const ratingText = this.add.text(width / 2, height / 2 + 70, rating.text, {
      fontSize: '28px',
      fontFamily: 'Arial, sans-serif',
      color: '#f1c40f',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Stars based on performance
    this.createStars(width / 2, height / 2 + 110, rating.stars);

    // Buttons
    this.createButton(width / 2 - 110, height / 2 + 170, 'PLAY AGAIN', () => {
      this.scene.start('GameScene');
    });

    this.createButton(width / 2 + 110, height / 2 + 170, 'MENU', () => {
      this.scene.start('MenuScene');
    });
  }

  private createStatsDisplay(x: number, y: number): void {
    const minutes = Math.floor(this.time / 60);
    const seconds = this.time % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Stats background
    const bg = this.add.graphics();
    bg.fillStyle(0xffffff, 0.2);
    bg.fillRoundedRect(x - 150, y - 40, 300, 80, 10);

    // Moves
    this.add.text(x, y - 10, `Moves: ${this.moves}`, {
      fontSize: '22px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Time
    this.add.text(x, y + 20, `Time: ${timeString}`, {
      fontSize: '22px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);
  }

  private calculateRating(): { stars: number; text: string } {
    // Rating based on moves and time
    let stars = 3;
    let text = 'AMAZING!';

    if (this.moves > 20 || this.time > 60) {
      stars = 2;
      text = 'GREAT!';
    }

    if (this.moves > 30 || this.time > 90) {
      stars = 1;
      text = 'GOOD JOB!';
    }

    return { stars, text };
  }

  private createStars(x: number, y: number, count: number): void {
    const starSpacing = 50;
    const startX = x - ((count - 1) * starSpacing) / 2;

    for (let i = 0; i < 3; i++) {
      const starX = startX + i * starSpacing;
      const filled = i < count;

      const star = this.add.text(starX, y, '★', {
        fontSize: '48px',
        color: filled ? '#f1c40f' : '#7f8c8d',
      }).setOrigin(0.5);

      if (filled) {
        // Animate filled stars
        star.setScale(0);
        this.tweens.add({
          targets: star,
          scale: 1,
          duration: 400,
          delay: i * 200,
          ease: 'Back.easeOut',
        });

        this.tweens.add({
          targets: star,
          angle: 360,
          duration: 1000,
          delay: i * 200,
          ease: 'Power2',
        });
      }
    }
  }

  private createButton(
    x: number,
    y: number,
    text: string,
    onClick: () => void
  ): Phaser.GameObjects.Container {
    const button = this.add.container(x, y);

    // Button background
    const bg = this.add.graphics();
    const buttonColor = text === 'PLAY AGAIN' ? 0x3498db : 0xe74c3c;
    const hoverColor = text === 'PLAY AGAIN' ? 0x2980b9 : 0xc0392b;

    bg.fillStyle(buttonColor, 1);
    bg.fillRoundedRect(-80, -20, 160, 40, 8);
    bg.lineStyle(2, 0xffffff, 0.5);
    bg.strokeRoundedRect(-80, -20, 160, 40, 8);

    // Button text
    const buttonText = this.add.text(0, 0, text, {
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    button.add([bg, buttonText]);
    button.setSize(160, 40);
    button.setInteractive(
      new Phaser.Geom.Rectangle(-80, -20, 160, 40),
      Phaser.Geom.Rectangle.Contains
    );

    // Hover effects
    button.on('pointerover', () => {
      this.tweens.add({
        targets: button,
        scale: 1.1,
        duration: 150,
        ease: 'Power2',
      });
      bg.clear();
      bg.fillStyle(hoverColor, 1);
      bg.fillRoundedRect(-80, -20, 160, 40, 8);
      bg.lineStyle(2, 0xffffff, 0.5);
      bg.strokeRoundedRect(-80, -20, 160, 40, 8);
    });

    button.on('pointerout', () => {
      this.tweens.add({
        targets: button,
        scale: 1,
        duration: 150,
        ease: 'Power2',
      });
      bg.clear();
      bg.fillStyle(buttonColor, 1);
      bg.fillRoundedRect(-80, -20, 160, 40, 8);
      bg.lineStyle(2, 0xffffff, 0.5);
      bg.strokeRoundedRect(-80, -20, 160, 40, 8);
    });

    button.on('pointerdown', () => {
      this.tweens.add({
        targets: button,
        scale: 0.95,
        duration: 100,
        yoyo: true,
        ease: 'Power2',
        onComplete: onClick,
      });
    });

    return button;
  }

  private createConfetti(): void {
    const { width, height } = this.cameras.main;
    const colors = [0xff6b6b, 0x4ecdc4, 0xf1c40f, 0x95e1d3, 0xf38181];

    // Create falling confetti
    for (let i = 0; i < 50; i++) {
      const x = Phaser.Math.Between(0, width);
      const color = Phaser.Utils.Array.GetRandom(colors);

      const confetti = this.add.rectangle(
        x,
        -20,
        Phaser.Math.Between(8, 15),
        Phaser.Math.Between(8, 15),
        color
      );

      confetti.setRotation(Phaser.Math.FloatBetween(0, Math.PI * 2));

      this.tweens.add({
        targets: confetti,
        y: height + 20,
        angle: 720,
        duration: Phaser.Math.Between(2000, 4000),
        delay: Phaser.Math.Between(0, 2000),
        repeat: -1,
        ease: 'Linear',
        onRepeat: () => {
          confetti.x = Phaser.Math.Between(0, width);
          confetti.y = -20;
        },
      });

      // Add slight horizontal movement
      this.tweens.add({
        targets: confetti,
        x: `+=${Phaser.Math.Between(-50, 50)}`,
        duration: Phaser.Math.Between(1000, 2000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }
}
