import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-light min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
        <a className="navbar-brand fw-bold fs-4 text-primary" href="/">
          Pharmacology
        </a>
        <div className="ms-auto">
          <Button
            type="text"
            className="me-2"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button type="primary" onClick={() => navigate('/register')}>
            Register
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container d-flex flex-column justify-content-center align-items-center text-center py-5" style={{ minHeight: '85vh' }}>
        <motion.h1
          className="display-5 fw-bold mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          AI-Powered Prescription Reader
        </motion.h1>

        <motion.p
          className="lead mb-4"
          style={{ maxWidth: '700px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Pharmacology is a cutting-edge AI application that helps users read and extract information from handwritten medical prescriptions. By using advanced OCR and deep learning, it transforms complex handwriting into clear, structured data — improving clarity, safety, and accessibility in healthcare.
        </motion.p>

        <motion.div
          className="d-flex gap-3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button type="primary" size="large" onClick={() => navigate('/login')}>
            Get Started
          </Button>
          <Button type="default" size="large" onClick={() => navigate('/register')}>
            Create Account
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
