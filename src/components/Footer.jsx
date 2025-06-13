import React from 'react'

function Footer() {
  return (
<footer className="sidebarBg text-white text-center pt-5 text-lg-start mt-5 border-top pt-4">
  <div className="container text-center text-md-start">
    <div className="row">

      <div className="col-md-3 mb-4">
        <h5 className="text-primary">Pharmacology</h5>
        <p>Your AI-powered prescription assistant, here to help you 24/7.</p>
      </div>

      <div className="col-md-3 mb-4">
        <h6 className="text-uppercase fw-bold">Resources</h6>
        <ul className="list-unstyled text-white">
          <li><a href="/helpcenterpage" className="text-decoration-none  text-white">Help Center</a></li>
          <li><a href="#" className="text-decoration-none  text-white">Video Tutorials</a></li>
          <li><a href="#" className="text-decoration-none  text-white">FAQs</a></li>
        </ul>
      </div>

      <div className="col-md-3 mb-4">
        <h6 className="text-uppercase fw-bold">Company</h6>
        <ul className="list-unstyled">
          <li><a href="#" className="text-decoration-none ">About Us</a></li>
          <li><a href="#" className="text-decoration-none ">Privacy Policy</a></li>
          <li><a href="#" className="text-decoration-none ">Terms of Service</a></li>
        </ul>
      </div>

      <div className="col-md-3 mb-4">
        <h6 className="text-uppercase fw-bold">Contact</h6>
        <p className=" mb-1">Email: support@pharmacology.ai</p>
        <p className=" mb-0">Phone: +1 234 567 890</p>
      </div>
    </div>
  </div>

  <div className="text-center py-3 border-top mt-3  text-white"  style={{ fontSize: '0.9rem' }}>
    © {new Date().getFullYear()} Pharmacology. All rights reserved.
  </div>
</footer>

  )
}

export default Footer