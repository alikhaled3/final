
// src/components/MedicationItem.js
import React from 'react';
import { Card, Typography, Tag, Button } from 'antd';
import { 
  MedicineBoxOutlined, 
  SoundOutlined, 
  LoadingOutlined, 
  PauseOutlined 
} from '@ant-design/icons';

const { Text, Title } = Typography;

const MedicationItem = ({ 
  med, 
  index, 
  isPlaying, 
  isLoadingAudio, 
  onPlayAudio, 
  onStopAudio 
}) => {
  return (
    <Card size="small" className="medication-card">
      <div className="medication-header">
        <MedicineBoxOutlined className="medication-icon" />
        <Title level={5} className="medication-name">{med.drug}</Title>
        
        {med.audio ? (
          <Button 
            type="text" 
            shape="circle"
            icon={isLoadingAudio ? <LoadingOutlined /> : (isPlaying ? <PauseOutlined /> : <SoundOutlined />)}
            onClick={() => isPlaying ? onStopAudio() : onPlayAudio(med.audio, index)}
            className="audio-button"
            disabled={isLoadingAudio}
          />
        ) : (
          <Button 
            type="text" 
            shape="circle"
            icon={<SoundOutlined />}
            disabled
            className="audio-button"
            title="No audio available"
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
  );
};

export default MedicationItem;