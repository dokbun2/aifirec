# AIFI Recorder Pro

전문적인 화면 녹화 애플리케이션 - Bandicam과 같은 고품질 화면 녹화 솔루션

## 주요 기능

### 📹 녹화 모드
- **전체 화면 녹화**: 모든 모니터 또는 특정 모니터 녹화
- **창 녹화**: 특정 애플리케이션 창만 선택하여 녹화
- **화면 영역 녹화**: 사용자가 지정한 영역만 녹화

### 🎥 비디오 설정
- **출력 포맷**: MP4, AVI, MOV 지원
- **화질 옵션**: 480p, 720p, 1080p, 4K 지원
- **프레임레이트**: 15, 24, 30, 60 FPS 선택 가능
- **실시간 압축**: 효율적인 파일 크기 관리

### 🎵 오디오 설정
- **시스템 오디오**: 컴퓨터에서 재생되는 소리 녹화
- **마이크 입력**: 외부 마이크 또는 내장 마이크 녹화
- **혼합 모드**: 시스템 소리와 마이크 동시 녹화
- **오디오 없음**: 비디오만 녹화

### ⚡ 성능 최적화
- **실시간 성능**: 지연 없는 실시간 녹화
- **파일 크기 최적화**: 고품질 유지하면서 용량 최소화
- **리소스 관리**: CPU 및 메모리 효율적 사용

## 기술 스택

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Material-UI (MUI)
- **Desktop Framework**: Electron
- **비디오 처리**: MediaRecorder API + FFmpeg
- **빌드 도구**: Webpack + electron-webpack

## 개발 환경 설정

### 필요 조건
- Node.js 18 이상
- npm 또는 yarn

### 설치 및 실행

1. 의존성 설치:
```bash
npm install
```

2. 개발 서버 시작:
```bash
npm run dev
```

3. 프로덕션 빌드:
```bash
npm run build
```

4. 배포 패키지 생성:
```bash
# Windows용
npm run dist:win

# macOS용
npm run dist:mac

# 모든 플랫폼
npm run dist
```

## 프로젝트 구조

```
src/
├── main/                 # Electron 메인 프로세스
│   ├── main.ts          # 앱 초기화 및 윈도우 관리
│   ├── screenRecorder.ts # 화면 녹화 엔진
│   └── preload.ts       # IPC 통신 브릿지
├── renderer/            # React 렌더러 프로세스
│   ├── components/      # UI 컴포넌트
│   ├── hooks/          # React 훅
│   ├── types/          # TypeScript 타입 정의
│   ├── App.tsx         # 메인 앱 컴포넌트
│   └── index.tsx       # 앱 엔트리 포인트
└── shared/             # 공통 타입 및 유틸리티
```

## 사용법

### 기본 녹화
1. 앱 실행
2. 녹화 모드 선택 (전체 화면/창/영역)
3. 화면 또는 창 선택
4. 녹화 시작 버튼 클릭

### 고급 설정
1. 설정 버튼 클릭
2. 비디오 품질 및 포맷 설정
3. 오디오 소스 선택
4. 저장 경로 지정

### 녹화 제어
- **시작/중지**: 기본 녹화 제어
- **일시정지/재개**: 녹화 중 일시 중단
- **실시간 상태**: 녹화 시간 및 파일 크기 모니터링

## 개발 계획

### Phase 1: 기본 기능 (완료)
- ✅ 프로젝트 구조 설정
- ✅ Electron + React 환경 구축
- ✅ 기본 UI 프레임워크

### Phase 2: 핵심 녹화 기능 (진행 중)
- 🔄 화면 캡처 엔진 구현
- 🔄 오디오 캡처 시스템
- ⏳ 실시간 인코딩 파이프라인

### Phase 3: UI/UX 완성
- ⏳ 화면 영역 선택 도구
- ⏳ 설정 패널 고도화
- ⏳ 사용자 경험 개선

### Phase 4: 고급 기능
- ⏳ 파일 최적화 시스템
- ⏳ 예약 녹화 기능
- ⏳ 핫키 지원

### Phase 5: 최적화 및 배포
- ⏳ 성능 최적화
- ⏳ 크로스 플랫폼 테스트
- ⏳ 설치 프로그램 제작

## 라이선스

MIT License

## 기여

이슈 리포트 및 Pull Request를 환영합니다.

---

**AIFI Recorder Pro** - Professional Screen Recording Solution