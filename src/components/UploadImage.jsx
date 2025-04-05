
import React, { useState } from 'react';
import { UploadOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Upload, List, Avatar, message } from 'antd';
import ImgCrop from 'antd-img-crop';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Magnet from './UI';

const UploadFile = () => {
  const [fileList, setFileList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [minZoom, setMinZoom] = useState(1);

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
    
    setMessages(prev => [
      ...prev,
      {
        type: 'image',
        content: imageUrl,
        sender: 'user',
        time: new Date().toLocaleTimeString()
      }
    ]);
    
    return file;
  };

  const handleProcessImage = async () => {
    if (fileList.length === 0 || !fileList[0].originFileObj) {
      message.error('Please select and crop an image first');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', fileList[0].originFileObj);

    try {
      const response = await axios.post('http://localhost:5000/process/extract_text', formData);
      const { text, segmented_image } = response.data;
      const processedUrl = `data:image/jpeg;base64,${segmented_image}`;
      
      setMessages(prev => [
        ...prev,
        {
          type: 'processed-image',
          content: processedUrl,
          sender: 'system',
          time: new Date().toLocaleTimeString()
        },
        {
          type: 'extracted-text',
          content: text,
          sender: 'system',
          time: new Date().toLocaleTimeString()
        }
      ]);
      message.success('Image processed successfully');
    } catch (err) {
      console.error('Error processing image:', err);
      message.error('Failed to process image');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (message) => {
    switch (message.type) {
      case 'image':
        return <img src={message.content} className="img-fluid rounded border" style={{ maxHeight: '200px' }} alt="Uploaded" />;
      case 'processed-image':
        return (
          <div className="mb-2">
            <p className="mb-1 fw-bold">Processed Image:</p>
            <img src={message.content} className="img-fluid rounded border" style={{ maxHeight: '200px' }} alt="Processed" />
          </div>
        );
      case 'extracted-text':
        return <div className="p-3 bg-light rounded">{message.content}</div>;
      default:
        return <p>{message.content}</p>;
    }
  };

  return <>
    <div className="d-flex flex-column overflow-auto h75  px-5">
      {/* Chat area */}
      <div className="flex-grow-1  px-3 w-75 m-auto">
        <List
          dataSource={messages}
          renderItem={(message, index) => (
            <List.Item className={`d-flex justify-content-${message.sender === 'user' ? 'end' : 'start'} mb-3`}>
              <div className={`d-flex flex-${message.sender === 'user' ? 'row-reverse' : 'row'} align-items-start`}>
                <Avatar 
                  className="flex-shrink-0"
                  style={{ 
                    backgroundColor: message.sender === 'user' ? '#1890ff' : '#f56a00',
                    width: '32px',
                    height: '32px',
                    lineHeight: '32px'
                  }}
                >
                  {message.sender === 'user' ? 'U' : 'S'}
                </Avatar>
                <div 
                  className={`mx-2 p-3 rounded ${message.sender === 'user' ? 'bg-primary text-white' : 'bg-light'}`}
                  style={{ maxWidth: '80%' }}
                >
                  {renderMessageContent(message)}
                  <div className="text-muted small mt-1" style={{ 
                    textAlign: message.sender === 'user' ? 'right' : 'left'
                  }}>
                    {message.time}
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>
    </div>
      {/* Control area */}
      <div className="px-3 bgHome d-flex justify-content-between  shadow   w-50 uploadSection p-4 m-auto">



          <ImgCrop 
            rotationSlider
            beforeCrop={beforeCrop}
            onModalOk={onCrop}
            minZoom={minZoom}
            modalTitle="Crop Prescription"
            modalOk="Confirm Crop"
            modalCancel="Cancel"
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
                className="flex-grow-1 bg-dark text-white"
              >
                Upload Prescription
              </Button>
            </Upload>
          </ImgCrop>
          <Button 
            type="primary" 
            icon={<SendOutlined />}
            onClick={handleProcessImage}
            loading={isLoading}
            disabled={fileList.length === 0}
            className="flex-shrink-0 text-white bg-dark"
          >
            Read Now
          </Button>
      </div>
            <p className='text-center mt-3'>AI-generated, for reference only</p>

  </>
};

export default UploadFile;
