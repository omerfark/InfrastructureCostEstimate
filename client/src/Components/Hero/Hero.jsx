import React from "react";
import "./Hero.css";
import dark_arrow from "../../assets/dark_arrow.png";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero_text">
        <h1>
        Better Infrastructure for a Better Environment
        </h1>
        <p>
          With modern engineering and innovative solutions, we aim to provide
          sustainable and safe environments for our communities.
        </p>
        <Link to="/contact">
          <button className="btn">
            {" "}
            Explore more <img src={dark_arrow} alt="" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
