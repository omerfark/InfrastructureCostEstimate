import React from "react";
import "./Contact.css";
import msg_icon from "../../assets/msg-icon.png";
import mail_icon from "../../assets/mail-icon.png";
import phone_icon from "../../assets/phone-icon.png";
import location_icon from "../../assets/location-icon.png";
import white_arrow from "../../assets/white-arrow.png";
import Title from "../Title/Title";
import excavator_2 from'../../assets/excavator-2.png'
import { Link } from 'react-router-dom'
import excavator_1 from '../../assets/excavator-1.png'
import truck_1 from '../../assets/truck-1.png'
import paver_1 from '../../assets/paver-1.png'
import freze_1 from '../../assets/freze-1.png'


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

  return (
    <>
     <Title subTitle="About Us" title="About us kısa yazı" />
    <div className='about '>
      
        <div className='about-left'>
            <img src={excavator_2} alt='' className='about-img'/>
        </div>
        
        <div className="about-right">
            <h3></h3>
            <h2></h2>
            <p>Lorem, ipsum dolor 
                sit amet consectetur adipisicing elit.
                Neque, nulla illum! Quasi quia iusto 
                amet ipsum hic eligendi et placeat
                explicabo, nulla reprehenderit.
                Similique sed, quas vel veritatis illum
                ducimus.</p>
            <p>Lorem ipsum dolor sit amet consectetur,
                adipisicing elit. Ipsum non culpa
                officia, aperiam voluptatum, veniam 
                quas quasi porro molestias quis
                officiis hic dolore a voluptatibus 
                nam dignissimos facere. Magni,
                voluptatem.</p>
        </div>
    </div>

    <div className='campus'>
      <Title subTitle='Vehicles' title='About Vehicles '/>
        <div className="gallery">
            <img src={excavator_1} alt=''/>
            <img src={truck_1} alt=''/>
            <img src={paver_1} alt=''/>
            <img src={freze_1} alt=''/>
        </div>
        <Link to="/"><button className='btn dark-btn'>See more here <img src={white_arrow} alt=''/></button>
</Link>
    </div>

      <Title subTitle="Contact" title="Contact us" />
      <div className="contact">
        <div className="contact-col">
          <h3>
            Send us a message <img src={msg_icon} alt="" />
          </h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
            ullam dolorum quae facilis quo tempore? Ullam perspiciatis, commodi
            sed iusto dolorem quod nobis labore odio repellendus quasi unde
            incidunt porro.
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
    </>
  );
};

export default Contact;
