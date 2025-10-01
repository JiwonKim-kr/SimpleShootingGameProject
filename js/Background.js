window.Background = class Background {
    constructor(canvas, stage = 1) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.stage = stage;
        this.scrollSpeed = 0.5;
        this.y1 = 0;
        this.y2 = -canvas.height;
        
        this.stageColors = {
            1: { bg: '#001122', stars: '#ffffff', nebula: '#003366' },
            2: { bg: '#220011', stars: '#ffcccc', nebula: '#660033' },
            3: { bg: '#112200', stars: '#ccffcc', nebula: '#336600' },
            4: { bg: '#221100', stars: '#ffffcc', nebula: '#663300' },
            5: { bg: '#110022', stars: '#ccccff', nebula: '#330066' }
        };
        
        this.stars = [];
        this.generateStars();
    }
    
    generateStars() {
        this.stars = [];
        const starCount = 50;
        const colors = this.stageColors[this.stage] || this.stageColors[1];
        
        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height * 2,
                size: Math.random() * 2 + 0.5,
                speed: Math.random() * 0.5 + 0.2,
                opacity: Math.random() * 0.8 + 0.2
            });
        }
    }
    
    update(deltaTime) {
        // 배경 스크롤
        this.y1 += this.scrollSpeed * deltaTime;
        this.y2 += this.scrollSpeed * deltaTime;
        
        if (this.y1 >= this.canvas.height) {
            this.y1 = this.y2 - this.canvas.height;
        }
        if (this.y2 >= this.canvas.height) {
            this.y2 = this.y1 - this.canvas.height;
        }
        
        // 별 업데이트
        this.stars.forEach(star => {
            star.y += star.speed * deltaTime;
            if (star.y > this.canvas.height) {
                star.y = -10;
                star.x = Math.random() * this.canvas.width;
            }
        });
    }
    
    draw() {
        const colors = this.stageColors[this.stage] || this.stageColors[1];
        
        // 배경 그라데이션
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, colors.bg);
        gradient.addColorStop(0.5, colors.nebula);
        gradient.addColorStop(1, colors.bg);
        
        // 첫 번째 배경
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, this.y1, this.canvas.width, this.canvas.height);
        
        // 두 번째 배경
        this.ctx.fillRect(0, this.y2, this.canvas.width, this.canvas.height);
        
        // 별 그리기
        this.ctx.fillStyle = colors.stars;
        this.stars.forEach(star => {
            this.ctx.globalAlpha = star.opacity;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
        
        // 스테이지별 추가 효과
        this.drawStageEffects();
    }
    
    drawStageEffects() {
        switch(this.stage) {
            case 2:
                this.drawNebula('#ff3366', 0.1);
                break;
            case 3:
                this.drawNebula('#33ff66', 0.1);
                break;
            case 4:
                this.drawNebula('#ff6633', 0.1);
                break;
            case 5:
                this.drawNebula('#6633ff', 0.1);
                break;
        }
    }
    
    drawNebula(color, opacity) {
        this.ctx.globalAlpha = opacity;
        this.ctx.fillStyle = color;
        
        for (let i = 0; i < 3; i++) {
            const x = (this.canvas.width / 4) * (i + 1);
            const y = (this.y1 + this.canvas.height / 2) % this.canvas.height;
            const radius = 100 + Math.sin(Date.now() * 0.001 + i) * 20;
            
            const nebulaGradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
            nebulaGradient.addColorStop(0, color);
            nebulaGradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = nebulaGradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.globalAlpha = 1;
    }
    
    setStage(stage) {
        if (this.stage !== stage) {
            this.stage = stage;
            this.generateStars();
        }
    }
};
