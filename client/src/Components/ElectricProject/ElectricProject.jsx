import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ElectricProject.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import LeafletMap from "../LeafletMap/LeafletMap";
import HeaderTr from "../HeadTr/HeadTr.jsx";


const ElectricProject = () => {
  const [holdUserId, setHoldUserId] = useState("");

  //Doğrulama anahtarı
  const navigate = useNavigate();
  axios.defaults.withCredentials = true; //cookie özelliği eklemek için

  // Doğrulama
  useEffect(() => {
    axios.get("http://localhost:3000/auth/verify").then((res) => {
      if (res.data.status) {
        setHoldUserId(res.data.token.userId);
      } else {
        navigate("/login");
      }
    });
  }, [navigate]);

  const emptyValue = null;
  const [length, setLength] = useState(null); // Kazı boyu
  const [width, setWidth] = useState(null); // Genişlik
  const depth = 0.8;
  const [volume, setVolume] = useState(null); // Hacim
  const [widthCable, setWidthCable] = useState(null);

  //Equipment
  const [numberOfCompactor, setNumberOfCompactor] = useState(null);
  const [valueofCable, setValueOfCable] = useState(null);
  //vehicles
  const [numberOfExcavator, setNumberOfExcavator] = useState(null);
  const [numberOfTruck, setNumberOfTruck] = useState(null);
  const [numberOfJCB, setNumberOfJCB] = useState(null);
  //materials
  const [valueOfSand, setValueOfSand] = useState(null);
  const [valueOfAggregate, setValueOfAggregate] = useState(null);
  const [valueOfConcreteSlab, setValueOfConcreteSlab] = useState(null);
  const [valueOfExcavation, setValueOfExcavation] = useState(null);
  //workers
  const [numberOfWorkers, setNumberOfWorkers] = useState(null);

  //unit Prices
  const [compactorUnitPrice, setCompactorUnitPrice] = useState(null);
  const [cableUnitPrice, setCableUnitPrice] = useState(null);
  const [excavatorUnitPrice, setExcavatorUnitPrice] = useState(null);
  const [truckUnitPrice, setTruckUnitPrice] = useState(null);
  const [jcbUnitPrice, setJcbUnitPrice] = useState(null);
  const [sandUnitPrice, setSandUnitPrice] = useState(null);
  const [aggregateUnitPrice, setAggregateUnitPrice] = useState(null);
  const [concreteSlabUnitPrice, setConcreteSlabUnitPrice] = useState(null);
  const [excavationUnitPrice, setExcavationUnitPrice] = useState(null);
  const [workerUnitPrice, setWorkerUnitPrice] = useState(null);

  //price All
  const [priceCompactor, setPriceCompactor] = useState(null);
  const [priceCable, setPriceCable] = useState(null);
  const [priceExcavator, setPriceExcavator] = useState(null);
  const [priceTruck, setPriceTruck] = useState(null);
  const [priceJCB, setPriceJCB] = useState(null);
  const [priceSand, setPriceSand] = useState(null);
  const [priceAggregate, SetPriceAggregate] = useState(null);
  const [priceConcreteSlab, setPriceConcreteSlab] = useState(null);
  const [priceWorkers, setPriceWorkers] = useState(null);
  const [priceExcavation, setPriceExcavation] = useState(null);
  const [calProjectTime, setCalProjectTime] = useState(null);
  const [totalProjectPrice, setTotalProjectPrice] = useState(null);

  //Electric project id
  const [idElectricProject, setIdElectricProject] = useState("");

  const [matPrices, setMatPrices] = useState([]);
  const [vehPrices, setVehPrices] = useState([]);
  const [eqPrices, setEqPrices] = useState([]);
  const [worPrices, setWorPrices] = useState(0);

  const calculateEssential = useCallback(
    (matPrices, vehPrices, eqPrices) => {
      console.log("first caluclation");
      console.log("matPrices", matPrices);
      console.log("vehPrices", vehPrices);
      console.log("eqPrices", eqPrices);

      const calTimeofProject = Math.ceil(volume / 3200);

      const widthDuct = widthCable * 2;
      setWidth(widthDuct);

      const calculatedVolume = length * widthDuct * depth;
      setVolume(calculatedVolume);

      const essentialNumberOfEquipment = Math.ceil(length / 4000);
      const numberOfOne = 1 * essentialNumberOfEquipment;
      const numberOfWorkers = 4 * essentialNumberOfEquipment;

      const sandValue = 0.2 * length * widthDuct;
      const aggregateValue = 0.3 * length * widthDuct;
      const concreteSlabValue = Math.ceil(length * 0.2); // 20 cm uzunluğu
      const concreteSlabWidth = Math.ceil(widthDuct * 0.1); // 10 cm genişliği olduğu icin
      const concreteSlab = concreteSlabValue * concreteSlabWidth;

      vehPrices.forEach((item) => {
        switch (item.type) {
          case "excavator":
            setPriceExcavator(item.price * numberOfOne * calTimeofProject);
            break;
          case "truck":
            setPriceTruck(item.price * numberOfOne * calTimeofProject);
            break;
          case "JCB":
            setPriceJCB(item.price * numberOfOne * calTimeofProject);
            break;
          default:
            break;
        }
      });

      matPrices.forEach((item) => {
        switch (item.type) {
          case "sand":
            setPriceSand(item.price * sandValue);
            break;
          case "aggregate":
            SetPriceAggregate(item.price * aggregateValue);
            break;
          case "concrete slab":
            setPriceConcreteSlab(item.price * concreteSlab); // yes like that  calculatedVolume
            break;
          case "excavation":
            setPriceExcavation(item.price * calculatedVolume);
            break;
          default:
            break;
        }
      });

      eqPrices.forEach((item) => {
        switch (item.type) {
          case "cable":
            setPriceCable(item.price * length * widthCable);
            break;
          case "compactor":
            setPriceCompactor(item.price * numberOfOne * calTimeofProject);
            break;
          default:
            break;
        }
      });

      setValueOfCable(widthCable * length);
      setNumberOfCompactor(numberOfOne);
      setNumberOfExcavator(numberOfOne);
      setNumberOfTruck(numberOfOne);
      setNumberOfJCB(numberOfOne);
      setNumberOfWorkers(numberOfWorkers);

      setValueOfExcavation(calculatedVolume);
      setValueOfSand(sandValue);
      setValueOfAggregate(aggregateValue);
      setValueOfConcreteSlab(concreteSlab);
      setCalProjectTime(calTimeofProject);

      return { numberOfWorkers: numberOfWorkers };
    },
    [length, widthCable, depth, volume]
  );

  //Get material Price
  useEffect(() => {
    const fetchMaterialPrice = async () => {
      try {
        const response = await fetch(`http://localhost:3000/materials/all`);
        if (!response.ok) {
          throw new Error("Unexpected error");
        }
        const allMaterial = await response.json();

        const newPrices = [];

        allMaterial.forEach((material) => {
          if (material.material_name === "sand") {
            setSandUnitPrice(material.material_price);
            const sandPrice = material.material_price;
            newPrices.push({ type: "sand", price: sandPrice });
          } else if (material.material_name === "aggregate") {
            setAggregateUnitPrice(material.material_price);
            const aggregatePrice = material.material_price;
            newPrices.push({ type: "aggregate", price: aggregatePrice });
          } else if (material.material_name === "concrete slab") {
            setConcreteSlabUnitPrice(material.material_price);
            const concreteSlabPrice = material.material_price;
            newPrices.push({ type: "concrete slab", price: concreteSlabPrice });
          } else if (material.material_name === "excavation") {
            setExcavationUnitPrice(material.material_price);
            const excavationPrice = material.material_price;
            newPrices.push({ type: "excavation", price: excavationPrice });
          }
        });

        setMatPrices(newPrices);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMaterialPrice();
  }, []);

  // get Vehicle price
  useEffect(() => {
    const fetchVehiclePrice = async () => {
      try {
        const response = await fetch(`http://localhost:3000/vehicles/all`);
        const response2 = await fetch("http://localhost:3000/worker/all");
        if (!response.ok && response2.ok) {
          throw new Error("Unexpected error");
        }
        const allVehicles = await response.json();
        const workerGet = await response2.json();

        const newVehPrices = [];

        allVehicles.map((vehicle) => {
          if (vehicle.vehicle_type === "truck") {
            setTruckUnitPrice(vehicle.vehicle_price);
            const truckPrice = vehicle.vehicle_price;
            newVehPrices.push({ type: "truck", price: truckPrice });
          } else if (vehicle.vehicle_type === "excavator") {
            setExcavatorUnitPrice(vehicle.vehicle_price);
            const excavatorPrice = vehicle.vehicle_price;
            newVehPrices.push({ type: "excavator", price: excavatorPrice });
          } else if (vehicle.vehicle_type === "JCB") {
            setJcbUnitPrice(vehicle.vehicle_price);
            const JCBPrice = vehicle.vehicle_price;
            newVehPrices.push({ type: "JCB", price: JCBPrice });
          }
        });
        setVehPrices(newVehPrices);

        // Worker Price
        const workerPrice = workerGet[0].worker_price;
        setWorkerUnitPrice(workerGet[0].worker_price);
        setWorPrices(workerPrice);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVehiclePrice();
  }, []);

  useEffect(() => {
    const fetchEquipmentPrice = async () => {
      try {
        const response = await fetch("http://localhost:3000/equipment/all");
        if (!response.ok) {
          throw new Error("Unexpected error");
        }

        const allEquipment = await response.json();

        const newEqPrices = [];

        allEquipment.forEach((equipment) => {
          if (equipment.equipment_name === "compactor") {
            setCompactorUnitPrice(equipment.equipment_price);
            const compactorPrice = equipment.equipment_price;
            newEqPrices.push({ type: "compactor", price: compactorPrice });
          } else if (equipment.equipment_name === "cable") {
            setCableUnitPrice(equipment.equipment_price);
            const cablePrice = equipment.equipment_price;
            newEqPrices.push({ type: "cable", price: cablePrice });
          }
        });

        setEqPrices(newEqPrices);
      } catch (err) {
        console.log(err);
      }
    };
    fetchEquipmentPrice();
  }, []);

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const getExcel = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/electric/${idElectricProject}/export/excel`,
        { responseType: "blob" } // Yanıtın blob formatında gelmesi için
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "electric_project.xlsx"); // Dosya adını belirleyin
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log("error: " + error);
    }
  }, [idElectricProject]);

  // reacord data to  electric db
  const sendToDB = useCallback(async () => {
    // send to db
    try {
      const response = await axios.post(
        "http://localhost:3000/electric/create",
        {
          equipments: [
            {
              type: "compactor",
              quantity: numberOfCompactor,
              unitprice: compactorUnitPrice.toFixed(0),
              price: priceCompactor,
            },
            {
              type: "cable",
              quantity: valueofCable.toFixed(0),
              unitprice: cableUnitPrice,
              price: priceCable.toFixed(0),
            },
          ],
          vehicles: [
            {
              type: "excavator",
              quantity: numberOfExcavator,
              unitprice: excavatorUnitPrice,
              price: priceExcavator.toFixed(0),
            },
            {
              type: "truck",
              quantity: numberOfTruck,
              unitprice: truckUnitPrice,
              price: priceTruck.toFixed(0),
            },
            {
              type: "JCB",
              quantity: numberOfJCB,
              unitprice: jcbUnitPrice,
              price: priceJCB.toFixed(1),
            },
          ],
          materials: [
            {
              type: "sand",
              quantity: valueOfSand.toFixed(0),
              unitprice: sandUnitPrice,
              price: priceSand.toFixed(0),
            },
            {
              type: "aggregate",
              quantity: valueOfAggregate.toFixed(0),
              unitprice: aggregateUnitPrice,
              price: priceAggregate.toFixed(0),
            },
            {
              type: "concrete slab",
              quantity: valueOfConcreteSlab,
              unitprice: concreteSlabUnitPrice,
              price: priceConcreteSlab.toFixed(0),
            },
            {
              type: "excavation",
              quantity: valueOfExcavation.toFixed(0),
              unitprice: excavationUnitPrice,
              price: priceExcavation.toFixed(0),
            },
          ],
          worker: [
            {
              type: "worker",
              quantity: numberOfWorkers,
              unitprice: workerUnitPrice,
              price: priceWorkers,
            },
          ],
          project_time: calProjectTime,
          total_price: totalProjectPrice,
        }
      );

      const data_id = response.data._id;
      setIdElectricProject(data_id);

      console.log("Backend'den gelen yanıt:", response.data);
    } catch (err) {
      console.error("Hata:", err);
      if (isMounted.current) {
        console.error("Failed to send data to DB", err);
      }
    }
  }, [
    numberOfCompactor,
    priceCompactor,
    compactorUnitPrice,
    cableUnitPrice,
    valueofCable,
    priceCable,
    numberOfExcavator,
    excavatorUnitPrice,
    priceExcavator,
    numberOfTruck,
    truckUnitPrice,
    priceTruck,
    jcbUnitPrice,
    numberOfJCB,
    priceJCB,
    sandUnitPrice,
    valueOfSand,
    priceSand,
    aggregateUnitPrice,
    valueOfAggregate,
    priceAggregate,
    concreteSlabUnitPrice,
    valueOfConcreteSlab,
    priceConcreteSlab,
    excavationUnitPrice,
    valueOfExcavation,
    priceExcavation,
    workerUnitPrice,
    numberOfWorkers,
    priceWorkers,
    calProjectTime,
    totalProjectPrice,
  ]);

  useEffect(() => {
    //okey
    if (!matPrices && !vehPrices && !eqPrices)
      return console.log("error gettign the data from the state");
    calculateEssential(matPrices, vehPrices, eqPrices);

    if (!worPrices && !numberOfWorkers && calProjectTime !== 0)
      return console.log("error getting worker price");
    setPriceWorkers(worPrices * numberOfWorkers * calProjectTime);
  }, [
    matPrices,
    vehPrices,
    numberOfWorkers,
    worPrices,
    eqPrices,
    calProjectTime,
    calculateEssential,
  ]);

  const handleExport = (e) => {
    e.preventDefault();
    getExcel();
  };

  const handleRecordIt = (e) => {
    e.preventDefault();
    sendToDB();
  };

  //Calculate button
  const handleSubmit = async (e) => {
    e.preventDefault();

    //hatalı her proje için
    const totalVPRice =
      priceExcavator + priceTruck + priceJCB + priceCable + priceCompactor;
    const totalMPrice =
      priceSand +
      priceAggregate +
      priceConcreteSlab +
      priceExcavation +
      priceWorkers;
    const totalAllPrice = totalMPrice + totalVPRice;

    setTotalProjectPrice(totalAllPrice.toFixed(0));

    console.log("deneme price: " + totalAllPrice.toLocaleString("tr-TR"));
  };

  // record project id to general proejct db
  useEffect(() => {
    if (idElectricProject) {
      const postProjectId = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 3 saniye bekle
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
    }
  }, [idElectricProject, holdUserId]);

  const [distance, setDistance] = useState(0);

  //leaflet map
  const handleTotalDistanceChange = (newDistance) => {
    setDistance(newDistance);
  };

  useEffect(() => {
    setLength(distance);
  }, [distance]);

  return (
    <div className="concrete">
      <Col>
      <Row>
      <HeaderTr items="electric" />
      </Row>
        <Row>
          <Col>
            <LeafletMap onTotalDistanceChange={handleTotalDistanceChange} />
          </Col>
          <Col xs={6}>
            <div className="excavation-col">
              <h2>Electric laying Calculate</h2>
              <form onSubmit={handleSubmit}>
                <label>
                  Length (m):
                  <input
                    className="m-2"
                    type="number"
                    placeholder="Uzunluk"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    onFocus={(e) => e.target.select()} // Girdiye odaklandığında içeriği seç
                  />
                </label>
                <br />
                <label>
                  Width (m):
                  <input
                    className="m-2"
                    type="float"
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
                    value={depth}
                    readOnly // Sadece okunabilir olarak ayarla
                  />
                </label>
                <br />
                <div className="calculate">
                  <button type="submit" className="calculate-button m-2">
                    {" "}
                    Calculate
                  </button>
                  <button className="calculate-button" onClick={handleRecordIt}>
                    Record It
                  </button>
                </div>
              </form>
              <div className="result">
                Volume (m³) : {volume && <span> {volume} m³</span>}
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="mt-4">
            <div className="excavation-col">
              <h2>Asphalt Road Calculator </h2>
              <h3>
                {" "}
                Project Time: {calProjectTime
                  ? `${calProjectTime} month`
                  : "-"}{" "}
              </h3>
              <h3> For Materials</h3>
              <table className="uniform-table">
                <thead>
                  <tr>
                    <th>Material Name</th>
                    <th>Total Value M3</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td> Excavation </td>
                    <td>
                      {valueOfExcavation
                        ? `${valueOfExcavation.toFixed(0)} m³`
                        : "-"}
                    </td>
                    <td>
                      {priceExcavation
                        ? `${priceExcavation.toLocaleString("tr-TR") + " TL"} `
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td>Sand </td>
                    <td>
                      {valueOfSand ? `${valueOfSand.toFixed(0)} m³` : "-"}
                    </td>
                    <td>
                      {priceSand
                        ? `${priceSand.toLocaleString("tr-TR") + " TL"}`
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td>Aggregate </td>
                    <td>
                      {valueOfAggregate
                        ? `${valueOfAggregate.toFixed(0)} m³`
                        : "-"}
                    </td>
                    <td>
                      {priceAggregate
                        ? `${priceAggregate.toLocaleString("tr-TR") + " TL"}`
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td>Concrete Slab</td>
                    <td>
                      {valueOfConcreteSlab
                        ? `${valueOfConcreteSlab.toFixed(2)} m³`
                        : "-"}
                    </td>
                    <td>
                      {priceConcreteSlab
                        ? `${priceConcreteSlab.toLocaleString("tr-TR") + " TL"}`
                        : "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
              <h3> For Vehicles</h3>
              <table className="uniform-table">
                <thead>
                  <tr>
                    <th>Vehicle Name</th>
                    <th>Number of Vehicle</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td> Excavator</td>
                    <td>
                      {numberOfExcavator ? `${numberOfExcavator} piece` : "-"}
                    </td>
                    <td>
                      {priceExcavator
                        ? `${priceExcavator.toLocaleString("tr-TR") + " TL"}`
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td>Truck</td>
                    <td>{numberOfTruck ? `${numberOfTruck} piece` : "-"}</td>
                    <td>
                      {priceTruck
                        ? `${priceTruck.toLocaleString("tr-TR") + " TL"}`
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td>JCB</td>
                    <td>{numberOfJCB ? `${numberOfJCB} piece` : "-"}</td>
                    <td>
                      {priceJCB
                        ? `${priceJCB.toLocaleString("tr-TR") + " TL"}`
                        : "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
              <h3> For Equipments</h3>
              <table className="uniform-table">
                <thead>
                  <tr>
                    <th>Equipment Name</th>
                    <th>Total Number</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Compactor</td>
                    <td>
                      {numberOfCompactor
                        ? `${numberOfCompactor.toFixed(0)} piece`
                        : "-"}
                    </td>
                    <td>
                      {priceCompactor
                        ? `${priceCompactor.toLocaleString("tr-TR") + " TL"}`
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td>Cable</td>
                    <td>
                      {valueofCable ? `${valueofCable.toFixed(0)} meter` : "-"}
                    </td>
                    <td>
                      {priceCable
                        ? `${priceCable.toLocaleString("tr-TR") + " TL"}`
                        : "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
              <h3> For Workers</h3>
              <table className="uniform-table">
                <thead>
                  <tr>
                    <th>Worker Type</th>
                    <th>Number of Workers</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Worker </td>
                    <td>
                      {numberOfWorkers ? `${numberOfWorkers} piece` : "-"}
                    </td>
                    <td>
                      {priceWorkers
                        ? `${priceWorkers.toLocaleString("tr-TR") + " TL"}`
                        : "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>All Total Price</td>
                    <td>
                      {totalProjectPrice
                        ? `${totalProjectPrice.toLocaleString("tr-TR") + " TL"}`
                        : "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
              <button onClick={handleExport} className="calculate-button">
                {" "}
                Export Excel
              </button>
            </div>
          </Col>
        </Row>
      </Col>
    </div>
  );
};

export default ElectricProject;
