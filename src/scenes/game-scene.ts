import "phaser";

const MARBLES = [
  {
    name: 'Rusia',
    url: 'assets/images/marble1.png'
  },
  {
    name: 'Ecuador',
    url: 'assets/images/marble2.png'
  },
  {
    name: 'Perú',
    url: 'assets/images/marble3.png'
  },
  {
    name: 'Player',
    url: 'assets/images/marble1.png'
  },
  {
    name: 'Player 2',
    url: 'assets/images/marble2.png'
  },
  {
    name: 'Player 3',
    url: 'assets/images/marble3.png'
  },
  {
    name: 'Player',
    url: 'assets/images/marble1.png'
  },
  {
    name: 'Player 2',
    url: 'assets/images/marble2.png'
  },
  {
    name: 'Player 3',
    url: 'assets/images/marble3.png'
  }
];

interface Marble {
  body: MatterJS.BodyType; // Changed type definition
  sprite: Phaser.GameObjects.Sprite;
}

interface Obstacle {
  body: MatterJS.BodyType; // Changed type definition
  visual: Phaser.GameObjects.Rectangle;
}

export class GameScene extends Phaser.Scene {
  private marbles: Marble[];
  private obstacles: Obstacle[];
  private leadingMarble: Marble | null;
  private obstacleColor: number;
  private countdownText: Phaser.GameObjects.Text | null;
  private baseTextStyle: any;

  constructor() {
    super({ key: "GameScene" });
    this.marbles = [];
    this.obstacles = [];
    this.leadingMarble = null;
    this.obstacleColor = 0x800080;
    this.countdownText = null;
    this.baseTextStyle = {
      fontFamily: 'FONT_PRESS_START_2P',
      fontSize: '32px',
      color: '#000000',
    };
  }

  preload(): void {
    // Preloading moved to PreloadScene
  }

