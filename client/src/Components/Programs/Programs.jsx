import React from "react";
import "./Programs.css";
import { Link } from "react-router-dom";
import excavator_image from "../../assets/excavator-image.png";
import büzz_pipe from "../../assets/büzz-pipe.png";
import asphalt_1 from "../../assets/asphalt-1.png";
import program_icon_1 from "../../assets/program-icon-1.png";
import program_icon_2 from "../../assets/program-icon-2.png";
import program_icon_3 from "../../assets/program-icon-3.png";

const Programs = () => {
  return (
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
        <Link to="/pipeinfrastructure">
          <div className="caption">
            <img src={program_icon_2} alt="" />
            <p>Pipe Infrastructure Calculator</p>
          </div>
        </Link>
      </div>
      <div className="program">
        <img src={excavator_image} alt="" />
        <Link to="/excavation">
          <div className="caption">
            <img src={program_icon_3} alt="" />
            <p>Excavation Calculating</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Programs;