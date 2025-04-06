class MarbleRace extends Phaser.Scene {
    constructor() {
        super({ key: 'MarbleRace' });
        this.marbles = [];
        this.obstacles = [];
        this.leadingMarble = null;
        this.obstacleColor = 0x800080; // Purple color in hex
    }

    preload() {
        // Load marble images
        this.load.image('marble-red', 'assets/marble1.png');
        this.load.image('marble-green', 'assets/marble2.png');
        this.load.image('marble-blue', 'assets/marble3.png');
    }

    create() {
        // Create checkered background
        const tileSize = 100;
        for (let y = 0; y < 3000; y += tileSize) {
            for (let x = 0; x < 800; x += tileSize) {
                const isAlternate = (Math.floor(x / tileSize) + Math.floor(y / tileSize)) % 2 === 0;
                const color = isAlternate ? 0xb3d9ff : 0xe6f3ff; // Alternating pastel blue colors
                const tile = this.add.rectangle(x + tileSize/2, y + tileSize/2, tileSize, tileSize, color);
                tile.setDepth(-1); // Ensure background is behind everything
            }
        }

        // Configurar física y paredes
        this.matter.world.setBounds(0, 0, 800, 3000);
        this.matter.world.setGravity(0, 0.5);

        // Crear canicas
        const marbleTextures = ['marble-red', 'marble-green', 'marble-blue'];
        for (let i = 0; i < 3; i++) {
            // Create a circle body with doubled radius (20 instead of 10)
            const marble = this.matter.add.circle(300 + (i * 50), 100, 20, {
                restitution: 0.8,
                friction: 0.005,
                density: 0.001
            });

            // Add sprite with doubled size (40x40 instead of 20x20)
            const sprite = this.add.sprite(marble.position.x, marble.position.y, marbleTextures[i]);
            sprite.setDisplaySize(40, 40);
            
            // Store both the body and sprite
            this.marbles.push({ body: marble, sprite: sprite });
        }

        // Crear obstáculos aleatorios
        for (let y = 300; y < 2700; y += 200) {
            const angle = Phaser.Math.Between(5, 45) * (Math.random() < 0.5 ? -1 : 1) * Math.PI / 180;
            const width = Phaser.Math.Between(100, 300);
            const x = Phaser.Math.Between(100, 700);
            
            // Create physics body
            const obstacle = this.matter.add.rectangle(
                x, y, width, 20,
                { 
                    isStatic: true, 
                    angle: angle
                }
            );

            // Add visual rectangle
            const visualObstacle = this.add.rectangle(x, y, width, 20, this.obstacleColor);
            visualObstacle.setAngle(angle * 180 / Math.PI); // Convert angle to degrees for visual object
            
            // Store both physics and visual objects
            this.obstacles.push({ body: obstacle, visual: visualObstacle });
        }

        // Configurar cámara
        this.cameras.main.setBounds(0, 0, 800, 3000);

        // Agregar línea de meta
        const finishLine = this.add.rectangle(400, 2900, 800, 40, 0xffffff);
        const finishText = this.add.text(400, 2900, 'META', { 
            fontSize: '32px', 
            fill: '#000',
            backgroundColor: '#ffffff'
        });
        finishText.setOrigin(0.5);
    }

    update() {
        // Update marble sprites positions
        this.marbles.forEach(marble => {
            marble.sprite.x = marble.body.position.x;
            marble.sprite.y = marble.body.position.y;
            marble.sprite.rotation = marble.body.angle;
        });

        // Find leading marble (update to use body property)
        this.leadingMarble = this.marbles.reduce((leading, marble) => {
            return (!leading || marble.body.position.y > leading.body.position.y) ? marble : leading;
        }, null);

        // Follow leading marble with camera
        if (this.leadingMarble) {
            this.cameras.main.scrollY = this.leadingMarble.body.position.y - 300;
        }

        // Check for winner (update to show victory message)
        this.marbles.forEach((marble, index) => {
            if (marble.body.position.y >= 2900) {
                this.scene.pause();
                const color = index === 0 ? 'Roja' : index === 1 ? 'Verde' : 'Azul';
                const victoryText = this.add.text(400, 300, `¡La canica ${color} ha ganado!`, {
                    fontSize: '48px',
                    fill: '#fff',
                    backgroundColor: '#000',
                    padding: { x: 20, y: 10 }
                });
                victoryText.setScrollFactor(0);
                victoryText.setOrigin(0.5);
            }
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'matter',
        matter: {
            // debug: true,
            gravity: { y: 0.5 }
        }
    },
    scene: MarbleRace
};

const game = new Phaser.Game(config);