import React, { useState } from 'react';
import { House, Chat, Person, Gear, List } from 'react-bootstrap-icons';
import img from '../assets/images.jpg';
import { HistoryOutlined, QuestionOutlined, SettingOutlined, StarOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  return (
<div className="col-md-2 bg-dark text-white p-3 d-flex flex-column">
  <div className="sidebar-header mb-4">
    <h4 className="text-center">Pharmacology.AI</h4>
    <hr className="bg-light" />
  </div>
  
  <div className="flex-grow-1">
    <div className="d-flex flex-column gap-2">

      <button className="btn btn-dark text-start py-2 d-flex align-items-center">
        <HistoryOutlined className="me-2" />
        History
      </button>
      <button className="btn btn-dark text-start py-2 d-flex align-items-center" >
        <StarOutlined className="me-2" />
        Saved Results
      </button>
      <button className="btn btn-dark text-start py-2 d-flex align-items-center">
        <SettingOutlined className="me-2" />
        Settings
      </button>
    </div>
  </div>

  <div className="mt-auto">
    <div className="text-center mb-3">
      <button className="btn btn-primary py-2" onClick={()=>navigate('helpcenterpage')}>
        <QuestionOutlined className="me-2" />
        Help Center
      </button>
    </div>
    <div className="text-center">
      <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-2" 
           style={{ width: '40px', height: '40px' }}>
        <UserOutlined />
      </div>
      <p className="mb-0">User Name</p>
      <small className="text-muted">user@example.com</small>
    </div>
  </div>
</div>
  );
};

export default Sidebar;