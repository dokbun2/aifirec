import { app, BrowserWindow, ipcMain, desktopCapturer, Menu, shell, systemPreferences } from 'electron';
import * as path from 'path';
import { ScreenRecorder } from './screenRecorder';

class ScreenRecorderApp {
  private mainWindow: BrowserWindow | null = null;
  private screenRecorder: ScreenRecorder;

  constructor() {
    this.screenRecorder = new ScreenRecorder();
    this.initializeApp();
  }

  private initializeApp(): void {
    // 앱이 준비되면 메인 윈도우 생성
    app.whenReady().then(() => {
      this.checkPermissions();
      this.createMainWindow();
      this.setupIpcHandlers();
      this.createAppMenu();

      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createMainWindow();
        }
      });
    });

    // 모든 윈도우가 닫히면 앱 종료 (macOS 제외)
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    // 앱 종료 시 녹화 중지
    app.on('before-quit', () => {
      this.screenRecorder.stopRecording();
    });
  }

  private async checkPermissions(): Promise<void> {
    if (process.platform === 'darwin') {
      try {
        // macOS에서 화면 캡처 권한 확인
        const status = systemPreferences.getMediaAccessStatus('screen');
        console.log('화면 캡처 권한 상태:', status);
        
        if (status === 'not-determined') {
          console.log('화면 캡처 권한 요청 중...');
          // 권한 요청은 사용자가 직접 시스템 환경설정에서 해야 함
        }
      } catch (error) {
        console.error('권한 확인 실패:', error);
      }
    }
  }

  private createMainWindow(): void {
    // 메인 윈도우 생성
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 900,
      minHeight: 600,
      center: true,
      resizable: true,
      minimizable: true,
      maximizable: true,
      fullscreenable: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
        webSecurity: false,
        allowRunningInsecureContent: true,
      },
      show: true,
      useContentSize: false,
      backgroundColor: '#1A1A1A',
    });

    // 개발 환경과 프로덕션 환경에 따른 URL 로드
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
      this.mainWindow.loadURL('http://localhost:4000');
      // this.mainWindow.webContents.openDevTools(); // 개발자 도구 자동 열기 비활성화
    } else {
      this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    }

    // 창 생성 직후 크기 설정
    console.log('윈도우 생성 완료');
    this.mainWindow.setMinimumSize(900, 600);
    this.mainWindow.setSize(1200, 800);
    this.mainWindow.center();
    
    // 강제 크기 설정 - 주기적으로 확인
    const forceResize = () => {
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        const bounds = this.mainWindow.getBounds();
        console.log('현재 크기:', bounds.width, 'x', bounds.height);
        
        if (bounds.width !== 1200 || bounds.height !== 800) {
          console.log('크기 강제 재설정!');
          this.mainWindow.setSize(1200, 800);
          this.mainWindow.center();
        }
      }
    };
    
    // 1초마다 크기 확인 (5번만)
    let checkCount = 0;
    const resizeInterval = setInterval(() => {
      forceResize();
      checkCount++;
      if (checkCount >= 5) {
        clearInterval(resizeInterval);
      }
    }, 1000);
    
    // 윈도우가 준비되면 추가 설정
    this.mainWindow.once('ready-to-show', () => {
      if (!this.mainWindow) return;
      
      console.log('ready-to-show 이벤트 발생');
      forceResize();
      
      setTimeout(() => {
        forceResize();
      }, 500);
    });

    // 윈도우가 닫히면 null로 설정
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  private setupIpcHandlers(): void {
    // 화면 소스 가져오기
    ipcMain.handle('get-screen-sources', async () => {
      try {
        const sources = await desktopCapturer.getSources({
          types: ['window', 'screen'],
          thumbnailSize: { width: 320, height: 240 },
          fetchWindowIcons: true
        });
        console.log('화면 소스 가져옴:', sources.length, '개');
        return sources.map(source => ({
          id: source.id,
          name: source.name,
          thumbnail: source.thumbnail.toDataURL(),
          type: source.name.includes('Screen') || source.name.includes('Display') ? 'screen' : 'window'
        }));
      } catch (error: any) {
        console.error('화면 소스 가져오기 실패:', error);
        throw error;
      }
    });

    // 녹화 시작
    ipcMain.handle('start-recording', async (_event, options) => {
      try {
        console.log('녹화 시작 요청:', options);
        await this.screenRecorder.startRecording(options);
        return { success: true, message: '녹화가 시작되었습니다' };
      } catch (error: any) {
        console.error('녹화 시작 실패:', error);
        return { success: false, error: error.message };
      }
    });

    // 녹화 중지
    ipcMain.handle('stop-recording', async () => {
      try {
        console.log('녹화 중지 요청');
        const filePath = await this.screenRecorder.stopRecording();
        return { success: true, filePath, message: '녹화가 중지되었습니다' };
      } catch (error: any) {
        console.error('녹화 중지 실패:', error);
        return { success: false, error: error.message };
      }
    });

    // 녹화 일시정지/재개
    ipcMain.handle('pause-recording', async () => {
      try {
        console.log('녹화 일시정지 요청');
        await this.screenRecorder.pauseRecording();
        return { success: true, message: '녹화가 일시정지되었습니다' };
      } catch (error: any) {
        console.error('녹화 일시정지 실패:', error);
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle('resume-recording', async () => {
      try {
        console.log('녹화 재개 요청');
        await this.screenRecorder.resumeRecording();
        return { success: true, message: '녹화가 재개되었습니다' };
      } catch (error: any) {
        console.error('녹화 재개 실패:', error);
        return { success: false, error: error.message };
      }
    });

    // 녹화 상태 가져오기
    ipcMain.handle('get-recording-status', () => {
      return this.screenRecorder.getStatus();
    });

    // 화면 영역 선택을 위한 윈도우 생성
    ipcMain.handle('show-area-selector', async () => {
      // TODO: 화면 영역 선택 윈도우 구현
      return { x: 0, y: 0, width: 1920, height: 1080 };
    });

    // 녹화 폴더 열기
    ipcMain.handle('open-recordings-folder', async () => {
      try {
        const userDataPath = app.getPath('userData');
        const recordingsPath = path.join(userDataPath, 'recordings');
        
        // 폴더가 없으면 생성
        const fs = require('fs');
        if (!fs.existsSync(recordingsPath)) {
          fs.mkdirSync(recordingsPath, { recursive: true });
        }
        
        // 시스템 기본 파일 관리자로 폴더 열기
        await shell.openPath(recordingsPath);
        return { success: true, path: recordingsPath };
      } catch (error: any) {
        console.error('폴더 열기 실패:', error);
        return { success: false, error: error.message };
      }
    });

    // 녹화 파일 목록 가져오기
    ipcMain.handle('get-recording-files', async () => {
      try {
        const userDataPath = app.getPath('userData');
        const recordingsPath = path.join(userDataPath, 'recordings');
        const fs = require('fs');
        
        if (!fs.existsSync(recordingsPath)) {
          return { success: true, files: [] };
        }
        
        const files = fs.readdirSync(recordingsPath)
          .filter((file: string) => file.endsWith('.mp4') || file.endsWith('.avi') || file.endsWith('.mov') || file.endsWith('.webm'))
          .map((file: string) => {
            const filePath = path.join(recordingsPath, file);
            const stats = fs.statSync(filePath);
            return {
              name: file,
              path: filePath,
              size: stats.size,
              createdAt: stats.birthtime,
              modifiedAt: stats.mtime
            };
          })
          .sort((a: any, b: any) => b.createdAt - a.createdAt); // 최신순 정렬
        
        return { success: true, files };
      } catch (error: any) {
        console.error('파일 목록 가져오기 실패:', error);
        return { success: false, error: error.message, files: [] };
      }
    });

    // 녹화 파일 저장
    ipcMain.handle('save-recording-file', async (_event, filename: string, buffer: ArrayBuffer) => {
      try {
        const userDataPath = app.getPath('userData');
        const recordingsPath = path.join(userDataPath, 'recordings');
        const filePath = path.join(recordingsPath, filename);
        
        console.log('파일 저장 시작:', filePath);
        
        // 디렉토리가 없으면 생성
        const fs = require('fs');
        if (!fs.existsSync(recordingsPath)) {
          fs.mkdirSync(recordingsPath, { recursive: true });
        }
        
        // Buffer로 변환하여 저장
        const nodeBuffer = Buffer.from(buffer);
        fs.writeFileSync(filePath, nodeBuffer);
        
        console.log('파일 저장 완료:', filePath);
        return { success: true, filePath };
      } catch (error: any) {
        console.error('파일 저장 실패:', error);
        return { success: false, error: error.message };
      }
    });
  }

  private createAppMenu(): void {
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: 'AIFI Recorder Pro',
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      },
      {
        label: '편집',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'selectAll' }
        ]
      },
      {
        label: '보기',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        label: '윈도우',
        submenu: [
          { role: 'minimize' },
          { role: 'close' }
        ]
      }
    ];

    if (process.platform === 'darwin') {
      const menu = Menu.buildFromTemplate(template);
      Menu.setApplicationMenu(menu);
    } else {
      Menu.setApplicationMenu(null);
    }
  }
}

// 앱 인스턴스 생성
new ScreenRecorderApp();