import React from 'react'
import './Campus.css'
import excavator_1 from '../../assets/excavator-1.png'
import truck_1 from '../../assets/truck-1.png'
import paver_1 from '../../assets/paver-1.png'
import freze_1 from '../../assets/freze-1.png'
import white_arrow from '../../assets/white-arrow.png'
import Title from '../Title/Title'
import { Link } from 'react-router-dom'


const Campus = () => {
  return (
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
  )
}

export default Campus