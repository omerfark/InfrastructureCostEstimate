import React, { useEffect, useState } from "react";
import "./Excavation.css";
import axios from "axios";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

const Excavation = () => {
  const [excavation_length, setLength] = useState(); // Kazı boyu
  const [excavation_width, setWidth] = useState(); // Genişlik
  const [excavation_depth, setDepth] = useState(); // Derinlik
  const [excavation_volume, setVolume] = useState(); // Hacim

  const [allMaterials, setAllMaterials] = useState([]);
  const [pipeSelected, setPipeSelected] = useState(null);
  const [valueOfSand, setValueOfSand] = useState(1);
  const [valueOfAggregate, setValueOfAggregate] = useState(2);
  const [valueOfSoil, setValueOfSoil] = useState(10);
  const [valueOfExcavation, setValueOfExcavation] = useState(0);
  const [numberOfPipe, setNumberOfPipe] = useState(0);
  const [numberOfBaseElement, setNumberOfBaseElement] = useState(10);
  const [numberOfConnectors, setNumberOfConnectors] = useState(0);
  const [numberOfPvcPipe, setNumberOfPvcPipe] = useState(0);

  const [priceSand, setPriceSand] = useState(0);
  const [priceAggregate, setPriceAggregate] = useState(0);
  const [priceExcavation, setPriceExcavation] = useState(0);
  const [priceSoil, setPriceSoil] = useState(0);
  const [pricePipe, setPricePipe] = useState(0);
  const [priceBaseElement, setPriceBaseElement] = useState(0);
  const [priceConnectors, setPriceConnectors] = useState(0);
  const [pricePvcPrice, setPricePvcPrice] = useState(0);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get("http://localhost:3000/materials/all");
        setAllMaterials(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMaterials();
  }, []);

  const calculatePrices = () => {

    const selectPipeName = pipeSelected?.name; // Seçilen borunun ismi

    allMaterials.forEach((material) => {
      if (material.material_name === "sand") {
        const sandPrice = valueOfSand * material.material_price;
        setPriceSand(sandPrice);
      } else if (material.material_name === "aggregate") {
        const aggregatePrice = valueOfAggregate * material.material_price;
        setPriceAggregate(aggregatePrice);
      } else if (material.material_name === "excavation") {
        const excavationPrice = valueOfExcavation * material.material_price;
        setPriceExcavation(excavationPrice);
      } else if (material.material_name === "soil") {
        const soilPrice = valueOfSoil * material.material_price;
        setPriceSoil(soilPrice);
      } else if (material.material_name === selectPipeName) {
        const pipePrice = numberOfPipe * material.material_price;
        setPricePipe(pipePrice);
      } else if (material.material_name === "baseElement") {
        const baseElementPrice = numberOfBaseElement * material.material_price;
        setPriceBaseElement(baseElementPrice);
      } else if (material.material_name === "connector") {
        const connectorsPrice = numberOfConnectors * material.material_price;
        setPriceConnectors(connectorsPrice);
      } else if (material.material_name === "pvc") {
        const pvcPrice = numberOfPvcPipe * material.material_price;
        setPricePvcPrice(pvcPrice);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Formun varsayılan işlemini engelle
    calculatePrices();
    // Hesaplama yap
    const calculatedVolume =
      excavation_length * excavation_width * excavation_depth;
    setVolume(calculatedVolume);

    try {
      const result = await axios.post(
        "http://localhost:3000/excavations/create",
        {
          excavation_length,
          excavation_width,
          excavation_depth,
          excavation_volume,
        }
      );
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Col>
        <Row>
          <Col>
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
                  <button type="submit" className="calculate-button">
                    {" "}
                    Calculate
                  </button>
                </div>
              </form>
              <div className="result">
                Volume (m³):{" "}
                {excavation_volume && <div> {excavation_volume}</div>}
              </div>
            </div>
          </Col>
          <Col>
            <div  className="excavation">
              <button onClick={handleSubmit}>Calculate Prices</button>
              <div>
                <h3>Sand Price: {priceSand}</h3>
                <h3>Aggregate Price: {priceAggregate}</h3>
                <h3>Excavation Price: {priceExcavation}</h3>
                <h3>Soil Price: {priceSoil}</h3>
                <h3>Pipe Price: {pricePipe}</h3>
                <h3>Base Element Price: {priceBaseElement}</h3>
                <h3>Connectors Price: {priceConnectors}</h3>
                <h3>PVC Price: {pricePvcPrice}</h3>
              </div>
            </div>
          </Col>
        </Row>
      </Col>
    </div>
  );
};

export default Excavation;
