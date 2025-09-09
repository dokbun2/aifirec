# 배포 가이드

## 1. GitHub에 푸시하기

1. GitHub에서 새 리포지토리 생성:
   - 리포지토리 이름: `aifi-cam` (또는 원하는 이름)
   - Public으로 설정
   - README 파일 추가하지 않기 (이미 있음)

2. 터미널에서 다음 명령 실행:
```bash
# GitHub 리포지토리 연결 (YOUR_USERNAME을 실제 GitHub 사용자명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/aifi-cam.git

# 코드 푸시
git push -u origin main
```

## 2. Netlify 배포

### 방법 1: GitHub 연동 (추천)
1. [Netlify](https://www.netlify.com) 접속 및 로그인
2. "Add new site" → "Import an existing project" 클릭
3. GitHub 선택 및 권한 승인
4. `aifi-cam` 리포지토리 선택
5. 배포 설정:
   - Build command: (비워두기)
   - Publish directory: `/` 또는 `.`
6. "Deploy site" 클릭

### 방법 2: 수동 배포
1. [Netlify Drop](https://app.netlify.com/drop) 접속
2. 프로젝트 폴더를 드래그 앤 드롭
3. 자동으로 배포됨

## 3. 중요 사항

### ⚠️ HTTPS 필수
- 화면 공유 API는 HTTPS에서만 작동합니다
- Netlify는 자동으로 HTTPS를 제공합니다
- 로컬 테스트는 `localhost`에서 가능합니다

### 📱 브라우저 호환성
- Chrome, Edge, Firefox, Safari 14.1+ 지원
- 모바일 브라우저는 화면 녹화 미지원

### 🔧 환경 설정
- 설정은 브라우저 localStorage에 저장됩니다
- 녹화 파일은 사용자 다운로드 폴더에 저장됩니다

## 4. 커스텀 도메인 설정 (선택사항)

1. Netlify 대시보드에서 "Domain settings" 클릭
2. "Add custom domain" 클릭
3. 도메인 입력 및 DNS 설정 안내 따르기

## 5. 배포 후 URL

배포가 완료되면 다음과 같은 URL로 접속 가능:
- Netlify: `https://YOUR-SITE-NAME.netlify.app`
- 커스텀 도메인: `https://your-domain.com`

## 문제 해결

### 화면 공유가 안 되는 경우
- HTTPS로 접속했는지 확인
- 브라우저 권한 설정 확인
- 지원되는 브라우저인지 확인

### 녹화 파일이 저장되지 않는 경우
- 브라우저 다운로드 설정 확인
- 디스크 공간 확인

### 설정이 저장되지 않는 경우
- localStorage가 활성화되어 있는지 확인
- 시크릿 모드에서는 설정이 저장되지 않음