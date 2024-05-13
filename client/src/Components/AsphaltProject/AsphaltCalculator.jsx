import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AsphaltCalculator.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import asphalt_1 from "../../assets/asphalt-1.png"

const AsphaltCalculator = () => {
  const [excavation_length, setLength] = useState(""); // Kazı boyu
  const [excavation_width, setWidth] = useState(""); // Genişlik
  const [excavation_depth, setDepth] = useState(""); // Derinlik
  const [excavation_volume, setVolume] = useState(""); // Hacim
  const [asphaltAmount, setAmount] = useState("");

  const navigate = useNavigate();
  axios.defaults.withCredentials = true; //cookie özelliği eklemek için
  
  useEffect(() => {
      axios.get("http://localhost:3000/auth/verify").then((res) => {
        if (res.data.status) {
          console.log(res.data);
          const tokenValue = res.data.token;
          console.log("token degeri : " + res.data.token);
        } else {
          navigate("/login");
        }
      });
    }, []);



  const handleSubmit = (e) => {
    e.preventDefault();
    const calculatedVolume =
      excavation_length * excavation_width * excavation_depth;
    setVolume(calculatedVolume);
    const asphaltCalculate = (calculatedVolume * 2.4).toFixed(2); // Maksimum 2 ondalık hane
    setAmount(asphaltCalculate);
  };

  return (
    <div className="asphalt">
      <Col>
        <Row>
          <Col xs={6}>
            <div className="excavation-col">
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
                  Width (m):
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
                  <button type="submit" className="calculate-button">
                    {" "}
                    Calculate
                  </button>
                </div>
              </form>
              <div className="result">
                Volume (m³) :{" "}
                {excavation_volume && <span> {excavation_volume} m³</span>}
              </div>
            </div>
          </Col>
          <Col xs={6} className="mt-4">
            <div className="excavation-col">
              <h2> Asphalt Calculator </h2>

              <ul>
                <li>Total Volume = Length X Width X Depth</li>
                <li>
                  Total Volume (m³) ={" "}
                  {excavation_volume && <span> {excavation_volume} m³</span>}
                </li>
                <li>Total Quantity = Total Volume X Density of Asphalt</li>
                <li>
                  Total Quantity ={" "}
                  {excavation_volume && (
                    <span>
                      {" "}
                      {excavation_volume} m³ X 2.4 
                    </span>
                  )}
                </li>
                <li>
                 Total Quantity = {asphaltAmount && (
                  <span>{""}{asphaltAmount} m³</span>
                 )}
                </li>
              </ul>
            </div>
          </Col>
        </Row>
        <Row className="mt-5">
          <div className="col-md-8 ">
            <div className="asphalt-info">
              <h2>What is Asphalt and Asphalt Calculation?</h2>
              <h3>Asphalt</h3>
              <p>
                Asphalt, also known as bitumen, is a sticky, black, and highly
                viscous liquid or semi-solid form of petroleum. It is commonly
                used in road construction as a binding agent for aggregate
                materials like gravel, sand, and crushed stone to create asphalt
                concrete. Asphalt provides durability, weather resistance, and
                smoothness to road surfaces, making it a popular choice for
                paving roads, highways, and airport runways.
              </p>

              <h3>Asphalt Calculation</h3>
              <p>
                When calculating the quantity of asphalt needed for a project,
                it's essential to consider the volume of the area to be paved
                and the density of the asphalt. The formula for calculating the
                asphalt quantity is:
              </p>

              <ul>
                <li>
                  <strong>Volume:</strong> The volume represents the space to be
                  filled with asphalt. It is typically calculated by multiplying
                  the length, width, and depth of the area to be paved. For
                  example, if you have a rectangular area, the volume (V) can be
                  calculated as V = Length × Width × Depth.
                </li>
                <li>
                  <strong>Density of Asphalt:</strong> The density of asphalt,
                  usually measured in kilograms per cubic meter (kg/m³) or
                  pounds per cubic yard (lb/yd³), represents the mass per unit
                  volume of asphalt. It can vary depending on the type of
                  asphalt mix and its composition.
                </li>
              </ul>

              <p>
                By multiplying the volume of the area to be paved by the density
                of the asphalt, you can determine the total quantity of asphalt
                needed for your project. This calculation ensures that you have
                sufficient asphalt to cover the specified area at the desired
                thickness.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <img src={asphalt_1} alt="Asphalt" className="img-fluid" />
          </div>
        </Row>
      </Col>
    </div>
  );
};

export default AsphaltCalculator;
