import { Button } from 'antd'
import React from 'react'
import logo from '../assets/logo.png'
function Navbar() {
  return (
          <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-3">
                <div className="container-fluid">
                  <a className="navbar-brand fw-bold fs-4 text-primary d-flex align-items-center" href="/">
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
  )
}

export default Navbar