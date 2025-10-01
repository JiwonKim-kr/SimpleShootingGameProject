window.Item = class Item {
    constructor(x, y, type, game) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.type = type;
        this.speed = 2;
        this.shouldRemove = false;
    }

    update() {
        this.y += this.speed;
        if (this.y > this.game.canvas.height) {
            this.shouldRemove = true;
        }
    }

    draw() {
        const ctx = this.game.ctx;
        const centerX = this.x + this.width/2;
        const centerY = this.y + this.height/2;
        
        if (this.type === 'powerup') {
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
        } else {
            // 폭탄: 원형 + B
            ctx.fillStyle = '#ffff00';
            ctx.beginPath();
            ctx.arc(centerX, centerY, this.width/2, 0, Math.PI * 2);
            ctx.fill();
            
            // 테두리
            ctx.strokeStyle = '#aaaa00';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // B 텍스트
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('B', centerX, centerY);
        }
    }
};
