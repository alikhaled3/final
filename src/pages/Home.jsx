import React from "react";
import { motion } from "framer-motion";
import { Button, Card } from "antd";
import { FileTextOutlined, UploadOutlined } from "@ant-design/icons";
import UploadFile from "./../components/UploadImage";
import Sidebar from "./../components/SideBar";
import logo from "../assets/logo.png";
function Home() {
  return (
    <div className="home-container d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar (Fixed) */}
      <Sidebar />

      {/* Main Content with left margin for sidebar */}
      <motion.div
        className="flex-grow-1 "
        style={{ marginLeft: "250px" }} // Adjust based on your sidebar width
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
            ></motion.h2>
            <motion.p
              className="lead text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <nav className="navbar navbar-expand-lg navbar-light bg-white ">
                <div className="container-fluid justify-content-center">
                  <a
                    className="navbar-brand fw-bold fs-5 text-primary d-flex align-items-center"
                    href="/"
                  >
                    <span
                      className="text-white rounded-circle me-2 d-inline-flex align-items-center justify-content-center"
                      style={{ width: "36px", height: "36px" }}
                    >
                      <div className="">
                        <img src={logo} alt="" width={59} />
                      </div>
                    </span>
                    Pharmacology
                  </a>
                </div>
              </nav>
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
                <UploadFile />

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
                  <div
                    className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mb-3"
                    style={{ width: "50px", height: "50px" }}
                  >
                    <FileTextOutlined style={{ fontSize: "20px" }} />
                  </div>
                  <h5 className="fw-bold">Recent Files</h5>
                  <p className="text-muted">
                    Access your previously scanned prescriptions
                  </p>
                  <Button type="text" className="ps-0">
                    View all →
                  </Button>
                </div>
              </Card>
            </div>
            <div className="col-md-4 mb-4">
              <Card className="border-0 shadow-sm h-100">
                <div className="p-3">
                  <div
                    className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mb-3"
                    style={{ width: "50px", height: "50px" }}
                  >
                    <FileTextOutlined style={{ fontSize: "20px" }} />
                  </div>
                  <h5 className="fw-bold">Tutorial</h5>
                  <p className="text-muted">
                    Learn how to get the best results from your scans
                  </p>
                  <Button type="text" className="ps-0">
                    Watch tutorial →
                  </Button>
                </div>
              </Card>
            </div>
            <div className="col-md-4 mb-4">
              <Card className="border-0 shadow-sm h-100">
                <div className="p-3">
                  <div
                    className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mb-3"
                    style={{ width: "50px", height: "50px" }}
                  >
                    <FileTextOutlined style={{ fontSize: "20px" }} />
                  </div>
                  <h5 className="fw-bold">Support</h5>
                  <p className="text-muted">
                    Need help? Contact our support team
                  </p>
                  <Button type="text" className="ps-0">
                    Contact us →
                  </Button>
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
