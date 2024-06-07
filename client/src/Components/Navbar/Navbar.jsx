import React, { useEffect, useState } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import logo_12 from "../../assets/logo-2.png";
import { Link, useNavigate } from "react-router-dom";
import menu_icon from "../../assets/menu-icon.png";
import axios from "axios";

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  useEffect(() => {
    axios.get("http://localhost:3000/auth/verify")
      .then((res) => {
        if (res.data.status) {
          setUserToken(res.data.token);
        }
      })
      .catch((err) => {
        console.error("Authentication check failed:", err);
      });
  }, []);

  const handleLogout = () => {
    axios.get("http://localhost:3000/auth/logout")
      .then((res) => {
        if (res.data.status) {
          setUserToken(null);
          navigate("/login");
        }
      })
      .catch((err) => {
        console.error("Logout failed:", err);
      });
  };


  return (
    <nav className="dark-nav">
      <Link to="/">
        <img src={logo_12} alt="Logo" className="logo" />
      </Link>
      <ul className={mobileMenu ? "" : "hide-mobile-menu"}>
        {userToken ? (
        <>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/contact">Contact us</Link></li>
        <li><Link to="/projectprofile">Project</Link></li>
        <li><button className="btn" onClick={handleLogout}>Logout</button></li>
        </>
        ):(
        <>
        <li><a href="/login" className="btn">Login</a></li>
        <li><a href="/signup" className="btn">Signup</a></li>
        </>
      )}
      </ul>
      <img
        src={menu_icon}
        alt="Menu Icon"
        className="menu-icon"
        onClick={toggleMenu}
      />
    </nav>
  );
};

export default Navbar;
