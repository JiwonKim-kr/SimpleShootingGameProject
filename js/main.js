// 의존성 검사 함수
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

// 게임 초기화
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
        alert('게임 초기화 실패: ' + error.message);
    }
});
