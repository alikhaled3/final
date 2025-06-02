import React, { useState, useEffect, useRef } from "react";
import {
  UploadOutlined,
  SendOutlined,
  UserOutlined,
  RobotOutlined,
  LoadingOutlined,
  MedicineBoxOutlined,
  SoundOutlined,
  PauseOutlined,
  PictureOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  Button,
  Upload,
  List,
  Avatar,
  message,
  Card,
  Typography,
  Spin,
  Divider,
  Steps,
  Progress,
  Tag,
  Dropdown,
  Menu,
  Space,
  Layout,
  Row,
  Col,
} from "antd";
import ImgCrop from "antd-img-crop";
import axios from "axios";
import MedicationExtractor from "./extract-text";
import useMedicationExtractor from "../hooks/useMedicationExtractor";
import MedicationItem from "./MedicationItem";

const { Text, Title } = Typography;
const { Step } = Steps;
const { Sider, Content } = Layout;

const filterOptions = [
  { key: "none", label: "No Filter", value: "none" },
  { key: "grayscale", label: "Grayscale", value: "grayscale" },
  { key: "invert", label: "Invert Colors", value: "invert" },
  { key: "sepia", label: "Sepia", value: "sepia" },
  { key: "contrast", label: "High Contrast", value: "contrast" },
  { key: "brightness", label: "Increase Brightness", value: "brightness" },
];

