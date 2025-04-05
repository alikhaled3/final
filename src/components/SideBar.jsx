import React, { useState } from 'react';
import { Tooltip} from 'antd';
import {
  HomeOutlined,
  MessageOutlined,
  SettingOutlined,
  UserOutlined,
  MenuOutlined,
  MobileOutlined,
} from '@ant-design/icons';
import img from '../assets/images.jpg'
const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { icon: <HomeOutlined />, label: 'Home' },
    { icon: <MessageOutlined />, label: 'Messages' },

  ];
  const menuItemsend = [
    { icon: <UserOutlined />, label: 'Profile' },
    { icon: <MobileOutlined />,   mobileLaber:'Mobile'   , img:<img src={img} alt="" /> },

    { icon: <SettingOutlined />, label: 'Settings' },
  ];

  return (
    <div
      className="bg-dark text-white d-flex flex-column justify-content-between p-5 "
      style={{
        width: open ? '270px' : '50px',
        height: '100vh',
        position: 'fixed',
        transition: 'width 0.3s ease',
      }}
    >
      {/* Toggle Button */}

      <div className="">
      <div
        className="d-flex align-items-center mb-4 cursor-pointer me-5"
        onClick={() => setOpen(!open)}
        style={{ cursor: 'pointer' }}
        >
        <MenuOutlined style={{ fontSize: '20px', color: '#fff' }} />
        {open && <span className="ms-2">Toggle</span>}
      </div>

      {/* Menu Items */}
      {menuItems.map((item, index) => (
        <div
        key={index}
        className="d-flex align-items-center gap-2 my-3 sidebar-icon"
        style={{
          padding: '8px',
          borderRadius: '8px',
          transition: 'background 0.3s',
          cursor: 'pointer',
        }}
        >
          <Tooltip title={!open ? item.label : ''} placement="right">
            <span style={{ fontSize: '18px', color: '#ccc' }}>{item.icon}</span>
          </Tooltip>
          {open && <span className="ms-2">{item.label}</span>}
        </div>
      ))}
      </div>
      <div className="">
              {menuItemsend.map((item, index) => (
        <div
          key={index}
          className="d-flex align-items-center gap-2 my-3 sidebar-icon"
          style={{
            padding: '8px',
            borderRadius: '8px',
            transition: 'background 0.3s',
            cursor: 'pointer',
          }}
        >
          <Tooltip title={!open ? item.label : item.img} placement="right">
            <span style={{ fontSize: '18px', color: '#ccc' }}>{item.icon}</span>
          </Tooltip>
          {open && <span className="ms-2">

            {item.label || item.mobileLaber}
            
            </span>}
        </div>
      ))}
      </div>

    </div>
  );
};

export default Sidebar;
