import { useState, useEffect, useCallback } from 'react';
import { mediaRecorderManager } from '../utils/mediaRecorder';

export interface ScreenSource {
  id: string;
  name: string;
  thumbnail: string;
}

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

export const useRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [screenSources, setScreenSources] = useState<ScreenSource[]>([]);
  const [outputPath, setOutputPath] = useState<string>('');

  // 녹화 상태 업데이트를 위한 인터벌
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording && !isPaused) {
      interval = setInterval(async () => {
        try {
          const status = await window.electronAPI.getRecordingStatus();
          setDuration(status.duration);
          if (status.outputPath) {
            setOutputPath(status.outputPath);
          }
        } catch (error) {
          console.error('녹화 상태 업데이트 실패:', error);
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRecording, isPaused]);

  // 화면 소스 가져오기
  const getScreenSources = useCallback(async (): Promise<ScreenSource[]> => {
    try {
      const sources = await window.electronAPI.getScreenSources();
      setScreenSources(sources);
      return sources;
    } catch (error) {
      console.error('화면 소스 가져오기 실패:', error);
      throw error;
    }
  }, []);

  // 녹화 시작
  const startRecording = useCallback(async (options: RecordingOptions): Promise<void> => {
    try {
      console.log('녹화 시작 시도:', options);
      
      // 먼저 메인 프로세스에 상태 알림
      const result = await window.electronAPI.startRecording(options);
      console.log('메인 프로세스 녹화 시작 결과:', result);
      
      if (result.success) {
        // 렌더러 프로세스에서 실제 녹화 시작
        await mediaRecorderManager.startRecording(options);
        
        setIsRecording(true);
        setIsPaused(false);
        setDuration(0);
        console.log('녹화 상태 업데이트 완료');
      } else {
        throw new Error(result.error || '녹화 시작에 실패했습니다.');
      }
    } catch (error) {
      console.error('녹화 시작 실패:', error);
      setIsRecording(false);
      throw error;
    }
  }, []);

  // 녹화 중지
  const stopRecording = useCallback(async (): Promise<string | null> => {
    try {
      // 실제 녹화 중지
      const filename = await mediaRecorderManager.stopRecording();
      
      // 메인 프로세스에 상태 알림
      const result = await window.electronAPI.stopRecording();
      console.log('메인 프로세스 녹화 중지 결과:', result);
      
      setIsRecording(false);
      setIsPaused(false);
      setDuration(0);
      
      return filename;
    } catch (error) {
      console.error('녹화 중지 실패:', error);
      setIsRecording(false);
      throw error;
    }
  }, []);

  // 녹화 일시정지
  const pauseRecording = useCallback(async (): Promise<void> => {
    try {
      // 실제 녹화 일시정지
      mediaRecorderManager.pauseRecording();
      
      // 메인 프로세스에 상태 알림
      const result = await window.electronAPI.pauseRecording();
      console.log('메인 프로세스 일시정지 결과:', result);
      
      if (result.success) {
        setIsPaused(true);
      } else {
        throw new Error(result.error || '녹화 일시정지에 실패했습니다.');
      }
    } catch (error) {
      console.error('녹화 일시정지 실패:', error);
      throw error;
    }
  }, []);

  // 녹화 재개
  const resumeRecording = useCallback(async (): Promise<void> => {
    try {
      // 실제 녹화 재개
      mediaRecorderManager.resumeRecording();
      
      // 메인 프로세스에 상태 알림
      const result = await window.electronAPI.resumeRecording();
      console.log('메인 프로세스 재개 결과:', result);
      
      if (result.success) {
        setIsPaused(false);
      } else {
        throw new Error(result.error || '녹화 재개에 실패했습니다.');
      }
    } catch (error) {
      console.error('녹화 재개 실패:', error);
      throw error;
    }
  }, []);

  // 화면 영역 선택
  const selectArea = useCallback(async () => {
    try {
      const area = await window.electronAPI.showAreaSelector();
      return area;
    } catch (error) {
      console.error('화면 영역 선택 실패:', error);
      throw error;
    }
  }, []);

  return {
    isRecording,
    isPaused,
    duration,
    screenSources,
    outputPath,
    getScreenSources,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    selectArea,
  };
};