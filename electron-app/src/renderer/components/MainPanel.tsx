import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  IconButton,
  Tooltip,
  Chip,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material';
import {
  Monitor,
  Crop,
  RectangleHorizontal,
  Settings,
  RotateCcw,
  Play,
  Pause,
  Square,
  Folder,
  Mouse,
  Keyboard,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { styled } from '@mui/material/styles';
import { ScreenSource, RecordingMode } from '../types/recording';

const ModeButton = styled(Button)<{ selected?: boolean }>(({ theme, selected }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(1),
  minWidth: '120px',
  width: '120px',
  height: '100px',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  backgroundColor: selected 
    ? '#4A4A4A'
    : '#3A3A3A',
  color: '#FFFFFF',
  border: '1px solid #5A5A5A',
  borderRadius: 8,
  '&:hover': {
    backgroundColor: selected 
      ? '#555555'
      : '#454545',
    transform: 'scale(1.02)',
  },
  transition: 'all 0.2s ease',
}));

const RecordButton = styled(Button)<{ isRecording?: boolean }>(({ theme, isRecording }) => ({
  minWidth: '100px',
  height: '100px',
  borderRadius: '50%',
  width: '100px',
  backgroundColor: isRecording ? '#FF3B30' : '#E53E3E',
  color: '#FFFFFF',
  border: '3px solid #FF6B6B',
  '&:hover': {
    backgroundColor: isRecording ? '#D70015' : '#D53F3F',
    transform: 'scale(1.05)',
  },
  '&:disabled': {
    backgroundColor: '#8E8E93',
    border: '3px solid #A0A0A0',
  },
  transition: 'all 0.2s ease',
  fontSize: '1.4rem',
  fontWeight: 'bold',
  boxShadow: '0 4px 12px rgba(229, 62, 62, 0.4)',
}));

const SourceCard = styled(Card)<{ selected?: boolean }>(({ theme, selected }) => ({
  cursor: 'pointer',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundColor: selected 
    ? 'rgba(0, 122, 255, 0.2)' 
    : '#1C1C1E',
  border: selected 
    ? `2px solid ${theme.palette.primary.main}` 
    : '1px solid #38383A',
  borderRadius: 8,
  position: 'relative',
  '&:hover': {
    transform: 'scale(1.02)',
    backgroundColor: selected 
      ? 'rgba(0, 122, 255, 0.3)' 
      : '#2C2C2E',
    boxShadow: selected 
      ? `0 0 0 1px ${theme.palette.primary.main}` 
      : '0 0 0 1px #48484A',
  },
}));

const ThumbnailImage = styled('img')({
  width: '100%',
  height: '180px',
  objectFit: 'cover',
  borderRadius: '8px',
  border: '1px solid #38383A',
});

interface MainPanelProps {
  screenSources: ScreenSource[];
  isRecording: boolean;
  onStartRecording: (sourceId: string, sourceType: RecordingMode) => void;
  onStopRecording: () => void;
  onPauseRecording: () => void;
  onRefreshSources: () => void;
  onOpenSettings: () => void;
  onOpenFiles: () => void;
}

