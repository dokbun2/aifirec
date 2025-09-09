import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  IconButton,
  Divider,
  Chip,
  Stack,
} from '@mui/material';
import {
  ArrowBack,
  VideoCall,
  VolumeUp,
  HighQuality,
  FolderOpen,
  Tune,
} from '@mui/icons-material';
import { RecordingSettings } from '../types/recording';

interface SettingsPanelProps {
  settings: RecordingSettings;
  onSettingsChange: (settings: RecordingSettings) => void;
  onBack: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsChange,
  onBack,
}) => {
  const handleSettingChange = (key: keyof RecordingSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  const handleSelectOutputPath = async () => {
    // TODO: 파일 다이얼로그 구현
    console.log('파일 경로 선택');
  };

  const qualityOptions = [
    { value: 'low', label: '낮음 (480p)', description: '작은 파일 크기' },
    { value: 'medium', label: '보통 (720p)', description: '균형잡힌 품질' },
    { value: 'high', label: '높음 (1080p)', description: '고품질 녹화' },
    { value: 'ultra', label: '최고 (4K)', description: '최상의 품질' },
  ];

  const formatOptions = [
    { value: 'mp4', label: 'MP4', description: '호환성이 좋음' },
    { value: 'avi', label: 'AVI', description: '무압축 고품질' },
    { value: 'mov', label: 'MOV', description: 'Apple 최적화' },
  ];

  const audioOptions = [
    { value: 'none', label: '없음', description: '비디오만 녹화' },
    { value: 'system', label: '시스템 소리', description: '컴퓨터 소리만' },
    { value: 'microphone', label: '마이크', description: '마이크 입력만' },
    { value: 'both', label: '시스템 + 마이크', description: '모든 오디오' },
  ];

  const fpsOptions = [15, 24, 30, 60];

  return (
    <Box>
      {/* 헤더 */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={onBack} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" component="h2">
          녹화 설정
        </Typography>
      </Box>

      {/* 비디오 설정 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <VideoCall sx={{ mr: 1 }} />
            <Typography variant="h6">비디오 설정</Typography>
          </Box>

          <Grid container spacing={3}>
            {/* 출력 포맷 */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>출력 포맷</InputLabel>
                <Select
                  value={settings.outputFormat}
                  label="출력 포맷"
                  onChange={(e) => handleSettingChange('outputFormat', e.target.value)}
                >
                  {formatOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box>
                        <Typography variant="body1">{option.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* 품질 설정 */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>화질</InputLabel>
                <Select
                  value={settings.quality}
                  label="화질"
                  onChange={(e) => handleSettingChange('quality', e.target.value)}
                >
                  {qualityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box>
                        <Typography variant="body1">{option.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* 프레임레이트 */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>프레임레이트 (FPS)</InputLabel>
                <Select
                  value={settings.fps}
                  label="프레임레이트 (FPS)"
                  onChange={(e) => handleSettingChange('fps', e.target.value as number)}
                >
                  {fpsOptions.map((fps) => (
                    <MenuItem key={fps} value={fps}>
                      {fps} FPS
                      {fps === 30 && (
                        <Chip
                          label="권장"
                          size="small"
                          color="primary"
                          sx={{ ml: 1, height: 20 }}
                        />
                      )}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 오디오 설정 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <VolumeUp sx={{ mr: 1 }} />
            <Typography variant="h6">오디오 설정</Typography>
          </Box>

          <FormControl fullWidth>
            <InputLabel>오디오 소스</InputLabel>
            <Select
              value={settings.audioSource}
              label="오디오 소스"
              onChange={(e) => handleSettingChange('audioSource', e.target.value)}
            >
              {audioOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box>
                    <Typography variant="body1">{option.label}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* 출력 설정 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <FolderOpen sx={{ mr: 1 }} />
            <Typography variant="h6">출력 설정</Typography>
          </Box>

          <Box display="flex" gap={1} alignItems="flex-start">
            <TextField
              fullWidth
              label="저장 경로"
              value={settings.outputPath}
              placeholder="기본 경로 사용"
              onChange={(e) => handleSettingChange('outputPath', e.target.value)}
              helperText="비어있으면 기본 녹화 폴더에 저장됩니다"
            />
            <Button
              variant="outlined"
              onClick={handleSelectOutputPath}
              sx={{ mt: 1, minWidth: 'auto', p: 1.5 }}
            >
              <FolderOpen />
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* 설정 요약 */}
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Tune sx={{ mr: 1 }} />
            <Typography variant="h6">현재 설정</Typography>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              label={`포맷: ${settings.outputFormat.toUpperCase()}`}
              color="primary"
              variant="outlined"
            />
            <Chip
              label={`품질: ${qualityOptions.find(q => q.value === settings.quality)?.label}`}
              color="secondary"
              variant="outlined"
            />
            <Chip
              label={`${settings.fps} FPS`}
              color="info"
              variant="outlined"
            />
            <Chip
              label={`오디오: ${audioOptions.find(a => a.value === settings.audioSource)?.label}`}
              color="success"
              variant="outlined"
            />
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary" align="center">
            설정은 자동으로 저장됩니다
          </Typography>
        </CardContent>
      </Card>

      {/* 하단 버튼 */}
      <Box textAlign="center" mt={3}>
        <Button
          variant="contained"
          onClick={onBack}
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          }}
        >
          완료
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsPanel;