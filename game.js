const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 600;


let player = { x: 180, y: 550, width: 40, height: 20 };
let bullets = [];
let enemies = [];
let enemyBullets = [];
let lives = 3;
let score = 0;
let level = 1;
let coins = 0;
let gameRunning = false;
let lastShot = 0;


function drawPlayer() {
  ctx.fillStyle = '#00f7ff';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}


function drawBullet(bullet) {
  ctx.fillStyle = '#ff0';
  ctx.fillRect(bullet.x, bullet.y, 5, 10);
}


function drawEnemy(enemy) {
  ctx.fillStyle = '#f00';
  ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
}


function spawnEnemies() {
  enemies = [];
  let cols = 6;
  let rows = 3 + level;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      enemies.push({ x: 60 * c + 20, y: 40 * r + 20, width: 30, height: 20, dx: 1 });
    }
  }
}


function updateBullets() {
  bullets = bullets.filter(b => b.y > 0);
  bullets.forEach(b => b.y -= 6);
}


function updateEnemies() {
  let changeDir = false;
  enemies.forEach(enemy => {
    enemy.x += enemy.dx;
    if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) changeDir = true;
  });


  if (changeDir) {
    enemies.forEach(enemy => {
      enemy.y += 20;
      enemy.dx *= -1;
    });
  }
}


function detectCollisions() {
  bullets.forEach((b, bi) => {
    enemies.forEach((e, ei) => {
      if (b.x < e.x + e.width && b.x + 5 > e.x && b.y < e.y + e.height && b.y + 10 > e.y) {
        bullets.splice(bi, 1);
        enemies.splice(ei, 1);
        coins += 5;
        document.getElementById('coinCount').textContent = coins;
      }
    });
  });


  enemies.forEach(e => {
    if (e.y + e.height >= canvas.height) {
      lives = 0;
    }
  });
}


function drawHUD() {
  ctx.fillStyle = '#fff';
  ctx.font = '16px Orbitron';
  ctx.fillText(`Lives: ${lives}`, 10, 20);
  ctx.fillText(`Level: ${level}`, 10, 40);
  ctx.fillText(`Score: ${score}`, 10, 60);
}


function gameLoop() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);


  drawPlayer();
  bullets.forEach(drawBullet);
  enemies.forEach(drawEnemy);
  drawHUD();


  updateBullets();
  updateEnemies();
  detectCollisions();


  if (lives <= 0) {
    alert('Game Over!');
    location.reload();
    return;
  }


  if (enemies.length === 0) {
    level++;
    spawnEnemies();
  }


  requestAnimationFrame(gameLoop);
}


function startGame() {
  document.getElementById('main-menu').style.display = 'none';
  canvas.style.display = 'block';
  gameRunning = true;
  spawnEnemies();
  gameLoop();
}


function openShop() {
  document.getElementById('shop').classList.remove('hidden');
}


function closeShop() {
  document.getElementById('shop').classList.add('hidden');
}


// Mobile Controls
document.getElementById('leftBtn').addEventListener('touchstart', () => player.x -= 20);
document.getElementById('rightBtn').addEventListener('touchstart', () => player.x += 20);
document.getElementById('shootBtn').addEventListener('touchstart', () => {
  let now = Date.now();
  if (now - lastShot > 500) {
    bullets.push({ x: player.x + 17, y: player.y });
    lastShot = now;
  }
});