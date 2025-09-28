window.Bullet = class Bullet {
    constructor(x, y, game, isPlayerBullet = true, damage = 10, speed = 10, scale = 1.0) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.baseWidth = 5;    // 기본 너비
        this.baseHeight = 10;   // 기본 높이
        this.width = this.baseWidth * scale;
        this.height = this.baseHeight * scale;
        this.speed = speed;
        this.speedX = 0;
        this.speedY = isPlayerBullet ? -speed : speed;
        this.damage = damage;
        this.isPlayerBullet = isPlayerBullet;
        this.shouldRemove = false;
        this.scale = scale;
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
        
        // 그림자 효과
        ctx.fillStyle = this.isPlayerBullet ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)';
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
        ctx.fillStyle = this.isPlayerBullet ? '#0f0' : '#f00';
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
        glow.addColorStop(0, this.isPlayerBullet ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)');
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
};
