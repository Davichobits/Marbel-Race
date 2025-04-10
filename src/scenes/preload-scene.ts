import "phaser";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload(): void {
    // Create loading bar
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    // Loading text
    const loadingText = this.add.text(400, 260, 'Loading...', {
      fontSize: '20px',
      color: '#ffffff'
    });
    loadingText.setOrigin(0.5, 0.5);

    // Loading progress
    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    // Clear loading bar when complete
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    // Load marbles
    const marbles = [
      { name: 'Rusia', url: 'assets/images/marble1.png' },
      { name: 'Ecuador', url: 'assets/images/marble2.png' },
      { name: 'Perú', url: 'assets/images/marble3.png' }
    ];

    marbles.forEach((marble, index) => {
      this.load.image(`marble-${index}`, marble.url);
    });

    // Load custom font
    this.load.font(
      'FONT_PRESS_START_2P',
      'assets/fonts/Press_Start_2P/PressStart2P-Regular.ttf'
    );
  }

  create(): void {
    this.scene.start('GameScene');
  }
}