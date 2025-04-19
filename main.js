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
let uiIcons = [];
let scoreText;
let platforms;

const game = new Phaser.Game(config);

function preload() {
  this.load.image('ui', 'ui-icons.png');
  this.load.spritesheet('hermine', 'hermine-sprite.png', {
    frameWidth: 32,
    frameHeight: 32
  });
}

function create() {
  // Plattform-Gruppe vorbereiten
  platforms = this.physics.add.staticGroup();

  // Sichtbare Plattform mit Farbe zum Testen
  const testPlatform = this.add.rectangle(300, 400, 300, 40, 0xff99ff);
  this.physics.add.existing(testPlatform, true);
  platforms.add(testPlatform);

  // Spieler sichtbar platzieren
  player = this.physics.add.sprite(200, 300, 'hermine', 1); // Frame 1 als Standard
  player.setCollideWorldBounds(true);
  player.setBounce(0.1);
  this.physics.add.collider(player, platforms);

  // Animationen
  this.anims.create({
    key: 'run',
    frames: this.anims.generateFrameNumbers('hermine', { start: 1, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  // Steuerung
  cursors = this.input.keyboard.createCursorKeys();
  wasd = this.input.keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.W,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D
  });

  this.cameras.main.startFollow(player);

  // UI: Nur erzeugen, wenn leer
  if (uiIcons.length === 0) {
    for (let i = 0; i < lives; i++) {
      const icon = this.add.image(30 + i * 34, 30, 'ui').setScrollFactor(0).setScale(0.2);
      uiIcons.push(icon);
    }
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
    player.setVelocityX(-160);
    player.anims.play('run', true);
    player.flipX = true;
  } else if (moveRight) {
    player.setVelocityX(160);
    player.anims.play('run', true);
    player.flipX = false;
  } else {
    player.setVelocityX(0);
    player.setFrame(1); // Zeige klaren Standframe
  }

  if (jump && player.body.touching.down) {
    player.setVelocityY(-450);
  }
}
