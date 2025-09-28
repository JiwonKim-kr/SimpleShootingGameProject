window.Enemy = class Enemy {
    constructor(x, y, game) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speed = 2;
        this.health = 20;
        this.points = 100;
        this.shouldRemove = false;
        this.shootCooldown = 0;
    }

    update() {
        this.y += this.speed;
        
        if (--this.shootCooldown <= 0) {
            if (Math.random() < 0.1) {
                const bullet = new Bullet(
                    this.x + this.width / 2,
                    this.y + this.height,
                    this.game,
                    false
                );
                this.game.bullets.push(bullet);
            }
            this.shootCooldown = 60;
        }

        if (this.y > this.game.canvas.height) {
            this.shouldRemove = true;
        }
    }

    draw() {
        const ctx = this.game.ctx;
        
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.fillRect(this.x + 2, this.y + 2, this.width, this.height);
        
        ctx.fillStyle = '#f00';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.beginPath();
        ctx.strokeStyle = '#ff0';
        ctx.lineWidth = 1;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.moveTo(this.x + this.width/2, this.y);
        ctx.lineTo(this.x + this.width/2, this.y + this.height);
        ctx.stroke();
        
        ctx.fillStyle = '#600';
        ctx.fillRect(this.x, this.y - 5, this.width, 3);
        
        const healthPercent = this.health / 20;
        ctx.fillStyle = `rgb(${255 * (1 - healthPercent)}, ${255 * healthPercent}, 0)`;
        ctx.fillRect(this.x, this.y - 5, this.width * healthPercent, 3);
        
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(this.x, this.y - 5, this.width, 3);
    }
};
