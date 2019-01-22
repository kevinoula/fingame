const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update
})

let buff = false
let streak = 0
let score = 0
let scoreText
let platforms
let moneys
let cursors
let player
var que = [
  'T or F: Saving is the same as investing.',
  'T or F: Primary reasons for saving should be: emergency funds, purchases, and wealth building.',
  'T or F: Most adjustable rate loans have a rate cap.',
  'T or F: One sign of debt problems is using and paying off your credit cards every month.',
  'T or F: There is a prime connection between individual financial stability and the overall health of the economy.',
  'T or F: Economic instability expands from income and consumption volatility',
  'T or F: Financial inclusion is not an important element of inclusive economic growth.',
  'T or F: A tax audit is a detailed examination of your tax return by the IRS',
  'T or F: If you are self-employed, you must make estimated tax payments to the IRS throughout the year.',
  'T or F: A real estate investment trust is a direct investment',
  'T or F: Retained earnings are profits a company reinvests for expansion or research and development',
  'T or F: Expensive houses and cars are true indications of wealth',
  'T or F: The three credit bureaus are Experian, TransUnion, and EquiFax',
  'T of F: Inflation increases the buying power of money.',
  'T or F: A new car is an example of a need.',
  'T of F: Saving a small amount of money each month will not help you in retirement planning.'
]

var ans = [
  'F',
  'T',
  'T',
  'F',
  'T',
  'T',
  'F',
  'T',
  'T',
  'F',
  'T',
  'F',
  'T',
  'F',
  'F',
  'F'
]
var done = []

function preload () {
  game.load.image('sky', 'land.png')
  game.load.image('ground', 'platform.png')
  game.load.image('money', 'money.png')
  game.load.image('gplat', 'ground.png')
  game.load.spritesheet('buffhuman', 'human2.png', 32, 43)
  game.load.spritesheet('human', 'human.png', 32, 32)
}

var button
var background

function create () {
  game.physics.startSystem(Phaser.Physics.ARCADE)

  game.add.sprite(0, 0, 'sky')

  platforms = game.add.group()
  platforms.enableBody = true

  let ground = platforms.create(0, game.world.height - 64, 'gplat')
  ground.scale.setTo(1, 1)
  ground.body.immovable = true

  //first ledge
  let ledge = platforms.create(400, 450, 'ground')
  ledge.body.immovable = true
  ledge.body.collideWorldBounds = true
  ledge.body.bounce.set(1);
  ledge.body.velocity.x = 100

  //second ledge
  ledge = platforms.create(-200, 150, 'ground')
  ledge.body.immovable = true
  ledge.body.collideWorldBounds = true
  ledge.body.bounce.set(1);
  ledge.body.velocity.x = 100

  //third ledge
  ledge = platforms.create(200, 300, 'ground')
  ledge.body.immovable = true
  ledge.body.collideWorldBounds = true
  ledge.body.bounce.set(1);
  ledge.body.velocity.x = 100

  player = game.add.sprite(32, game.world.height - 150, 'human')
  game.physics.arcade.enable(player)
  player.body.bounce.y = 0.2
  player.body.gravity.y = 800
  player.body.collideWorldBounds = true

  player.animations.add('left', [0, 1, 2, 3], 10, true)
  player.animations.add('right', [5, 6, 7, 8], 10, true)

  moneys = game.add.group()
  moneys.enableBody = true

  //add starting moneys
  for (var i = 0; i < 2; i++) {
    //let money = moneys.create(Math.random()*(600-40)+40, Math.floor(Math.random()*600)+1, 'money')
    //let money = moneys.create(Math.random()*(600), Math.random()*(600-game.world.height-103)+game.world.height-103, 'money')
    let money = moneys.create(Math.random()*(600), Math.random()*(600)-100, 'money')
    money.body.gravity.y = 1000
    money.body.bounce.y = 0.3 + Math.random() * 0.2
    money.body.collideWorldBounds = true
  }

  scoreText = game.add.text(16, 16, '', { fontSize: '32px', fill: '#000' })
  cursors = game.input.keyboard.createCursorKeys()
}

function update () {
  //this.sky.tilePosition.y = -(this.camera.y * 0.7);
  player.body.velocity.x = 0
  game.physics.arcade.collide(player, platforms)
  game.physics.arcade.collide(moneys, platforms)
  game.physics.arcade.overlap(player, moneys, collectMoney, null, this)

  if (buff) {
    player.loadTexture('buffhuman')
    player.animations.add('left', [0, 1, 2, 3], 10, true)
    player.animations.add('right', [5, 6, 7, 8], 10, true)
    if (cursors.left.isDown) {
      player.body.velocity.x = -250
      player.animations.play('left')
    } else if (cursors.right.isDown) {
      player.body.velocity.x = 250
      player.animations.play('right')
    } else {
      player.animations.stop()
    }
    if (cursors.up.isDown && player.body.touching.down) {
      player.body.velocity.y = -600
    }
  }
  else {
    player.loadTexture('human')
    player.animations.add('left', [0, 1, 2, 3], 10, true)
    player.animations.add('right', [5, 6, 7, 8], 10, true)
    if (cursors.left.isDown) {
      player.body.velocity.x = -150
      player.animations.play('left')
    } else if (cursors.right.isDown) {
      player.body.velocity.x = 150
      player.animations.play('right')
    } else {
      player.animations.stop()
    }
    if (cursors.up.isDown && player.body.touching.down) {
      player.body.velocity.y = -500
    }
  }
  if (done.length==que.length) {
    confirm("Game Over! Final score: " + score)
    score = 0
    streak = 0
    done = []
    buff = false
    create()
  }

}

function collectMoney (player, money) {
  var i = Math.floor(Math.random()*que.length)
  var n = done.includes(que[i])
  while (n==true) {
    i = Math.floor(Math.random()*que.length)
    n = done.includes(que[i])
  }
  done.push(que[i]);
  var answer = prompt(que[i], "")
  if (answer == ans[i]) {
    correct()
  } else {
    incorrect()
  }
  money.kill()
}

function correct() {
  streak++
  score+=100
  if (streak==3) {
    buff = true
  }
  if (streak>=3) {
    confirm("Correct! You're on fire!")
  }
  if (streak>=3 && streak <6) {
    score+=100
  }
  if (streak>=6 && streak <12) {
    score+=200
  }
  if (streak>=12) {
    score+=300
  }

  scoreText.text = 'Score: ' + score + ' Streak: ' + streak
  //createLedge()
  spawnMoneys()
}

function incorrect(){
  buff = false
  streak = 0
  score-=100
  alert("Incorrect! Streak reset to 0!")
  scoreText.text = 'Score: ' + score + ' Streak: ' + streak
  if (score<0) {
    alert("You lose!")
    score = 0
    done = [];
    create()
  }
  else{
    spawnMoneys()
  }
}

function spawnMoneys() {
    let m = moneys.create(Math.random()*(600), Math.random()*(600)-100, 'money')
    m.body.gravity.y = 1000
    m.body.bounce.y = 0.3 + Math.random() * 0.2
    m.body.collideWorldBounds = true
}
