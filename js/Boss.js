window.Boss = class Boss {
    constructor(x, y, game) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.health = 500;
        this.maxHealth = 500;
        this.shouldRemove = false;
        this.moveDirection = 1;
        
        // 패턴 시스템
        this.patterns = [
            this.pattern1_SpreadShot.bind(this),
            this.pattern2_BigSlow.bind(this),
            this.pattern3_HomingMissiles.bind(this)
        ];
        this.currentPattern = 0;
        this.patternTimer = 0;
        this.patternCooldown = 120; // 2초
        this.patternState = {};
    }

    update() {
        // 이동
        this.x += this.moveDirection * 2;
        if (this.x <= 0 || this.x + this.width >= this.game.canvas.width) {
            this.moveDirection *= -1;
        }

        // 패턴 실행
        this.patternTimer++;
        if (this.patternTimer >= this.patternCooldown) {
            this.executePattern();
            this.patternTimer = 0;
            this.currentPattern = Math.floor(Math.random() * this.patterns.length);
        }

        // 체력이 0 이하일 때만 제거 플래그 설정 (보상은 Game.js에서 처리)
        if (this.health <= 0) {
            this.shouldRemove = true;
        }
    }

    executePattern() {
        this.patternState = {}; // 패턴 상태 초기화
        this.patterns[this.currentPattern]();
    }

    // 패턴 1: 4발의 산탄을 플레이어를 향해 2번씩 발사
    pattern1_SpreadShot() {
        const playerX = this.game.player ? this.game.player.x : this.game.canvas.width / 2;
        const playerY = this.game.player ? this.game.player.y : this.game.canvas.height / 2;
        
        const shootBurst = (burstIndex) => {
            setTimeout(() => {
                const centerX = this.x + this.width / 2;
                const centerY = this.y + this.height;
                
                const baseAngle = Math.atan2(playerY - centerY, playerX - centerX);
                const spreadAngle = Math.PI / 6; // 30도 확산
                
                for (let i = 0; i < 4; i++) {
                    const angle = baseAngle + (i - 1.5) * (spreadAngle / 3);
                    const bullet = new Bullet(centerX, centerY, this.game, false, 10, 6);
                    bullet.speedX = Math.cos(angle) * 6;
                    bullet.speedY = Math.sin(angle) * 6;
                    this.game.bullets.push(bullet);
                }
            }, burstIndex * 300);
        };
        
        shootBurst(0);
        shootBurst(1);
    }

    // 패턴 2: 크고 느린 속도로 날아오는 탄막 2개를 일정 간격으로 발사
    pattern2_BigSlow() {
        const shootBig = (index) => {
            setTimeout(() => {
                const centerX = this.x + this.width / 2;
                const centerY = this.y + this.height;
                const offsetX = (index === 0) ? -30 : 30;
                
                const bullet = new Bullet(
                    centerX + offsetX, 
                    centerY, 
                    this.game, 
                    false, 
                    25, // 높은 데미지
                    3,  // 느린 속도
                    2.5 // 큰 크기
                );
                this.game.bullets.push(bullet);
            }, index * 800);
        };
        
        shootBig(0);
        shootBig(1);
    }

    // 패턴 3: 플레이어를 느린 속도로 추적하는 미사일 모양 탄막을 3발 발사
    pattern3_HomingMissiles() {
        const playerX = this.game.player ? this.game.player.x : this.game.canvas.width / 2;
        const playerY = this.game.player ? this.game.player.y : this.game.canvas.height / 2;
        
        const shootMissile = (index) => {
            setTimeout(() => {
                const centerX = this.x + this.width / 2;
                const centerY = this.y + this.height;
                const offsetX = (index - 1) * 25;
                
                const missile = new Missile(
                    centerX + offsetX,
                    centerY,
                    this.game,
                    playerX,
                    playerY
                );
                this.game.bullets.push(missile);
            }, index * 400);
        };
        
        shootMissile(0);
        shootMissile(1);
        shootMissile(2);
    }

    draw() {
        const ctx = this.game.ctx;
        
        // 그림자
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.fillRect(this.x + 5, this.y + 5, this.width, this.height);
        
        // 본체
        ctx.fillStyle = '#800';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 테두리
        ctx.beginPath();
        ctx.strokeStyle = '#f00';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
        
        // 상단 삼각형
        ctx.beginPath();
        ctx.fillStyle = '#ff0';
        ctx.moveTo(this.x + this.width/2, this.y);
        ctx.lineTo(this.x + this.width/2 - 20, this.y + 20);
        ctx.lineTo(this.x + this.width/2 + 20, this.y + 20);
        ctx.closePath();
        ctx.fill();
        
        // 체력바 배경
        ctx.fillStyle = '#300';
        ctx.fillRect(this.x, this.y - 15, this.width, 10);
        
        // 체력바
        const healthPercent = this.health / this.maxHealth;
        const gradient = ctx.createLinearGradient(this.x, 0, this.x + this.width, 0);
        gradient.addColorStop(0, '#f00');
        gradient.addColorStop(0.5, '#ff0');
        gradient.addColorStop(1, '#0f0');
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y - 15, this.width * healthPercent, 10);
        
        // 체력바 테두리
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y - 15, this.width, 10);
        
        // 패턴 표시 효과
        const patternAlpha = 0.3 + Math.sin(Date.now() / 200) * 0.3;
        ctx.strokeStyle = `rgba(255, 255, 0, ${patternAlpha})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
    }
};
