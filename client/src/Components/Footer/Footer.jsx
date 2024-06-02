import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <>
      <div className="footer"></div>

      <footer className="bg-body-tertiary text-center text-lg-start">
      <div className="container p-4 pb-0">
        <div className="row">
          <div className="col-md-6 col-12 mb-4 mb-md-0 text-start">
            <ul className="list-unstyled">
              <li>Terms of Services</li>
            </ul>
          </div>
          <div className="col-md-6 col-12 mb-4 mb-md-0 text-end">
            <ul className="list-unstyled">
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
      </div>
      <div
        className="text-center p-3"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
      >
        © Copyright 2024 : All rights reserved
      </div>
    </footer>
    </>
  );
};

export default Footer;
