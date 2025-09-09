# AIFI CAM - 웹 기반 화면 녹화 앱

AIFI CAM은 브라우저에서 직접 실행되는 화면 녹화 애플리케이션입니다. Bandicam 스타일의 UI를 제공하며, 설치 없이 웹에서 바로 사용할 수 있습니다.

## 🚀 주요 기능

- 🎥 화면 녹화 (전체 화면, 특정 창, 브라우저 탭)
- ⏸️ 일시정지/재개 기능
- 📁 녹화 히스토리 관리
- ⚙️ 커스터마이징 가능한 설정
- ⌨️ 단축키 지원
- 🎬 WebM 형식으로 자동 다운로드

## 💻 기술 스택

- HTML5
- CSS3
- JavaScript (Vanilla)
- MediaRecorder API
- Lucide Icons

## 🌐 브라우저 지원

화면 녹화 기능은 다음 브라우저에서 지원됩니다:

- Chrome 72+
- Edge 79+
- Firefox 66+
- Safari 14.1+ (macOS)
- Opera 60+

## ⚠️ 제한사항

웹 브라우저에서 실행되는 특성상 다음과 같은 제한사항이 있습니다:

1. **HTTPS 필수**: 화면 공유 API는 보안 연결(HTTPS)에서만 작동합니다
2. **시스템 오디오**: 일부 브라우저/OS에서 시스템 오디오 캡처가 제한됩니다
3. **파일 저장**: 브라우저 보안 정책으로 자동 저장 경로 지정이 불가능합니다
4. **코덱 제한**: WebM 형식만 지원됩니다

## 📦 배포 방법

### GitHub Pages
```bash
git add .
git commit -m "Initial commit"
git push origin main
# GitHub 설정에서 Pages 활성화
```

### Netlify
1. GitHub 리포지토리 연결
2. Build command: 비워두기
3. Publish directory: `/`
4. 자동 배포 활성화

### Vercel
```bash
vercel --prod
```

## 🔒 보안 고려사항

- 모든 녹화는 로컬에서 처리됩니다
- 서버로 데이터가 전송되지 않습니다
- 브라우저의 화면 공유 권한 요청을 승인해야 합니다

## 📝 라이선스

MIT License

## 🤝 기여

Issues와 Pull Requests를 환영합니다!

---

Made with ❤️ by AIFI