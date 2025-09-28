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
        ctx.fillStyle = this.type === 'powerup' ? '#0f0' : '#ff0';
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
        ctx.fill();
    }
};
