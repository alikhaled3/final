import React, { useState, useEffect } from 'react';
import { Button, Card, List, Typography, Spin, message, Tag } from 'antd';
import { MedicineBoxOutlined, SendOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text, Title } = Typography;

const MedicationExtractor = ({ extractedText, onMedicationsExtracted }) => {
  const [medications, setMedications] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const renderMedicationItem = (med) => {
    return (
      <List.Item>
        <Card size="small" className="medication-card">
          <div className="medication-header">
            <MedicineBoxOutlined className="medication-icon" />
            <Title level={5} className="medication-name">{med.drug}</Title>
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
            renderItem={renderMedicationItem}
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