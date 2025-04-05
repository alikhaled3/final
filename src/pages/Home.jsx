import React from 'react';
import { motion } from 'framer-motion';
import UploadFile from './../components/UploadImage';
import Sidebar from './../components/SideBar';

function Home() {
  return (
    <div className="home-container">
      {/* Sidebar (Fixed) */}
      <Sidebar />

      {/* Main Content with left margin for sidebar */}
      <motion.div
        className="content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <motion.h3 
          className="text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Prescription Reader
        </motion.h3>
        <motion.p 
          className="text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Welcome to Pharmacology
        </motion.p>
        <UploadFile />
      </motion.div>
    </div>
  );
}

export default Home;

