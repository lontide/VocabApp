# 구슬쌤 실전 영어 단어장 (VocabApp)

`wordlist.xlsx`의 **총정리 1탄 ~ 50탄 (총 2,500개 실전 표현)**을 기반으로 제작된 반응형 모바일/PC 영어 단어장 웹앱입니다.

## 다음 업데이트 계획

2026-11-04 요청은 문서에 반영한 상태이며 아직 구현하지 않았습니다. 객관식을 어휘 리스트 페이지로 교체하고, 답안 탭 공개·모드별 암기 기록·원본/섞기 선택을 추가하며 모바일 화면의 단축키 안내를 정리할 예정입니다. 상세 요구사항은 [SPEC.md](SPEC.md), 구현 작업과 완료 기준은 [TASKS.md](TASKS.md)를 참고하세요.

## ✨ 현재 구현 기능
- **총정리 1~50탄 복수 선택**: 원하는 탄들을 체크하여 묶어서 학습 (빠른 묶음 선택 지원)
- **4가지 학습 모드**:
  1. 단어 ➔ 뜻 맞히기
  2. 뜻 ➔ 단어 맞히기
  3. 예문 ➔ 뜻 맞히기
  4. 한국어 문장 ➔ 영어 예문 맞히기
- **학습 스타일 선택**: 플래시카드(암기 및 자가진단) & 4지선다 퀴즈(객관식 테스트)
- **발음 듣기 (Web Speech API TTS)**: 단어 및 예문 원어민 발음 재생
- **반응형 & 설치 안내**: 모바일 터치·PC 키보드 단축키, manifest와 홈 화면 설치 안내 제공 (설치 가능 여부는 브라우저에 따라 다르며 오프라인 캐시는 미구현)
- **세션 오답 재시도 & 북마크**: 현재 학습의 틀린 단어 재도전, 북마크는 Local Storage에 저장
- **전체 사전 검색**: 2,500개 표현 실시간 검색

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
