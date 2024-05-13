import React, { useEffect, useState } from 'react'
import './Navbar.css'
import logo from "../../assets/logo.png"
import { Link } from 'react-router-dom';
import menu_icon from "../../assets/menu-icon.png"

const Navbar = () => {

  // const[sticky, setSticky] = useState(false);

  // useEffect(()=>{
  //   window.addEventListener('scroll', ()=>{
  //     window.scrollY > 580 ? setSticky(true) : setSticky(false);
  //   })
  // },[]);


  const[mobileMenu, setMobileMenu] = useState(false);
  const toggleMenu = ()=>{
    mobileMenu? setMobileMenu(false) : setMobileMenu(true);
  }
  

  return (
    <nav className='dark-nav'>  
        <Link to='/'><img src={logo} alt='' className='logo' /></Link>
        <ul className={mobileMenu? '' : 'hide-mobile-menu'}>
            <li><Link to='/' >Home</Link></li>
            <li><Link to='/about' >About us</Link></li>
            <li><Link to='/campus' >Vehicles</Link></li>
            <li><Link to='/contact' >Contact us</Link></li>
            <li><Link to='/userprofile'> Profile</Link></li>
            <li><a href='/login' className='btn'>Login</a></li>
            <li><a href='/signup' className='btn'>Signup</a></li>
        </ul>
        <img src={menu_icon} alt='' className='menu-icon ' onClick={toggleMenu}/>
    </nav>
  )
}

export default Navbar