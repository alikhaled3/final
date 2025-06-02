// src/hooks/useMedicationExtractor.js
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useMedicationExtractor = (extractedText, onMedicationsExtracted) => {
  const [medications, setMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [audioLoading, setAudioLoading] = useState(null);
  const audioRef = useRef(null);

  const extractMedications = async () => {
    if (!extractedText || extractedText.trim() === '') {
      message.error('No text available for extraction');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:5000/process/process_text', {
        text: extractedText
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.error) {
        setError(response.data.error);
        message.warning(response.data.error);
      } else {
        const extractedMeds = response.data.results || [];
        setMedications(extractedMeds);
        console.log(extractedMeds);
        
        const medsWithAudio = extractedMeds.map((med, index) => ({
          ...med,
          audio: `/audio/${med.drug}.mp3` // Example audio path
        }));
        
        if (onMedicationsExtracted) {
          onMedicationsExtracted(medsWithAudio);
        }
        message.success(`Extracted ${extractedMeds.length} medications`);
      }
    } catch (err) {
      console.error('Error extracting medications:', err);
      setError(err.message);
      message.error('Failed to extract medications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = (audioUrl, medicationId) => {
    if (!audioUrl || typeof audioUrl !== 'string') {
      message.warning('No audio available for this medication');
      return;
    }

    // Stop currently playing audio if any
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlayingAudio(null);
      setAudioLoading(null);
    }

    console.log(audioUrl);

    // Create new audio element
    const audio = new Audio(`http://localhost:5000${audioUrl}`);
    audioRef.current = audio;
    
    setAudioLoading(medicationId);
    
    audio.oncanplay = () => {
      setAudioLoading(null);
      audio.play().catch(err => {
        console.error('Error playing audio:', err);
        message.error('Failed to play audio: ' + err.message);
        setPlayingAudio(null);
        setAudioLoading(null);
      });
    };
    
    audio.onerror = () => {
      message.error('Failed to load audio file');
      setPlayingAudio(null);
      setAudioLoading(null);
      audioRef.current = null;
    };
    
    setPlayingAudio(medicationId);
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlayingAudio(null);
      setAudioLoading(null);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return {
    medications,
    isLoading,
    error,
    playingAudio,
    audioLoading,
    extractMedications,
    playAudio,
    stopAudio
  };
};

export default useMedicationExtractor;