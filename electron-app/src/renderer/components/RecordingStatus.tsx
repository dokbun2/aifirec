import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Chip,
  Stack,
} from '@mui/material';
import {
  Stop,
  Pause,
  PlayArrow,
  FiberManualRecord,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const RecordingCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.9) 0%, rgba(185, 28, 28, 0.9) 100%)',
  border: '2px solid rgba(220, 38, 38, 0.5)',
  boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)',
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': {
      boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)',
    },
    '50%': {
      boxShadow: '0 0 30px rgba(220, 38, 38, 0.6)',
    },
    '100%': {
      boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)',
    },
  },
}));

const RecordingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const RecordingDot = styled(FiberManualRecord)(({ theme }) => ({
  color: theme.palette.common.white,
  animation: 'blink 1s infinite',
  '@keyframes blink': {
    '0%, 50%': { opacity: 1 },
    '51%, 100%': { opacity: 0.3 },
  },
}));

const ControlButton = styled(Button)(({ theme }) => ({
  minWidth: '120px',
  height: '48px',
  fontSize: '1rem',
  fontWeight: 600,
  borderRadius: '8px',
  textTransform: 'none',
}));

const StopButton = styled(ControlButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: '#dc2626',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
  },
}));

const PauseResumeButton = styled(ControlButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
  },
}));

const TimeDisplay = styled(Typography)(({ theme }) => ({
  fontFamily: 'Monaco, Menlo, Consolas, "Courier New", monospace',
  fontSize: '2rem',
  fontWeight: 700,
  color: 'white',
  textAlign: 'center',
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
}));

interface RecordingStatusProps {
  isRecording: boolean;
  isPaused: boolean;
  duration: string;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
}

const RecordingStatus: React.FC<RecordingStatusProps> = ({
  isRecording,
  isPaused,
  duration,
  onStop,
  onPause,
  onResume,
}) => {
  if (!isRecording) return null;

  return (
    <Box mb={3}>
      <RecordingCard>
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <RecordingIndicator>
            <RecordingDot />
            <Typography variant="h6" color="white" fontWeight="bold">
              {isPaused ? '일시정지됨' : '녹화 중'}
            </Typography>
          </RecordingIndicator>

          <TimeDisplay variant="h3" component="div">
            {duration}
          </TimeDisplay>

          <Box mt={2} mb={3}>
            {isPaused ? (
              <Chip
                label="일시정지"
                color="warning"
                variant="filled"
                sx={{
                  fontSize: '0.9rem',
                  height: '32px',
                  backgroundColor: 'rgba(255, 193, 7, 0.9)',
                  color: '#000',
                }}
              />
            ) : (
              <Chip
                label="녹화 진행 중"
                color="error"
                variant="filled"
                sx={{
                  fontSize: '0.9rem',
                  height: '32px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                }}
              />
            )}
          </Box>

          <Stack direction="row" spacing={2} justifyContent="center">
            <PauseResumeButton
              onClick={isPaused ? onResume : onPause}
              startIcon={isPaused ? <PlayArrow /> : <Pause />}
            >
              {isPaused ? '재개' : '일시정지'}
            </PauseResumeButton>
            
            <StopButton
              onClick={onStop}
              startIcon={<Stop />}
            >
              중지
            </StopButton>
          </Stack>

          <Box mt={3}>
            <LinearProgress
              variant={isPaused ? 'determinate' : 'indeterminate'}
              value={isPaused ? 100 : undefined}
              sx={{
                height: 4,
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'white',
                },
              }}
            />
          </Box>

          <Typography
            variant="caption"
            color="rgba(255, 255, 255, 0.8)"
            sx={{ mt: 1, display: 'block' }}
          >
            ESC 키를 눌러 빠른 중지
          </Typography>
        </CardContent>
      </RecordingCard>
    </Box>
  );
};

export default RecordingStatus;