# 구슬쌤 실전 영어 단어장 (VocabApp)

`wordlist.xlsx`의 **총정리 1탄 ~ 50탄 (총 2,500개 실전 표현)**을 기반으로 제작된 반응형 모바일/PC 영어 단어장 웹앱입니다.

## 주요 기능

- 1~50탄 복수 선택과 원본 순서/섞기 선택.
- 단어→뜻, 뜻→단어, 예문→뜻, 한국어→영어예문 학습.
- 플래시카드와 어휘 리스트: 답안을 탭해 공개하고 외웠어요/헷갈려요 기록.
- 어휘·모드별 기록을 브라우저에 저장하며 카드와 목록에서 공유.
- 검색·북마크·영어 TTS·홈 화면 설치 안내. 서비스 워커는 미구현.

## 🚀 GitHub Pages 배포 방법

### 1단계: GitHub 새 저장소(Repository) 생성
1. [GitHub](https://github.com/new)에 접속하여 새 저장소를 생성합니다. (예: `VocabApp`)

### 2단계: 로컬 코드 푸시(Push)
터미널에서 아래 명령어를 실행합니다:
```bash
git add .
git commit -m "feat: 구슬쌤 실전 영어 단어장 초기 버전 및 GitHub Pages 배포 설정"
git remote add origin https://github.com/<본인_GitHub_아이디>/<저장소_이름>.git
git push -u origin main
```

### 3단계: GitHub Pages 활성화
1. GitHub 저장소 페이지의 **[Settings] ➔ [Pages]**로 이동합니다.
2. **Build and deployment** 항목의 **Source**를 **`GitHub Actions`**로 선택합니다.
3. 잠시 후 상단에 배포 완료 URL (`https://<아이디>.github.io/<저장소_이름>/`)이 생성됩니다!

스마트폰 브라우저에서 해당 주소로 접속한 후, **"홈 화면에 추가"** 또는 **"앱 설치"**를 누르면 안드로이드 폰에서 독립 앱으로 언제 어디서든 이용하실 수 있습니다.

## 개발 및 검증 Harness

Node.js 24에서 `npm ci` 후 `npm run check`로 자동 테스트와 프로덕션 빌드를 실행합니다.
현재 기능·데이터 계약은 [SPEC.md](SPEC.md), 후속 작업은 [TASKS.md](TASKS.md), 작업 지침은 [AGENTS.md](AGENTS.md), 실행·검증 절차는 [docs/HARNESS.md](docs/HARNESS.md)를 참고하세요.
