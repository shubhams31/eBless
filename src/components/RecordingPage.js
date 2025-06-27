import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { FaVideo, FaMicrophone, FaPlay, FaStop, FaDownload, FaHeart } from 'react-icons/fa';
import VideoRecorder from './VideoRecorder';
import AudioRecorder from './AudioRecorder';

const PageContainer = styled.div`
  padding: 40px 0;
`;

const Hero = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const RecordingCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 32px;
`;

const RecordingTabs = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 16px;
`;

const TabButton = styled.button`
  background: none;
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
  color: ${props => props.active ? '#667eea' : '#666'};
  background: ${props => props.active ? 'rgba(102, 126, 234, 0.1)' : 'transparent'};
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
`;

const FormSection = styled.div`
  margin-bottom: 24px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SuccessMessage = styled.div`
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  margin-top: 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 16px;
  border-radius: 12px;
  margin-top: 16px;
  border: 1px solid #f5c6cb;
`;

function RecordingPage() {
  const [activeTab, setActiveTab] = useState('video');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [recordedMedia, setRecordedMedia] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleMediaRecorded = useCallback((mediaBlob) => {
    setRecordedMedia(mediaBlob);
  }, []);

  const handleSubmit = async () => {
    if (!name.trim() || !message.trim() || !recordedMedia) {
      setError('Please fill in all fields and record a message');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Create form data
      const formData = new FormData();
      formData.append('name', name);
      formData.append('message', message);
      formData.append('media', recordedMedia, `message_${Date.now()}.${activeTab === 'video' ? 'webm' : 'wav'}`);
      formData.append('type', activeTab);

      // In a real app, you would send this to your backend
      // For now, we'll simulate the upload
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear form
      setName('');
      setMessage('');
      setRecordedMedia(null);
      setSubmitSuccess(true);

      // Hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      setError('Failed to submit message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <Hero>
        <Title>Share Your Love</Title>
        <Subtitle>
          Record a special video or audio message for your parents' anniversary. 
          Your heartfelt words will be treasured forever.
        </Subtitle>
      </Hero>

      <RecordingCard>
        <RecordingTabs>
          <TabButton 
            active={activeTab === 'video'} 
            onClick={() => setActiveTab('video')}
          >
            <FaVideo />
            Video Message
          </TabButton>
          <TabButton 
            active={activeTab === 'audio'} 
            onClick={() => setActiveTab('audio')}
          >
            <FaMicrophone />
            Audio Message
          </TabButton>
        </RecordingTabs>

        <FormSection>
          <FormLabel>Your Name *</FormLabel>
          <FormInput
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </FormSection>

        <FormSection>
          <FormLabel>Your Message *</FormLabel>
          <FormInput
            as="textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your heartfelt message here..."
            rows="4"
            required
          />
        </FormSection>

        {activeTab === 'video' ? (
          <VideoRecorder onMediaRecorded={handleMediaRecorded} />
        ) : (
          <AudioRecorder onMediaRecorded={handleMediaRecorded} />
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {submitSuccess && (
          <SuccessMessage>
            <FaHeart />
            Thank you! Your message has been recorded successfully.
          </SuccessMessage>
        )}

        <button 
          className="btn btn-primary" 
          onClick={handleSubmit}
          disabled={isSubmitting || !recordedMedia}
          style={{ marginTop: '24px', width: '100%' }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Message'}
        </button>
      </RecordingCard>
    </PageContainer>
  );
}

export default RecordingPage; 