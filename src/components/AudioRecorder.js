import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlay, FaStop, FaRedo, FaMicrophone, FaDownload, FaVolumeUp, FaSync } from 'react-icons/fa';

const RecorderContainer = styled.div`
  margin: 24px 0;
`;

const AudioContainer = styled.div`
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 20px;
  text-align: center;
  color: white;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const AudioVisualizer = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin: 20px 0;
`;

const AudioBar = styled.div`
  width: 4px;
  background: white;
  border-radius: 2px;
  transition: height 0.1s ease;
  height: ${props => props.height}px;
  opacity: ${props => props.isRecording ? 1 : 0.3};
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const ControlButton = styled.button`
  background: ${props => props.variant === 'danger' ? '#dc3545' : props.variant === 'success' ? '#28a745' : 'white'};
  color: ${props => props.variant === 'danger' || props.variant === 'success' ? 'white' : '#667eea'};
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

const Status = styled.div`
  text-align: center;
  margin: 16px 0;
  font-weight: 500;
  color: #666;
`;

const AudioPreview = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  text-align: center;
`;

const AudioPlayer = styled.audio`
  width: 100%;
  margin: 10px 0;
`;

function AudioRecorder({ onMediaRecorded }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const [audioLevels, setAudioLevels] = useState(new Array(20).fill(10));
  const [loading, setLoading] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Start mic only on mount or retry
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setStream(null);
    setAudioLevels(new Array(20).fill(10));
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(mediaStream => {
        if (!active) return;
        setStream(mediaStream);
        setError('');
      })
      .catch(err => {
        setError('Unable to access microphone. Please check permissions and ensure no other app is using it.');
        setStream(null);
      })
      .finally(() => {
        setLoading(false);
      });
    return () => {
      active = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
    // eslint-disable-next-line
  }, [retryKey]);

  const updateAudioLevels = useCallback(() => {
    if (analyserRef.current && isRecording) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      const levels = Array.from({ length: 20 }, (_, i) => {
        const index = Math.floor(i * dataArray.length / 20);
        return Math.max(10, (dataArray[index] / 255) * 50);
      });
      setAudioLevels(levels);
      animationFrameRef.current = requestAnimationFrame(updateAudioLevels);
    }
  }, [isRecording]);

  const startRecording = useCallback(() => {
    if (!stream) return;
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm'
    });
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      setRecordedBlob(blob);
      onMediaRecorded(blob);
      setAudioLevels(new Array(20).fill(10));
    };
    // Set up audio visualization
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 256;
    source.connect(analyserRef.current);
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
    updateAudioLevels();
  }, [stream, onMediaRecorded, updateAudioLevels]);

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
      a.download = `audio_message_${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [recordedBlob]);

  const handleRetry = () => {
    setRetryKey(k => k + 1);
    setError('');
    setRecordedBlob(null);
    onMediaRecorded(null);
  };

  return (
    <RecorderContainer>
      <AudioContainer>
        <FaMicrophone size={48} />
        <h3 style={{ margin: '16px 0 8px 0' }}>
          {isRecording ? 'Recording Audio...' : 'Audio Recorder'}
        </h3>
        <p style={{ margin: 0, opacity: 0.9 }}>
          {isRecording 
            ? 'Speak clearly into your microphone' 
            : 'Click "Start Recording" to begin'
          }
        </p>
        <AudioVisualizer>
          {audioLevels.map((height, index) => (
            <AudioBar 
              key={index} 
              height={height} 
              isRecording={isRecording}
            />
          ))}
        </AudioVisualizer>
        {!stream && !loading && (
          <ControlButton onClick={handleRetry} style={{marginTop: 16}}>
            <FaSync /> Retry
          </ControlButton>
        )}
      </AudioContainer>
      {error && (
        <div className="error" style={{ marginBottom: '16px' }}>
          {error}
        </div>
      )}
      <Controls>
        {!isRecording && !recordedBlob && stream && !loading && (
          <ControlButton onClick={startRecording}>
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
        <AudioPreview>
          <h4 style={{ margin: '0 0 16px 0', color: '#333' }}>
            <FaVolumeUp style={{ marginRight: '8px' }} />
            Preview Your Recording
          </h4>
          <AudioPlayer controls>
            <source src={URL.createObjectURL(recordedBlob)} type="audio/webm" />
            Your browser does not support the audio element.
          </AudioPlayer>
        </AudioPreview>
      )}
    </RecorderContainer>
  );
}

export default AudioRecorder; 