import React, { useState, useEffect } from "react";
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
  CloudUploadOutlined,
  HistoryOutlined,
  StarOutlined,
  SettingOutlined,
  QuestionOutlined,
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
  Steps,
  Progress,
  Dropdown,
  Menu,
  Modal,
  Carousel,
  Rate,
} from "antd";
import { Image as AntdImage } from "antd";
import ImgCrop from "antd-img-crop";
import axios from "axios";
import MedicationItem from "./MedicationItem";
import useMedicationExtractor from "./../hooks/useMedicationExtractor";
import Sidebar from "./SideBar";
import Navbar from "./navBar";

const { Text, Title } = Typography;
const { Step } = Steps;

const filterOptions = [
  { key: "none", label: "No Filter", value: "none" },
  { key: "grayscale", label: "Grayscale", value: "grayscale" },
  { key: "invert", label: "Invert Colors", value: "invert" },
  { key: "sepia", label: "Sepia", value: "sepia" },
  { key: "contrast", label: "High Contrast", value: "contrast" },
  { key: "brightness", label: "Increase Brightness", value: "brightness" },
  { key: "sobel", label: "Sobel Edge Detection" },
  { key: "laplacian", label: "Laplacian Edge Detection" },
];

const UploadFile = () => {
  const [fileList, setFileList] = useState([]);
  const [cropedImages, setcropedImages] = useState([]);
  const [ImageStepsUrl, setImageStepsUrl] = useState([]);
  console.log(cropedImages);

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
  const [filteredImage, setFilteredImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  console.log(fileList);

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

        // Helper function to get pixel value at (x,y)
        function getPixel(x, y) {
          if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
            return [0, 0, 0]; // Return black for out of bounds
          }
          const offset = (y * canvas.width + x) * 4;
          return [
            imageData.data[offset],
            imageData.data[offset + 1],
            imageData.data[offset + 2],
          ];
        }

        // Convert to grayscale first for edge detection
        if (filterType === "sobel" || filterType === "laplacian") {
          for (let i = 0; i < data.length; i += 4) {
            const gray =
              0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            data[i] = data[i + 1] = data[i + 2] = gray;
          }
          ctx.putImageData(imageData, 0, 0);
        }

        switch (filterType) {
          case "grayscale":
            for (let i = 0; i < data.length; i += 4) {
              const avg =
                0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
              data[i] = data[i + 1] = data[i + 2] = avg;
            }
            break;
          case "invert":
            for (let i = 0; i < data.length; i += 4) {
              data[i] = 255 - data[i];
              data[i + 1] = 255 - data[i + 1];
              data[i + 2] = 255 - data[i + 2];
            }
            break;
          case "sepia":
            for (let i = 0; i < data.length; i += 4) {
              data[i] = Math.min(
                255,
                data[i] * 0.393 + data[i + 1] * 0.769 + data[i + 2] * 0.189
              );
              data[i + 1] = Math.min(
                255,
                data[i] * 0.349 + data[i + 1] * 0.686 + data[i + 2] * 0.168
              );
              data[i + 2] = Math.min(
                255,
                data[i] * 0.272 + data[i + 1] * 0.534 + data[i + 2] * 0.131
              );
            }
            break;
          case "contrast":
            const contrastFactor = 2.5;
            for (let i = 0; i < data.length; i += 4) {
              data[i] = 128 + contrastFactor * (data[i] - 128);
              data[i + 1] = 128 + contrastFactor * (data[i + 1] - 128);
              data[i + 2] = 128 + contrastFactor * (data[i + 2] - 128);
            }
            break;
          case "brightness":
            const brightness = 50;
            for (let i = 0; i < data.length; i += 4) {
              data[i] = Math.min(255, data[i] + brightness);
              data[i + 1] = Math.min(255, data[i + 1] + brightness);
              data[i + 2] = Math.min(255, data[i + 2] + brightness);
            }
            break;
          case "sobel":
            const sobelData = new Uint8ClampedArray(data.length);

            // Sobel kernels
            const sobelX = [
              [-1, 0, 1],
              [-2, 0, 2],
              [-1, 0, 1],
            ];

            const sobelY = [
              [-1, -2, -1],
              [0, 0, 0],
              [1, 2, 1],
            ];

            for (let y = 0; y < canvas.height; y++) {
              for (let x = 0; x < canvas.width; x++) {
                let pixelX = 0;
                let pixelY = 0;

                // Apply Sobel kernels
                for (let ky = -1; ky <= 1; ky++) {
                  for (let kx = -1; kx <= 1; kx++) {
                    const pixel = getPixel(x + kx, y + ky);
                    const gray = pixel[0];

                    pixelX += gray * sobelX[ky + 1][kx + 1];
                    pixelY += gray * sobelY[ky + 1][kx + 1];
                  }
                }

                const magnitude = Math.min(
                  255,
                  Math.sqrt(pixelX * pixelX + pixelY * pixelY)
                );
                const offset = (y * canvas.width + x) * 4;
                sobelData[offset] =
                  sobelData[offset + 1] =
                  sobelData[offset + 2] =
                    magnitude;
                sobelData[offset + 3] = 255; // Alpha channel
              }
            }

            // Copy the result back to the original data
            for (let i = 0; i < data.length; i++) {
              data[i] = sobelData[i];
            }
            break;
          case "laplacian":
            const laplacianData = new Uint8ClampedArray(data.length);

            // Laplacian kernel
            const laplacianKernel = [
              [0, 1, 0],
              [1, -4, 1],
              [0, 1, 0],
            ];

            for (let y = 0; y < canvas.height; y++) {
              for (let x = 0; x < canvas.width; x++) {
                let sum = 0;

                // Apply Laplacian kernel
                for (let ky = -1; ky <= 1; ky++) {
                  for (let kx = -1; kx <= 1; kx++) {
                    const pixel = getPixel(x + kx, y + ky);
                    const gray = pixel[0];
                    sum += gray * laplacianKernel[ky + 1][kx + 1];
                  }
                }

                const magnitude = Math.min(255, Math.abs(sum));
                const offset = (y * canvas.width + x) * 4;
                laplacianData[offset] =
                  laplacianData[offset + 1] =
                  laplacianData[offset + 2] =
                    magnitude;
                laplacianData[offset + 3] = 255; // Alpha channel
              }
            }

            // Copy the result back to the original data
            for (let i = 0; i < data.length; i++) {
              data[i] = laplacianData[i];
            }
            break;
          default:
            break;
        }

        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };
      img.src = imageUrl;
    });
  };

  const handleFilterSelect = async (filter) => {
    console.log("Filter selected:", filter);
    if (!fileList[0]?.originFileObj) {
      message.warning("Please upload an image first");
      return;
    }

    try {
      setSelectedFilter(filter);
      setShowFilterOptions(false);

      const imageUrl = URL.createObjectURL(fileList[0].originFileObj);
      console.log("Applying filter:", filter);

      if (filter === "none") {
        await resetFilter();
      } else {
        const filteredUrl = await applyFilter(imageUrl, filter);
        setFilteredImage(filteredUrl);
        setCurrentImage(filteredUrl);
      }

      URL.revokeObjectURL(imageUrl);
    } catch (error) {
      console.error("Error applying filter:", error);
      message.error("Failed to apply filter");
    }
  };

  const resetFilter = async () => {
    if (!fileList[0]?.originFileObj) return;

    try {
      setSelectedFilter("none");
      const imageUrl = URL.createObjectURL(fileList[0].originFileObj);
      const normalizedUrl = await normalizeImage(imageUrl);
      setFilteredImage(null);
      setCurrentImage(normalizedUrl);
      URL.revokeObjectURL(imageUrl);
    } catch (error) {
      console.error("Error resetting filter:", error);
      message.error("Failed to reset filter");
    }
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
      reader.onload = async (e) => {
        const normalizedUrl = await normalizeImage(e.target.result);
        console.log(normalizedUrl);

        localStorage.setItem("normalizedImage", normalizedUrl);
        localStorage.setItem("originalImage", e.target.result);
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
    console.log(imageUrl);

    localStorage.setItem("originalImageUrl", imageUrl);
    const normalizedUrl = await normalizeImage(imageUrl);
    localStorage.setItem("normalizedImageUrl", normalizedUrl);
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
          setProgressPercent(98);
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
      console.log(response.data);

      const { full_text, segmented_image, cropped_images } = response.data;
      console.log(cropped_images);
      console.log(cropedImages);

      const processedUrl = `data:image/jpeg;base64,${segmented_image}`;
      if (full_text) {
        setProgressPercent(100);
      }
      setcropedImages(cropped_images);
      setExtractedText(full_text);
      localStorage.setItem("imageAfterSegment", processedUrl);
      showModal();
      extractMedications();
      setCurrentImage(processedUrl);

      setMessages((prev) => [
        ...prev.filter((msg) => msg.type !== "status"),
        {
          type: "extracted-text",
          content: full_text,
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
      items={filterOptions.map((option) => ({
        key: option.key,
        label: option.label,
      }))}
    />
  );

  return (
    <>
      <div className="container  p-0 vh80">
        <div className="row g-0 h-100">
          {/* Sidebar */}
          {/* Main Content Area */}


          <div className="col-md-6 p-4 me-5 d-flex flex-column h-100">
            {/* Upload/Drop Area */}
            <div
              className={`flex-grow-1 d-flex justify-content-center align-items-center bg-light rounded mb-3 border-dashed ${
                !currentImage ? "border-2" : "border-1"
              } border-secondary`}
              style={{
                minHeight: "300px",
                borderStyle: "dashed",
                transition: "all 0.3s",
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add("border-primary", "bg-info");
                e.currentTarget.style.backgroundColor = "#e6f7ff";
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove("border-primary", "bg-info");
                e.currentTarget.style.backgroundColor = "";
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove("border-primary", "bg-info");
                e.currentTarget.style.backgroundColor = "";

                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  const file = e.dataTransfer.files[0];
                  if (file.type.match("image.*")) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setCurrentImage(event.target.result);
                      setFileList([
                        {
                          uid: "-1",
                          name: file.name,
                          status: "done",
                          url: event.target.result,
                          originFileObj: file,
                        },
                      ]);
                      handleProcessImage();
                    };
                    reader.readAsDataURL(file);
                  }
                }
              }}
            >
              {currentImage ? (
                <div className="text-center">
                  <img
                    src={currentImage}
                    className="img-fluid rounded shadow"
                    style={{ maxHeight: "60vh" }}
                    alt="Prescription"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <CloudUploadOutlined
                    className="text-primary mb-3"
                    style={{ fontSize: "3rem" }}
                  />
                  <h4 className="mb-2">No Prescription Uploaded</h4>
                  <p className="text-muted">
                    Drag and drop an image or click upload to begin analysis
                  </p>
                </div>
              )}
            </div>

            {/* Control Panel */}
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex flex-wrap justify-content-center gap-3">
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
                      beforeUpload={(file) => {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          setImageStepsUrl((prev) => [
                            ...prev,
                            { ImageUrl: e.target.result },
                          ]);
                          localStorage.setItem(
                            "originalImageBeforeCrop",
                            e.target.result
                          );
                          setCurrentImage(e.target.result);
                          setFileList(
                            [
                              {
                                uid: "-1",
                                name: file.name,
                                status: "done",
                                url: e.target.result,
                                originFileObj: file,
                              },
                            ],
                            () => {
                              handleProcessImage();
                            }
                          );
                        };
                        reader.readAsDataURL(file);
                        return false;
                      }}
                    >
                      <Button
                        icon={<UploadOutlined />}
                        size="large"
                        className="me-2"
                        type="primary"
                      >
                        {fileList.length > 0 ? "Change" : "Upload"}
                      </Button>
                    </Upload>
                  </ImgCrop>

                  {fileList.length > 0 && (
                    <>
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
                          className="me-2"
                        >
                          Filters
                        </Button>
                      </Dropdown>

                      {selectedFilter !== "none" && (
                        <Button
                          icon={<CloseOutlined />}
                          size="large"
                          onClick={resetFilter}
                        >
                          Reset
                        </Button>
                      )}
                      <Button type="primary" size="large" onClick={showModal}>
                        Image Details
                      </Button>
                      <Button
                        type="primary"
                        icon={<SendOutlined />}
                        size="large"
                        onClick={handleProcessImage}
                        loading={isLoading}
                        className="me-2"
                      >
                        Analyze
                      </Button>
                      {extractedText ? <Rate defaultValue={2.5} /> : ""}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Modal
            title="Image Processing Steps"
            closable={{ "aria-label": "Custom Close Button" }}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Carousel
              autoplay={{ dotDuration: true }}
              autoplaySpeed={3000}
              className="custom-carousel"
            >
              <div>
                <h5 className="text-center">Step 1: Original Image</h5>
                <div className="p-4">
                  <AntdImage
                    width={200}
                    src={localStorage.getItem("originalImage")}
                  />
                  <p className="mt-2">
                    This is the original prescription image uploaded by the
                    user. The system will process this image through several
                    stages to extract the text content. The quality of this
                    initial image significantly affects the accuracy of text
                    extraction.
                  </p>
                </div>
              </div>

              <div>
                <h5 className="text-center">Step 2: Normalized Image</h5>
                <div className="p-4">
                  <AntdImage
                    width={200}
                    src={localStorage.getItem("normalizedImage")}
                  />
                  <p className="mt-2">
                    The image undergoes normalization to improve readability.
                    This includes adjusting brightness, contrast, and removing
                    noise. Normalization helps standardize the image for better
                    text recognition, especially important for low-quality or
                    unevenly lit prescriptions.
                  </p>
                </div>
              </div>

              <div>
                <h5 className="text-center">Step 3: Cropped Image</h5>
                <div className="p-4">
                  {fileList.length > 0 ? (
                    <>
                      <AntdImage width={200} src={fileList[0].url} />
                      <p className="mt-2">
                        The system automatically crops the image to focus on the
                        relevant prescription area, removing unnecessary
                        background. This step improves OCR accuracy by
                        eliminating distractions and focusing processing power
                        on the text-containing regions.
                      </p>
                    </>
                  ) : (
                    "No cropped image available"
                  )}
                </div>
              </div>

              <div>
                <h5 className="text-center">
                  Step 4: Segmented Image with Extracted Text
                </h5>
                <div className="d-flex flex-column align-items-center">
                  <AntdImage
                    width={200}
                    src={localStorage.getItem("imageAfterSegment")}
                  />
                  <div className="p-4">
                    <p>
                      In this final processing stage, the system performs
                      Optical Character Recognition (OCR) to extract text from
                      the prescription. The segmented image shows which areas
                      were identified as containing text.
                    </p>
                    <p>
                      The extracted text undergoes validation and formatting to
                      present the prescription information in a structured,
                      readable format. Common processing includes:
                    </p>
                    <ul>
                      <li>Identifying medication names and dosages</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <h5 className="text-center">
                  Step 5: Segmented Images with Extracted Text
                </h5>
                <div className="p-4">
                  {fileList.length > 0 ? (
                    <>
                      {cropedImages.map((img) => {
                        return (
                          <AntdImage
                            width={100}
                            height={100}
                            src={`data:image/jpeg;base64,${img}`}
                          />
                        );
                      })}
                      <div className="mt-2" style={{ maxWidth: "600px" }}>
                        <p>
                          <strong>Precision OCR Processing:</strong> Each
                          segmented region undergoes specialized processing:
                        </p>
                        <ul>
                          <li>
                            <strong>Medical Terminology Focus:</strong> Enhanced
                            dictionary for drug names
                          </li>
                          <li>
                            <strong>Dosage Recognition:</strong> Special pattern
                            matching for mg/mL/etc
                          </li>
                          <li>
                            <strong>Handwriting Analysis:</strong> Adaptive
                            models for doctor handwriting
                          </li>
                          <li>
                            <strong>Context Validation:</strong> Cross-checking
                            between fields
                          </li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    "No cropped image available"
                  )}
                </div>
              </div>
            </Carousel>
          </Modal>

          {/* Results Sidebar */}

          <div className="col-md-5 my-3 bg-white p-4  border-start h-100 overflow-auto chateArea shadow">
            <h4 className="mb-4 text-center textResultColor">
              Analysis Results
            </h4>

            {messages.length === 0 ? (
              <div className="alert alert-light text-center">
                Results will appear here after analysis
              </div>
            ) : (
              <List
                dataSource={messages}
                renderItem={(message, index) => (
                  <List.Item className="p-0 mb-3">
                    <div className="w-100">
                      <div className="d-flex align-items-start mb-2">
                        <Avatar
                          icon={
                            message.sender === "user" ? (
                              <UserOutlined />
                            ) : (
                              <RobotOutlined />
                            )
                          }
                          className={`me-3 bg-purple-avatar`}
                        />
                        <div className="flex-grow-1">
                          {renderMessageContent(message)}
                          <small className="text-muted d-block mt-1">
                            {message.time}
                          </small>
                        </div>
                      </div>
                    </div>
                  </List.Item>
                )}
                className="message-list"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadFile;
