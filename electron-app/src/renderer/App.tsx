import React, { useState, useEffect } from 'react';
import { Box, Typography, ThemeProvider, createTheme, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import MainPanel from './components/MainPanel';
import SettingsPanel from './components/SettingsPanel';
import RecordingStatus from './components/RecordingStatus';
import AreaSelector from './components/AreaSelector';
import RecordingFiles from './components/RecordingFiles';
import { useRecording } from './hooks/useRecording';
import { RecordingSettings } from './types/recording';

// Apple-style 다크 테마
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#007AFF',
      light: '#409CFF',
      dark: '#0056CC',
    },
    secondary: {
      main: '#FF9500',
      light: '#FFAD33',
      dark: '#CC7700',
    },
    background: {
      default: '#000000',
      paper: '#1C1C1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#8E8E93',
    },
    divider: '#38383A',
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    subtitle1: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1C1C1E',
          backgroundImage: 'none',
          border: '1px solid #38383A',
        },
      },
    },
  },
});

const AppContainer = styled(Box)(() => ({
  minHeight: '100vh',
  height: '100vh',
  background: '#000000',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(3),
  paddingTop: theme.spacing(2),
  WebkitAppRegion: 'drag',  // 드래그 가능한 영역으로 설정
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  cursor: 'move',  // 드래그 커서 표시
}));

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'main' | 'settings' | 'files'>('main');
  const [showAreaSelector, setShowAreaSelector] = useState(false);
  const [settings, setSettings] = useState<RecordingSettings>({
    outputFormat: 'mp4',
    quality: 'high',
    fps: 30,
    audioSource: 'system',
    outputPath: '',
  });

  const {
    isRecording,
    isPaused,
    duration,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    getScreenSources,
    screenSources
  } = useRecording();

  useEffect(() => {
    // 앱 시작 시 화면 소스 로드
    loadScreenSources();
  }, []);

  const loadScreenSources = async () => {
    try {
      await getScreenSources();
    } catch (error) {
      console.error('화면 소스 로드 실패:', error);
    }
  };

  const handleSettingsChange = (newSettings: RecordingSettings) => {
    setSettings(newSettings);
  };

  const handleStartRecording = async (sourceId: string, sourceType: 'screen' | 'window' | 'area') => {
    if (sourceType === 'area') {
      setShowAreaSelector(true);
      return;
    }

    const recordingOptions = {
      sourceId,
      sourceType,
      outputFormat: settings.outputFormat,
      quality: settings.quality,
      fps: settings.fps,
      audioSource: settings.audioSource,
      outputPath: settings.outputPath,
    };

    try {
      await startRecording(recordingOptions);
    } catch (error) {
      console.error('녹화 시작 실패:', error);
    }
  };

  const handleAreaSelect = async (area: { x: number; y: number; width: number; height: number }) => {
    setShowAreaSelector(false);
    
    const recordingOptions = {
      sourceId: 'area-selection',
      sourceType: 'area' as const,
      outputFormat: settings.outputFormat,
      quality: settings.quality,
      fps: settings.fps,
      audioSource: settings.audioSource,
      outputPath: settings.outputPath,
      area,
    };

    try {
      await startRecording(recordingOptions);
    } catch (error) {
      console.error('영역 녹화 시작 실패:', error);
    }
  };

  const handleAreaSelectCancel = () => {
    setShowAreaSelector(false);
  };

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / 60000) % 60;
    const hours = Math.floor(ms / 3600000);

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <AppContainer>
        <HeaderContainer>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', letterSpacing: '1px' }}>
            TOOLBEE CAM
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, WebkitAppRegion: 'no-drag' }}>
              <Button 
                variant="contained" 
                size="small" 
                sx={{ 
                  backgroundColor: '#007AFF', 
                  fontSize: '0.75rem',
                  px: 2,
                  py: 0.5,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  WebkitAppRegion: 'no-drag',  // 버튼을 클릭 가능하게 설정
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#0056CC' }
                }}
              >
                PRO 업그레이드
              </Button>
            </Box>
          </Box>
        </HeaderContainer>

      <Box 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          px: 2,
          pb: 1,
          width: '100%',
          height: '100%',
        }}
      >
        {isRecording && (
          <RecordingStatus
            isRecording={isRecording}
            isPaused={isPaused}
            duration={formatDuration(duration)}
            onStop={stopRecording}
            onPause={pauseRecording}
            onResume={resumeRecording}
          />
        )}

        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {currentView === 'main' ? (
            <MainPanel
              screenSources={screenSources}
              isRecording={isRecording}
              onStartRecording={handleStartRecording}
              onStopRecording={stopRecording}
              onPauseRecording={pauseRecording}
              onRefreshSources={loadScreenSources}
              onOpenSettings={() => setCurrentView('settings')}
              onOpenFiles={() => setCurrentView('files')}
            />
          ) : currentView === 'settings' ? (
            <SettingsPanel
              settings={settings}
              onSettingsChange={handleSettingsChange}
              onBack={() => setCurrentView('main')}
            />
          ) : (
            <RecordingFiles
              onClose={() => setCurrentView('main')}
            />
          )}
        </Box>
      </Box>
      
      <AreaSelector
        isVisible={showAreaSelector}
        onAreaSelect={handleAreaSelect}
        onCancel={handleAreaSelectCancel}
      />
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;