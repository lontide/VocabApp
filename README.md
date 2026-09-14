# 구슬쌤 실전 영어 단어장 (VocabApp)

`wordlist.xlsx`의 **총정리 1탄 ~ 50탄 (총 2,500개 실전 표현)**을 기반으로 제작된 반응형 모바일/PC 영어 단어장 웹앱입니다.

## ✨ 주요 기능
- **총정리 1~50탄 복수 선택**: 원하는 탄들을 체크하여 묶어서 학습 (빠른 묶음 선택 지원)
- **4가지 학습 모드**:
  1. 단어 ➔ 뜻 맞히기
  2. 뜻 ➔ 단어 맞히기
  3. 예문 ➔ 뜻 맞히기
  4. 한국어 문장 ➔ 영어 예문 맞히기
- **학습 스타일 선택**: 플래시카드(암기 및 자가진단) & 4지선다 퀴즈(객관식 테스트)
- **발음 듣기 (Web Speech API TTS)**: 단어 및 예문 원어민 발음 재생
- **반응형 & PWA 지원**: 모바일 터치 및 PC 키보드 단축키 지원, 홈 화면에 앱으로 설치 가능
- **오답 노트 & 북마크**: 틀린 단어 재도전, 즐겨찾기 저장 (Local Storage)
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