  create(): void {
    // Create checkered background
    const tileSize = 50;
    for (let y = 0; y < 3000; y += tileSize) {
      for (let x = 0; x < 800; x += tileSize) {
        const isAlternate =
          (Math.floor(x / tileSize) + Math.floor(y / tileSize)) % 2 === 0;
        const color = isAlternate ? 0xb3d9ff : 0xe6f3ff;
        const tile = this.add.rectangle(
          x + tileSize / 2,
          y + tileSize / 2,
          tileSize,
          tileSize,
          color
        );
        tile.setDepth(-1);
      }
    }

    // Configure physics and walls
    const wallThickness = 60;
    const semiCircleRadius = 60;
    const semiCircleSpacing = semiCircleRadius * 4; // Space between circles equals diameter (2 * radius * 2)
    
    // Create base walls
    this.matter.add.rectangle(-wallThickness/2, 1500, wallThickness, 3000, { isStatic: true });
    this.matter.add.rectangle(800 + wallThickness/2, 1500, wallThickness, 3000, { isStatic: true });

    // Create semicircles on walls
    for (let y = 100; y < 3000; y += semiCircleSpacing) {
      // Left wall semicircles
      const leftCircle = this.matter.add.circle(0, y, semiCircleRadius, {
        isStatic: true,
        friction: 0.2,
        restitution: 0.5
      });

      // Right wall semicircles
      const rightCircle = this.matter.add.circle(800, y, semiCircleRadius, {
        isStatic: true,
        friction: 0.2,
        restitution: 0.5
      });

      // Visual representation using arcs
      const leftGraphics = this.add.graphics();
      leftGraphics.lineStyle(2, this.obstacleColor);
      leftGraphics.fillStyle(this.obstacleColor);
      leftGraphics.beginPath();
      leftGraphics.arc(0, y, semiCircleRadius, -Math.PI/2, Math.PI/2, false);
      leftGraphics.fillPath();
      leftGraphics.strokePath();

      const rightGraphics = this.add.graphics();
      rightGraphics.lineStyle(2, this.obstacleColor);
      rightGraphics.fillStyle(this.obstacleColor);
      rightGraphics.beginPath();
      rightGraphics.arc(800, y, semiCircleRadius, Math.PI/2, -Math.PI/2, false);
      rightGraphics.fillPath();
      rightGraphics.strokePath();
    }

    // Configure world bounds (only top and bottom)
    this.matter.world.setBounds(0, 0, 800, 3000, 20, true, true, true, true);
    this.matter.world.setGravity(0, 0);

    // Create marbles
    const startX = 400; // Center position
    const spacing = 50; // Space between marbles
    const offset = (MARBLES.length - 1) * spacing / 2; // Calculate total offset

    for (let i = 0; i < MARBLES.length; i++) {
      const marble = this.matter.add.circle(startX - offset + (i * spacing), 100, 20, {
        restitution: 0.8,
        friction: 0.005,
        density: 0.001,
      });

      const sprite = this.add.sprite(
        marble.position.x,
        marble.position.y,
        `marble-${i}`
      );
      sprite.setDisplaySize(40, 40);

      this.marbles.push({ body: marble, sprite: sprite });
    }

    // Create random obstacles
    for (let y = 300; y < 2700; y += 200) {
      const angle =
        (Phaser.Math.Between(5, 45) *
          (Math.random() < 0.5 ? -1 : 1) *
          Math.PI) /
        180;
      const width = Phaser.Math.Between(100, 300);
      const x = Phaser.Math.Between(100, 700);

      // Create physics body with rounded corners
      const obstacle = this.matter.add.rectangle(x, y, width, 20, {
        isStatic: true,
        angle: angle,
        chamfer: { radius: 10 },
      });

      // Create visual rectangle
      const visualObstacle = this.add.rectangle(
        x,
        y,
        width,
        20,
        this.obstacleColor
      );
      visualObstacle.setAngle((angle * 180) / Math.PI);
      visualObstacle.setStrokeStyle(2, this.obstacleColor, 1);

      this.obstacles.push({
        body: obstacle,
        visual: visualObstacle,
      });
    }

    // Configure camera
    this.cameras.main.setBounds(0, 0, 800, 3000);

    // Add finish line
    const finishLine = this.add.rectangle(400, 2900, 800, 40, 0xffffff);
    const finishText = this.add.text(400, 2900, "META", this.baseTextStyle);
    finishText.setOrigin(0.5);

    // Update countdown text with custom font
    this.countdownText = this.add.text(400, 200, '3', {
      ...this.baseTextStyle,
      fontSize: '64px',
      padding: { x: 20, y: 10 }
    });
    this.countdownText.setOrigin(0.5);
    this.countdownText.setScrollFactor(0);
    this.countdownText.setDepth(1);

    // Start countdown
    let countdown = 3;
    const timer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        countdown--;
        if (countdown > 0) {
          if (this.countdownText) {
            this.countdownText.setText(countdown.toString());
          }
        } else {
          if (this.countdownText) {
            this.countdownText.setText('¡YA!');
            this.time.delayedCall(500, () => {
              if (this.countdownText) {
                this.countdownText.destroy();
              }
              // Enable gravity to start the race
              this.matter.world.setGravity(0, 0.5);
            });
          }
        }
      },
      repeat: 2
    });
  }

  private getBodyPosition(body: MatterJS.BodyType): { x: number; y: number } {
      return (body as any).position;
  }

  update(): void {
      this.marbles.forEach(marble => {
          const pos = this.getBodyPosition(marble.body);
          marble.sprite.x = pos.x;
          marble.sprite.y = pos.y;
          marble.sprite.rotation = (marble.body as any).angle;
      });
  
      // Update leadingMarble check
      this.leadingMarble = this.marbles.reduce((leading: Marble | null, marble: Marble) => {
          if (!leading) return marble;
          return this.getBodyPosition(marble.body).y > this.getBodyPosition(leading.body).y ? marble : leading;
      }, null as Marble | null);
  
      // Update camera follow
      if (this.leadingMarble) {
          this.cameras.main.scrollY = this.getBodyPosition(this.leadingMarble.body).y - 300;
      }
  
      // Update winner check
      this.marbles.forEach((marble, index) => {
          if (this.getBodyPosition(marble.body).y >= 2900) {
              this.scene.pause();
              const victoryText = this.add.text(400, 300, `¡${MARBLES[index].name} ha ganado!`, {
                  ...this.baseTextStyle,
                  fontSize: '48px',
                  color: '#fff',
                  backgroundColor: '#000',
                  padding: { x: 20, y: 10 }
              });
              victoryText.setScrollFactor(0);
              victoryText.setOrigin(0.5);
          }
      });
  }
}
