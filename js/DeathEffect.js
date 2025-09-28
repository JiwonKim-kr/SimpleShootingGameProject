window.DeathEffect = class DeathEffect {
    constructor(x, y, game, isBoss = false) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = isBoss ? 200 : 50;
        this.expandSpeed = isBoss ? 8 : 4;
        this.opacity = 1;
        this.shouldRemove = false;
        this.color = isBoss ? '#ff0' : '#f66';
        
        if (isBoss) {
            setTimeout(() => {
                if (this.game) {
                    this.game.effects.push(new DeathEffect(
                        x + (Math.random() * 100 - 50),
                        y + (Math.random() * 100 - 50),
                        game,
                        false
                    ));
                }
            }, 100);
            setTimeout(() => {
                if (this.game) {
                    this.game.effects.push(new DeathEffect(
                        x + (Math.random() * 100 - 50),
                        y + (Math.random() * 100 - 50),
                        game,
                        false
                    ));
                }
            }, 200);
            setTimeout(() => {
                if (this.game) {
                    this.game.effects.push(new DeathEffect(
                        x + (Math.random() * 100 - 50),
                        y + (Math.random() * 100 - 50),
                        game,
                        false
                    ));
                }
            }, 300);
        }
    }

    update() {
        this.radius += this.expandSpeed;
        this.opacity -= 0.05;
        
        if (this.opacity <= 0) {
            this.shouldRemove = true;
        }
    }

    draw() {
        const ctx = this.game.ctx;
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius
        );
        gradient.addColorStop(0, `${this.color}4`);
        gradient.addColorStop(1, `${this.color}0`);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.restore();
    }
};
