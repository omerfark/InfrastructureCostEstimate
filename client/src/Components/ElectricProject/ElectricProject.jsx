import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ElectricProject.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const ElectricProject = () => {

  const [holdUserId, setHoldUserId] = useState("");

  //Doğrulama anahtarı
  const navigate = useNavigate();
  axios.defaults.withCredentials = true; //cookie özelliği eklemek için

  useEffect(() => {
    axios.get("http://localhost:3000/auth/verify").then((res) => {
      if (res.data.status) {
        console.log(res.data);
        const tokenValue = res.data.token;
        const sbtUser = tokenValue.userId;
        setHoldUserId(sbtUser);
      } else {
        navigate("/login");
      }
    });
  }, []);

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
  const [numberOfWorkers, setNumberOfWorkers] = useState("");

  //price All
  const [priceCompactor, setPriceCompactor] = useState("");
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
    return new Promise((resolve) => {
      const depth = 0.8;
      setDepth(depth);

      const widthDuct = widthCable * 2;
      setWidth(widthDuct);

      const calculatedVolume = (excavation_length * excavation_width * depth).toFixed(2);
      setVolume(calculatedVolume);

      const essentialNumberOfEquipment = Math.ceil(excavation_length / 4000);
      const numberOfOne = 1 * essentialNumberOfEquipment;
      const numberOfWorkers = 4 * essentialNumberOfEquipment;

      const sandValue = 0.2 * (excavation_length * excavation_width).toFixed(2);
      const aggregateValue = (0.3 * (excavation_length * excavation_width)).toFixed(2);
      const concreteSlabValue = Math.round(excavation_length / 0.4);
      const concreteSlabWidth = Math.round(excavation_width / 0.2);
      const concreteSlab = concreteSlabValue * concreteSlabWidth;

      setNumberOfCompactor(numberOfOne);
      setNumberOfExcavator(numberOfOne);
      setNumberOfTruck(numberOfOne);
      setNumberOfJCB(numberOfOne);
      setNumberOfWorkers(numberOfWorkers);

      setValueOfExcavation(calculatedVolume);
      setValueOfSand(sandValue);
      setValueOfAggregate(aggregateValue);
      setValueOfConcreteSlab(concreteSlab);

      resolve();
    });
  };
  
  useEffect(() => {
    if (valueOfSand && valueOfAggregate && valueOfConcreteSlab && valueOfExcavation) {
      const fetchMaterialPrice = async () => {
        try {
          const response = await fetch(`http://localhost:3000/materials/all`);
          if (!response.ok) {
            throw new Error("Unexpected error");
          }
          const allMaterial = await response.json();
          allMaterial.forEach((material) => {
            if (material.material_name === "sand") {
              const sandPRice = valueOfSand * material.material_price;
              setPriceSand(sandPRice);
            } else if (material.material_name === "aggregate") {
              const aggregatePrice = valueOfAggregate * material.material_price;
              SetPriceAggregate(aggregatePrice);
            } else if (material.material_name === "excavation") {
              const excavationPrice = valueOfExcavation * material.material_price;
              setPriceExcavation(excavationPrice);
            } else if (material.material_name === "concret slab") {
              const concreteSlab = valueOfConcreteSlab * material.material_price;
              setPriceConcreteSlab(concreteSlab);
            }
          });
        } catch (err) {
          console.error(err);
        }
      };
      fetchMaterialPrice();
    }
  }, [valueOfSand, valueOfAggregate, valueOfConcreteSlab, valueOfExcavation]);
  
  useEffect(() => {
    if (numberOfTruck && numberOfExcavator && numberOfJCB && numberOfWorkers) {
      const fetchVehiclePrice = async () => {
        try {
          const response = await fetch(`http://localhost:3000/vehicles/all`);
          const response2 = await fetch("http://localhost:3000/worker/all");
          if (!response.ok && response2.ok) {
            throw new Error("Unexpected error");
          }
          const allVehicles = await response.json();
          const workerGet = await response2.json();
  
          allVehicles.forEach((vehicle) => {
            if (vehicle.vehicle_type === "truck") {
              const truckPrice = numberOfTruck * vehicle.vehicle_price * calProjectTime;
              setPriceTruck(truckPrice);
            } else if (vehicle.vehicle_type === "excavator") {
              const excavatorPrice = numberOfExcavator * vehicle.vehicle_price * calProjectTime;
              setPriceExcavator(excavatorPrice);
            } else if (vehicle.vehicle_type === "JCB") {
              const JCBPrice = numberOfJCB * vehicle.vehicle_price * calProjectTime;
              setPriceJCB(JCBPrice);
            }
          });
  
          const workerPrice = numberOfWorkers * workerGet[0].worker_price * (calProjectTime + 1);
          setPriceWorkers(workerPrice);
        } catch (err) {
          console.error(err);
        }
      };
      fetchVehiclePrice();
    }
  }, [numberOfTruck, numberOfExcavator, numberOfJCB, numberOfWorkers, calProjectTime]);
  
  useEffect(() => {
    if (numberOfCompactor) {
      const fetchEquipmentPrice = async () => {
        try {
          const response = await fetch("http://localhost:3000/equipment/all");
          if (!response.ok) {
            throw new Error("Unexpected error");
          }
          const allEquipment = await response.json();
          allEquipment.forEach((equipment) => {
            if (equipment.equipment_name === "compactor") {
              const compactorPrice = numberOfCompactor * equipment.equipment_price * calProjectTime;
              setPriceCompactor(compactorPrice);
            }
          });
        } catch (err) {
          console.log(err);
        }
      };
      fetchEquipmentPrice();
    }
  }, [numberOfCompactor, calProjectTime]);
  

 //Tüm fiyatlar hesaplanınca db ye kaydediyor
 useEffect(() => {
  if (totalProjectPrice) {
    const sendToDB = async () => {
      // send to db
      try {
        const response = await axios.post(
          "http://localhost:3000/electric/create",
          {
            equipments: [
              {
                type: "compactor",
                quantity: numberOfCompactor,
                price: priceCompactor,
              },
            ],
            vehicles: [
              {
                type: "excavator",
                quantity: numberOfExcavator,
                price: priceExcavator,
              },
              { type: "truck", quantity: numberOfTruck, price: priceTruck },
              { type: "JCB", quantity: numberOfJCB, price: priceJCB },
            ],
            materials: [
              { type: "sand", quantity: valueOfSand, price: priceSand },
              {
                type: "aggregate",
                quantity: valueOfAggregate,
                price: priceAggregate,
              },
              {
                type: "concrete slab",
                quantity: valueOfConcreteSlab,
                price: priceConcreteSlab,
              },
              {
                type: "excavation",
                quantity: valueOfExcavation,
                price: priceExcavation,
              },
            ],
            worker: [
              { type: "worker", quantity: numberOfWorkers, price: priceWorkers },
            ],
            project_time: calProjectTime,
          }
        );
    
        const data_id = response.data._id;
        setIdElectricProject(data_id);
        console.log("Backend'den gelen yanıt:", response.data);
      } catch (err) {
        console.log(err);
      }
    };
    sendToDB();
  }
}, [totalProjectPrice]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const calTimeofProject = Math.ceil(excavation_length / 2500);
    setCalProjectTime(calTimeofProject);
  
      await calculateEssential();

      
    
  
    const totalMPrice = priceExcavator + priceTruck + priceJCB;
    const totalVPRice =
      priceAggregate + priceConcreteSlab + priceExcavation + priceWorkers;
    const totalAllPrice = totalMPrice + totalVPRice;
    setTotalProjectPrice(totalAllPrice);
    console.log("deneme price: " + totalProjectPrice.toLocaleString("tr-TR"));
  };
  
  useEffect(() => {
    const postProjectId = async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 saniye bekle
      try {
        const response = await axios.patch(
          `http://localhost:3000/project/${holdUserId}/electric`,
          {
            electric_projects: idElectricProject,
          }
        );
        console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    postProjectId();
  }, [idElectricProject, holdUserId]);

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
        <Row>
          <Col>
            <table>
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th>Material</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Tiles</td>
                  <td>{priceExcavator} No. of Tiles</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Cement</td>
                  <td>{priceTruck} Bags</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Sand</td>
                  <td>{priceJCB} Ton</td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
      </Col>
    </div>
  );
};

export default ElectricProject;
