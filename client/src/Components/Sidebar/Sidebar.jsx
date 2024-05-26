import React, { useState } from "react";
import { Dashboard, Logout, Home, Build, Folder, Settings } from "@mui/icons-material";
import "./Sidebar.css";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const Menus = [
    { title: "Profile", icon: <Dashboard />, link: "/userprofile"},
    { title: "Logout", icon: <Logout /> },
    { title: "Main Page", icon: <Home />, gap: true },
    { title: "Projects", icon: <Build /> },
    { title: "Asphalt Road Projects", icon: <Build /> },
    { title: "Concrete Road Projects", icon: <Build /> },
    { title: "Electric Project", icon: <Build /> },
    { title: "Pipe project", icon: <Build /> },
    { title: "Files ", icon: <Folder />, gap: true },
    { title: "Setting", icon: <Settings /> },
  ];

  return (
    <div >
      <div className={`sidebar-container ${open ? 'sidebar-container-open' : 'sidebar-container-closed'}`}>
        <div className={`control-icon ${!open && 'control-icon-closed'}`}
          onClick={() => setOpen(!open)}>
            {<Dashboard />}
        </div>
        <div className="logo-container">
          <img src="./src/assets/logo.png" className={`logo ${open && 'logo-open'}`} />
          <h1 className={`designer-title ${!open && 'designer-title-closed'}`}>Designer</h1>
        </div>
        <ul className="menu-list">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className={`menu-item ${Menu.gap ? 'menu-item-gap' : 'menu-item-default'} ${
                index === 0 && 'menu-item-active'
              } `}
            >
              <Link to={Menu.link} className="menu-link">
                {Menu.icon}
                <span className={`${!open && 'menu-title-closed'} origin-left duration-200`}>{Menu.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
