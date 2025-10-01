window.BouncingItem = class BouncingItem {
    constructor(x, y, game) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.type = 'powerup';
        this.shouldRemove = false;
        
        // 튕기는 물리
        this.velocityX = (Math.random() - 0.5) * 8; // -4 ~ 4
        this.velocityY = (Math.random() - 0.5) * 8; // -4 ~ 4
        this.bounce = 0.8; // 튕김 계수
        
        // 15초 후 제거
        this.lifeTime = 900; // 15초 (60fps 기준)
        this.currentLife = 0;
    }

    update() {
        this.currentLife++;
        if (this.currentLife >= this.lifeTime) {
            this.shouldRemove = true;
            return;
        }
        
        // 이동
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // 벽 충돌 및 튕김
        if (this.x <= 0 || this.x + this.width >= this.game.canvas.width) {
            this.velocityX *= -this.bounce;
            this.x = Math.max(0, Math.min(this.game.canvas.width - this.width, this.x));
        }
        
        if (this.y <= 0 || this.y + this.height >= this.game.canvas.height) {
            this.velocityY *= -this.bounce;
            this.y = Math.max(0, Math.min(this.game.canvas.height - this.height, this.y));
        }
        
        // 마찰력 (점진적 속도 감소)
        this.velocityX *= 0.995;
        this.velocityY *= 0.995;
    }

    draw() {
        const ctx = this.game.ctx;
        const centerX = this.x + this.width/2;
        const centerY = this.y + this.height/2;
        
        // 생명 시간에 따른 깜빡임 효과
        const alpha = this.currentLife > this.lifeTime * 0.8 ? 
            0.3 + 0.7 * Math.sin(this.currentLife * 0.3) : 1;
        
        ctx.globalAlpha = alpha;
        
        // 파워업: 모서리가 둥근 사각형 + P
        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 4);
        ctx.fill();
        
        // 테두리
        ctx.strokeStyle = '#00aa00';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // P 텍스트
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('P', centerX, centerY);
        
        ctx.globalAlpha = 1;
    }
};
