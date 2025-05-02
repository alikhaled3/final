import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, List, Typography, Spin, message, Tag } from 'antd';
import { MedicineBoxOutlined, SendOutlined, SoundOutlined, LoadingOutlined, PauseOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text, Title } = Typography;

const MedicationExtractor = ({ extractedText, onMedicationsExtracted }) => {
  const [medications, setMedications] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playingAudio, setPlayingAudio] = useState(null);
  const audioRef = useRef(null);

  const extractMedications = async () => {
    if (!extractedText) {
      message.error('No text available for extraction');
      return;
    }
    
    console.log(extractedText);
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:5000/process/process_text', {
        text: `${extractedText}`
      });
      console.log(response);
      
      if (response.data.error) {
        setError(response.data.error);
        message.warning(response.data.error);
      } else {
        setMedications(response.data.results);
        onMedicationsExtracted(response.data);
        message.success('Medications extracted successfully');
      }
    } catch (err) {
      console.error('Error extracting medications:', err);
      setError('Failed to extract medications');
      message.error('Failed to extract medications');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-extract when extractedText changes
  useEffect(() => {
    if (extractedText) {
      extractMedications();
    }
  }, [extractedText]);

  // Handle audio playback
  const playAudio = (audioUrl, medicationId) => {
    // Stop currently playing audio if any
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Create new audio element
    const audio = new Audio(`http://localhost:5000${audioUrl}`);
    audioRef.current = audio;
    
    // Set the currently playing medication
    setPlayingAudio(medicationId);
    
    // Play the audio
    audio.play().catch(err => {
      console.error('Error playing audio:', err);
      message.error('Failed to play audio');
      setPlayingAudio(null);
    });
    
    // When audio ends, reset state
    audio.onended = () => {
      setPlayingAudio(null);
      audioRef.current = null;
    };
    
    // If there's an error loading the audio
    audio.onerror = () => {
      message.error('Failed to load audio file');
      setPlayingAudio(null);
      audioRef.current = null;
    };
  };

  // Stop audio playback
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlayingAudio(null);
    }
  };

  // Clean up audio on component unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const renderMedicationItem = (med, index) => {
    const isPlaying = playingAudio === index;
    
    return (
      <List.Item>
        <Card size="small" className="medication-card">
          <div className="medication-header">
            <MedicineBoxOutlined className="medication-icon" />
            <Title level={5} className="medication-name">{med.drug}</Title>
            
            {med.audio && (
              <Button 
                type="text" 
                shape="circle"
                icon={isPlaying ? <PauseOutlined /> : <SoundOutlined />}
                onClick={() => isPlaying ? stopAudio() : playAudio(med.audio, index)}
                className="audio-button"
                loading={isPlaying && playingAudio === 'loading'}
              />
            )}
          </div>
          <div className="medication-details">
            {med.dosage && (
              <Tag color="blue" className="medication-tag">
                <Text strong>Dosage:</Text> {med.dosage}
              </Tag>
            )}
            {med.frequency && (
              <Tag color="green" className="medication-tag">
                <Text strong>Frequency:</Text> {med.frequency}
              </Tag>
            )}
            {med.duration && (
              <Tag color="orange" className="medication-tag">
                <Text strong>Duration:</Text> {med.duration}
              </Tag>
            )}
            {med.instructions && (
              <div className="medication-instructions">
                <Text type="secondary" strong>Instructions:</Text> {med.instructions}
              </div>
            )}
          </div>
        </Card>
      </List.Item>
    );
  };

  return (
    <div className="medication-extractor">
      <div className="extractor-header">
        <Title level={4} className="extractor-title">
          <MedicineBoxOutlined /> Extracted Medications
        </Title>
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={extractMedications}
          loading={isLoading}
          disabled={!extractedText}
          size="small"
        >
          Re-extract
        </Button>
      </div>

      {isLoading ? (
        <div className="extractor-loading">
          <Spin tip="Analyzing medications..." />
        </div>
      ) : error ? (
        <div className="extractor-error">
          <Text type="danger">{error}</Text>
        </div>
      ) : medications ? (
        medications.length > 0 ? (
          <List
            dataSource={medications}
            renderItem={(item, index) => renderMedicationItem(item, index)}
            className="medication-list"
          />
        ) : (
          <div className="extractor-empty">
            <Text type="secondary">No medications detected in the text</Text>
          </div>
        )
      ) : (
        <div className="extractor-empty">
          <Text type="secondary">Submit text to extract medications</Text>
        </div>
      )}
    </div>
  );
};

export default MedicationExtractor;