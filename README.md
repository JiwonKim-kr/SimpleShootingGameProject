# Space Combat Game

HTML5 Canvas 기반의 2D 슈팅 게임입니다.

## 🎮 게임 특징
- 키보드 조작 (방향키 + 스페이스바 + C키)
- 파워업 시스템 (위성, 산탄, 베리어)
- 스테이지 진행 시스템
- 점수 및 체력 시스템
- 보스전 시스템

## 🚀 실행 방법
1. 웹 서버에서 `index.html` 파일을 실행
2. 또는 로컬에서 Live Server 확장을 사용하여 실행

## 🎯 조작법
- **← → ↑ ↓**: 이동
- **SPACE**: 공격
- **C**: 폭탄 (화면의 모든 적 제거)
- **ESC**: 일시정지

## 📁 프로젝트 구조
```
SimpleShootingGameProject/
├── index.html          # 메인 HTML 파일
├── css/
│   └── style.css       # 스타일시트
├── js/
│   ├── PlayerStats.js  # 플레이어 통계
│   ├── Player.js       # 플레이어 클래스
│   ├── Enemy.js        # 적 클래스
│   ├── Boss.js         # 보스 클래스
│   ├── Bullet.js       # 탄환 클래스
│   ├── DeathEffect.js  # 폭발 효과
│   ├── Item.js         # 아이템 클래스
│   ├── Game.js         # 메인 게임 로직
│   └── main.js         # 초기화 및 의존성 검사
└── README.md
```

## 🔧 개발 프로세스 체크리스트

### 코드 업데이트 시 확인사항
1. 클래스 정의 순서 확인
   - [ ] PlayerStats
   - [ ] Player
   - [ ] Enemy
   - [ ] Boss
   - [ ] Bullet
   - [ ] DeathEffect
   - [ ] Item
   - [ ] Game

2. 의존성 검사
   - [ ] 모든 필요한 클래스가 정의되어 있는지 확인
   - [ ] 클래스 간 의존 관계가 올바른지 확인
   - [ ] 순환 참조가 없는지 확인

3. 초기화 코드 확인
   - [ ] DOMContentLoaded 이벤트 리스너 존재 확인
   - [ ] 게임 인스턴스 생성 코드 확인
   - [ ] 의존성 검증 코드 실행 확인

4. 테스트
   - [ ] 콘솔 에러 메시지 확인
   - [ ] 게임 시작 및 메뉴 동작 확인
   - [ ] 게임 플레이 기능 확인

### 파일 업로드 전 확인사항
1. 코드 검증
   ```javascript
   validateDependencies();
   ```

2. 파일 목록 확인
   - [ ] index.html
   - [ ] css/style.css
   - [ ] js/*.js (9개 파일)

## 🌐 배포
AWS S3를 사용한 정적 웹사이트 호스팅:
```bash
aws s3 cp . s3://your-bucket-name/game/ --recursive --region us-west-2
```

## 📝 라이선스
MIT License

## 👨‍💻 개발자
- 개발: JiwonKim
- © 2025 All Rights Reserved
