import React, { useState } from "react";
import './Excavation.css';
import axios from "axios";

const Excavation = () => {
  const [excavation_length, setLength] = useState(); // Kazı boyu
  const [excavation_width, setWidth] = useState();   // Genişlik
  const [excavation_depth, setDepth] = useState();   // Derinlik
  const [excavation_volume, setVolume] = useState(); // Hacim

  const handleSubmit = async (e) => {
    e.preventDefault(); // Formun varsayılan işlemini engelle
    
    // Hesaplama yap
    const calculatedVolume = excavation_length * excavation_width * excavation_depth;
    setVolume(calculatedVolume);
    
        try{
          const result =await axios.post('http://localhost:3000/excavations/create', {excavation_length,excavation_width,excavation_depth,excavation_volume});
          console.log(result)
        }catch(err){
          console.log(err)
        }
  };

  return (
    <div>
      <div className="excavation">
      <h2>Excavation Volume Calculating</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Length (m):
          <input
            className="m-2"
            type="number"
            value={excavation_length}
            onChange={(e) => setLength(e.target.value)}
            onFocus={(e) => e.target.select()} // Girdiye odaklandığında içeriği seç
          />
        </label>
        <br />
        <label>
           Width(m):
          <input
            className="m-2"
            type="number"
            value={excavation_width}
            onChange={(e) => setWidth(e.target.value)}
            onFocus={(e) => e.target.select()} // Girdiye odaklandığında içeriği seç
          />
        </label>
        <br />
        <label>
          Depth (m):
          <input
            className="m-2"
            type="number"
            value={excavation_depth}
            onChange={(e) => setDepth(e.target.value)}
            onFocus={(e) => e.target.select()} // Girdiye odaklandığında içeriği seç
          />
        </label>
        <br />
        <div className="calculate">
        <button type="submit" className="calculate-button"> Calculate</button>
      </div>
      </form>
      <div className="result">
       Volume (m³): {excavation_volume && <div> {excavation_volume}</div>}
      </div>
      </div>

    </div>
  );
}

export default Excavation;
