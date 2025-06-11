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
            <motion.div
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
                      style={{ width: "25px", height: "25px" }}
                    >
                      <div className="">
                        <img src={logo} alt="" width={59} />
                      </div>
                    </span>
                    Pharmacology
                  </a>
                </div>
              </nav>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
                <UploadFile />

          </motion.div>


        </motion.div>
      </motion.div>
    </div>
  );
}

export default Home;
