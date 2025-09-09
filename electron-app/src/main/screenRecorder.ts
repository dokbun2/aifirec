import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';

export interface RecordingOptions {
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
}

export interface RecordingStatus {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  outputPath?: string;
  fileSize?: number;
}

export class ScreenRecorder {
  private isRecording = false;
  private isPaused = false;
  private startTime = 0;
  private pausedTime = 0;
  private pausedDuration = 0;
  private currentOutputPath = '';
  private currentOptions: RecordingOptions | null = null;

  constructor() {
    this.setupDirectories();
  }

  private setupDirectories(): void {
    const userDataPath = app.getPath('userData');
    const recordingsPath = path.join(userDataPath, 'recordings');
    
    if (!fs.existsSync(recordingsPath)) {
      fs.mkdirSync(recordingsPath, { recursive: true });
    }
  }

  private generateOutputPath(format: string): string {
    const userDataPath = app.getPath('userData');
    const recordingsPath = path.join(userDataPath, 'recordings');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `screen-recording-${timestamp}.${format}`;
    
    return path.join(recordingsPath, filename);
  }

  async startRecording(options: RecordingOptions): Promise<void> {
    if (this.isRecording) {
      throw new Error('이미 녹화가 진행 중입니다.');
    }

    try {
      this.currentOptions = options;
      this.currentOutputPath = options.outputPath || this.generateOutputPath(options.outputFormat);
      this.isRecording = true;
      this.isPaused = false;
      this.startTime = Date.now();
      this.pausedDuration = 0;

      console.log('녹화 시작:', this.currentOutputPath);
      console.log('녹화 옵션:', options);
      
      // 녹화는 실제로 렌더러 프로세스에서 처리됩니다.
      // 여기서는 상태만 관리합니다.
      
    } catch (error: any) {
      console.error('녹화 시작 실패:', error);
      this.cleanup();
      throw new Error(`녹화 시작에 실패했습니다: ${error.message}`);
    }
  }

  async stopRecording(): Promise<string> {
    if (!this.isRecording) {
      throw new Error('진행 중인 녹화가 없습니다.');
    }

    try {
      console.log('녹화 중지');
      
      const outputPath = this.currentOutputPath;
      this.cleanup();
      
      return outputPath;
    } catch (error: any) {
      console.error('녹화 중지 실패:', error);
      throw error;
    }
  }

  async pauseRecording(): Promise<void> {
    if (!this.isRecording || this.isPaused) {
      throw new Error('일시정지할 수 있는 녹화가 없습니다.');
    }

    this.isPaused = true;
    this.pausedTime = Date.now();
    console.log('녹화 일시정지');
  }

  async resumeRecording(): Promise<void> {
    if (!this.isRecording || !this.isPaused) {
      throw new Error('재개할 수 있는 녹화가 없습니다.');
    }

    this.isPaused = false;
    this.pausedDuration += Date.now() - this.pausedTime;
    console.log('녹화 재개');
  }

  private cleanup(): void {
    this.isRecording = false;
    this.isPaused = false;
    this.currentOptions = null;
    this.currentOutputPath = '';
    this.pausedDuration = 0;
  }

  getStatus(): RecordingStatus {
    let duration = 0;
    
    if (this.isRecording) {
      if (this.isPaused) {
        duration = this.pausedTime - this.startTime - this.pausedDuration;
      } else {
        duration = Date.now() - this.startTime - this.pausedDuration;
      }
    }

    let fileSize = 0;
    if (this.currentOutputPath && fs.existsSync(this.currentOutputPath)) {
      fileSize = fs.statSync(this.currentOutputPath).size;
    }

    return {
      isRecording: this.isRecording,
      isPaused: this.isPaused,
      duration,
      outputPath: this.currentOutputPath,
      fileSize
    };
  }
}