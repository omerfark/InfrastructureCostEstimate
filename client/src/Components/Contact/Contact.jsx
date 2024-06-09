import React, { useState } from "react";
import "./Contact.css";
import msg_icon from "../../assets/msg-icon.png";
import mail_icon from "../../assets/mail-icon.png";
import phone_icon from "../../assets/phone-icon.png";
import location_icon from "../../assets/location-icon.png";
import white_arrow from "../../assets/white-arrow.png";
import Title from "../Title/Title";
import excavator_2 from "../../assets/excavator-2.png";
import { Link } from "react-router-dom";
import excavator_1 from "../../assets/excavator-1.png";
import truck_1 from "../../assets/truck-1.png";
import paver_1 from "../../assets/paver-1.png";
import freze_1 from "../../assets/freze-1.png";
import LeafletMap from "../LeafletMap/LeafletMap";

const Contact = () => {
  const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "f40dfbb8-c23d-4e36-9ef7-4cd095421378");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Sending Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  const [distance, setDistance] = useState(0);

  const handleTotalDistanceChange = (newDistance) => {
    setDistance(newDistance);
  };

  const [showMap, setShowMap] = useState(false);
  const toggleMap = () => {
    setShowMap(!showMap);
  };

  return (
    <>
      <Title subTitle="" title="About Us" />
      <div className="about ">
        <div className="about-left">
          <img src={excavator_2} alt="" className="about-img" />
        </div>

        <div className="about-right">
          <h3></h3>
          <h2>About This Project</h2>
          <p>
            This project focuses on providing essential information and
            guidelines for the installation of critical infrastructure
            components, including underground electrical systems, asphalt road
            construction, and concrete sewer pipe installation. Our goal is to
            ensure that all aspects of these installations are clearly
            understood, from cost considerations to technical specifications, to
            support efficient and effective project planning and execution. By
            leveraging industry best practices and high-quality materials, we
            aim to enhance the durability, safety, and performance of
            infrastructure projects.
          </p>
        </div>
      </div>

      <div className="campus">
        <Title subTitle="Vehicles" title="About Vehicles " />
        <div className="gallery">
          <img src={excavator_1} alt="" />
          <img src={truck_1} alt="" />
          <img src={paver_1} alt="" />
          <img src={freze_1} alt="" />
        </div>
        <Link to="/">
          <button className="btn dark-btn">
            See more here <img src={white_arrow} alt="" />
          </button>
        </Link>
      </div>

      <Title subTitle="Contact" title="Contact us" />
      <div className="contact">
        <div className="contact-col">
          <h3>
            Send us a message <img src={msg_icon} alt="" />
          </h3>
          <p>
            For any inquiries or further information about our project and
            services, please feel free to contact us. We are here to assist you
            and provide the support you need. Reach out to us via email or
            phone, and our team will respond promptly to your queries. We look
            forward to hearing from you!
          </p>
          <ul>
            <li>
              <img src={mail_icon} alt="" />
              contact@omerstack.dev
            </li>
            <li>
              <img src={phone_icon} alt="" />
              +90 544-745-20-12
            </li>
            <li>
              <img src={location_icon} alt="" />
              İstanbul / Beykoz <br /> Türkiye
            </li>
          </ul>
        </div>
        <div className="contact-col">
          <form onSubmit={onSubmit}>
            <label>Your name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              required
            />
            <label>Phone number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your mobile number"
              required
            />
            <label>Write your message</label>
            <textarea
              name="message"
              id=""
              cols=""
              rows="6"
              placeholder="Enter your message"
              required
            ></textarea>
            <button type="submit" className="btn dark-btn">
              Submit now <img src={white_arrow} alt="" />
            </button>
          </form>
          <span>{result}</span>
        </div>
      </div>

      {/* <div>
        <LeafletMap onTotalDistanceChange={handleTotalDistanceChange}/>
        <h2> total distance : {distance}</h2>
      </div> */}

      <div>
        <Title subTitle="Map" title="Map container" />
        <h1>My Map Application</h1>

        <button onClick={toggleMap}>{showMap ? "Hide Map" : "Show Map"}</button>
        {showMap && (
          <div>
            <LeafletMap onTotalDistanceChange={handleTotalDistanceChange} />
            <h2>Total Distance: {distance} m</h2>
          </div>
        )}
      </div>
    </>
  );
};

export default Contact;
