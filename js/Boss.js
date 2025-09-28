window.Boss = class Boss {
    constructor(x, y, game) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.health = 500;
        this.shouldRemove = false;
        this.moveDirection = 1;
    }

    update() {
        this.x += this.moveDirection * 2;
        if (this.x <= 0 || this.x + this.width >= this.game.canvas.width) {
            this.moveDirection *= -1;
        }

        if (Math.random() < 0.05) {
            const bullet = new Bullet(
                this.x + this.width / 2,
                this.y + this.height,
                this.game,
                false
            );
            this.game.bullets.push(bullet);
        }

        if (this.health <= 0) {
            this.shouldRemove = true;
            this.game.stage++;
            this.game.score += 1000;
        }
    }

    draw() {
        const ctx = this.game.ctx;
        
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.fillRect(this.x + 5, this.y + 5, this.width, this.height);
        
        ctx.fillStyle = '#800';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.beginPath();
        ctx.strokeStyle = '#f00';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
        
        ctx.beginPath();
        ctx.fillStyle = '#ff0';
        ctx.moveTo(this.x + this.width/2, this.y);
        ctx.lineTo(this.x + this.width/2 - 20, this.y + 20);
        ctx.lineTo(this.x + this.width/2 + 20, this.y + 20);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#300';
        ctx.fillRect(this.x, this.y - 15, this.width, 10);
        
        const healthPercent = this.health / 500;
        const gradient = ctx.createLinearGradient(this.x, 0, this.x + this.width, 0);
        gradient.addColorStop(0, '#f00');
        gradient.addColorStop(0.5, '#ff0');
        gradient.addColorStop(1, '#0f0');
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y - 15, this.width * healthPercent, 10);
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y - 15, this.width, 10);
        
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 0, 0, ${0.5 + Math.sin(Date.now() / 200) * 0.5})`;
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
            ctx.moveTo(this.x, this.y + i * (this.height/3));
            ctx.lineTo(this.x + this.width, this.y + i * (this.height/3));
        }
        ctx.stroke();
    }
};
