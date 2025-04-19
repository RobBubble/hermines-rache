const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
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
let wasd;
let score = 0;
let lives = 7;
let scoreText;
let platforms;

const game = new Phaser.Game(config);

function preload() {
  this.load.image('ui', 'ui-icons.png');
}

function create() {
  platforms = this.physics.add.staticGroup();

  // Sichtbare Plattform
  const testPlatform = this.add.rectangle(300, 400, 300, 40, 0xff99ff);
  this.physics.add.existing(testPlatform, true);
  platforms.add(testPlatform);

  // Spieler: grünes Rechteck
  player = this.add.rectangle(200, 300, 32, 32, 0x00ff00);
  this.physics.add.existing(player);
  player.body.setCollideWorldBounds(true);
  player.body.setBounce(0.1);

  this.physics.add.collider(player, platforms);

  // Steuerung
  cursors = this.input.keyboard.createCursorKeys();
  wasd = this.input.keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.W,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D
  });

  this.cameras.main.startFollow(player);

  // UI: Icons nur einmal anzeigen durch Flag
  if (!this.uiDrawn) {
    for (let i = 0; i < lives; i++) {
      this.add.image(30 + i * 34, 30, 'ui').setScrollFactor(0).setScale(0.2);
    }
    this.uiDrawn = true;
  }

  scoreText = this.add.text(780, 25, 'PUNKTE: 0', {
    fontSize: '20px',
    fill: '#fff'
  }).setScrollFactor(0);
}

function update() {
  const moveLeft = cursors.left.isDown || wasd.left.isDown;
  const moveRight = cursors.right.isDown || wasd.right.isDown;
  const jump = cursors.up.isDown || wasd.up.isDown;

  if (moveLeft) {
    player.body.setVelocityX(-160);
  } else if (moveRight) {
    player.body.setVelocityX(160);
  } else {
    player.body.setVelocityX(0);
  }

  if (jump && player.body.touching.down) {
    player.body.setVelocityY(-450);
  }
}
