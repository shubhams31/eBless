import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { FaPlay, FaStop, FaRedo, FaVideo, FaDownload } from 'react-icons/fa';

const RecorderContainer = styled.div`
  margin: 24px 0;
`;

const VideoContainer = styled.div`
  position: relative;
  background: #000;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 20px;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
`;

const Placeholder = styled.div`
  color: #666;
  font-size: 18px;
  text-align: center;
  padding: 40px;
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const ControlButton = styled.button`
  background: ${props => props.variant === 'danger' ? '#dc3545' : props.variant === 'success' ? '#28a745' : '#667eea'};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const RecordingIndicator = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(220, 53, 69, 0.9);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
`;

const RecordingDot = styled.div`
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const PreviewContainer = styled.div`
  margin-top: 20px;
`;

const Status = styled.div`
  text-align: center;
  margin: 16px 0;
  font-weight: 500;
  color: #666;
`;

function VideoRecorder({ onMediaRecorded }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError('');
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
      console.error('Error accessing camera:', err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const startRecording = useCallback(() => {
    if (!stream) return;

    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9'
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setRecordedBlob(blob);
      onMediaRecorded(blob);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  }, [stream, onMediaRecorded]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const resetRecording = useCallback(() => {
    setRecordedBlob(null);
    onMediaRecorded(null);
    chunksRef.current = [];
  }, [onMediaRecorded]);

  const downloadRecording = useCallback(() => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `video_message_${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [recordedBlob]);

  React.useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  return (
    <RecorderContainer>
      <VideoContainer>
        {stream ? (
          <VideoElement
            ref={videoRef}
            autoPlay
            muted
            playsInline
          />
        ) : (
          <Placeholder>
            <FaVideo size={48} />
            <div>Camera not available</div>
          </Placeholder>
        )}
        
        {isRecording && (
          <RecordingIndicator>
            <RecordingDot />
            Recording...
          </RecordingIndicator>
        )}
      </VideoContainer>

      {error && (
        <div className="error" style={{ marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <Controls>
        {!isRecording && !recordedBlob && (
          <ControlButton onClick={startRecording} disabled={!stream}>
            <FaPlay />
            Start Recording
          </ControlButton>
        )}
        
        {isRecording && (
          <ControlButton variant="danger" onClick={stopRecording}>
            <FaStop />
            Stop Recording
          </ControlButton>
        )}
        
        {recordedBlob && (
          <>
            <ControlButton variant="success" onClick={downloadRecording}>
              <FaDownload />
              Download
            </ControlButton>
            <ControlButton onClick={resetRecording}>
              <FaRedo />
              Record Again
            </ControlButton>
          </>
        )}
      </Controls>

      {recordedBlob && (
        <PreviewContainer>
          <Status>Recording completed! You can download or record again.</Status>
        </PreviewContainer>
      )}

      {!stream && !error && (
        <Status>Initializing camera...</Status>
      )}
    </RecorderContainer>
  );
}

export default VideoRecorder; 