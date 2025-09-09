import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider,
  Alert,
} from '@mui/material';
import {
  Play,
  Folder,
  Trash2,
  Download,
  RefreshCw,
  Film,
  Clock,
  HardDrive,
} from 'lucide-react';
import { styled } from '@mui/material/styles';

const RecordingCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#1C1C1E',
  border: '1px solid #38383A',
  marginBottom: theme.spacing(1),
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: '#2C2C2E',
    borderColor: '#48484A',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
}));

const FileIcon = styled(Box)({
  width: 48,
  height: 48,
  backgroundColor: '#007AFF',
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 16,
  flexShrink: 0,
});

interface RecordingFile {
  name: string;
  path: string;
  size: number;
  createdAt: Date;
  modifiedAt: Date;
}

interface RecordingFilesProps {
  onClose: () => void;
}

export const RecordingFiles: React.FC<RecordingFilesProps> = ({ onClose }) => {
  const [files, setFiles] = useState<RecordingFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await window.electronAPI.getRecordingFiles();
      
      if (result.success) {
        setFiles(result.files.map(file => ({
          ...file,
          createdAt: new Date(file.createdAt),
          modifiedAt: new Date(file.modifiedAt)
        })));
      } else {
        setError(result.error || '파일 목록을 불러올 수 없습니다.');
      }
    } catch (err: any) {
      console.error('파일 목록 로드 실패:', err);
      setError('파일 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toUpperCase() || '';
  };

  const handleOpenFile = async (filePath: string) => {
    try {
      // IPC를 통해 메인 프로세스에서 파일 열기
      console.log('파일 열기 시도:', filePath);
      // TODO: IPC 핸들러를 통해 shell.openPath 호출
    } catch (error) {
      console.error('파일 열기 실패:', error);
    }
  };

  const handleOpenFolder = async () => {
    try {
      const result = await window.electronAPI.openRecordingsFolder();
      if (!result.success) {
        setError(result.error || '폴더를 열 수 없습니다.');
      }
    } catch (err: any) {
      console.error('폴더 열기 실패:', err);
      setError('폴더를 여는 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteFile = (filePath: string) => {
    // TODO: 파일 삭제 기능 구현
    console.log('파일 삭제:', filePath);
  };

  const getTotalSize = (): string => {
    const total = files.reduce((sum, file) => sum + file.size, 0);
    return formatFileSize(total);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 헤더 */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3, 
        pb: 2,
        borderBottom: '1px solid #38383A' 
      }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white', mb: 0.5 }}>
            녹화 파일
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {files.length}개 파일 • 총 {getTotalSize()}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={loadFiles}
            disabled={loading}
            sx={{ color: '#8E8E93' }}
          >
            <RefreshCw size={20} />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Folder size={18} />}
            onClick={handleOpenFolder}
            sx={{ 
              backgroundColor: '#007AFF',
              color: 'white',
              '&:hover': {
                backgroundColor: '#0056CC'
              }
            }}
          >
            폴더 열기
          </Button>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ 
              borderColor: '#38383A',
              color: 'white',
              '&:hover': {
                borderColor: '#48484A',
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }
            }}
          >
            닫기
          </Button>
        </Box>
      </Box>

      {/* 에러 메시지 */}
      {error && (
        <Alert severity="error" sx={{ mb: 2, backgroundColor: '#2C2C2E' }}>
          {error}
        </Alert>
      )}

      {/* 파일 목록 */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '200px' 
          }}>
            <Typography color="text.secondary">파일 목록을 불러오는 중...</Typography>
          </Box>
        ) : files.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '200px',
            textAlign: 'center'
          }}>
            <Film size={48} color="#8E8E93" />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
              녹화 파일이 없습니다
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              첫 번째 화면 녹화를 시작해보세요!
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Folder size={18} />}
              onClick={handleOpenFolder}
              sx={{ 
                borderColor: '#38383A',
                color: 'white',
                '&:hover': {
                  borderColor: '#48484A',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)'
                }
              }}
            >
              녹화 폴더 열기
            </Button>
          </Box>
        ) : (
          files.map((file) => (
            <RecordingCard key={file.path}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FileIcon>
                    <Film size={24} color="white" />
                  </FileIcon>
                  
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 600, 
                        color: 'white',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {file.name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                      <Chip
                        label={getFileExtension(file.name)}
                        size="small"
                        sx={{ 
                          backgroundColor: '#007AFF',
                          color: 'white',
                          fontSize: '0.75rem',
                          height: 24
                        }}
                      />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <HardDrive size={14} color="#8E8E93" />
                        <Typography variant="caption" color="text.secondary">
                          {formatFileSize(file.size)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Clock size={14} color="#8E8E93" />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(file.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 0.5, ml: 2 }}>
                    <IconButton
                      onClick={() => handleOpenFile(file.path)}
                      sx={{ 
                        color: '#007AFF',
                        '&:hover': { backgroundColor: 'rgba(0, 122, 255, 0.1)' }
                      }}
                    >
                      <Play size={18} />
                    </IconButton>
                    
                    <IconButton
                      onClick={() => handleDeleteFile(file.path)}
                      sx={{ 
                        color: '#FF3B30',
                        '&:hover': { backgroundColor: 'rgba(255, 59, 48, 0.1)' }
                      }}
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </RecordingCard>
          ))
        )}
      </Box>
    </Box>
  );
};

export default RecordingFiles;