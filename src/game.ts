import 'phaser';

interface Marble {
    body: MatterJS.BodyType;  // Changed type definition
    sprite: Phaser.GameObjects.Sprite;
}

interface Obstacle {
    body: MatterJS.BodyType;  // Changed type definition
    visual: Phaser.GameObjects.Rectangle;
}

class MarbleRace extends Phaser.Scene {
    private marbles: Marble[];
    private obstacles: Obstacle[];
    private leadingMarble: Marble | null;
    private obstacleColor: number;

    constructor() {
        super({ key: 'MarbleRace' });
        this.marbles = [];
        this.obstacles = [];
        this.leadingMarble = null;
        this.obstacleColor = 0x800080;
    }

    preload(): void {
        this.load.image('marble-red', 'assets/marble1.png');
        this.load.image('marble-green', 'assets/marble2.png');
        this.load.image('marble-blue', 'assets/marble3.png');
    }

    create(): void {
        // Create checkered background
        const tileSize = 100;
        for (let y = 0; y < 3000; y += tileSize) {
            for (let x = 0; x < 800; x += tileSize) {
                const isAlternate = (Math.floor(x / tileSize) + Math.floor(y / tileSize)) % 2 === 0;
                const color = isAlternate ? 0xb3d9ff : 0xe6f3ff;
                const tile = this.add.rectangle(x + tileSize/2, y + tileSize/2, tileSize, tileSize, color);
                tile.setDepth(-1);
            }
        }

        // Configure physics and walls
        this.matter.world.setBounds(0, 0, 800, 3000);
        this.matter.world.setGravity(0, 0.5);

        // Create marbles
        const marbleTextures = ['marble-red', 'marble-green', 'marble-blue'];
        for (let i = 0; i < 3; i++) {
            const marble = this.matter.add.circle(300 + (i * 50), 100, 20, {
                restitution: 0.8,
                friction: 0.005,
                density: 0.001
            });

            const sprite = this.add.sprite(marble.position.x, marble.position.y, marbleTextures[i]);
            sprite.setDisplaySize(40, 40);
            
            this.marbles.push({ body: marble, sprite: sprite });
        }

        // Create random obstacles
        for (let y = 300; y < 2700; y += 200) {
            const angle = Phaser.Math.Between(5, 45) * (Math.random() < 0.5 ? -1 : 1) * Math.PI / 180;
            const width = Phaser.Math.Between(100, 300);
            const x = Phaser.Math.Between(100, 700);
            
            const obstacle = this.matter.add.rectangle(
                x, y, width, 20,
                { 
                    isStatic: true, 
                    angle: angle
                }
            );

            const visualObstacle = this.add.rectangle(x, y, width, 20, this.obstacleColor);
            visualObstacle.setAngle(angle * 180 / Math.PI);
            
            this.obstacles.push({ body: obstacle, visual: visualObstacle });
        }

        // Configure camera
        this.cameras.main.setBounds(0, 0, 800, 3000);

        // Add finish line
        const finishLine = this.add.rectangle(400, 2900, 800, 40, 0xffffff);
        const finishText = this.add.text(400, 2900, 'META', { 
            fontSize: '32px', 
            color: '#000000',
            backgroundColor: '#ffffff'
        });
        finishText.setOrigin(0.5);
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
                const color = index === 0 ? 'Roja' : index === 1 ? 'Verde' : 'Azul';
                const victoryText = this.add.text(400, 300, `¡La canica ${color} ha ganado!`, {
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

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'matter',
        matter: {
            gravity: {x:0,  y: 0.5 }
        }
    },
    scene: MarbleRace
};

const game = new Phaser.Game(config);