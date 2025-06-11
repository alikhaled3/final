import React from 'react';
import { Button, Card, Row, Col, Statistic, Tag } from 'antd';
import { 
  FileTextOutlined, 
  WarningOutlined, 
  UserOutlined,
  MedicineBoxOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import img1 from '../assets/drug.jpg'
import logo from '../assets/logo.png';
import prescription from '../assets/processed_basic.jpg';

import prescription5 from '../assets/WhatsApp Image 2025-04-25 at 10.34.45 PM.jpeg';
import prescription6 from '../assets/download (2).jpg';
import headerImage from '../assets/HomeBack.png';
import prescription2 from '../assets/download (3).jpg';
import prescription4 from '../assets/download (1).jpg';
import image1 from '../assets/images (1).jpg';
import image2 from '../assets/imageeee.jpg';
import image3 from '../assets/pexels-photo-7578803.webp';
import scanImage from '../assets/Illustration-of-a-prescription-coming-out-of-a-computer-576x486.jpg';
import prescription3 from '../assets/FdZcM0WaMAASabt_1664381414282_1664381437487_1664381437487.webp';
import ReactCompareImage from 'react-compare-image';

// Add this style tag to include the Caveat font from Google Fonts
const caveatStyle = {
  fontFamily: "'Caveat', cursive",
  fontWeight: 'bold'
};

const { Meta } = Card;
const Index = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Prescription card data
  const prescriptionCards = [
    {
      imageBeforeAnalyze: prescription,
      imageAfterAnalyze: prescription2,
      image: img1,
      patient: "John Doe",
      date: "2023-05-15",
      medications: [
        { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", duration: "30 days" },
        { name: "Metformin", dosage: "500mg", frequency: "Twice daily", duration: "30 days" }
      ],
      notes: "Take with food. Monitor blood pressure regularly."
    },
    {
      imageBeforeAnalyze:prescription3 ,
      imageAfterAnalyze:prescription4 ,
      image: img1,
      patient: "Sarah Smith",
      date: "2023-06-20",
      medications: [
        { name: "Atorvastatin", dosage: "20mg", frequency: "At bedtime", duration: "90 days" },
        { name: "Albuterol", dosage: "90mcg", frequency: "As needed", duration: "1 year" }
      ],
      notes: "Use inhaler before exercise. Report any muscle pain."
    },
    {
      imageBeforeAnalyze: prescription5,
      imageAfterAnalyze: prescription6,
      image: img1,
      patient: "Michael Johnson",
      date: "2023-07-10",
      medications: [
        { name: "Levothyroxine", dosage: "50mcg", frequency: "Morning empty stomach", duration: "60 days" },
        { name: "Omeprazole", dosage: "20mg", frequency: "Once daily", duration: "30 days" },
        { name: "Levothyroxine", dosage: "50mcg", frequency: "Morning empty stomach", duration: "60 days" },
      ],
      notes: "Take thyroid med at least 30 mins before breakfast."
    },
  ];

  const features = [
  {
    title: "Smart Image Enhancement",  
    description: "Automatically sharpen and crop scanned prescriptions for optimal clarity",  
    image: image1
  },  
  {
    title: "Precision Text Segmentation",  
    description: "AI extracts medication details by isolating text regions from handwritten scripts",  
    image: image2
  },  
  {
    title: "Structured Data Output",  
    description: "Converts segmented text into organized digital records for error-free processing",  
    image: image3
  }
];
  // Statistics data
  const stats = [
    { title: "Annual Deaths from Prescription Errors", value: "7,000+", icon: <WarningOutlined />, color: "#ff4d4f" },
    { title: "Medication Errors Due to Handwriting", value: "1.5M+", icon: <FileTextOutlined />, color: "#1890ff" },
    { title: "Doctors Using Handwritten Prescriptions", value: "65%", icon: <UserOutlined />, color: "#52c41a" },
    { title: "Hospitals Affected Annually", value: "10,000+", icon: <MedicineBoxOutlined />, color: "#722ed1" }
  ];


  return (
    <div className="bg-light min-vh-100">
      {/* Add the Google Fonts link for Caveat */}
      <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" rel="stylesheet" />
      
      {/* Modern Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-3">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold fs-5 text-primary d-flex align-items-center" href="/" style={caveatStyle}>
            <span className="text-white rounded-circle me-2 d-inline-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
              <img src={logo} alt="" width={59} />
            </span>
            Pharmacology
          </a>
          <div className="ms-auto d-flex align-items-center">
            <Button type="text" className="me-2 fw-medium" onClick={() => navigate('/login')}>Login</Button>
            <Button type="primary" onClick={() => navigate('/register')} className="fw-medium">Register</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container d-flex flex-column justify-content-center align-items-center text-center py-5" style={{ minHeight: '70vh' }}>
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 mb-3 fw-medium" style={caveatStyle}>
            AI-Powered Healthcare Solution
          </span>
        </motion.div>

        <motion.h1
          className="display-5 fw-bold mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={caveatStyle}
        >
          Zero Errors Prescription <br /> with <span className="text-primary">AI Technology</span>
        </motion.h1>
                    <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >

                    <img src={headerImage} alt="" className='w-50' />

            </motion.div>
        <motion.p
          className="lead mb-4 text-muted"
          style={{ maxWidth: '700px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Each year, over <strong>7,000 deaths</strong> occur in the US alone due to medication errors caused by illegible handwriting. Our AI transforms handwritten prescriptions into clear, structured data — preventing errors and saving lives.
        </motion.p>

        <motion.div
          className="d-flex gap-3 mt-3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button 
            type="primary" 
            size="large" 
            onClick={() => navigate('/login')}
            className="px-4"
          >
            Try Demo
          </Button>
          <Button 
            type="default" 
            size="large" 
            onClick={() => navigate('/register')}
            className="px-4"
          >
            Get Started Free
          </Button>
        </motion.div>
      </div>
      {/* Statistics Section */}
      <div className="container-fluid bg-white py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold" style={caveatStyle}>The Alarming Reality of Handwritten Prescriptions</h2>
          
          <Row gutter={[24, 24]} className="mb-5">
            {stats.map((stat, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index }}
                >
                  <Card className="border-0 shadow-sm h-100">
                    <Statistic
                      title={<span >{stat.title}</span>}
                      value={stat.value}
                      prefix={<span style={{ color: stat.color }}>{stat.icon}</span>}
                      valueStyle={{ color: stat.color, fontWeight: 'bold' }}
                    />
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>

          <motion.div
            className="alert alert-warning mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <WarningOutlined className="me-2" />
            <strong>Did you know?</strong> A study published in the Journal of the American Medical Association found that 
            medication errors harm at least 1.5 million people annually in the US, with illegible handwriting being 
            a leading contributing factor.
          </motion.div>
        </div>
      </div>

<div className="container">
  <div className="row">
    <h3 className="text-center mb-4">OCR Demonstration and Result Analysis</h3>

    {/* Left: Image Comparison */}
    <div className="col-md-6">
      <div className="w-75 ms-5 p-5">
        <ReactCompareImage
          leftImage={prescription}
          rightImage={prescription2}
          sliderLineWidth={2}
          sliderLineColor="#fff"
          hover={true}
          style={{ objectFit: "" }}
        />
      </div>
    </div>

    {/* Right: OCR Description & Extracted Information */}
    <div className="col-md-6">
      <div className="ps-md-4 mt-5">
        {/* OCR Result */}
        <div className="border-top pt-4 mt-4">
          <h5 className="fw-bold mb-3">Extracted Text Output</h5>
          <p className="fst-italic">
            "10 . tat . refenolvadex . 1x2 . fall . y Kro can trental sr 400 1x2 y thiotacid . cup 600 &quot;m. jee ."
          </p>

          <h6 className="fw-bold mt-4">Identified Medications & Dosages</h6>
          <p className="text-muted">
            The Optical Character Recognition (OCR) process successfully extracted several key medication names along with their associated dosages from the input prescription image. Below is a summary of the structured output:
          </p>
          <ul className="list-unstyled">
            <li className="mb-2">
              <strong className="text-dark">Nolvadex</strong> — Detected as part of the handwritten content, commonly used in hormone therapy treatments.
            </li>
            <li className="mb-2">
              <strong className="text-dark">Trental</strong> — Identified with a prescribed dosage of <span className="text-success">400 mg</span>. It is often used to improve blood flow in patients with circulation problems.
            </li>
            <li>
              <strong className="text-dark">Thiotacid</strong> — Extracted with a dosage of <span className="text-success">600 mg</span>, typically prescribed for neuropathic pain or metabolic disorders.
            </li>
          </ul>

          <p className="mt-4 text-muted">
            The above output highlights the effectiveness of our OCR pipeline in parsing noisy, handwritten, or low-quality medical prescriptions and transforming them into clean, structured data for downstream processing or integration with healthcare systems.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>


<div className="container py-5 my-5">
  <h2 className="text-center mb-5 fw-bold" style={caveatStyle}>Key Features</h2>
  
  <Row gutter={[24, 24]}>
    {features.map((feature, index) => (
      <Col xs={24} md={8} key={index}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Card className="h-100 border-0 shadow-sm">
            <div className="d-flex flex-column align-items-center text-center p-4">
              <div className="mb-4" style={{ width: '100px', height: '100px' }}>
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="img-fluid rounded-circle"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    border: '3px solid rgba(24, 144, 255, 0.1)'
                  }}
                />
              </div>
              <h4 className="fw-bold mb-3" style={caveatStyle}>{feature.title}</h4>
              <p className="text-muted mb-0">{feature.description}</p>
            </div>
          </Card>
        </motion.div>
      </Col>
    ))}
  </Row>
</div>

      {/* How It Works Section */}
      <div className="container py-5 my-5">
        <h2 className="text-center mb-5 fw-bold" style={caveatStyle}>How Pharmacology Works</h2>
        
        <Row gutter={[24, 24]} className="align-items-center">
          <Col xs={24} md={12}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="bg-light p-4 rounded-3">
                <div className="ratio ratio-16x9">
                  <div className="d-flex align-items-center justify-content-center  rounded-2">
                    <img src={scanImage} alt="" className='w-75' />
                  </div>
                </div>
              </div>
            </motion.div>
          </Col>
          <Col xs={24} md={12}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="ps-md-4">
                <div className="d-flex mb-4">
                  <div className="me-3">
                    <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                      1
                    </div>
                  </div>
                  <div>
                    <h5 className="fw-bold" >Image preprocessing filter sharpening and cropping</h5>
                    <p className="text-muted">Enhance image clarity and remove unnecessary regions through sharpening filters and precise cropping.</p>
                  </div>
                </div>

                <div className="d-flex mb-4">
                  <div className="me-3">
                    <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                      2
                    </div>
                  </div>
                  <div>
                    <h5 className="fw-bold" >Image segmentation and cropping</h5>
                    <p className="text-muted">Isolate and extract specific regions of interest by segmenting the image and cropping relevant sections.</p>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="me-3">
                    <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                      3
                    </div>
                  </div>
                  <div>
                    <h5 className="fw-bold" >Text recognition</h5>
                    <p className="text-muted">Detect and convert text within the image into machine-readable characters using OCR (Optical Character Recognition).</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </Col>
        </Row>
      </div>

      {/* CTA Section */}
      <div className="bg-primary py-5">
        <div className="container text-center text-white">
          <motion.h2
            className="fw-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            style={caveatStyle}
          >
            Ready to Eliminate Prescription Errors?
          </motion.h2>
          <motion.p
            className="lead mb-5 opacity-75"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            viewport={{ once: true }}
          >
            Join hundreds of healthcare professionals using Pharmacology to prevent medication errors and save lives.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Button 
              type="default" 
              size="large" 
              onClick={() => navigate('/register')}
              className="fw-medium px-4 bg-white"
              icon={<ArrowRightOutlined />}
            >
              Start Free Trial
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;