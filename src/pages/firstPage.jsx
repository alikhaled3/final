import React from 'react';
import { Button, Card, Row, Col, Statistic } from 'antd';
import { 
  FileTextOutlined, 
  WarningOutlined, 
  UserOutlined,
  MedicineBoxOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import img from '../assets/drug.jpg'
import logo from '../assets/logo.png'


const Index = () => {
  const navigate = useNavigate();

  // Statistics data - removed HospitalOutlined since it's not available
  const stats = [
    { title: "Annual Deaths from Prescription Errors", value: "7,000+", icon: <WarningOutlined />, color: "#ff4d4f" },
    { title: "Medication Errors Due to Handwriting", value: "1.5M+", icon: <FileTextOutlined />, color: "#1890ff" },
    { title: "Doctors Using Handwritten Prescriptions", value: "65%", icon: <UserOutlined />, color: "#52c41a" },
    { title: "Hospitals Affected Annually", value: "10,000+", icon: <MedicineBoxOutlined />, color: "#722ed1" }
  ];

  const features = [
    {
      title: "Smart Image Enhancement",  
      description: "Automatically sharpen and crop scanned prescriptions for optimal clarity",  
      icon: <FileTextOutlined  className="text-primary" style={{ fontSize: '24px' }} />  
    },  
    {
      title: "Precision Text Segmentation",  
      description: "AI extracts medication details by isolating text regions from handwritten scripts",  
      icon: <WarningOutlined className="text-primary" style={{ fontSize: '24px' }} />  
    },  
    {
      title: "Structured Data Output",  
      description: "Converts segmented text into organized digital records for error-free processing",  
      icon: <MedicineBoxOutlined className="text-primary" style={{ fontSize: '24px' }} />  
    }
  ];

  return (
    <div className="bg-light min-vh-100">
      {/* Modern Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-3">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold fs-5 text-primary d-flex align-items-center" href="/">
            <span className=" text-white rounded-circle me-2 d-inline-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
              <img src={logo} alt=""  width={59} />
            </span>
            Pharmacology
          </a>
          <div className="ms-auto d-flex align-items-center">
            <Button
              type="text"
              className="me-2 fw-medium"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button 
              type="primary" 
              onClick={() => navigate('/register')}
              className="fw-medium"
            >
              Register
            </Button>
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
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 mb-3 fw-medium">
            AI-Powered Healthcare Solution
          </span>
        </motion.div>

        <motion.h1
          className="display-5 fw-bold mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Zero Errors Prescription  <br /> with <span className="text-primary">AI Technology</span>
        </motion.h1>

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
          <h2 className="text-center mb-5 fw-bold">The Alarming Reality of Handwritten Prescriptions</h2>
          
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
                      title={stat.title}
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

      {/* Features Section */}
      <div className="container py-5 my-5">
        <h2 className="text-center mb-5 fw-bold">Key Features</h2>
        
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
                  <div className="d-flex flex-column align-items-center text-center p-3">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle mb-3">
                      {feature.icon}
                    </div>
                    <h4 className="fw-bold mb-2">{feature.title}</h4>
                    <p className="text-muted">{feature.description}</p>
                  </div>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>

      {/* How It Works Section */}
      <div className="container py-5 my-5">
        <h2 className="text-center mb-5 fw-bold">How Pharmacology Works</h2>
        
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
                  <div className="d-flex align-items-center justify-content-center bg-white rounded-2">

                    <img src={img} alt="" className='w-75' />
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
                    <h5 className="fw-bold">-image preprocessing filter sharpening and cropping </h5>
                    <p className="text-muted"> Enhance image clarity and remove unnecessary regions through sharpening filters and precise cropping. </p>
                  </div>
                </div>

                <div className="d-flex mb-4">
                  <div className="me-3">
                    <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                      2
                    </div>
                  </div>
                  <div>
                    <h5 className="fw-bold">-image segmentation and cropping </h5>
                    <p className="text-muted"> Isolate and extract specific regions of interest by segmenting the image and cropping relevant sections.</p>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="me-3">
                    <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                      3
                    </div>
                  </div>
                  <div>
                    <h5 className="fw-bold">-text recognition </h5>
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