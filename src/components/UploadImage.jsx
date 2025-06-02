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
} from "antd";
import ImgCrop from "antd-img-crop";
import axios from "axios";
import MedicationExtractor from "./extract-text";
import useMedicationExtractor from "../hooks/useMedicationExtractor";
import MedicationItem from "./MedicationItem";
const { Text, Title } = Typography;
const { Step } = Steps;

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

    setMessages((prev) => [
      ...prev.filter((msg) => msg.type !== "image"),
      {
        type: "image",
        content: filteredUrl,
        sender: "user",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    URL.revokeObjectURL(imageUrl);
  };

  const resetFilter = async () => {
    if (!fileList[0]?.originFileObj) return;

    setSelectedFilter("none");
    const imageUrl = URL.createObjectURL(fileList[0].originFileObj);
    const normalizedUrl = await normalizeImage(imageUrl);
    setFilteredImage(null);

    setMessages((prev) => [
      ...prev.filter((msg) => msg.type !== "image"),
      {
        type: "image",
        content: normalizedUrl,
        sender: "user",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

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

    setMessages((prev) => [
      ...prev.filter(
        (msg) => msg.content !== "Upload a prescription to start analysis"
      ),
      {
        type: "image",
        content: normalizedUrl,
        sender: "user",
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

      setMessages((prev) => [
        ...prev.filter((msg) => msg.type !== "status"),
        {
          type: "processed-image",
          content: processedUrl,
          sender: "system",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
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
    console.log(med.Audio);

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
      case "image":
        return (
          <div className="prescription-card">
            <div className="prescription-image-container">
              <img
                src={message.content}
                className="prescription-image"
                alt="Prescription"
              />
            </div>
            <div className="prescription-label">
              {selectedFilter !== "none"
                ? `${
                    filterOptions.find((f) => f.key === selectedFilter)?.label
                  } Filter Applied`
                : "Normalized Prescription"}
            </div>
          </div>
        );
      case "processed-image":
        return (
          <div className="analysis-result">
            <Text strong className="section-title">
              Enhanced Analysis
            </Text>
            <div className="processed-image-container">
              <img
                src={message.content}
                className="processed-image"
                alt="Processed prescription"
              />
            </div>
          </div>
        );
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
    <div className="prescription-container overflow-y-hidden">
      <div className="prescription-content">
        <div className="message-area pt-5 mt-4">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-illustration text-danger iconsize">
                <MedicineBoxOutlined />
              </div>
              <Title level={4} className="empty-title">
                No Prescription Uploaded
              </Title>
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
                      icon={
                        message.sender === "user" ? (
                          <UserOutlined />
                        ) : (
                          <RobotOutlined />
                        )
                      }
                      className="message-avatar"
                      style={{
                        backgroundColor:
                          message.sender === "user" ? "#4a6bdf" : "#7c4dff",
                      }}
                    />
                    <div className="message-bubble">
                      {renderMessageContent(message)}
                      <div className="message-time">{message.time}</div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          )}
        </div>

        <div className="control-area">
          <Divider className="control-divider" />
          <div className="upload-controls">
            <Space>
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
                    className="upload-button bg-primary text-white"
                  >
                    {fileList.length > 0
                      ? "Change Prescription"
                      : "Upload Prescription"}
                  </Button>
                </Upload>
              </ImgCrop>

              {fileList.length > 0 && (
                <Dropdown
                  overlay={filterMenu}
                  trigger={["click"]}
                  placement="bottomLeft"
                  visible={showFilterOptions}
                  onVisibleChange={setShowFilterOptions}
                >
                  <Button
                    icon={<PictureOutlined />}
                    size="large"
                    className="filter-button"
                  >
                    {selectedFilter === "none"
                      ? "Apply Filter"
                      : filterOptions.find((f) => f.key === selectedFilter)
                          ?.label}
                  </Button>
                </Dropdown>
              )}

              {selectedFilter !== "none" && (
                <Button
                  icon={<CloseOutlined />}
                  size="large"
                  onClick={resetFilter}
                  className="reset-filter-button"
                >
                  Reset
                </Button>
              )}

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
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
