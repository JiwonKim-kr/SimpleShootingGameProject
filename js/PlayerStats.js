window.PlayerStats = class PlayerStats {
    constructor() {
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.powerLevel = 1;
        this.maxPowerLevel = 10;  // 최대 10단계로 증가
        this.bombs = 3;
        this.maxBombs = 5;
        this.moveSpeed = 5;
        this.shootDelay = 45;
        this.bulletDamage = 10;
        this.bulletSpeed = 10;
        this.isInvincible = false;
        this.invincibleTime = 3000;
        this.invincible = false; // 디버그 모드용 무적 상태
    }

    increasePower() {
        if (this.powerLevel < this.maxPowerLevel) {
            this.powerLevel++;
            this.shootDelay = Math.max(30, this.shootDelay - 2);
            
            // 데미지 증가 (10% 증가)
            if (this.powerLevel % 3 !== 0) {  // 3의 배수 레벨이 아닐 때
                this.bulletDamage *= 1.1;
            }
        }
    }

    // 현재 파워 레벨에 따른 발사 탄환 수 계산
    getBulletCount() {
        return 1 + Math.floor((this.powerLevel - 1) / 3);  // 3단계마다 1개씩 증가
    }

    // 현재 파워 레벨에 따른 탄환 크기 배율 계산 (1.0 ~ 2.0)
    getBulletScale() {
        return 1 + (this.powerLevel - 1) / 9;  // 10단계에서 2배
    }

    takeDamage(amount) {
        if (!this.isInvincible && !this.invincible) {
            this.health = Math.max(0, this.health - amount);
        }
        return this.health > 0;
    }

    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }

    addBomb() {
        this.bombs = Math.min(this.maxBombs, this.bombs + 1);
    }

    useBomb() {
        if (this.bombs > 0) {
            this.bombs--;
            return true;
        }
        return false;
    }
};
