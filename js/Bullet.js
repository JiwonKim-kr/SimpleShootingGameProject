window.Bullet = class Bullet {
    constructor(x, y, game, isPlayerBullet = true, damage = 10, speed = 10, scale = 1.0, isSatelliteBullet = false) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.baseWidth = 5;    // 기본 너비
        this.baseHeight = 10;   // 기본 높이
        this.width = this.baseWidth * scale;
        this.height = this.baseHeight * scale;
        
        // 적의 탄환 속도 20% 감소
        const adjustedSpeed = isPlayerBullet ? speed : speed * 0.8;
        this.speed = adjustedSpeed;
        this.speedX = 0;
        this.speedY = isPlayerBullet ? -adjustedSpeed : adjustedSpeed;
        this.damage = damage;
        this.isPlayerBullet = isPlayerBullet;
        this.shouldRemove = false;
        this.scale = scale;
        this.isSatelliteBullet = isSatelliteBullet;
        
        // 적의 탄환은 원형으로 설정
        if (!isPlayerBullet) {
            this.radius = Math.max(this.width, this.height) / 2 + 2; // 약간 더 크게
        }
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.y < 0 || this.y > this.game.canvas.height ||
            this.x < 0 || this.x > this.game.canvas.width) {
            this.shouldRemove = true;
        }
    }

    draw() {
        const ctx = this.game.ctx;
        
        if (this.isPlayerBullet) {
            if (this.isSatelliteBullet) {
                // 위성 탄환 (파란색)
                // 그림자 효과
                ctx.fillStyle = 'rgba(0, 100, 255, 0.3)';
                ctx.beginPath();
                ctx.ellipse(
                    this.x + 2, 
                    this.y + 2, 
                    this.width/2, 
                    this.height/2, 
                    0, 0, Math.PI * 2
                );
                ctx.fill();
                
                // 탄환 본체
                ctx.fillStyle = '#00aaff';
                ctx.beginPath();
                ctx.ellipse(
                    this.x, 
                    this.y, 
                    this.width/2, 
                    this.height/2, 
                    0, 0, Math.PI * 2
                );
                ctx.fill();
                
                // 발광 효과
                const glow = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.width
                );
                glow.addColorStop(0, 'rgba(0, 170, 255, 0.3)');
                glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.ellipse(
                    this.x, 
                    this.y, 
                    this.width, 
                    this.height, 
                    0, 0, Math.PI * 2
                );
                ctx.fill();
            } else {
                // 플레이어 탄환 (기존 녹색)
                // 그림자 효과
                ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
                ctx.beginPath();
                ctx.ellipse(
                    this.x + 2, 
                    this.y + 2, 
                    this.width/2, 
                    this.height/2, 
                    0, 0, Math.PI * 2
                );
                ctx.fill();
                
                // 탄환 본체
                ctx.fillStyle = '#0f0';
                ctx.beginPath();
                ctx.ellipse(
                    this.x, 
                    this.y, 
                    this.width/2, 
                    this.height/2, 
                    0, 0, Math.PI * 2
                );
                ctx.fill();
                
                // 발광 효과
                const glow = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.width
                );
                glow.addColorStop(0, 'rgba(0, 255, 0, 0.3)');
                glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.ellipse(
                    this.x, 
                    this.y, 
                    this.width, 
                    this.height, 
                    0, 0, Math.PI * 2
                );
                ctx.fill();
            }
        } else {
            // 적의 탄환 (원형 붉은색)
            // 외곽 테두리
            ctx.strokeStyle = '#ff6666';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.stroke();
            
            // 탄환 본체 (원형)
            ctx.fillStyle = '#ff3333';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius - 1, 0, Math.PI * 2);
            ctx.fill();
            
            // 중심 하이라이트
            ctx.fillStyle = '#ff9999';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius / 2, 0, Math.PI * 2);
            ctx.fill();
            
            // 발광 효과
            const enemyGlow = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.radius * 2
            );
            enemyGlow.addColorStop(0, 'rgba(255, 51, 51, 0.4)');
            enemyGlow.addColorStop(1, 'rgba(255, 51, 51, 0)');
            ctx.fillStyle = enemyGlow;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
};
