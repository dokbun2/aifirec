# TOOLBEE CAM - Electron + PWA 통합 가이드

## 🎯 개요
TOOLBEE CAM은 데스크톱(Electron)과 웹(PWA) 모두에서 동작하는 스크린 레코더 애플리케이션입니다.

## 🚀 빠른 시작

### PWA (웹 앱) 테스트

1. **로컬 서버 실행**
```bash
node server.js
```

2. **브라우저에서 접속**
```
http://localhost:8080
```

3. **PWA 설치**
- Chrome/Edge 브라우저 주소창 오른쪽의 설치 아이콘 클릭
- 또는 페이지 하단의 "📥 앱 설치" 버튼 클릭

### Electron 앱 실행

1. **의존성 설치**
```bash
cd electron-app
npm install
```

2. **TypeScript 컴파일**
```bash
npm run build:main
```

3. **개발 모드 실행**
```bash
npm start
```

4. **앱 빌드 (배포용)**
```bash
# Windows
npm run dist:win

# macOS
npm run dist:mac
```

## 📁 프로젝트 구조

```
rec/
├── index.html              # 메인 애플리케이션 (PWA + Electron 공용)
├── manifest.json           # PWA 설정 파일
├── service-worker.js       # 오프라인 지원 및 캐싱
├── server.js              # 테스트용 HTTP 서버
├── generate-icons.html    # 아이콘 생성 도구
├── icons/                 # PWA 및 앱 아이콘
│   └── icon.svg          # 기본 SVG 아이콘
├── electron-app/          # Electron 데스크톱 앱
│   ├── src/
│   │   └── main/
│   │       └── main.ts   # Electron 메인 프로세스
│   └── package.json      # Electron 설정
└── PWA_ELECTRON_GUIDE.md  # 이 파일
```

## 🎨 아이콘 생성

1. `generate-icons.html`을 브라우저에서 열기
2. "아이콘 생성" 클릭
3. "모든 아이콘 다운로드" 클릭
4. 다운로드된 PNG 파일들을 `icons/` 폴더에 저장

## ✨ 주요 기능

### PWA 기능
- ✅ 오프라인 지원 (Service Worker)
- ✅ 홈 화면에 추가
- ✅ 독립 창 모드 (앱처럼 실행)
- ✅ 자동 업데이트
- ✅ 푸시 알림 준비

### Electron 기능
- ✅ 네이티브 데스크톱 앱
- ✅ 시스템 트레이 지원
- ✅ 파일 시스템 접근
- ✅ 전역 단축키
- ✅ 자동 업데이트

### 플랫폼 감지
앱은 자동으로 실행 환경을 감지합니다:

```javascript
const isElectron = navigator.userAgent.includes('Electron');
const isPWA = window.matchMedia('(display-mode: standalone)').matches;

if (isElectron) {
  // Electron 환경
} else if (isPWA) {
  // PWA 환경
} else {
  // 일반 웹 브라우저
}
```

## 🔧 개발 팁

### Service Worker 업데이트
Service Worker 수정 후 브라우저에서 강제 업데이트:
1. F12 → Application → Service Workers
2. "Update on reload" 체크
3. 페이지 새로고침

### PWA 디버깅
Chrome DevTools에서:
- Application 탭 → Manifest: 매니페스트 확인
- Application 탭 → Service Workers: SW 상태 확인
- Network 탭: 캐시 동작 확인

### Electron 디버깅
```javascript
// main.ts에서 DevTools 열기
this.mainWindow.webContents.openDevTools();
```

## 📦 배포

### GitHub Pages (PWA)
1. GitHub에 푸시
2. Settings → Pages → Source 설정
3. `https://[username].github.io/[repo]/` 접속

### Electron 배포
```bash
cd electron-app
npm run dist
```
생성된 파일:
- Windows: `release/*.exe`
- macOS: `release/*.dmg`

## 🌐 브라우저 호환성

### PWA 지원 브라우저
- Chrome 73+
- Edge 79+
- Safari 11.3+ (제한적)
- Firefox 57+ (제한적)

### 권장 브라우저
- Chrome/Edge 최신 버전 (완벽 지원)

## 📝 주의사항

1. **HTTPS 필요**: PWA는 보안 연결(HTTPS) 또는 localhost에서만 동작
2. **아이콘 필수**: PWA 설치를 위해 최소 192x192, 512x512 아이콘 필요
3. **Service Worker 캐시**: 업데이트 시 캐시 버전 변경 필요

## 🆘 문제 해결

### PWA가 설치되지 않음
- manifest.json 경로 확인
- HTTPS 또는 localhost 사용 확인
- 필수 아이콘 파일 존재 확인

### Service Worker 등록 실패
- 브라우저 콘솔에서 에러 확인
- service-worker.js 파일 경로 확인
- CORS 정책 확인

### Electron 앱 실행 안됨
- Node.js 버전 확인 (14+ 권장)
- npm install 실행 확인
- TypeScript 컴파일 확인

## 📖 참고 자료

- [PWA 문서](https://web.dev/progressive-web-apps/)
- [Electron 문서](https://www.electronjs.org/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

Made with ❤️ by TOOLBEE CAM Team