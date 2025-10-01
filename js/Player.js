window.Player = class Player {
    constructor(game) {
        this.game = game;
        this.width = 30;
        this.height = 30;
        this.x = game.canvas.width / 2;
        this.y = game.canvas.height - 50;
        
        this.stats = new PlayerStats();
        this.keys = {};
        this.isShooting = false;
        this.shootCooldown = 0;
        this.shotCount = 0;

        // 파워업 상태
        this.satellites = [];
        this.hasSpread = false;
        this.hasMissile = false;
        this.missileCounter = 0;
        this.missileInterval = 10; // 미사일 발사 간격 (기본 10회)
        this.barrier = null;
        this.barrierHits = 0;
        this.maxBarrierHits = 10;
        
        this.setupControls();
    }

    setupControls() {
        window.addEventListener('keydown', e => {
            this.keys[e.code] = true;
            if (e.code === 'Space') this.isShooting = true;
            if (e.code === 'KeyC') this.useBomb();  // C키로 폭탄 사용
        });
        window.addEventListener('keyup', e => {
            this.keys[e.code] = false;
            if (e.code === 'Space') this.isShooting = false;
        });
    }

    shoot() {
        const bulletCount = Math.floor((this.stats.powerLevel + 2) / 3);  // 3레벨마다 1개씩 증가
        const bulletScale = 1 + (this.stats.powerLevel - 1) / 9;  // 10단계에서 2배
        
        // 부채꼴 형태로 발사
        if (bulletCount > 1) {
            const spreadAngle = Math.PI / 6;  // 30도
            const angleStep = spreadAngle / (bulletCount - 1);
            const startAngle = -spreadAngle / 2;
            
            for (let i = 0; i < bulletCount; i++) {
                const angle = startAngle + angleStep * i;
                const bullet = new Bullet(
                    this.x + this.width / 2,
                    this.y,
                    this.game,
                    true,
                    this.stats.bulletDamage,
                    this.stats.bulletSpeed,
                    bulletScale
                );
                
                // 탄환의 방향 설정
                bullet.speedX = Math.sin(angle) * this.stats.bulletSpeed;
                bullet.speedY = -Math.cos(angle) * this.stats.bulletSpeed;
                
                this.game.bullets.push(bullet);
            }
        } else {
            // 단일 탄환 발사
            const bullet = new Bullet(
                this.x + this.width / 2,
                this.y,
                this.game,
                true,
                this.stats.bulletDamage,
                this.stats.bulletSpeed,
                bulletScale
            );
            bullet.speedY = -this.stats.bulletSpeed;
            this.game.bullets.push(bullet);
        }

        // 위성 공격
        this.satellites.forEach(satellite => {
            if (satellite.cooldown <= 0) {
                const bullet = new Bullet(
                    this.x + this.width/2 + Math.cos(satellite.angle) * satellite.distance,
                    this.y + this.height/2 + Math.sin(satellite.angle) * satellite.distance,
                    this.game,
                    true,
                    this.stats.bulletDamage * 0.5,
                    this.stats.bulletSpeed,
                    bulletScale * 0.8,
                    true // 위성 탄환 표시
                );
                bullet.speedY = -this.stats.bulletSpeed;
                this.game.bullets.push(bullet);
                satellite.cooldown = 30;
            }
        });
        
        // 미사일 발사 (동적 간격)
        if (this.hasMissile) {
            this.missileCounter++;
            if (this.missileCounter >= this.missileInterval) {
                this.missileCounter = 0;
                
                // 양쪽에서 미사일 2발 발사
                const leftMissile = new PlayerMissile(
                    this.x - 10,
                    this.y,
                    this.game
                );
                leftMissile.damage = this.stats.bulletDamage * 0.2;
                
                const rightMissile = new PlayerMissile(
                    this.x + this.width + 10,
                    this.y,
                    this.game
                );
                rightMissile.damage = this.stats.bulletDamage * 0.2;
                
                this.game.bullets.push(leftMissile);
                this.game.bullets.push(rightMissile);
            }
        }
    }

    useBomb() {
        if (this.stats.useBomb()) {
            this.stats.isInvincible = true;
            setTimeout(() => this.stats.isInvincible = false, this.stats.invincibleTime);
            
            // 폭탄 이펙트 생성
            this.game.effects.push(new DeathEffect(
                this.x + this.width/2,
                this.y + this.height/2,
                this.game,
                true  // 보스급 이펙트 사용
            ));
            
            // 모든 적과 적의 총알 제거
            this.game.enemies = [];
            this.game.bullets = this.game.bullets.filter(b => b.isPlayerBullet);
            
            // 보스에게 데미지
            if (this.game.boss) {
                this.game.boss.health -= 50;
                if (this.game.boss.health <= 0) {
                    this.game.effects.push(new DeathEffect(
                        this.game.boss.x + this.game.boss.width/2,
                        this.game.boss.y + this.game.boss.height/2,
                        this.game,
                        true
                    ));
                    this.game.score += 1000;
                    this.game.stage++;
                    this.game.boss = null;
                    
                    setTimeout(() => this.game.showPowerupScreen(), 1000);
                }
            }
        }
    }

    update(deltaMultiplier = 1) {
        const diagonalSpeed = this.stats.moveSpeed * 0.707 * deltaMultiplier;
        const isDiagonal = (this.keys['ArrowLeft'] || this.keys['ArrowRight']) && 
                          (this.keys['ArrowUp'] || this.keys['ArrowDown']);
        const currentSpeed = isDiagonal ? diagonalSpeed : this.stats.moveSpeed * deltaMultiplier;

        if (this.keys['ArrowLeft']) {
            this.x = Math.max(0, this.x - currentSpeed);
        }
        if (this.keys['ArrowRight']) {
            this.x = Math.min(this.game.canvas.width - this.width, this.x + currentSpeed);
        }
        if (this.keys['ArrowUp']) {
            this.y = Math.max(0, this.y - currentSpeed);
        }
        if (this.keys['ArrowDown']) {
            this.y = Math.min(this.game.canvas.height - this.height, this.y + currentSpeed);
        }

        // 위성 업데이트
        this.satellites.forEach(satellite => {
            satellite.angle += 0.02;
            if (satellite.cooldown > 0) {
                satellite.cooldown--;
            }
        });

        if (this.isShooting && this.shootCooldown <= 0) {
            this.shoot();
            this.shootCooldown = this.stats.shootDelay;
        }
        if (this.shootCooldown > 0) {
            this.shootCooldown--;
        }
    }

    draw() {
        const ctx = this.game.ctx;
        
        // 베리어 그리기
        if (this.barrierHits < this.maxBarrierHits) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 255, 255, ${0.3 + Math.sin(Date.now() / 200) * 0.2})`;
            ctx.lineWidth = 3;
            ctx.arc(this.x + this.width/2, this.y - 20, 25, Math.PI, 0);
            ctx.stroke();
        }

        // 위성 그리기
        this.satellites.forEach(satellite => {
            const satX = this.x + this.width/2 + Math.cos(satellite.angle) * satellite.distance;
            const satY = this.y + this.height/2 + Math.sin(satellite.angle) * satellite.distance;
            
            ctx.fillStyle = '#0ff';
            ctx.beginPath();
            ctx.arc(satX, satY, 5, 0, Math.PI * 2);
            ctx.fill();
        });

        // 엔진 불꽃 효과
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 100, 0, 0.5)';
        ctx.moveTo(this.x + this.width / 2, this.y + this.height);
        ctx.lineTo(this.x + this.width / 2 - 5, this.y + this.height + 10);
        ctx.lineTo(this.x + this.width / 2 + 5, this.y + this.height + 10);
        ctx.closePath();
        ctx.fill();

        // 기체 본체
        ctx.fillStyle = this.stats.isInvincible ? '#ff0' : '#fff';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();

        // 기체 윤곽선
        ctx.strokeStyle = '#0af';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 파워 레벨에 따른 날개 효과
        if (this.stats.powerLevel > 1) {
            ctx.beginPath();
            ctx.strokeStyle = '#0ff';
            ctx.lineWidth = 1;
            ctx.moveTo(this.x - 5, this.y + this.height - 10);
            ctx.lineTo(this.x + this.width + 5, this.y + this.height - 10);
            ctx.stroke();
        }
        if (this.stats.powerLevel > 2) {
            ctx.beginPath();
            ctx.strokeStyle = '#f0f';
            ctx.moveTo(this.x - 10, this.y + this.height - 5);
            ctx.lineTo(this.x + this.width + 10, this.y + this.height - 5);
            ctx.stroke();
        }
    }

    addPowerup(type) {
        switch(type) {
            case 'satellite':
                this.satellites.push({
                    angle: this.satellites.length * (Math.PI * 2 / 3),
                    distance: 40,
                    cooldown: 0
                });
                break;
            case 'missile':
                if (!this.hasMissile) {
                    this.hasMissile = true;
                    this.missileCounter = 0;
                    this.missileInterval = 10;
                } else {
                    // 중복 획득 시 발사 간격 감소 (최소 5까지)
                    this.missileInterval = Math.max(5, this.missileInterval - 1);
                }
                break;
            case 'barrier':
                this.maxBarrierHits += 10;
                this.barrierHits = 0;
                break;
        }
    }
};