const UploadFile = () => {
  const [fileList, setFileList] = useState([]);
  const [messages, setMessages] = useState([
    {
      type: "text",
      content: "Upload a prescription to start analysis",
      sender: "system",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [minZoom, setMinZoom] = useState(1);
  const [processingStage, setProcessingStage] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [extractedText, setExtractedText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [filteredImage, setFilteredImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  const {
    medications,
    isLoading: isExtracting,
    extractMedications,
    playAudio,
    stopAudio,
    playingAudio,
    audioLoading,
  } = useMedicationExtractor(extractedText, (meds) => {
    if (meds && meds.length > 0) {
      setMessages((prev) => [
        ...prev,
        ...meds.map((med, index) => ({
          type: "medication",
          content: med,
          sender: "system",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          index,
        })),
      ]);
    } else if (meds && meds.length === 0) {
      setMessages((prev) => [
        ...prev,
        {
          type: "text",
          content: "No medications were detected in the extracted text.",
          sender: "system",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  });

  const applyFilter = (imageUrl, filterType) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          switch (filterType) {
            case "grayscale":
              const avg = 0.299 * r + 0.587 * g + 0.114 * b;
              data[i] = data[i + 1] = data[i + 2] = avg;
              break;
            case "invert":
              data[i] = 255 - r;
              data[i + 1] = 255 - g;
              data[i + 2] = 255 - b;
              break;
            case "sepia":
              data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
              data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
              data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
              break;
            case "contrast":
              const factor = 2.5;
              data[i] = 128 + factor * (r - 128);
              data[i + 1] = 128 + factor * (g - 128);
              data[i + 2] = 128 + factor * (b - 128);
              break;
            case "brightness":
              const brightness = 50;
              data[i] = r + brightness;
              data[i + 1] = g + brightness;
              data[i + 2] = b + brightness;
              break;
            default:
              break;
          }
        }

        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };
      img.src = imageUrl;
    });
  };

  const handleFilterSelect = async (filter) => {
    if (!fileList[0]?.originFileObj) return;

    setSelectedFilter(filter);
    setShowFilterOptions(false);

    const imageUrl = URL.createObjectURL(fileList[0].originFileObj);
    const filteredUrl = await applyFilter(imageUrl, filter);
    setFilteredImage(filteredUrl);
    setCurrentImage(filteredUrl);

    URL.revokeObjectURL(imageUrl);
  };

  const resetFilter = async () => {
    if (!fileList[0]?.originFileObj) return;

    setSelectedFilter("none");
    const imageUrl = URL.createObjectURL(fileList[0].originFileObj);
    const normalizedUrl = await normalizeImage(imageUrl);
    setFilteredImage(null);
    setCurrentImage(normalizedUrl);

    URL.revokeObjectURL(imageUrl);
  };

  const normalizeImage = (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let minR = 255,
          maxR = 0;
        let minG = 255,
          maxG = 0;
        let minB = 255,
          maxB = 0;

        for (let i = 0; i < data.length; i += 4) {
          minR = Math.min(minR, data[i]);
          maxR = Math.max(maxR, data[i]);
          minG = Math.min(minG, data[i + 1]);
          maxG = Math.max(maxG, data[i + 1]);
          minB = Math.min(minB, data[i + 2]);
          maxB = Math.max(maxB, data[i + 2]);
        }

        const rangeR = maxR - minR;
        const rangeG = maxG - minG;
        const rangeB = maxB - minB;

        for (let i = 0; i < data.length; i += 4) {
          data[i] = rangeR > 0 ? ((data[i] - minR) / rangeR) * 255 : data[i];
          data[i + 1] =
            rangeG > 0 ? ((data[i + 1] - minG) / rangeG) * 255 : data[i + 1];
          data[i + 2] =
            rangeB > 0 ? ((data[i + 2] - minB) / rangeB) * 255 : data[i + 2];
        }

        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.9));
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
    const normalizedUrl = await normalizeImage(imageUrl);
    setFilteredImage(null);
    setSelectedFilter("none");
    setCurrentImage(normalizedUrl);

    setMessages((prev) => [
      ...prev.filter(
        (msg) => msg.content !== "Upload a prescription to start analysis"
      ),
      {
        type: "text",
        content: "Prescription uploaded. Click 'Analyze' to process.",
        sender: "system",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    URL.revokeObjectURL(imageUrl);
    return file;
  };

  const simulateProcessing = () => {
    setProcessingStage("preprocess");
    setProgressPercent(10);

    setTimeout(() => {
      setProcessingStage("inference");
      setProgressPercent(30);

      const interval = setInterval(() => {
        setProgressPercent((prev) => {
          const newPercent = prev + 1;
          if (newPercent >= 90) {
            clearInterval(interval);
            setProcessingStage("postprocess");
            return 90;
          }
          return newPercent;
        });
      }, 87);

      setTimeout(() => {
        setProcessingStage("postprocess");
        setProgressPercent(95);

        setTimeout(() => {
          setProgressPercent(100);
        }, 500);
      }, 8736);
    }, 170);
  };

  const handleProcessImage = async () => {
    if (fileList.length === 0 || !fileList[0].originFileObj) {
      message.error("Please upload a prescription image first");
      return;
    }

    setIsLoading(true);
    setProgressPercent(0);
    setExtractedText("");

    const formData = new FormData();

    if (filteredImage) {
      const blob = await fetch(filteredImage).then((r) => r.blob());
      formData.append("image", blob, fileList[0].name);
    } else {
      formData.append("image", fileList[0].originFileObj);
    }

    try {
      setMessages((prev) => [
        ...prev.filter((msg) => msg.type !== "status"),
        {
          type: "status",
          content: "Starting prescription analysis...",
          sender: "system",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

      simulateProcessing();

      const response = await axios.post(
        "http://localhost:5000/process/extract_text",
        formData
      );
      const { text, segmented_image } = response.data;
      const processedUrl = `data:image/jpeg;base64,${segmented_image}`;

      setExtractedText(text);
      setCurrentImage(processedUrl);

      setMessages((prev) => [
        ...prev.filter((msg) => msg.type !== "status"),
        {
          type: "extracted-text",
          content: text,
          sender: "system",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      message.success("Prescription analyzed successfully");
    } catch (err) {
      console.error("Error processing image:", err);
      message.error("Failed to analyze prescription");
      setMessages((prev) => prev.filter((msg) => msg.type !== "status"));
    } finally {
      setIsLoading(false);
      setProcessingStage(null);
    }
  };

  const renderMedicationItem = (med, index) => {
    const isPlaying = playingAudio === index;
    const isLoadingAudio = audioLoading === index;

    return (
      <Card size="small" className="medication-card">
        <div className="medication-header">
          <MedicineBoxOutlined className="medication-icon" />
          <Title level={5} className="medication-name">
            {med.drug}
          </Title>

          {med.audio ? (
            <Button
              type="text"
              shape="circle"
              icon={
                isLoadingAudio ? (
                  <LoadingOutlined />
                ) : isPlaying ? (
                  <PauseOutlined />
                ) : (
                  <SoundOutlined />
                )
              }
              onClick={() =>
                isPlaying ? stopAudio() : playAudio(med.audio, index)
              }
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
              <Text type="secondary" strong>
                Instructions:
              </Text>{" "}
              {med.instructions}
            </div>
          )}
        </div>
      </Card>
    );
  };

  const renderMessageContent = (message) => {
    switch (message.type) {
      case "extracted-text":
        return (
          <div className="analysis-result">
            <Text strong className="section-title">
              Extracted Text
            </Text>
            <Card className="text-card">
              <div
                className="prescription-text"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {message.content}
              </div>
            </Card>
            <div className="extract-button-container">
              <Button
                type="primary"
                icon={<MedicineBoxOutlined />}
                onClick={extractMedications}
                loading={isExtracting}
                disabled={!message.content}
                className="extract-button"
              >
                Extract Medications
              </Button>
            </div>
          </div>
        );
      case "medication":
        return (
          <div className="medication-message">
            <MedicationItem
              med={message.content}
              index={message.index}
              isPlaying={playingAudio === message.index}
              isLoadingAudio={audioLoading === message.index}
              onPlayAudio={playAudio}
              onStopAudio={stopAudio}
            />
          </div>
        );
      case "status":
        return (
          <div className="status-message">
            {isLoading && processingStage ? (
              <div className="processing-visualization">
                <Steps
                  current={
                    processingStage === "preprocess"
                      ? 0
                      : processingStage === "inference"
                      ? 1
                      : 2
                  }
                  size="small"
                >
                  <Step title="Preprocessing" description="17ms" />
                  <Step title="AI Analysis" description="8736ms" />
                  <Step title="Finalizing" description="68ms" />
                </Steps>
                <Progress
                  percent={progressPercent}
                  status={progressPercent < 100 ? "active" : "success"}
                  strokeColor={{
                    "0%": "#108ee9",
                    "100%": "#87d068",
                  }}
                />
                <div className="processing-details">
                  <Text type="secondary">
                    {processingStage === "preprocess" &&
                      "Preparing image for analysis (17ms)..."}
                    {processingStage === "inference" &&
                      "AI model analyzing prescription (8736ms)..."}
                    {processingStage === "postprocess" &&
                      "Finalizing results (68ms)..."}
                  </Text>
                </div>
              </div>
            ) : (
              <>
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 18 }} spin />}
                />
                <Text type="secondary">{message.content}</Text>
              </>
            )}
          </div>
        );
      default:
        return <Text>{message.content}</Text>;
    }
  };

  const filterMenu = (
    <Menu
      selectedKeys={[selectedFilter]}
      onClick={({ key }) => handleFilterSelect(key)}
      items={filterOptions}
    />
  );

  return (
    <Layout className="prescription-container" style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "24px", display: "flex", flexDirection: "column" }}>
        <div style={{ 
          flex: 1, 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          backgroundColor: "#f0f2f5",
          borderRadius: "8px",
          marginBottom: "16px"
        }}>
          {currentImage ? (
            <div style={{ 
              maxWidth: "100%", 
              maxHeight: "70vh", 
              display: "flex", 
              justifyContent: "center",
              alignItems: "center"
            }}>
              <img
                src={currentImage}
                style={{ 
                  maxHeight: "55%", 
                  maxWidth: "55%", 
                  objectFit: "contain",
                  borderRadius: "4px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}
                alt="Prescription"
              />
            </div>
          ) : (
            <div className="empty-state" style={{ textAlign: "center" }}>
              <div className="empty-illustration text-danger iconsize">
                <MedicineBoxOutlined style={{ fontSize: "48px" }} />
              </div>
              <Title level={4} className="empty-title">
                No Prescription Uploaded
              </Title>
              <Text type="secondary" className="empty-description">
                Upload a prescription image to begin analysis
              </Text>
            </div>
          )}
        </div>

        <div style={{ 
          backgroundColor: "#fff", 
          padding: "16px", 
          borderRadius: "8px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
        }}>
          <Row gutter={16} justify="center" align="middle">
            <Col>
              <ImgCrop
                rotationSlider
                beforeCrop={beforeCrop}
                onModalOk={onCrop}
                minZoom={minZoom}
                modalTitle="Crop Prescription"
                modalOk="Confirm"
                modalCancel="Cancel"
                aspect={3 / 4}
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
                    className="upload-button"
                    type="primary"
                  >
                    {fileList.length > 0 ? "Change" : "Upload"}
                  </Button>
                </Upload>
              </ImgCrop>
            </Col>

            {fileList.length > 0 && (
              <>
                <Col>
                  <Dropdown
                    overlay={filterMenu}
                    trigger={["click"]}
                    placement="bottomLeft"
                  >
                    <Button
                      icon={<PictureOutlined />}
                      size="large"
                    >
                      Filters
                    </Button>
                  </Dropdown>
                </Col>

                {selectedFilter !== "none" && (
                  <Col>
                    <Button
                      icon={<CloseOutlined />}
                      size="large"
                      onClick={resetFilter}
                    >
                      Reset
                    </Button>
                  </Col>
                )}

                <Col>
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    size="large"
                    onClick={handleProcessImage}
                    loading={isLoading}
                    className="process-button"
                  >
                    Analyze
                  </Button>
                </Col>
              </>
            )}
          </Row>
        </div>
      </Content>

      <Sider 
        width={400} 
        style={{ 
          background: "#fff", 
          padding: "24px",
          borderLeft: "1px solid #f0f0f0",
          overflowY: "auto"
        }}
      >
        <Title level={4} style={{ marginBottom: "24px" }}>Analysis Results</Title>
        
        {messages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px" }}>
            <Text type="secondary">Results will appear here after analysis</Text>
          </div>
        ) : (
          <List
            dataSource={messages}
            renderItem={(message, index) => (
              <List.Item style={{ padding: "12px 0" }}>
                <div style={{ width: "100%" }}>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "flex-start",
                    marginBottom: "8px"
                  }}>
                    <Avatar
                      icon={message.sender === "user" ? <UserOutlined /> : <RobotOutlined />}
                      style={{
                        backgroundColor: message.sender === "user" ? "#4a6bdf" : "#7c4dff",
                        marginRight: "12px"
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      {renderMessageContent(message)}
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {message.time}
                      </Text>
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />
        )}
      </Sider>
    </Layout>
  );
};

export default UploadFile;