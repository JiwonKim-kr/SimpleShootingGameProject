// 1. 먼저 모든 클래스 정의
window.PlayerStats = class PlayerStats {
    // PlayerStats 클래스 내용...
};

window.Player = class Player {
    // Player 클래스 내용...
};

window.Enemy = class Enemy {
    // Enemy 클래스 내용...
};

window.Boss = class Boss {
    // Boss 클래스 내용...
};

window.Bullet = class Bullet {
    // Bullet 클래스 내용...
};

window.DeathEffect = class DeathEffect {
    // DeathEffect 클래스 내용...
};

window.Item = class Item {
    // Item 클래스 내용...
};

window.Game = class Game {
    // Game 클래스 내용...
};

// 2. 의존성 검사 함수 정의
const validateDependencies = () => {
    const required = [
        'PlayerStats',
        'Player',
        'Enemy',
        'Boss',
        'Bullet',
        'DeathEffect',
        'Item',
        'Game'
    ];

    const missing = required.filter(className => 
        typeof window[className] === 'undefined'
    );

    if (missing.length > 0) {
        console.error('Missing required classes:', missing);
        throw new Error(`Missing required classes: ${missing.join(', ')}`);
    }
};

// 3. 게임 초기화
document.addEventListener('DOMContentLoaded', () => {
    try {
        validateDependencies();
        
        const gameInfo = document.getElementById('gameInfo');
        gameInfo.style.display = 'none';

        const menuScreen = document.getElementById('menuScreen');
        menuScreen.classList.add('active');

        window.game = new Game();
    } catch (error) {
        console.error('Game initialization failed:', error);
        alert('게임 초기화 실패: 필요한 클래스가 누락되었습니다.');
    }
});
