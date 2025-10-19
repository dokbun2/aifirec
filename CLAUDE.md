# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TOOLBEE CAM is a web-based screen recording application built as a single-page application in `index.html`. The entire application (HTML, CSS, and JavaScript) is contained within this single file for easy deployment and portability.

## Architecture

### Single-File Structure
- **index.html**: Contains all application code (~2200 lines)
  - Lines 1-822: HTML structure and CSS styles
  - Lines 823-913: Main UI HTML including toolbar, recording controls, and settings modal
  - Lines 914-1162: Settings modal HTML structure with tabs
  - Lines 1164-2166: JavaScript implementation

### Key Components

1. **Recording Engine** (lines 1220-1448)
   - Uses MediaRecorder API for screen capture
   - Handles stream management and chunk collection
   - Converts recordings to Base64 for localStorage persistence

2. **Settings System** (lines 1743-1887)
   - Four-tab configuration interface (General, Video, Overlay, Shortcuts)
   - Persistent storage via localStorage
   - Customizable keyboard shortcuts with visual feedback

3. **History Management** (lines 1456-1609)
   - Recording history stored in localStorage as Base64
   - Maximum 10 recordings to manage storage limits
   - Playback, download, and delete functionality

4. **UI Components**
   - Modal-based settings dialog
   - Recording history list with action buttons
   - Status bar with FPS and resolution indicators

## Development Commands

### Local Development
```bash
# Open directly in browser (file://)
open index.html

# Or use a local server for HTTPS features
python3 -m http.server 8000
# Then visit http://localhost:8000
```

### Testing Screen Recording
1. Click the REC button
2. Select screen/window/tab to record
3. Use STOP button or configured shortcuts to end recording
4. Check recording history for saved videos

## Known Issues and Considerations

1. **Template Literal Syntax**: Some template literals were replaced with string concatenation (line 2156) due to parsing errors
2. **Video Playback**: Removed from UI due to browser security restrictions with local file URLs
3. **Storage Limitations**: Base64 encoding increases file size ~33%, limiting localStorage capacity
4. **Browser Compatibility**: Screen recording requires secure context (HTTPS or localhost)

## Data Storage

### localStorage Keys
- `appSettings`: Application configuration object
- `recordingHistory`: Array of recording metadata and Base64 video data

### Settings Structure
```javascript
{
  general: { theme, countdown, outputFolder, ... },
  video: { format, codec, fps, resolution, ... },
  overlay: { showCursor, showWebcam, ... },
  shortcuts: { record, window, stop, pause }
}
```

## Deployment

The application is designed for static hosting:
- GitHub Pages: Push to repository and enable Pages
- Netlify/Vercel: Deploy directly from repository
- Any static web server supporting HTTPS

## Security Notes

- All processing happens client-side
- No server communication or data transmission
- Screen recording requires explicit user permission
- Recordings stored locally in browser storage