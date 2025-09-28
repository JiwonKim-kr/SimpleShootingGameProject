# Space Combat Game

## 개발 프로세스 체크리스트

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
   - [ ] js/game.js

3. 업로드 명령어
   ```bash
   aws s3 cp . s3://hsuniv-14-s3/game/ --recursive --region us-west-2
   ```
