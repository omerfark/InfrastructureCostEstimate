import React from "react";
import './HeadTr.css'

const HeadTr = (props) => {
  return (
    <div>
      <header>
        <div
          className="p-5  mb-5 text-center bg-image"
          style={{
            backgroundImage:
              "url('https://dmt55mxnkgbz2.cloudfront.net/900x0_s3-57820-MNSW-171_22-LP-1_jpeg.jpg')",
            height: 250,
          }}
        >
          <div
            className="mask"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          >
            <div className="d-flex justify-content-center align-items-center h-10">
              <div className="text-white">
                <div className="button-container">
                  <a className="custom-btn" href="/" role="button">
                    Main
                  </a>
                  <i className="separator">/</i>
                  <a
                    className="custom-btn"
                    href={props.items}
                    role="button"
                  >
                    {props.items}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default HeadTr;
