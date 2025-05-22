const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    backgroundColor: '#d0e7ff',
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

let player;
let cursors;
let obstacles;
let stars;
let score = 0;
let scoreText;

const game = new Phaser.Game(config);

function preload() {
    this.load.image('goks', 'assets/goks.png');
    this.load.image('obstacle', 'assets/obstacle.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('ground', 'assets/ground.png'); // Optional if you want a base
}

function create() {
    // Ground
    const ground = this.add.rectangle(400, 390, 800, 20, 0x444444);
    this.physics.add.existing(ground, true);

    // Player
    player = this.physics.add.sprite(100, 340, 'goks').setScale(0.5);
    player.setCollideWorldBounds(true);

    // Obstacles
    obstacles = this.physics.add.group();
    spawnObstacle(this);

    // Stars
    stars = this.physics.add.group();
    spawnStar(this);

    // Score text
    scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '20px',
        fill: '#000'
    });

    // Controls
    cursors = this.input.keyboard.createCursorKeys();

    // Collisions
    this.physics.add.collider(player, ground);
    this.physics.add.collider(player, obstacles, hitObstacle, null, this);
    this.physics.add.overlap(player, stars, collectStar, null, this);
}

function update() {
    // Jump
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-500);
    }

    // Move obstacles and stars
    Phaser.Actions.IncX(obstacles.getChildren(), -4);
    Phaser.Actions.IncX(stars.getChildren(), -3);

    // Recycle obstacles and stars
    obstacles.getChildren().forEach(obstacle => {
        if (obstacle.x < -50) {
            obstacle.x = Phaser.Math.Between(800, 1000);
        }
    });

    stars.getChildren().forEach(star => {
        if (star.x < -50) {
            star.x = Phaser.Math.Between(800, 1200);
        }
    });
}

function spawnObstacle(scene) {
    for (let i = 0; i < 3; i++) {
        const x = 800 + i * 300;
        const obstacle = scene.physics.add.sprite(x, 360, 'obstacle').setScale(0.5).setImmovable();
        obstacles.add(obstacle);
    }
}

function spawnStar(scene) {
    for (let i = 0; i < 2; i++) {
        const x = 1000 + i * 400;
        const star = scene.physics.add.sprite(x, Phaser.Math.Between(200, 300), 'star').setScale(0.5);
        stars.add(star);
    }
}

function hitObstacle(player, obstacle) {
    this.scene.restart();
    score = 0;
}

function collectStar(player, star) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
}
