import React from 'react'
import './Hero.css'
import dark_arrow from '../../assets/dark_arrow.png'


const Hero = () => {
  return (
    <div className='hero'>
        <div className="hero_text">
            <h1>We ensure better construction for a better center</h1>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Fugiat reprehenderit similique sint, deserunt perferendis 
                a tempora architecto iusto neque eius esse harum. Excepturi 
                id enim hic dolor aperiam incidunt perferendis?</p>
                <button className='btn'> Explore more <img src={dark_arrow} alt=''/></button>
        </div>
    </div>
  )
}

export default Hero