import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background gradient effect using rectangles
    const gradient = this.add.graphics();
    gradient.fillGradientStyle(0x3498db, 0x3498db, 0x2980b9, 0x2980b9, 1);
    gradient.fillRect(0, 0, width, height);

    // Animated background particles
    this.createBackgroundParticles();

    // Game title with shadow
    const titleShadow = this.add.text(width / 2 + 3, height / 2 - 97, 'ECHO PAIRS', {
      fontSize: '64px',
      fontFamily: 'Arial, sans-serif',
      color: '#000000',
      fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0.3);

    const title = this.add.text(width / 2, height / 2 - 100, 'ECHO PAIRS', {
      fontSize: '64px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Subtitle
    const subtitle = this.add.text(width / 2, height / 2 - 40, 'Memory Matching Puzzle', {
      fontSize: '24px',
      fontFamily: 'Arial, sans-serif',
      color: '#ecf0f1',
    }).setOrigin(0.5);

    // Pulsing title animation
    this.tweens.add({
      targets: title,
      scale: 1.05,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Play button
    const playButton = this.createButton(width / 2, height / 2 + 50, 'PLAY', () => {
      this.scene.start('GameScene');
    });

    // Instructions
    const instructions = this.add.text(
      width / 2,
      height / 2 + 140,
      'Find all matching pairs!\nClick cards to flip them over.',
      {
        fontSize: '18px',
        fontFamily: 'Arial, sans-serif',
        color: '#ecf0f1',
        align: 'center',
      }
    ).setOrigin(0.5);

    // Credits
    const credits = this.add.text(
      width / 2,
      height - 30,
      'Built with Phaser & TypeScript',
      {
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        color: '#bdc3c7',
      }
    ).setOrigin(0.5);
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
    bg.fillStyle(0x2ecc71, 1);
    bg.fillRoundedRect(-100, -25, 200, 50, 10);
    bg.lineStyle(3, 0x27ae60, 1);
    bg.strokeRoundedRect(-100, -25, 200, 50, 10);

    // Button shadow
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.3);
    shadow.fillRoundedRect(-97, -22, 200, 50, 10);

    // Button text
    const buttonText = this.add.text(0, 0, text, {
      fontSize: '32px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    button.add([shadow, bg, buttonText]);
    button.setSize(200, 50);
    button.setInteractive(
      new Phaser.Geom.Rectangle(-100, -25, 200, 50),
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
      bg.fillStyle(0x27ae60, 1);
      bg.fillRoundedRect(-100, -25, 200, 50, 10);
      bg.lineStyle(3, 0x229954, 1);
      bg.strokeRoundedRect(-100, -25, 200, 50, 10);
    });

    button.on('pointerout', () => {
      this.tweens.add({
        targets: button,
        scale: 1,
        duration: 150,
        ease: 'Power2',
      });
      bg.clear();
      bg.fillStyle(0x2ecc71, 1);
      bg.fillRoundedRect(-100, -25, 200, 50, 10);
      bg.lineStyle(3, 0x27ae60, 1);
      bg.strokeRoundedRect(-100, -25, 200, 50, 10);
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

  private createBackgroundParticles(): void {
    const { width, height } = this.cameras.main;

    // Create floating particles
    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);

      const particle = this.add.circle(x, y, Phaser.Math.Between(2, 5), 0xffffff, 0.3);

      this.tweens.add({
        targets: particle,
        y: y - Phaser.Math.Between(100, 300),
        alpha: 0,
        duration: Phaser.Math.Between(3000, 6000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 3000),
        onRepeat: () => {
          particle.y = height + 10;
          particle.x = Phaser.Math.Between(0, width);
          particle.alpha = 0.3;
        },
      });
    }
  }
}
