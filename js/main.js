// 의존성 검사 함수
const validateDependencies = () => {
    const required = [
        'PlayerStats',
        'Background',
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

// 성능 최적화를 위한 requestAnimationFrame 폴리필
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = window.webkitRequestAnimationFrame ||
                                   window.mozRequestAnimationFrame ||
                                   window.oRequestAnimationFrame ||
                                   window.msRequestAnimationFrame ||
                                   function(callback) {
                                       return window.setTimeout(callback, 1000 / 60);
                                   };
}

// 게임 초기화
document.addEventListener('DOMContentLoaded', () => {
    try {
        validateDependencies();
        
        const gameInfo = document.getElementById('gameInfo');
        gameInfo.style.display = 'none';

        const menuScreen = document.getElementById('menuScreen');
        menuScreen.classList.add('active');

        // 캔버스 크기 자동 조정
        const canvas = document.getElementById('gameCanvas');
        const resizeCanvas = () => {
            const container = document.querySelector('.game-container');
            const containerRect = container.getBoundingClientRect();
            canvas.width = Math.min(800, containerRect.width - 20);
            canvas.height = Math.min(600, containerRect.height - 100);
        };
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        window.game = new Game();
        
        // 게임 성능 모니터링
        let lastTime = performance.now();
        const checkPerformance = () => {
            const currentTime = performance.now();
            const deltaTime = currentTime - lastTime;
            if (deltaTime > 50) { // 20fps 이하일 때 경고
                console.warn(`Performance warning: Frame time ${deltaTime.toFixed(2)}ms`);
            }
            lastTime = currentTime;
        };
        
        setInterval(checkPerformance, 1000);
        
    } catch (error) {
        console.error('Game initialization failed:', error);
        alert('게임 초기화 실패: ' + error.message);
    }
});
