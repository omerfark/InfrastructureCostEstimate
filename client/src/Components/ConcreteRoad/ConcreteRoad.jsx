import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ConcreteRoad.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const ConcreteRoad = () => {

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
  const [excavation_width, setWidth] = useState(4.5); // Genişlik
  const [excavation_depth, setDepth] = useState(0.2); // Derinlik
  const [excavation_volume, setVolume] = useState(""); // Hacim


  //Vehicles
  const [numberOfExcavator, setNumberOfExcavator] = useState("");
  const [numberOfTruck, setNumberOfTruck] = useState("");
  const [numberOfRoller, setNumberOfRoller] = useState("");
  const [numberOfGreyder, setNumberOfGreyder] = useState("");
  //materials
  const [valueOfPmt, setValueOfPmt] = useState("");
  const [valueOfCesan, setValueOfCesan] = useState(""); // cesan demir 7cm
  const [valueOfExcavation, setValueOfExcavation] = useState("");
  const [valueOfConcrete, setValueOfConcrete] = useState("");
  //Workers
  const [numberOfWorkers, setNumberOfWorkers] = useState("");

  //price All
  const [priceExcavator, setPriceExcavator] = useState("");
  const [priceTruck, setPriceTruck] = useState("");
  const [priceRoller, setPriceRoller] = useState("");
  const [priceGreyder, setPriceGreyder] = useState("");
  const [pricePmt, setPricePmt] = useState("");
  const [priceCesan, setPriceCesan] = useState("");
  const [priceConcrete, setPriceConcrete]  = useState("");
  const [priceExcavation, setPriceExcavation] = useState("");
  const [priceWorkers, setPriceWorkers] = useState("");
  const [calProjectTime, setCalProjectTime] = useState("");
  const [totalProjectPrice, setTotalProjectPrice] = useState("");

  //concrete project id
  const [idConcreteRoadProject, setIdConcreteRoadProject] = useState("");

  const calculateEssential = () => {
    setDepth(0.2);
    setWidth(4.5);
    const calculatedVolume =
      excavation_length * excavation_width * excavation_depth;
    setVolume(calculatedVolume);

    const essentialNumberOfEquipment = Math.ceil(excavation_length / 3000);
    const numberOfTwo = 2 * essentialNumberOfEquipment;
    const numberOfOne = essentialNumberOfEquipment;
    const numberOfWorkers = 8 * essentialNumberOfEquipment; // beton yol icin 1 ekip icinde 8 kişi bulunur

    setNumberOfExcavator(numberOfTwo);
    setNumberOfTruck(numberOfTwo);
    setNumberOfRoller(numberOfOne);
    setNumberOfGreyder(numberOfOne);
    setNumberOfWorkers(numberOfWorkers ); // beton yol için ayrıca

    const cesanValue = (excavation_length / 5) * 2; // 1 tanesi 5m x 2.15 m, 7cm şeklinde --> adet 100 adet 10 bin tl
    const totalValuePmt = 0.1 * excavation_length * excavation_width;
    const totalValueConcrete =
      2.5 * (excavation_width * excavation_length * 0.15); // 1 m3 beton 2.5 ton ediyor

    setValueOfExcavation(calculatedVolume);
    setValueOfCesan(cesanValue);
    setValueOfPmt(totalValuePmt);
    setValueOfConcrete(totalValueConcrete);
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
          if (material.material_name === "pmt") {
            const pmtPrice = valueOfPmt * material.material_price;
            setPricePmt(pmtPrice);
          } else if (material.material_name === "cesan") {
            const cesanPrice = valueOfCesan * material.material_price;
            setPriceCesan(cesanPrice);
          } else if (material.material_name === "excavation") {
            const excavationPrice = valueOfExcavation * material.material_price;
            setPriceExcavation(excavationPrice);
          } else if (material.material_name === "concrete") {
            const concretePrice = valueOfConcrete * material.material_price;
            setPriceConcrete(concretePrice);
          }
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchMaterialPrice();
  }, [valueOfPmt, valueOfCesan, valueOfExcavation,valueOfConcrete]);
  //#endregion

  //#region Vehicle price
  useEffect(() => {
    const fetchVehiclePrice = async () => {
      try {
        const response = await fetch(`http://localhost:3000/vehicles/all`);
        const response2 = await fetch("http://localhost:3000/worker/all");
        if (!response.ok && response2.ok) {
          if (response.status === 404 && response2.status === 404) {
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
          } else if (vehicle.vehicle_type === "roller") {
            const rollerPrice =
              numberOfRoller * vehicle.vehicle_price * calProjectTime;
            setPriceRoller(rollerPrice);
          } else if (vehicle.vehicle_type === "greyder") {
            const greyderPrice =
              numberOfGreyder * vehicle.vehicle_price * calProjectTime;
            setPriceGreyder(greyderPrice);
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
    numberOfRoller,
    numberOfGreyder,
    numberOfWorkers,
    calProjectTime,
  ]);
  //#endregion

  const handleSubmit = async (e) => {
    e.preventDefault();

    const calTimeofProject = Math.ceil(excavation_length / 1500);
    console.log(calTimeofProject);
    setCalProjectTime(calTimeofProject);

    calculateEssential();

    try {
      const response = await axios.post(
        "http://localhost:3000/concreteRoad/create",
        {
          equipments: [
            { type: "equipment Type", quantity: 10, price: 100 }, // Örnek değerler
          ],
          vehicles: [
            {
              type: "excavator",
              quantity: numberOfExcavator,
              price: priceExcavator,
            },
            { type: "truck", quantity: numberOfTruck, price: priceTruck },
            { type: "roller", quantity: numberOfRoller, price: priceRoller },
            { type: "greyder", quantity: numberOfGreyder, price: priceGreyder },
          ],
          materials: [
            { type: "pmt", quantity: valueOfPmt, price: pricePmt },
            {
              type: "cesan",
              quantity: valueOfCesan,
              price: priceCesan,
            },
            {
              type: "asphalt_2",
              quantity: valueOfConcrete,
              price: priceConcrete,
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
      setIdConcreteRoadProject(data_id);

      console.log("Backend'den gelen yanıt:", response.data);
    
    } catch (err) {
      console.log(err)
    }

    const totalMPrice =
      priceExcavator + priceTruck + priceRoller + priceGreyder ;
    const totalVPRice =
      pricePmt +
      priceCesan +
      priceConcrete +
      priceExcavation +
      priceWorkers;
    const totalAllPrice = totalMPrice + totalVPRice;
    setTotalProjectPrice(totalAllPrice);
    console.log("deneme price: " + totalProjectPrice.toLocaleString("tr-TR"));
    
  };

  //Add Concrede Road project to user project list
  useEffect(() => {
    const postProjectId = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 saniye bekle
      try {
        const response = await axios.patch(
          `http://localhost:3000/project/${holdUserId}/concreteRoad`,
          {
            concreteroad_projects: idConcreteRoadProject,
          }
        );
        console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    postProjectId();
  }, [idConcreteRoadProject, holdUserId]);

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
                    placeholder="Not needed"
                    value={excavation_width} //width yani genişlik 4,50 sabit
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

export default ConcreteRoad;
