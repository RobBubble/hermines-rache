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

const game = new Phaser.Game(config);

function preload() {
  this.load.image('tileset', 'tileset.png');
  this.load.image('background', 'tileset.png'); // Temporärer Hintergrund aus dem Tileset
  this.load.spritesheet('hermine', 'hermine-sprite.png', {
    frameWidth: 32,
    frameHeight: 32
  });
}

function create() {
  this.add.image(480, 270, 'background').setScrollFactor(0.5);

  const platforms = this.physics.add.staticGroup();
  platforms.create(400, 450, 'tileset').setScale(2).refreshBody();

  player = this.physics.add.sprite(100, 350, 'hermine');
  player.setCollideWorldBounds(true);
  player.setBounce(0.1);

  this.physics.add.collider(player, platforms);

  this.anims.create({
    key: 'run',
    frames: this.anims.generateFrameNumbers('hermine', { start: 1, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  cursors = this.input.keyboard.createCursorKeys();
  this.cameras.main.startFollow(player);
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play('run', true);
    player.flipX = true;
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play('run', true);
    player.flipX = false;
  } else {
    player.setVelocityX(0);
    player.setFrame(0);
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-450);
  }
}
