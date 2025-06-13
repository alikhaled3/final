
import UploadFile from "./../components/UploadImage";
import logo from '../assets/logo.png'

import Navbar from './../components/navBar';
import { HistoryOutlined, QuestionOutlined, SettingOutlined, StarOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

import img1 from '../assets/5723525.png'
import img2 from '../assets/png-transparent-upload-cloud-folder-upload-folder-folder-file-document-data-3d-icon-removebg-preview.png'
import img3 from '../assets/scan_ocr - Copy.jpg'
function Home() {
    const navigate = useNavigate();
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
              <UploadOutlined className="me-2 blueText" />
              Upload Now
            </button>
            <button className="btn  text-start py-2 d-flex align-items-center " onClick={()=>navigate('/history')}>
              <HistoryOutlined className="me-2  blueText" />
              History
            </button>

            <button className="btn  text-start py-2 d-flex align-items-center" onClick={()=>navigate('/settings')}>
              <SettingOutlined className="me-2 blueText" />
              Settings
            </button>
            <button className="btn  text-start py-2 d-flex align-items-center" onClick={()=>navigate('/helpcenterpage')}>
            <QuestionOutlined className="me-2 blueText" />
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

      <div className="bgUploadPage mb-5">

        <UploadFile/>
      </div>
            <div className="container mb-5 mt-5">
        <h4 className="text-primary mb-4">Related Resources</h4>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title Text1">Getting Started</h5>
                <p className="card-text">Learn how to upload, crop, and analyze prescriptions easily.</p>
                <button className="btn btn-link p-0 text-primary" onClick={() => navigate('/helpcenterpage')}>
                  View Guide →
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title Text3">Video Tutorial</h5>
                <p className="card-text">Watch a step-by-step video walkthrough.</p>
                <button className="btn btn-link p-0 text-primary" onClick={() => navigate('/helpcenterpage')}>
                  Watch Now →
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title Text4">FAQs</h5>
                <p className="card-text">Find answers to common questions about analysis and formats.</p>
                <button className="btn btn-link p-0 text-primary" onClick={() => navigate('/helpcenterpage')}>
                  Read FAQs →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


            {/* 🔹 Visual/Image Section */}
      <div className="container mb-5 mt-5">
        <h4 className="text-primary mb-4">Featured Insights</h4>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card h-100 shadow-sm overflow-hidden">
              <div className="row g-0">
                <div className="col-md-6">
                  <img 
                    src={img2}
                    className="img-fluid w-100 h-100 object-fit-cover" 
                    alt="Upload Tips" 
                  />
                </div>
                <div className="col-md-6 p-3 d-flex flex-column justify-content-center">
                  <h5>Upload Tips</h5>
                  <p>Ensure your prescription image is clear and well-lit. Avoid blur or glare for the best results.</p>
                  <button className="btn btn-sm btn-outline-primary mt-2" onClick={() => navigate('/helpcenterpage')}>Learn More</button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card h-100 shadow-sm overflow-hidden">
              <div className="row g-0">
                <div className="col-md-6">
                  <img 
                    src={img1} 
                    className="img-fluid w-100 h-100 object-fit-cover" 
                    alt="Security Information" 
                  />
                </div>
                <div className="col-md-6 p-3 d-flex flex-column justify-content-center">
                  <h5>Data Security</h5>
                  <p>Your uploads are encrypted and never shared. We comply with healthcare privacy standards.</p>
                  <button className="btn btn-sm btn-outline-primary mt-2" onClick={() => navigate('/helpcenterpage')}>View Policy</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <img src={img3} alt="" className="w-50" />
      </div>
      <div className="mt-5">
        <Footer/>
      </div>
  </>


  
}

export default Home;
