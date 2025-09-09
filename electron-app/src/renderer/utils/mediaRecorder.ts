import { RecordingOptions } from '../types/recording';

export class MediaRecorderManager {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  async startRecording(options: RecordingOptions): Promise<void> {
    try {
      console.log('MediaRecorderManager: 녹화 시작 요청', options);

      // 권한 확인
      console.log('Navigator 확인:', !!navigator.mediaDevices);
      console.log('getUserMedia 확인:', !!navigator.mediaDevices?.getUserMedia);

      // 화면 캡처 스트림 가져오기
      console.log('미디어 스트림 요청 중...');
      this.stream = await this.getMediaStream(options);
      console.log('미디어 스트림 획득 성공:', this.stream);
      
      // MediaRecorder 설정
      const mimeType = this.getMimeType(options.outputFormat);
      
      // 지원되는 mimeType 확인
      let finalMimeType = mimeType;
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        console.warn(`${mimeType}가 지원되지 않습니다. webm으로 대체합니다.`);
        finalMimeType = 'video/webm;codecs=vp9';
        if (!MediaRecorder.isTypeSupported(finalMimeType)) {
          finalMimeType = 'video/webm';
        }
      }

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: finalMimeType,
        videoBitsPerSecond: this.getBitrate(options.quality)
      });

      this.recordedChunks = [];

      // 데이터 수집 이벤트 리스너
      this.mediaRecorder.ondataavailable = (event) => {
        console.log('데이터 수신:', event.data.size, 'bytes');
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      // 녹화 시작 이벤트
      this.mediaRecorder.onstart = () => {
        console.log('MediaRecorder 시작됨');
      };

      // 녹화 완료 이벤트 리스너
      this.mediaRecorder.onstop = () => {
        console.log('MediaRecorder 중지됨, 데이터 저장 중...');
        this.saveRecording(options);
      };

      // 에러 이벤트 리스너
      this.mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder 에러:', event);
      };

      // 녹화 시작 (500ms마다 데이터 수집)
      this.mediaRecorder.start(500);
      console.log('MediaRecorder 시작 완료');

    } catch (error: any) {
      console.error('녹화 시작 실패:', error);
      this.cleanup();
      throw new Error(`녹화 시작에 실패했습니다: ${error.message}`);
    }
  }

  async stopRecording(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('진행 중인 녹화가 없습니다.'));
        return;
      }

      console.log('녹화 중지 요청');

      // 저장 완료 후 resolve
      this.mediaRecorder.onstop = () => {
        console.log('녹화 중지 및 저장 완료');
        const filename = `recording-${Date.now()}.webm`;
        this.cleanup();
        resolve(filename);
      };

      this.mediaRecorder.stop();
      
      // 모든 트랙 중지
      if (this.stream) {
        this.stream.getTracks().forEach(track => {
          track.stop();
        });
      }
    });
  }

  pauseRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
      console.log('녹화 일시정지');
    }
  }

  resumeRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
      console.log('녹화 재개');
    }
  }

  private async getMediaStream(options: RecordingOptions): Promise<MediaStream> {
    console.log('getMediaStream 호출됨:', options.sourceType);
    
    if (options.sourceType === 'area') {
      return this.getAreaMediaStream(options);
    }

    const constraints: any = {
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: options.sourceId,
          ...this.getVideoConstraints(options)
        }
      }
    };

    console.log('Video constraints:', constraints.video);

    // 오디오 설정
    if (options.audioSource !== 'none') {
      if (options.audioSource === 'system') {
        constraints.audio = {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: options.sourceId
          }
        };
      } else if (options.audioSource === 'microphone') {
        // 마이크 오디오는 별도로 처리
        try {
          const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          console.log('마이크 스트림 획득 성공');
        } catch (error) {
          console.warn('마이크 접근 실패:', error);
        }
      } else if (options.audioSource === 'both') {
        constraints.audio = {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: options.sourceId
          }
        };
      }
    }

    try {
      console.log('getUserMedia 호출 중...');
      const stream = await (navigator.mediaDevices as any).getUserMedia(constraints);
      console.log('미디어 스트림 획득:', stream.getTracks().length, '개 트랙');
      
      // 트랙 정보 출력
      stream.getTracks().forEach((track, index) => {
        console.log(`트랙 ${index}:`, track.kind, track.label, track.readyState);
      });
      
      return stream;
    } catch (error) {
      console.error('getUserMedia 실패:', error);
      throw error;
    }
  }

  private async getAreaMediaStream(options: RecordingOptions): Promise<MediaStream> {
    // 화면 영역 선택의 경우, 전체 화면을 캡처한 후 Canvas로 영역만 추출
    console.log('영역 선택 녹화 시작:', options.area);
    
    // 먼저 전체 화면 스트림 획득
    const sources = await window.electronAPI.getScreenSources();
    const screenSource = sources.find(source => source.type === 'screen');
    
    if (!screenSource) {
      throw new Error('화면 소스를 찾을 수 없습니다.');
    }

    const constraints: any = {
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: screenSource.id,
          ...this.getVideoConstraints(options)
        }
      }
    };

    // 오디오 설정
    if (options.audioSource !== 'none') {
      if (options.audioSource === 'system') {
        constraints.audio = {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: screenSource.id
          }
        };
      } else if (options.audioSource === 'microphone') {
        // 마이크 오디오는 별도로 처리
        try {
          const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          console.log('마이크 스트림 획득 성공');
        } catch (error) {
          console.warn('마이크 접근 실패:', error);
        }
      } else if (options.audioSource === 'both') {
        constraints.audio = {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: screenSource.id
          }
        };
      }
    }

    const fullStream = await (navigator.mediaDevices as any).getUserMedia(constraints);
    
    // 영역 크롭은 Canvas를 사용해서 구현
    // 현재는 전체 화면 스트림을 반환 (실제 크롭 기능은 추후 구현)
    console.log('전체 화면 스트림으로 대체 (영역 크롭 기능 개발 중)');
    
    return fullStream;
  }

  private getVideoConstraints(options: RecordingOptions): any {
    const constraints: any = {
      minFrameRate: options.fps,
      maxFrameRate: options.fps
    };

    switch (options.quality) {
      case 'ultra':
        constraints.minWidth = 3840;
        constraints.minHeight = 2160;
        constraints.maxWidth = 3840;
        constraints.maxHeight = 2160;
        break;
      case 'high':
        constraints.minWidth = 1920;
        constraints.minHeight = 1080;
        constraints.maxWidth = 1920;
        constraints.maxHeight = 1080;
        break;
      case 'medium':
        constraints.minWidth = 1280;
        constraints.minHeight = 720;
        constraints.maxWidth = 1280;
        constraints.maxHeight = 720;
        break;
      case 'low':
        constraints.minWidth = 854;
        constraints.minHeight = 480;
        constraints.maxWidth = 854;
        constraints.maxHeight = 480;
        break;
    }

    return constraints;
  }

  private getMimeType(format: string): string {
    switch (format) {
      case 'mp4':
        return 'video/mp4;codecs=h264';
      case 'mov':
        return 'video/mp4;codecs=h264'; // MOV는 MP4와 유사하게 처리
      default:
        return 'video/webm;codecs=vp9';
    }
  }

  private getBitrate(quality: string): number {
    switch (quality) {
      case 'ultra':
        return 8000000; // 8 Mbps
      case 'high':
        return 4000000; // 4 Mbps
      case 'medium':
        return 2000000; // 2 Mbps
      case 'low':
        return 1000000; // 1 Mbps
      default:
        return 2000000;
    }
  }

  private async saveRecording(options: RecordingOptions): Promise<void> {
    if (this.recordedChunks.length === 0) {
      console.error('저장할 데이터가 없습니다.');
      return;
    }

    console.log('녹화 데이터 저장 중...', this.recordedChunks.length, '개 청크');

    try {
      const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
      
      // ArrayBuffer로 변환
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      
      // Electron을 통해 파일 저장 요청
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `screen-recording-${timestamp}.webm`;
      
      // 실제 파일 저장은 메인 프로세스에 요청
      await this.saveFile(filename, buffer);
      
      console.log('녹화 파일 저장 완료:', filename);
    } catch (error) {
      console.error('파일 저장 실패:', error);
    }
  }

  private async saveFile(filename: string, buffer: Uint8Array): Promise<void> {
    try {
      // IPC를 통해 메인 프로세스에 파일 저장 요청
      const result = await window.electronAPI.saveRecordingFile(filename, buffer.buffer);
      
      if (result.success) {
        console.log('파일 저장 완료:', result.filePath);
      } else {
        throw new Error(result.error || '파일 저장 실패');
      }
    } catch (error) {
      console.error('IPC 파일 저장 실패:', error);
      // 브라우저 다운로드로 대체
      this.downloadFile(filename, buffer);
    }
  }

  private downloadFile(filename: string, buffer: Uint8Array): void {
    const blob = new Blob([buffer], { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
  }

  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    this.mediaRecorder = null;
    this.recordedChunks = [];
  }

  isRecording(): boolean {
    return this.mediaRecorder !== null && this.mediaRecorder.state === 'recording';
  }

  isPaused(): boolean {
    return this.mediaRecorder !== null && this.mediaRecorder.state === 'paused';
  }
}

// 전역 인스턴스
export const mediaRecorderManager = new MediaRecorderManager();