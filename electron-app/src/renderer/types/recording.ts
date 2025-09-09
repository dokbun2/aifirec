export interface RecordingSettings {
  outputFormat: 'mp4' | 'avi' | 'mov';
  quality: 'low' | 'medium' | 'high' | 'ultra';
  fps: number;
  audioSource: 'none' | 'system' | 'microphone' | 'both';
  outputPath: string;
}

export interface ScreenSource {
  id: string;
  name: string;
  thumbnail: string;
  type?: 'screen' | 'window';
}

export interface RecordingArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RecordingOptions {
  sourceId: string;
  sourceType: 'screen' | 'window' | 'area';
  outputFormat: 'mp4' | 'avi' | 'mov';
  quality: 'low' | 'medium' | 'high' | 'ultra';
  fps: number;
  audioSource: 'none' | 'system' | 'microphone' | 'both';
  outputPath?: string;
  area?: RecordingArea;
}

export interface RecordingStatus {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  outputPath?: string;
  fileSize?: number;
}

export type RecordingMode = 'screen' | 'window' | 'area';