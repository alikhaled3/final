import React, { useState, useEffect, useRef } from 'react';
import { UploadOutlined, SendOutlined, UserOutlined, RobotOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Upload, List, Avatar, message, Card, Typography, Spin, Divider, Steps, Progress } from 'antd';
import ImgCrop from 'antd-img-crop';
import axios from 'axios';
import MedicationExtractor from './extract-text';

const { Text, Title } = Typography;
const { Step } = Steps;

const UploadFile = () => {
  const [fileList, setFileList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [minZoom, setMinZoom] = useState(1);
  const [processingStage, setProcessingStage] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [extractedText, setExtractedText] = useState('');

  // Clean up object URLs
  useEffect(() => {
    return () => {
      messages.forEach(msg => {
        if ((msg.type === 'image' || msg.type === 'processed-image') && msg.content.startsWith('blob:')) {
          URL.revokeObjectURL(msg.content);
        }
      });
    };
  }, [messages]);

  const normalizeImage = (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Find min and max values for each channel
        let minR = 255, maxR = 0;
        let minG = 255, maxG = 0;
        let minB = 255, maxB = 0;
        
        for (let i = 0; i < data.length; i += 4) {
          minR = Math.min(minR, data[i]);
          maxR = Math.max(maxR, data[i]);
          minG = Math.min(minG, data[i+1]);
          maxG = Math.max(maxG, data[i+1]);
          minB = Math.min(minB, data[i+2]);
          maxB = Math.max(maxB, data[i+2]);
        }
        
        // Normalize each channel
        const rangeR = maxR - minR;
        const rangeG = maxG - minG;
        const rangeB = maxB - minB;
        
        for (let i = 0; i < data.length; i += 4) {
          data[i] = rangeR > 0 ? ((data[i] - minR) / rangeR) * 255 : data[i];     // R
          data[i+1] = rangeG > 0 ? ((data[i+1] - minG) / rangeG) * 255 : data[i+1]; // G
          data[i+2] = rangeB > 0 ? ((data[i+2] - minB) / rangeB) * 255 : data[i+2]; // B
        }
        
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.src = imageUrl;
    });
  };

  const onUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const beforeCrop = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = () => {
          const zoomRatio = 300 / image.height;
          setMinZoom(Math.min(1, zoomRatio));
          resolve(true);
        };
      };
    });
  };

  const onCrop = async (file) => {
    const imageUrl = URL.createObjectURL(file);
    
    // Normalize the image before displaying
    const normalizedUrl = await normalizeImage(imageUrl);
    
    setMessages(prev => [
      ...prev,
      {
        type: 'image',
        content: normalizedUrl,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    
    // Revoke the original object URL
    URL.revokeObjectURL(imageUrl);
    
    return file;
  };

  const simulateProcessing = () => {
    setProcessingStage('preprocess');
    setProgressPercent(10);
    
    setTimeout(() => {
      setProcessingStage('inference');
      setProgressPercent(30);
      
      const interval = setInterval(() => {
        setProgressPercent(prev => {
          const newPercent = prev + 1;
          if (newPercent >= 90) {
            clearInterval(interval);
            setProcessingStage('postprocess');
            return 90;
          }
          return newPercent;
        });
      }, 87);
      
      setTimeout(() => {
        setProcessingStage('postprocess');
        setProgressPercent(95);
        
        setTimeout(() => {
          setProgressPercent(100);
        }, 500);
      }, 8736);
    }, 170);
  };

  const handleProcessImage = async () => {
    if (fileList.length === 0 || !fileList[0].originFileObj) {
      message.error('Please upload a prescription image first');
      return;
    }

    setIsLoading(true);
    setProgressPercent(0);
    setExtractedText('');

    const formData = new FormData();
    formData.append('image', fileList[0].originFileObj);

    try {
      setMessages(prev => [
        ...prev,
        {
          type: 'status',
          content: 'Starting prescription analysis...',
          sender: 'system',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      simulateProcessing();

      const response = await axios.post('http://localhost:5000/process/extract_text', formData);
      const { text, segmented_image } = response.data;
      const processedUrl = `data:image/jpeg;base64,${segmented_image}`;
      
      setExtractedText(text);
      
      setMessages(prev => [
        ...prev.filter(msg => msg.type !== 'status'),
        {
          type: 'processed-image',
          content: processedUrl,
          sender: 'system',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          type: 'extracted-text',
          content: text,
          sender: 'system',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      message.success('Prescription analyzed successfully');
    } catch (err) {
      console.error('Error processing image:', err);
      message.error('Failed to analyze prescription');
      setMessages(prev => prev.filter(msg => msg.type !== 'status'));
    } finally {
      setIsLoading(false);
      setProcessingStage(null);
    }
  };

  const renderMessageContent = (message) => {
    switch (message.type) {
      case 'image':
        return (
          <div className="prescription-card">
            <div className="prescription-image-container">
              <img 
                src={message.content} 
                className="prescription-image"
                alt="Enhanced prescription" 
                style={{ 
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
            </div>
            <div className="prescription-label">Normalized Prescription</div>
          </div>
        );
      case 'processed-image':
        return (
          <div className="analysis-result">
            <Text strong className="section-title">Enhanced Analysis</Text>
            <div className="processed-image-container">
              <img 
                src={message.content} 
                className="processed-image"
                alt="Processed prescription" 
              />
            </div>
          </div>
        );
      case 'extracted-text':
        return (
          <div className="analysis-result">
            <Text strong className="section-title">Extracted Text</Text>
            <Card className="text-card">
              <div className="prescription-text" style={{ whiteSpace: 'pre-wrap' }}>
                {message.content}
              </div>
            </Card>
          </div>
        );
      case 'status':
        return (
          <div className="status-message">
            {isLoading && processingStage ? (
              <div className="processing-visualization">
                <Steps current={processingStage === 'preprocess' ? 0 : 
                               processingStage === 'inference' ? 1 : 2} 
                       size="small">
                  <Step title="Preprocessing" description="17ms" />
                  <Step title="AI Analysis" description="8736ms" />
                  <Step title="Finalizing" description="68ms" />
                </Steps>
                <Progress 
                  percent={progressPercent}
                  status={progressPercent < 100 ? "active" : "success"}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
                <div className="processing-details">
                  <Text type="secondary">
                    {processingStage === 'preprocess' && 
                     "Preparing image for analysis (17ms)..."}
                    {processingStage === 'inference' && 
                     "AI model analyzing prescription (8736ms)..."}
                    {processingStage === 'postprocess' && 
                     "Finalizing results (68ms)..."}
                  </Text>
                </div>
              </div>
            ) : (
              <>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 18 }} spin />} />
                <Text type="secondary">{message.content}</Text>
              </>
            )}
          </div>
        );
      default:
        return <Text>{message.content}</Text>;
    }
  };

  return (
    <div className="prescription-container">
      <div className="prescription-content">
        <div className="message-area">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-illustration iconsize">
                <UploadOutlined />
              </div>
              <Title level={4} className="empty-title text-danger">No Prescription Uploaded</Title>
              <Text type="secondary" className="empty-description">
                Upload a prescription image to begin analysis
              </Text>
            </div>
          ) : (
            <List
              dataSource={messages}
              renderItem={(message, index) => (
                <List.Item className={`message-item ${message.sender}`}>
                  <div className="message-content">
                    <Avatar 
                      icon={message.sender === 'user' ? <UserOutlined /> : <RobotOutlined />}
                      className="message-avatar"
                      style={{ 
                        backgroundColor: message.sender === 'user' ? '#4a6bdf' : '#7c4dff'
                      }}
                    />
                    <div className="message-bubble">
                      {renderMessageContent(message)}
                      <div className="message-time">
                        {message.time}
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          )}
        </div>

        {/* Medication Extractor */}
        {extractedText && (
          <div className="medication-extractor-container">
            <MedicationExtractor 
              extractedText={extractedText}
              onMedicationsExtracted={(meds) => {
                // You can handle the extracted medications here if needed
                console.log('Extracted medications:', meds);
              }}
            />
          </div>
        )}

        <div className="control-area">
          <Divider className="control-divider" />
          <div className="upload-controls">
            <ImgCrop 
              rotationSlider
              beforeCrop={beforeCrop}
              onModalOk={onCrop}
              minZoom={minZoom}
              modalTitle="Crop Prescription"
              modalOk="Confirm"
              modalCancel="Cancel"
              aspect={3/4}
            >
              <Upload
                fileList={fileList}
                onChange={onUploadChange}
                accept="image/*"
                maxCount={1}
                showUploadList={false}
              >
                <Button 
                  icon={<UploadOutlined />} 
                  size="large"
                  className="upload-button bg-primary"
                >
                  {fileList.length > 0 ? 'Change Prescription' : 'Upload Prescription'}
                </Button>
              </Upload>
            </ImgCrop>
            <Button 
              type="primary" 
              icon={<SendOutlined />}
              size="large"
              onClick={handleProcessImage}
              loading={isLoading}
              disabled={fileList.length === 0}
              className="process-button"
            >
              Analyze
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;