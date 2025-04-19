import React from 'react';
import { motion } from 'framer-motion';
import { Button, Card } from 'antd';
import { FileTextOutlined, UploadOutlined } from '@ant-design/icons';
import UploadFile from './../components/UploadImage';
import Sidebar from './../components/SideBar';

function Home() {
  return (
    <div className="home-container d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar (Fixed) */}
      <Sidebar />

      {/* Main Content with left margin for sidebar */}
      <motion.div
        className="flex-grow-1 p-4"
        style={{ marginLeft: '250px' }} // Adjust based on your sidebar width
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="container py-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center ">
            <motion.h2
              className="fw-bold mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <FileTextOutlined className="me-2 text-primary" />
              Prescription Reader
            </motion.h2>
            <motion.p
              className="lead text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Transform handwritten prescriptions into digital format with AI
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-0 shadow-sm mb-4">
              <div className="text-center p-4">

                <UploadFile />
              </div>
            </Card>
          </motion.div>

          <motion.div
            className="row mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="col-md-4 mb-4">
              <Card className="border-0 shadow-sm h-100">
                <div className="p-3">
                  <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: '50px', height: '50px' }}>
                    <FileTextOutlined style={{ fontSize: '20px' }} />
                  </div>
                  <h5 className="fw-bold">Recent Files</h5>
                  <p className="text-muted">Access your previously scanned prescriptions</p>
                  <Button type="text" className="ps-0">View all →</Button>
                </div>
              </Card>
            </div>
            <div className="col-md-4 mb-4">
              <Card className="border-0 shadow-sm h-100">
                <div className="p-3">
                  <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: '50px', height: '50px' }}>
                    <FileTextOutlined style={{ fontSize: '20px' }} />
                  </div>
                  <h5 className="fw-bold">Tutorial</h5>
                  <p className="text-muted">Learn how to get the best results from your scans</p>
                  <Button type="text" className="ps-0">Watch tutorial →</Button>
                </div>
              </Card>
            </div>
            <div className="col-md-4 mb-4">
              <Card className="border-0 shadow-sm h-100">
                <div className="p-3">
                  <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: '50px', height: '50px' }}>
                    <FileTextOutlined style={{ fontSize: '20px' }} />
                  </div>
                  <h5 className="fw-bold">Support</h5>
                  <p className="text-muted">Need help? Contact our support team</p>
                  <Button type="text" className="ps-0">Contact us →</Button>
                </div>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Home;

