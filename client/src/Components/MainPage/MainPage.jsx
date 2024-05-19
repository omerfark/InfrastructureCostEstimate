import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Hero from "../Hero/Hero";
import Title from "../Title/Title";
import "./MainPage.css";
import { Link } from "react-router-dom";
import excavator_image from "../../assets/excavator-image.png";
import büzz_pipe from "../../assets/büzz-pipe.png";
import asphalt_1 from "../../assets/asphalt-1.png";
import truck_1 from "../../assets/truck-1.png";
import program_icon_1 from "../../assets/program-icon-1.png";
import program_icon_2 from "../../assets/program-icon-2.png";
import program_icon_3 from "../../assets/program-icon-3.png";

function MainPage() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true; //cookie özelliği eklemek için

  useEffect(() => {
    axios.get("http://localhost:3000/auth/verify").then((res) => {
      if (res.data.status) {
        console.log(res.data);
        const tokenValue = res.data.token;
        console.log("token degeri : " + res.data.token);
      } else {
        navigate("/login");
      }
    });
  }, []);

  return (
    <div>
      <Hero />
      <Title subTitle="Our COMPANY" title="What We Offer" />
      <div className="programs">
        <div className="program">
          <img src={asphalt_1} alt="" />
          <Link to="/asphaltcalculator">
            <div className="caption">
              <img src={program_icon_1} alt="" />
              <p>Asphalt Calculator</p>
            </div>
          </Link>
        </div>
        <div className="program">
          <img src={büzz_pipe} alt="" />
          <Link to="/pipeConcrete">
            <div className="caption">
              <img src={program_icon_2} alt="" />
              <p>Pipe Infrastructure Calculator</p>
            </div>
          </Link>
        </div>
        <div className="program">
          <img src={excavator_image} alt="" />
          <Link to="/concreteRoad">
            <div className="caption">
              <img src={program_icon_3} alt="" />
              <p>Excavation Calculating</p>
            </div>
          </Link>
        </div>
        <div className="program">
          <img src={truck_1} alt="" />
          <Link to="/electric">
            <div className="caption">
              <img src={program_icon_1} alt="" />
              <p>Electric Project Calculating</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
