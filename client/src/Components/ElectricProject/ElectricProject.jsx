import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ElectricProject.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const ElectricProject = () => {
  const [excavation_length, setLength] = useState(""); // Kazı boyu
  const [excavation_width, setWidth] = useState(""); // Genişlik
  const [excavation_depth, setDepth] = useState(0.8); // Derinlik
  const [excavation_volume, setVolume] = useState(""); // Hacim

  //Equipment
  const [numberOfCompactor, setNumberOfCompactor] = useState("");
  const [widthCable, setWidthCable] = useState("");
  //vehicles
  const [numberOfExcavator, setNumberOfExcavator] = useState("");
  const [numberOfTruck, setNumberOfTruck] = useState("");
  const [numberOfJCB, setNumberOfJCB] = useState("");
  //materials
  const [valueOfSand, setValueOfSand] = useState("");
  const [valueOfAggregate, setValueOfAggregate] = useState("");
  const [valueOfConcreteSlab, setValueOfConcreteSlab] = useState("");
  const [valueOfExcavation, setValueOfExcavation] = useState("");
  //workers
  const [ numberOfWorkers, setNumberOfWorkers ]= useState("");

  //price All
  const [priceExcavator, setPriceExcavator] = useState("");
  const [priceTruck, setPriceTruck] = useState("");
  const [priceJCB, setPriceJCB] = useState("");
  const [priceSand, setPriceSand] = useState("");
  const [priceAggregate, SetPriceAggregate] = useState("");
  const [priceConcreteSlab, setPriceConcreteSlab] = useState("");
  const [priceWorkers, setPriceWorkers] = useState("");
  const [priceExcavation, setPriceExcavation] = useState("");
  const [calProjectTime, setCalProjectTime] = useState("");
  const [totalProjectPrice, setTotalProjectPrice] = useState("");

  //Electric project id
  const [idElectricProject, setIdElectricProject] = useState("");

  const calculateEssential = () => {
    setDepth(0.8);
    const widthDuct = widthCable * 2;
    setWidth(widthDuct);
    const calculatedVolume =
      excavation_length * excavation_width * excavation_depth;
    setVolume(calculatedVolume);

    const essentialNumberOfEquipment = Math.ceil(excavation_length / 4000);
    const numberOfOne = essentialNumberOfEquipment;
    const numberOfWorkers = 4 * essentialNumberOfEquipment; // beton yol icin 1 ekip icinde 8 kişi bulunur

    setNumberOfCompactor(numberOfOne);
    setNumberOfExcavator(numberOfOne);
    setNumberOfTruck(numberOfOne);
    setNumberOfJCB(numberOfOne);
    setNumberOfWorkers(numberOfWorkers); // beton yol için ayrıca

    const sandValue = 0.2 * excavation_length * excavation_width;
    const aggregateValue = 0.3 * excavation_length * excavation_width;
    const concreteSlabValue = Math.round(excavation_length / 0.4); // 20x40 6 cm
    const concreteSlabWidt = Math.round(excavation_width / 0.2); // 20x40 6 cm
    const concreteSlab = concreteSlabValue * concreteSlabWidt;

    setValueOfExcavation(calculatedVolume);
    setValueOfSand(sandValue);
    setValueOfAggregate(aggregateValue);
    setValueOfConcreteSlab(concreteSlab);
  };

  //#region Material Price
  useEffect(() => {
    const fetchMaterialPrice = async () => {
      try {
        const response = await fetch(`http://localhost:3000/materials/all`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Material not found");
          } else {
            throw new Error("Unexpected error");
          }
        }
        const allMaterial = await response.json();
        //Set Material Price
        allMaterial.map((material) => {
          if (material.material_name === "sand") {
            const sandPRice = valueOfSand * material.material_price;
            setPriceSand(sandPRice);
          } else if (material.material_name === "aggregate") {
            const aggregatePrice = valueOfAggregate * material.material_price;
            SetPriceAggregate(aggregatePrice);
          } else if (material.material_name === "excavation") {
            const excavationPrice = valueOfExcavation * material.material_price;
            setPriceExcavation(excavationPrice);
          } else if (material.material_name === "concrete") {
            const concreteSlab = valueOfConcreteSlab * material.material_price;
            setPriceConcreteSlab(concreteSlab);
          }
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchMaterialPrice();
  }, [valueOfSand, valueOfAggregate, valueOfConcreteSlab, valueOfExcavation]);
  //#endregion

  //#region Vehicle price
  useEffect(() => {
    const fetchVehiclePrice = async () => {
      try {
        const response = await fetch(`http://localhost:3000/vehicles/all`);
        const response2 = await fetch("http://localhost:3000/worker/all");
        if (!response.ok && response2.ok) {
          if (response.status === 404 && response.status === 404) {
            throw new Error("Vehicles not found");
          } else {
            throw new Error("Unexpected error");
          }
        }
        const allVehicles = await response.json();
        const workerGet = await response2.json();

        //Set Material Price
        allVehicles.map((vehicle) => {
          if (vehicle.vehicle_type === "truck") {
            console.log("cal proje time: " + calProjectTime);
            const truckPrice =
              numberOfTruck * vehicle.vehicle_price * calProjectTime;
            setPriceTruck(truckPrice);
          } else if (vehicle.vehicle_type === "excavator") {
            const excavatorPrice =
              numberOfExcavator * vehicle.vehicle_price * calProjectTime;
            setPriceExcavator(excavatorPrice);
          } else if (vehicle.vehicle_type === "JCB") {
            const JCBPrice =
            numberOfJCB * vehicle.vehicle_price * calProjectTime;
              setPriceJCB(JCBPrice);
          } 
        });

        //worker Price
        const workerPrice =
          numberOfWorkers * workerGet[0].worker_price * (calProjectTime + 1);
        setPriceWorkers(workerPrice);

      } catch (err) {
        console.error(err);
      }
    };
    fetchVehiclePrice();
  }, [
    numberOfTruck,
    numberOfExcavator,
    numberOfJCB,
    numberOfWorkers,
    calProjectTime,
  ]);
  //#endregion

  const handleSubmit = async (e) => {
    e.preventDefault();

    calculateEssential();
  };

  return (
    <div className="concrete">
      <Col>
        <Row>
          <Col xs={6}>
            <div className="excavation-col">
              <h2>Concrete Volume Calculating</h2>
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
                    placeholder="Boru capı"
                    value={widthCable} //width yani genişlik 4,50 sabit
                    onChange={(e) => setWidthCable(e.target.value)}
                    onFocus={(e) => e.target.select()} // Girdiye odaklandığında içeriği seç
                  />
                </label>
                <br />
                <label>
                  Depth (m):
                  <input
                    className="m-2"
                    type="number"
                    placeholder="Not needed"
                    value={excavation_depth}
                    readOnly // Sadece okunabilir olarak ayarla
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
          <Col>
            <div className="excavation-col">
              <h2> Concrete Road Calculator </h2>

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
                    <span> {excavation_volume} m³ X 2.4</span>
                  )}
                </li>
              </ul>
            </div>
          </Col>
        </Row>
      </Col>
    </div>
  );
};

export default ElectricProject;