const MainPanel: React.FC<MainPanelProps> = ({
  screenSources,
  isRecording,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onRefreshSources,
  onOpenSettings,
  onOpenFiles,
}) => {
  const [selectedMode, setSelectedMode] = useState<RecordingMode>('screen');
  const [selectedSource, setSelectedSource] = useState<string>('');

  const modes = [
    {
      type: 'area' as RecordingMode,
      label: '화면 영역',
      icon: <Crop size={32} />,
      description: '선택 영역 녹화',
    },
    {
      type: 'screen' as RecordingMode,
      label: '전체 화면',
      icon: <Monitor size={32} />,
      description: '전체 화면 녹화',
    },
    {
      type: 'window' as RecordingMode,
      label: '창',
      icon: <RectangleHorizontal size={32} />,
      description: '특정 창 녹화',
    },
  ];

  const actionButtons = [
    {
      label: '환경 설정',
      icon: <Settings size={32} />,
      onClick: () => {
        console.log('환경 설정 버튼 클릭됨');
        onOpenSettings();
      },
    },
    {
      label: '녹화 파일',
      icon: <Folder size={32} />,
      onClick: () => {
        console.log('녹화 파일 버튼 클릭됨');
        onOpenFiles();
      },
    },
  ];

  // 임시로 모든 소스를 표시 (디버깅용)
  const filteredSources = screenSources;

  const handleStartRecording = () => {
    if (selectedMode === 'area') {
      // 영역 선택 모드의 경우 특별한 처리
      onStartRecording('area-selection', 'area');
    } else if (selectedSource) {
      onStartRecording(selectedSource, selectedMode);
    }
  };

  const canStartRecording = selectedMode === 'area' || selectedSource !== '';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* 메인 툴바 - 밴디캠과 동일한 4개 버튼 + REC 버튼 */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2, 
        backgroundColor: '#2C2C2E',
        borderBottom: '1px solid #38383A',
        flexShrink: 0,
        gap: 1,
        overflow: 'visible'
      }}>
        {/* 왼쪽 그룹: 4개 모드 버튼들 + 환경설정 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {modes.map((mode) => (
            <ModeButton
              key={mode.type}
              selected={selectedMode === mode.type}
              onClick={() => {
                setSelectedMode(mode.type);
                setSelectedSource('');
              }}
            >
              {mode.icon}
              <Typography variant="caption" sx={{ fontSize: '0.8rem', lineHeight: 1.2, fontWeight: 500 }}>
                {mode.label}
              </Typography>
            </ModeButton>
          ))}
          
          {/* 액션 버튼들 */}
          {actionButtons.map((button, index) => (
            <ModeButton
              key={index}
              selected={false}
              onClick={button.onClick}
            >
              {button.icon}
              <Typography variant="caption" sx={{ fontSize: '0.8rem', lineHeight: 1.2, fontWeight: 500 }}>
                {button.label}
              </Typography>
            </ModeButton>
          ))}
        </Box>

        {/* 오른쪽 그룹: 녹화 버튼 */}
        <Box>
          {!isRecording ? (
            <RecordButton
              onClick={handleStartRecording}
              disabled={!canStartRecording}
              isRecording={false}
            >
              REC
            </RecordButton>
          ) : (
            <RecordButton
              onClick={onStopRecording}
              isRecording={true}
            >
              STOP
            </RecordButton>
          )}
        </Box>
      </Box>

      {/* 상태 메시지 바 */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2, 
        backgroundColor: '#1E1E1E',
        borderBottom: '1px solid #38383A',
        flexShrink: 0 
      }}>
        <Typography variant="body2" color="text.secondary">
          녹화할 디스플레이 화면을 선택하세요
        </Typography>
        <IconButton onClick={onRefreshSources} color="inherit" size="small">
          <RotateCcw size={20} />
        </IconButton>
      </Box>

      {/* 메인 컨텐츠 영역 - 2열 그리드 */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto', 
        p: 3,
        minHeight: 0,
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#1C1C1E',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#48484A',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: '#636366',
          },
        },
      }}>
        {/* 영역 선택 모드가 아닐 때만 화면/창 선택 표시 */}
        {selectedMode !== 'area' ? (
          filteredSources.length > 0 ? (
            <Grid container spacing={3}>
              {filteredSources.map((source) => (
                <Grid item xs={6} key={source.id}>
                  <SourceCard
                    selected={selectedSource === source.id}
                    onClick={() => setSelectedSource(source.id)}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <ThumbnailImage
                        src={source.thumbnail}
                        alt={source.name}
                      />
                      {selectedSource === source.id && (
                        <Box sx={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          backgroundColor: '#007AFF',
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid white',
                        }}>
                          <Typography sx={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                            ✓
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontWeight: selectedSource === source.id ? 600 : 400,
                          fontSize: '0.9rem',
                        }}
                      >
                        {source.name}
                      </Typography>
                    </Box>
                  </SourceCard>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              textAlign: 'center'
            }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                사용 가능한 소스가 없습니다
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedMode === 'screen' ? '화면' : '창'}을 찾을 수 없습니다.
              </Typography>
              <Button
                onClick={onRefreshSources}
                startIcon={<RotateCcw size={20} />}
                variant="outlined"
              >
                새로고침
              </Button>
            </Box>
          )
        ) : (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            textAlign: 'center'
          }}>
            <Crop size={48} color="#8E8E93" />
            <Typography variant="h6" color="text.primary" gutterBottom sx={{ mt: 2 }}>
              화면 영역 선택 모드
            </Typography>
            <Typography variant="body2" color="text.secondary">
              녹화 시작 후 마우스를 드래그하여<br />
              녹화할 화면 영역을 선택하세요.
            </Typography>
          </Box>
        )}
      </Box>

      {/* 최하단 상태바 */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 1, 
        backgroundColor: '#1A1A1A',
        borderTop: '1px solid #38383A',
        flexShrink: 0,
        minHeight: '40px'
      }}>
        {/* 왼쪽: 상태 아이콘들 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small" sx={{ color: '#8E8E93', '&:hover': { color: '#FFFFFF' } }}>
            <Mouse size={16} />
          </IconButton>
          <IconButton size="small" sx={{ color: '#8E8E93', '&:hover': { color: '#FFFFFF' } }}>
            <VolumeX size={16} />
          </IconButton>
          <IconButton size="small" sx={{ color: '#8E8E93', '&:hover': { color: '#FFFFFF' } }}>
            <Keyboard size={16} />
          </IconButton>
          <IconButton size="small" sx={{ color: '#8E8E93', '&:hover': { color: '#FFFFFF' } }}>
            <Settings size={16} />
          </IconButton>
        </Box>

        {/* 오른쪽: 해상도/FPS 정보 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ color: '#8E8E93', fontSize: '0.75rem', fontWeight: 500 }}>
            5K | 60FPS
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MainPanel;