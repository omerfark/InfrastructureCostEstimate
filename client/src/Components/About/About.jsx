import React from 'react'
import './About.css'
import excavator_2 from'../../assets/excavator-2.png'
import Title from "../Title/Title";

const About = () => {
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
    </>
  )


}


export default About