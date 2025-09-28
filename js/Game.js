window.Game = class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 600;
        this.canvas.height = 800;
        
        this.score = 0;
        this.stage = 1;
        this.player = null;
        this.enemies = [];
        this.bullets = [];
        this.items = [];
        this.effects = [];
        this.boss = null;
        this.stageTime = 0;
        this.isGameRunning = false;
        this.isPowerupScreenActive = false;
        
        this.setupMenuListeners();
    }

    setupMenuListeners() {
        document.querySelectorAll('.menu-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                this.handleMenuAction(action);
            });
        });
    }

    handleMenuAction(action) {
        const menuScreen = document.getElementById('menuScreen');
        const howtoScreen = document.getElementById('howtoScreen');
        const creditsScreen = document.getElementById('creditsScreen');
        const gameOverScreen = document.getElementById('gameOverScreen');
        const powerupScreen = document.getElementById('powerupScreen');
        const gameInfo = document.getElementById('gameInfo');

        [menuScreen, howtoScreen, creditsScreen, gameOverScreen, powerupScreen].forEach(screen => {
            screen.classList.remove('active');
        });

        switch(action) {
            case 'start':
            case 'restart':
                gameInfo.style.display = 'block';
                this.startGame();
                break;
            case 'howto':
                howtoScreen.classList.add('active');
                break;
            case 'credits':
                creditsScreen.classList.add('active');
                break;
            case 'back':
                menuScreen.classList.add('active');
                break;
            case 'quit':
                gameInfo.style.display = 'none';
                menuScreen.classList.add('active');
                break;
        }
    }

    startGame() {
        this.isGameRunning = true;
        this.isPowerupScreenActive = false;
        this.score = 0;
        this.stage = 1;
        this.player = new Player(this);
        this.enemies = [];
        this.bullets = [];
        this.items = [];
        this.effects = [];
        this.boss = null;
        this.stageTime = 0;
        
        this.gameLoop();
    }

    gameLoop() {
        if (!this.isGameRunning && !this.isPowerupScreenActive) return;
        
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        if (!this.isGameRunning && !this.isPowerupScreenActive) {
            this.updateEntities(this.effects);
            return;
        }

        if (this.player && this.player.stats.health <= 0) {
            this.gameOver();
            return;
        }

        this.stageTime++;
        if (this.stageTime % 3600 === 0 && !this.boss) {
            this.spawnBoss();
        }
        if (this.stageTime % 60 === 0) {
            this.spawnEnemy();
        }

        this.player?.update();
        this.updateEntities(this.enemies);
        this.updateEntities(this.bullets);
        this.updateEntities(this.items);
        this.updateEntities(this.effects);
        if (this.boss) this.boss.update();
        
        this.checkCollisions();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.player?.draw();
        this.enemies.forEach(enemy => enemy.draw());
        this.bullets.forEach(bullet => bullet.draw());
        this.items.forEach(item => item.draw());
        this.effects.forEach(effect => effect.draw());
        if (this.boss) this.boss.draw();
        
        this.updateUI();
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('health').textContent = this.player?.stats.health ?? 0;
        document.getElementById('stage').textContent = this.stage;
        document.getElementById('bombs').textContent = this.player?.stats.bombs ?? 0;
        document.getElementById('power').textContent = this.player?.stats.powerLevel ?? 1;
    }

    gameOver() {
        this.isGameRunning = false;
        this.isPowerupScreenActive = false;
        
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalStage').textContent = this.stage;
        
        document.getElementById('gameInfo').style.display = 'none';
        document.getElementById('gameOverScreen').classList.add('active');

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                if (this.player) {
                    this.effects.push(new DeathEffect(
                        this.player.x + this.player.width/2 + (Math.random() * 40 - 20),
                        this.player.y + this.player.height/2 + (Math.random() * 40 - 20),
                        this,
                        false
                    ));
                }
            }, i * 100);
        }
    }

    showPowerupScreen() {
        this.isPowerupScreenActive = true;
        this.isGameRunning = false;
        document.getElementById('powerupScreen').classList.add('active');

        const handlePowerupSelect = (e) => {
            const option = e.target.closest('.powerup-option');
            if (!option) return;

            const powerupType = option.getAttribute('data-powerup');
            this.player.addPowerup(powerupType);
            
            document.getElementById('powerupScreen').classList.remove('active');
            this.isPowerupScreenActive = false;
            this.isGameRunning = true;
            
            document.querySelectorAll('.powerup-option').forEach(opt => {
                opt.removeEventListener('click', handlePowerupSelect);
            });
            window.removeEventListener('keydown', handleKeySelect);

            this.stageTime = 0;
        };

        const handleKeySelect = (e) => {
            if (e.key >= '1' && e.key <= '3') {
                const powerups = ['satellite', 'spread', 'barrier'];
                const index = parseInt(e.key) - 1;
                this.player.addPowerup(powerups[index]);
                
                document.getElementById('powerupScreen').classList.remove('active');
                this.isPowerupScreenActive = false;
                this.isGameRunning = true;
                
                document.querySelectorAll('.powerup-option').forEach(opt => {
                    opt.removeEventListener('click', handlePowerupSelect);
                });
                window.removeEventListener('keydown', handleKeySelect);

                this.stageTime = 0;
            }
        };

        document.querySelectorAll('.powerup-option').forEach(option => {
            option.addEventListener('click', handlePowerupSelect);
        });
        window.addEventListener('keydown', handleKeySelect);
    }

    checkCollisions() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            if (!bullet.isPlayerBullet) continue;
            
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                if (this.isColliding(bullet, enemy)) {
                    enemy.health -= bullet.damage;
                    this.bullets.splice(i, 1);
                    
                    if (enemy.health <= 0) {
                        this.effects.push(new DeathEffect(
                            enemy.x + enemy.width/2,
                            enemy.y + enemy.height/2,
                            this,
                            false
                        ));
                        
                        this.enemies.splice(j, 1);
                        this.score += enemy.points;
                        
                        if (Math.random() < 0.3) {
                            const itemType = Math.random() < 0.7 ? 'powerup' : 'bomb';
                            this.items.push(new Item(enemy.x, enemy.y, itemType, this));
                        }
                    }
                    break;
                }
            }
            
            if (this.boss && this.isColliding(bullet, this.boss)) {
                this.boss.health -= bullet.damage;
                this.bullets.splice(i, 1);
                if (this.boss.health <= 0) {
                    this.effects.push(new DeathEffect(
                        this.boss.x + this.boss.width/2,
                        this.boss.y + this.boss.height/2,
                        this,
                        true
                    ));
                    
                    this.score += 1000;
                    this.stage++;
                    this.boss = null;
                    
                    setTimeout(() => this.showPowerupScreen(), 1000);
                }
            }
        }
        
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            if (bullet.isPlayerBullet) continue;
            
            if (this.isColliding(bullet, this.player)) {
                if (this.player.barrierHits < this.player.maxBarrierHits) {
                    this.player.barrierHits++;
                    bullet.shouldRemove = true;
                } else {
                    this.player.stats.takeDamage(bullet.damage);
                    this.bullets.splice(i, 1);
                }
            }
        }
        
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            if (this.isColliding(enemy, this.player)) {
                this.player.stats.takeDamage(20);
                this.enemies.splice(i, 1);
            }
        }
        
        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            if (this.isColliding(item, this.player)) {
                if (item.type === 'powerup') {
                    this.player.stats.increasePower();
                } else if (item.type === 'bomb') {
                    this.player.stats.addBomb();
                }
                this.items.splice(i, 1);
            }
        }
    }

    updateEntities(entities) {
        for (let i = entities.length - 1; i >= 0; i--) {
            entities[i].update();
            if (entities[i].shouldRemove) {
                entities.splice(i, 1);
            }
        }
    }

    spawnEnemy() {
        const enemy = new Enemy(
            Math.random() * (this.canvas.width - 30),
            -30,
            this
        );
        this.enemies.push(enemy);
    }

    spawnBoss() {
        this.boss = new Boss(this.canvas.width / 2, 50, this);
    }

    isColliding(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
};
