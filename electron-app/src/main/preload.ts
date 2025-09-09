import { contextBridge, ipcRenderer } from 'electron';

// IPC API를 렌더러 프로세스에 안전하게 노출
contextBridge.exposeInMainWorld('electronAPI', {
  // 화면 소스 관련
  getScreenSources: () => ipcRenderer.invoke('get-screen-sources'),
  
  // 녹화 제어
  startRecording: (options: any) => ipcRenderer.invoke('start-recording', options),
  stopRecording: () => ipcRenderer.invoke('stop-recording'),
  pauseRecording: () => ipcRenderer.invoke('pause-recording'),
  resumeRecording: () => ipcRenderer.invoke('resume-recording'),
  
  // 녹화 상태
  getRecordingStatus: () => ipcRenderer.invoke('get-recording-status'),
  
  // 화면 영역 선택
  showAreaSelector: () => ipcRenderer.invoke('show-area-selector'),
  
  // 파일 관리
  openRecordingsFolder: () => ipcRenderer.invoke('open-recordings-folder'),
  getRecordingFiles: () => ipcRenderer.invoke('get-recording-files'),
  saveRecordingFile: (filename: string, buffer: ArrayBuffer) => ipcRenderer.invoke('save-recording-file', filename, buffer),
  
  // 이벤트 리스너
  onRecordingStatusChange: (callback: (status: any) => void) => {
    ipcRenderer.on('recording-status-changed', (_event, status) => callback(status));
  },
  
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  }
});

// 타입 정의를 위한 전역 선언
declare global {
  interface Window {
    electronAPI: {
      getScreenSources: () => Promise<Array<{
        id: string;
        name: string;
        thumbnail: string;
      }>>;
      startRecording: (options: {
        sourceId: string;
        sourceType: 'screen' | 'window' | 'area';
        outputFormat: 'mp4' | 'avi' | 'mov';
        quality: 'low' | 'medium' | 'high' | 'ultra';
        fps: number;
        audioSource: 'none' | 'system' | 'microphone' | 'both';
        outputPath?: string;
        area?: {
          x: number;
          y: number;
          width: number;
          height: number;
        };
      }) => Promise<{ success: boolean; error?: string }>;
      stopRecording: () => Promise<{ success: boolean; filePath?: string; error?: string }>;
      pauseRecording: () => Promise<{ success: boolean; error?: string }>;
      resumeRecording: () => Promise<{ success: boolean; error?: string }>;
      getRecordingStatus: () => Promise<{
        isRecording: boolean;
        isPaused: boolean;
        duration: number;
        outputPath?: string;
        fileSize?: number;
      }>;
      showAreaSelector: () => Promise<{
        x: number;
        y: number;
        width: number;
        height: number;
      }>;
      openRecordingsFolder: () => Promise<{
        success: boolean;
        path?: string;
        error?: string;
      }>;
      getRecordingFiles: () => Promise<{
        success: boolean;
        files: Array<{
          name: string;
          path: string;
          size: number;
          createdAt: Date;
          modifiedAt: Date;
        }>;
        error?: string;
      }>;
      saveRecordingFile: (filename: string, buffer: ArrayBuffer) => Promise<{
        success: boolean;
        filePath?: string;
        error?: string;
      }>;
      onRecordingStatusChange: (callback: (status: any) => void) => void;
      removeAllListeners: (channel: string) => void;
    };
  }
}