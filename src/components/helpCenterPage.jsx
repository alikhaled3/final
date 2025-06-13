import { useState } from "react";
import {
  QuestionCircleOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  MessageOutlined,
  ArrowLeftOutlined,
  HistoryOutlined,
  StarOutlined,
  SettingOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import logo from "../assets/logo.png";
import usageExample from "../assets/usageExampleV.mp4";
import { Button } from "antd";
import Footer from "./Footer";

const HelpCenterPage = () => {
  const [activeSection, setActiveSection] = useState("main");
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "Hi! How can I assist you today?" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sections = {
    main: {
      title: "Help Center",
      items: [
        {
          icon: <FileTextOutlined className="text-primary" />,
          title: "Getting Started",
          description: "Learn how to upload and analyze prescriptions",
          action: () => setActiveSection("getting-started"),
        },
        {
          icon: <VideoCameraOutlined className="text-primary" />,
          title: "Video Tutorials",
          description: "Watch step-by-step guides",
          action: () => setActiveSection("tutorials"),
        },
        {
          icon: <MessageOutlined className="text-primary" />,
          title: "FAQs",
          description: "Find answers to common questions",
          action: () => setActiveSection("faqs"),
        },
      ],
    },
    "getting-started": {
      title: "Getting Started",
      content: (
        <div>
          <h5 className="mb-3">How to Use Prescription AI</h5>
          <ol className="list-group list-group-numbered mb-4">
            <li className="list-group-item border-0 ps-0">
              Click the Upload button or drag and drop your prescription image
            </li>
            <li className="list-group-item border-0 ps-0">
              Adjust the crop if needed and confirm
            </li>
            <li className="list-group-item border-0 ps-0">
              Click Analyze to process your prescription
            </li>
            <li className="list-group-item border-0 ps-0">
              View results in the right panel
            </li>
          </ol>

          <h5 className="mb-3">Supported Formats</h5>
          <ul className="list-group mb-4">
            <li className="list-group-item border-0 ps-0">
              JPEG, PNG, or PDF files
            </li>
            <li className="list-group-item border-0 ps-0">
              Clear, well-lit images work best
            </li>
            <li className="list-group-item border-0 ps-0">
              Minimum resolution: 300dpi recommended
            </li>
          </ul>
        </div>
      ),
    },
    tutorials: {
      title: "Video Tutorials",
      content: (
        <div>
          <div className="card mb-3">
            <div className="card-body">
              <h5>Basic Usage</h5>
              <div className="ratio ratio-16x9 bg-light rounded d-flex align-items-center justify-content-center">
      <iframe
        src={usageExample}
        title="Help Video"
        allowFullScreen
      ></iframe>
                <div className="text-center">
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    faqs: {
      title: "Frequently Asked Questions",
      content: (
        <div className="accordion" id="faqAccordion">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq1"
              >
                How accurate is the prescription analysis?
              </button>
            </h2>
            <div
              id="faq1"
              className="accordion-collapse collapse show"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                Our AI achieves approximately 95% accuracy for typed
                prescriptions and 85% for handwritten ones under good
                conditions. Always verify critical information.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq2"
              >
                Can I save my analyzed prescriptions?
              </button>
            </h2>
            <div
              id="faq2"
              className="accordion-collapse collapse"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                Yes, analyzed prescriptions are automatically saved to your
                history. You can also star important ones for quick access.
              </div>
              import Sidebar from './SideBar'; import Navbar from './navBar';
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq3"
              >
                Is my prescription data secure?
              </button>
            </h2>
            <div
              id="faq3"
              className="accordion-collapse collapse"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                We use end-to-end encryption and comply with healthcare data
                protection standards. Your data is never shared without consent.
              </div>
            </div>
          </div>
        </div>
      ),
    },
  };

  return (
    <>
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
      <div className="container p-0 vh-100">
        <div className="row g-0 h-100">
          {/* Sidebar (from your existing component) */}

          {/* Main Content */}
          <div className="col-md-12 p-4 h-100 overflow-auto">
            <div className="d-flex align-items-center mb-4">
              {activeSection !== "main" && (
                <button
                  onClick={() => setActiveSection("main")}
                  className="btn btn-light me-3"
                >
                  <ArrowLeftOutlined />
                </button>
              )}
              <h2 className="mb-0">
                <QuestionCircleOutlined className="me-2 text-primary" />
                {sections[activeSection].title}
              </h2>
            </div>

            {activeSection === "main" ? (
              <div className="row g-4">
                {sections.main.items.map((item, index) => (
                  <div key={index} className="col-md-6 col-lg-4">
                    <div
                      className="card h-100 cursor-pointer hover-shadow"
                      onClick={item.action}
                    >
                      <div className="card-body">
                        <div className="d-flex align-items-center mb-3">
                          <div className="me-3" style={{ fontSize: "1.5rem" }}>
                            {item.icon}
                          </div>
                          <h5 className="mb-0">{item.title}</h5>
                        </div>
                        <p className="text-muted">{item.description}</p>
                        <div className="text-primary mt-2">Learn more →</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card">
                <div className="card-body">
                  {sections[activeSection].content}
                </div>
              </div>
            )}

            {/* Contact Support Section */}
            {(activeSection === "main" || activeSection === "faqs") && (
              <div className="card mt-4 border-primary">
                <div className="card-body">
                  <h4 className="text-primary">
                    <MessageOutlined className="me-2" />
                    Still need help?
                  </h4>
                  <p className="mb-3">
                    Our support team is available 24/7 to assist you.
                  </p>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => setShowLiveChat(!showLiveChat)}
                  >
                    Live Chat
                  </button>

                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setShowSupportForm(!showSupportForm)}
                  >
                    Support
                  </button>
                  {showLiveChat && (
                    <div
                      className="border rounded mt-3 p-3"
                      style={{ maxHeight: "300px", overflowY: "auto" }}
                    >
                      <div
                        className="mb-2"
                        style={{ maxHeight: "200px", overflowY: "auto" }}
                      >
                        {chatMessages.map((msg, index) => (
                          <div
                            key={index}
                            className={`mb-2 p-2 rounded ${
                              msg.sender === "user"
                                ? "bg-primary text-white text-end"
                                : "bg-light text-start"
                            }`}
                          >
                            {msg.text}
                          </div>
                        ))}
                      </div>
                      <form
                        className="d-flex gap-2"
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!newMessage.trim()) return;

                          const userMsg = { sender: "user", text: newMessage };
                          const botMsg = {
                            sender: "bot",
                            text: "Thanks for your message! We’ll get back shortly.",
                          };

                          setChatMessages((prev) => [...prev, userMsg, botMsg]);
                          setNewMessage("");
                        }}
                      >
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button className="btn btn-primary" type="submit">
                          Send
                        </button>
                      </form>
                    </div>
                  )}

                  {showSupportForm && (
                    <form className="mt-3">
                      <div className="mb-3">
                        <label className="form-label">Your Email</label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="example@example.com"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Message</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          placeholder="How can we help you?"
                        />
                      </div>
                      <Button type="primary" htmlType="submit">
                        Send
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer/>
    </>
  );
};

export default HelpCenterPage;
