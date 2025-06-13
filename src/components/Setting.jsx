import React, { useState } from 'react';
import { SettingOutlined, SaveOutlined, LockOutlined, UserOutlined, QuestionOutlined, HistoryOutlined, UploadOutlined } from '@ant-design/icons';
import { Input, Switch, Button, Form, message } from 'antd';
import Footer from './Footer';
import logo from '../assets/logo.png'
const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = (values) => {
    console.log('Saved settings:', values);
    message.success('Settings saved!');
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
            <button className="btn  text-start py-2 d-flex align-items-center" onClick={()=>navigate('/home')}>
              <UploadOutlined className="me-2" />
              Upload Now
            </button>
            <button className="btn  text-start py-2 d-flex align-items-center " onClick={()=>navigate('/history')}>
              <HistoryOutlined className="me-2" />
              History
            </button>

            <button className="btn  text-start py-2 d-flex align-items-center" onClick={()=>navigate('/settings')}>
              <SettingOutlined className="me-2" />
              Settings
            </button>
            <button className="btn  text-start py-2 d-flex align-items-center" onClick={()=>navigate('/helpcenterpage')}>
            <QuestionOutlined className="me-2" />
              Help Center 
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

    <div className="container py-5">
      <h2 className="mb-4 text-primary">
        <SettingOutlined className="me-2" />
        Settings
      </h2>

      <div className="card shadow-sm">
        <div className="card-body">
          <Form layout="vertical" onFinish={handleSave}>
            <h5 className="mb-3">
              <UserOutlined className="me-2" />
              Profile Settings
            </h5>
            <Form.Item label="Full Name" name="fullName">
              <Input placeholder="Enter your full name" />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input placeholder="Enter your email address" />
            </Form.Item>

            <h5 className="mt-4 mb-3">
              <LockOutlined className="me-2" />
              Password
            </h5>
            <Form.Item label="New Password" name="password">
              <Input.Password placeholder="Enter new password" />
            </Form.Item>

            <h5 className="mt-4 mb-3">Preferences</h5>
            <div className="form-check form-switch mb-3">
              <Switch
                checked={notifications}
                onChange={(checked) => setNotifications(checked)}
              />
              <span className="ms-2">Enable Notifications</span>
            </div>

            <div className="form-check form-switch mb-4">
              <Switch
                checked={darkMode}
                onChange={(checked) => setDarkMode(checked)}
              />
              <span className="ms-2">Enable Dark Mode</span>
            </div>

            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              Save Changes
            </Button>
          </Form>
        </div>
      </div>
    </div>
    <Footer/>
  </>
  
};

export default SettingsPage;
