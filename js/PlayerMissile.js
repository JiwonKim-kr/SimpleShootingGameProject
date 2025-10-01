window.PlayerMissile = class PlayerMissile {
    constructor(x, y, game) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 6;
        this.height = 12;
        this.speed = 4;
        this.damage = 0; // Player.js에서 설정됨
        this.shouldRemove = false;
        this.isPlayerBullet = true;
        this.angle = -Math.PI / 2; // 초기에는 위쪽
        this.trail = [];
        
        // 추적 시스템
        this.velocityX = 0;
        this.velocityY = -this.speed;
        this.maxSpeed = 5;
        this.acceleration = 0.2;
        this.target = null;
        this.trackingTime = 0;
        this.maxTrackingTime = 120; // 2초간 추적
    }

    update() {
        this.trackingTime++;
        
        // 가장 가까운 적 찾기
        if (this.trackingTime <= this.maxTrackingTime) {
            this.findNearestTarget();
            
            if (this.target) {
                const dx = this.target.x + this.target.width/2 - this.x;
                const dy = this.target.y + this.target.height/2 - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 0) {
                    const targetVelX = (dx / distance) * this.maxSpeed;
                    const targetVelY = (dy / distance) * this.maxSpeed;
                    
                    this.velocityX += (targetVelX - this.velocityX) * this.acceleration;
                    this.velocityY += (targetVelY - this.velocityY) * this.acceleration;
                    
                    const currentSpeed = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
                    if (currentSpeed > this.maxSpeed) {
                        this.velocityX = (this.velocityX / currentSpeed) * this.maxSpeed;
                        this.velocityY = (this.velocityY / currentSpeed) * this.maxSpeed;
                    }
                    
                    this.angle = Math.atan2(this.velocityY, this.velocityX);
                }
            }
        }
        
        // 이동
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // 궤적 추가
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > 6) {
            this.trail.shift();
        }
        
        // 화면 밖으로 나가면 제거
        if (this.y < -50 || this.y > this.game.canvas.height + 50 ||
            this.x < -50 || this.x > this.game.canvas.width + 50) {
            this.shouldRemove = true;
        }
    }
    
    findNearestTarget() {
        let nearestDistance = Infinity;
        this.target = null;
        
        // 일반 적 검사
        this.game.enemies.forEach(enemy => {
            const dx = enemy.x + enemy.width/2 - this.x;
            const dy = enemy.y + enemy.height/2 - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < nearestDistance) {
                nearestDistance = distance;
                this.target = enemy;
            }
        });
        
        // 보스 검사
        if (this.game.boss) {
            const dx = this.game.boss.x + this.game.boss.width/2 - this.x;
            const dy = this.game.boss.y + this.game.boss.height/2 - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < nearestDistance) {
                this.target = this.game.boss;
            }
        }
    }

    draw() {
        const ctx = this.game.ctx;
        
        // 궤적 그리기
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < this.trail.length - 1; i++) {
            const alpha = (i + 1) / this.trail.length * 0.6;
            ctx.globalAlpha = alpha;
            ctx.moveTo(this.trail[i].x, this.trail[i].y);
            ctx.lineTo(this.trail[i + 1].x, this.trail[i + 1].y);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
        
        // 미사일 본체
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle + Math.PI / 2);
        
        // 미사일 몸체
        ctx.fillStyle = '#00ff44';
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        
        // 미사일 머리
        ctx.fillStyle = '#00ff88';
        ctx.beginPath();
        ctx.moveTo(0, -this.height/2);
        ctx.lineTo(-this.width/2, -this.height/2 + 4);
        ctx.lineTo(this.width/2, -this.height/2 + 4);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
};
