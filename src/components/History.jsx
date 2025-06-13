import React from 'react';
import { ClockCircleOutlined, EyeOutlined, DeleteOutlined, UserOutlined, SettingOutlined, StarOutlined, HistoryOutlined, UploadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import logo from '../assets/logo.png'
import Footer from './Footer';
const historyData = [
  {
    id: 1,
    fileName: 'Prescription_Jan23.pdf',
    date: '2025-01-23 10:15 AM',
    result: 'Paracetamol, Ibuprofen'
  },
  {
    id: 2,
    fileName: 'Prescription_Feb02.jpg',
    date: '2025-02-02 9:02 AM',
    result: 'Amoxicillin'
  },
  {
    id: 3,
    fileName: 'Prescription_May15.png',
    date: '2025-05-15 2:40 PM',
    result: 'Ciprofloxacin, Vitamin D'
  }
];

const HistoryPage = () => {
  const handleView = (record) => {
    console.log('Viewing record:', record);
    // Navigate or show modal
  };

  const handleDelete = (id) => {
    console.log('Deleting record with id:', id);
    // Add delete logic (update state or API call)
  };

  return <>
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-3">
        <div className="container-fluid">
          <a
            className="navbar-brand fw-bold fs-4 text-primary d-flex align-items-center"
            href="/"
          >
            <span
              className=" text-white rounded-circle me-2 d-inline-flex align-items-center justify-content-center"
              style={{ width: "36px", height: "36px" }}
            >
              <img src={logo} alt="" width={59} />
            </span>
            Pharmacology
          </a>
          <div className="m-auto d-flex align-items-center">
            <button className="btn  text-start py-2 d-flex align-items-center">
              <UploadOutlined className="me-2" />
              Upload Now
            </button>
            <button className="btn  text-start py-2 d-flex align-items-center">
              <HistoryOutlined className="me-2" />
              History
            </button>
            <button
              className="btn  text-start py-2 d-flex align-items-center"
              onClick={() => navigate("helpcenterpage")}
            >
              <StarOutlined className="me-2" />
              Saved Results
            </button>
            <button className="btn  text-start py-2 d-flex align-items-center">
              <SettingOutlined className="me-2" />
              Settings
            </button>
          </div>
          <div className="">
            <div
              className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
              style={{ width: "40px", height: "40px" }}
            >
              <UserOutlined />
            </div>
          </div>
        </div>
      </nav>
    <div className="container py-5 vh80">
      <h2 className="mb-4 text-primary">
        <ClockCircleOutlined className="me-2" />
        Upload History
      </h2>

      {historyData.length === 0 ? (
        <div className="alert alert-info">No upload history available.</div>
      ) : (
          <div className="table-responsive">
          <table className="table align-middle table-bordered">
            <thead className="table-light">
              <tr>
                <th>File Name</th>
                <th>Date Uploaded</th>
                <th>Result Summary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((item) => (
                <tr key={item.id}>
                  <td>{item.fileName}</td>
                  <td>{item.date}</td>
                  <td>{item.result}</td>
                  <td>
                    <Button 
                      type="link" 
                      icon={<EyeOutlined />} 
                      onClick={() => handleView(item)}
                    >
                      View
                    </Button>
                    <Button 
                      type="link" 
                      danger 
                      icon={<DeleteOutlined />} 
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    <Footer/>
    </>
  
};

export default HistoryPage;
