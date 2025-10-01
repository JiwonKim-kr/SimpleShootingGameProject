window.Missile = class Missile {
    constructor(x, y, game, targetX, targetY) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 8;
        this.height = 16;
        this.speed = 3;
        this.damage = 15;
        this.shouldRemove = false;
        this.targetX = targetX;
        this.targetY = targetY;
        this.angle = 0;
        this.trail = [];
        
        // 관성 시스템
        this.velocityX = 0;
        this.velocityY = this.speed; // 초기에는 아래로 이동
        this.maxSpeed = 4;
        this.acceleration = 0.15; // 가속도 (관성 효과)
        this.turnRate = 0.05; // 회전 속도 제한 (더 느리게)
    }

    update() {
        // 플레이어 위치 추적
        if (this.game.player) {
            const dx = this.game.player.x - this.x;
            const dy = this.game.player.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                // 목표 방향 계산
                const targetVelX = (dx / distance) * this.maxSpeed;
                const targetVelY = (dy / distance) * this.maxSpeed;
                
                // 관성을 적용한 속도 변화 (부드러운 가속)
                this.velocityX += (targetVelX - this.velocityX) * this.acceleration;
                this.velocityY += (targetVelY - this.velocityY) * this.acceleration;
                
                // 최대 속도 제한
                const currentSpeed = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
                if (currentSpeed > this.maxSpeed) {
                    this.velocityX = (this.velocityX / currentSpeed) * this.maxSpeed;
                    this.velocityY = (this.velocityY / currentSpeed) * this.maxSpeed;
                }
                
                // 각도 계산 (시각적 표현용)
                this.angle = Math.atan2(this.velocityY, this.velocityX);
            }
        }
        
        // 관성이 적용된 이동
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // 궤적 추가
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > 8) {
            this.trail.shift();
        }
        
        // 화면 밖으로 나가면 제거
        if (this.y < -50 || this.y > this.game.canvas.height + 50 ||
            this.x < -50 || this.x > this.game.canvas.width + 50) {
            this.shouldRemove = true;
        }
    }

    draw() {
        const ctx = this.game.ctx;
        
        // 궤적 그리기
        ctx.strokeStyle = 'rgba(255, 100, 100, 0.6)';
        ctx.lineWidth = 2;
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
        ctx.fillStyle = '#ff4444';
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        
        // 미사일 머리
        ctx.fillStyle = '#ff8888';
        ctx.beginPath();
        ctx.moveTo(0, -this.height/2);
        ctx.lineTo(-this.width/2, -this.height/2 + 6);
        ctx.lineTo(this.width/2, -this.height/2 + 6);
        ctx.closePath();
        ctx.fill();
        
        // 미사일 꼬리
        ctx.fillStyle = '#ffaa44';
        ctx.fillRect(-this.width/4, this.height/2 - 4, this.width/2, 8);
        
        ctx.restore();
    }
};
