# VocabApp 작업 Harness

## 작업 시작
- README.md와 docs/HARNESS.md를 읽고 관련 소스를 확인한다.
- React 18 + TypeScript strict + Vite 6 정적 웹앱이다. 서버/API/계정 시스템은 없다.
- 기존 사용자 변경을 보존하고 요청과 무관한 리팩터링은 피한다.

## 구현 지도
- src/App.tsx: 선택 탄, 덱, 점수, 연속 정답, 세션 오답 및 화면 전환.
- src/components/: 플래시카드, 퀴즈, 결과, 탄 선택, 검색, QR 연결, 설치 배너.
- src/utils/quiz.ts: 문제 및 선택지 생성. src/utils/storage.ts: 설정/북마크 저장.
- src/utils/tts.ts: 브라우저 Web Speech API. src/types/vocab.ts: 데이터 계약.
- wordlist.xlsx → scripts/convert_data.py → src/data/wordlist.json.
- public/manifest.json: 설치 메타데이터. 서비스 워커/오프라인 캐시는 미구현.

## 변경 규칙
- 한국어 UI와 4개 QuizMode, 2개 StudyStyle의 일관성을 유지한다.
- 데이터 ID는 북마크에 사용된다. 재번호 부여나 저장 키 변경은 마이그레이션 없이 하지 않는다.
- 퀴즈/저장소/데이터 계약을 바꾸면 tests/의 관련 검증을 업데이트한다.
- XLSX 변환은 데이터 변경 작업에서만 실행하고 JSON diff를 검토한다. Python + openpyxl이 필요하다.
- 상대 base 경로와 GitHub Pages 하위 경로 호환성을 보존한다.
- 배포는 별도 요청이 있을 때만 수행한다.

## 완료 조건
1. npm ci (첫 설치), npm run check 실행.
2. UI 변경 시 docs/HARNESS.md의 관련 수동 시나리오를 확인.
3. 변경 내용, 실제 실행한 검사, 남은 한계를 보고한다. 미실행 검사를 통과했다고 쓰지 않는다.
