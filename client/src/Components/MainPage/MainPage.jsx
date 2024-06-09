import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Hero from "../Hero/Hero";
import Title from "../Title/Title";
import "./MainPage.css";
import { Link } from "react-router-dom";
import büzz_pipe from "../../assets/büzz-pipe.png";
import asphalt_1 from "../../assets/asphalt-1.png";
import concreteRoad_1 from "../../assets/concreteRoad-1.png";
import electric_2 from "../../assets/electric-2.png";
import comprehensive_1 from "../../assets/comprehensive-1.png";
import AddRoadIcon from '@mui/icons-material/AddRoad';
import EditRoadIcon from '@mui/icons-material/EditRoad';
import PlumbingIcon from '@mui/icons-material/Plumbing';
import MergeTypeIcon from '@mui/icons-material/MergeType';

import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';

function MainPage() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true; //cookie özelliği eklemek için

  useEffect(() => {
    axios.get("http://localhost:3000/auth/verify").then((res) => {
      if (res.data.status) {
        console.log(res.data);
      } else {
        navigate("/login");
      }
    });
  }, []);

  return (
    <div>
      <Hero />
      <Title  title="Our Projects Type" />
      <div className="programs">
        <div className="program">
          <img src={asphalt_1} alt="" />
          <Link to="/asphaltcalculator">
            <div className="caption">
             <AddRoadIcon style={{ fontSize: 48 }}/>
              <p style={{ fontSize: 24 }}>Asphalt Calculator</p>
            </div>
          </Link>
        </div>
        <div className="program">
          <img src={büzz_pipe} alt="" />
          <Link to="/pipeConcrete">
            <div className="caption">
              <PlumbingIcon style={{ fontSize: 48}}/>
              <p style={{ fontSize: 24 }}>Pipe Concrete Calculator</p>
            </div>
          </Link>
        </div>
        <div className="program">
          <img src={concreteRoad_1} alt="" />
          <Link to="/concreteRoad">
            <div className="caption">
            <EditRoadIcon style={{ fontSize: 48 }}/>
              <p style={{ fontSize: 24 }} >Concrete Road Calculating</p>
            </div>
          </Link>
        </div>
        <div className="program">
          <img src={electric_2} alt="" />
          <Link to="/electric">
            <div className="caption">
            <OfflineBoltIcon style={{ fontSize: 48 }}/>
              <p style={{ fontSize: 24 }}>Electric Project Calculating</p>
            </div>
          </Link>
        </div>
        <div className="program">
          <img src={comprehensive_1} alt="" />
          <Link to="/comprehensive">
            <div className="caption">
            <MergeTypeIcon style={{ fontSize: 48 }}/>
              <p style={{ fontSize: 24 }}>Comprehensive Project Calculating</p>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default MainPage;
