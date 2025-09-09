import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Crop, X } from 'lucide-react';

const AreaSelectorContainer = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  zIndex: 9999,
  cursor: 'crosshair',
  userSelect: 'none',
});

const SelectionBox = styled(Box)<{ 
  left: number; 
  top: number; 
  width: number; 
  height: number; 
}>(({ left, top, width, height }) => ({
  position: 'absolute',
  left: `${left}px`,
  top: `${top}px`,
  width: `${width}px`,
  height: `${height}px`,
  border: '2px solid #007AFF',
  backgroundColor: 'rgba(0, 122, 255, 0.1)',
  pointerEvents: 'none',
}));

const InfoPanel = styled(Card)(({ theme }) => ({
  position: 'absolute',
  top: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 10000,
  backgroundColor: 'rgba(28, 28, 30, 0.95)',
  backdropFilter: 'blur(10px)',
  border: '1px solid #38383A',
  minWidth: '300px',
}));

const CloseButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: '20px',
  right: '20px',
  zIndex: 10000,
  minWidth: '40px',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 59, 48, 0.9)',
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(215, 0, 21, 0.9)',
  },
}));

interface AreaSelectorProps {
  isVisible: boolean;
  onAreaSelect: (area: { x: number; y: number; width: number; height: number }) => void;
  onCancel: () => void;
}

export const AreaSelector: React.FC<AreaSelectorProps> = ({ 
  isVisible, 
  onAreaSelect, 
  onCancel 
}) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [selectedArea, setSelectedArea] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (event.target === containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      setIsSelecting(true);
      setStartPos({ x, y });
      setCurrentPos({ x, y });
      setSelectedArea(null);
    }
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (isSelecting && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setCurrentPos({ x, y });
    }
  }, [isSelecting]);

  const handleMouseUp = useCallback(() => {
    if (isSelecting) {
      const left = Math.min(startPos.x, currentPos.x);
      const top = Math.min(startPos.y, currentPos.y);
      const width = Math.abs(currentPos.x - startPos.x);
      const height = Math.abs(currentPos.y - startPos.y);
      
      if (width > 10 && height > 10) { // 최소 크기 체크
        const area = { x: left, y: top, width, height };
        setSelectedArea(area);
      }
      
      setIsSelecting(false);
    }
  }, [isSelecting, startPos, currentPos]);

  const handleConfirm = useCallback(() => {
    if (selectedArea) {
      onAreaSelect(selectedArea);
    }
  }, [selectedArea, onAreaSelect]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onCancel();
    } else if (event.key === 'Enter' && selectedArea) {
      handleConfirm();
    }
  }, [onCancel, selectedArea, handleConfirm]);

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isVisible, handleKeyDown]);

  if (!isVisible) {
    return null;
  }

  const selectionBox = (() => {
    if (isSelecting || selectedArea) {
      const area = selectedArea || {
        x: Math.min(startPos.x, currentPos.x),
        y: Math.min(startPos.y, currentPos.y),
        width: Math.abs(currentPos.x - startPos.x),
        height: Math.abs(currentPos.y - startPos.y)
      };
      
      return (
        <SelectionBox
          left={area.x}
          top={area.y}
          width={area.width}
          height={area.height}
        />
      );
    }
    return null;
  })();

  const displayArea = selectedArea || (isSelecting ? {
    x: Math.min(startPos.x, currentPos.x),
    y: Math.min(startPos.y, currentPos.y),
    width: Math.abs(currentPos.x - startPos.x),
    height: Math.abs(currentPos.y - startPos.y)
  } : null);

  return (
    <AreaSelectorContainer
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {selectionBox}
      
      <InfoPanel>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Crop size={20} color="#007AFF" />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'white' }}>
              화면 영역 선택
            </Typography>
          </Box>
          
          <Typography variant="body2" sx={{ color: '#8E8E93', mb: 2 }}>
            마우스를 드래그하여 녹화할 영역을 선택하세요
          </Typography>
          
          {displayArea && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                선택된 영역: {Math.round(displayArea.width)} × {Math.round(displayArea.height)} px
              </Typography>
              <br />
              <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                위치: ({Math.round(displayArea.x)}, {Math.round(displayArea.y)})
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              size="small"
              onClick={onCancel}
              sx={{ color: '#8E8E93', borderColor: '#8E8E93' }}
            >
              취소 (ESC)
            </Button>
            {selectedArea && (
              <Button
                variant="contained"
                size="small"
                onClick={handleConfirm}
                sx={{ backgroundColor: '#007AFF' }}
              >
                확인 (Enter)
              </Button>
            )}
          </Box>
        </CardContent>
      </InfoPanel>
      
      <CloseButton onClick={onCancel}>
        <X size={20} />
      </CloseButton>
    </AreaSelectorContainer>
  );
};

export default AreaSelector;