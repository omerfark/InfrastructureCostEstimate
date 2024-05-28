import { useCallback, useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AsphaltCalculator.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import asphalt_1 from "../../assets/asphalt-1.png";
import LeafletMap from "../LeafletMap/LeafletMap";

const AsphaltCalculator = () => {
  const [holdUserId, setHoldUserId] = useState("");

  const navigate = useNavigate();
  axios.defaults.withCredentials = true; // cookie özelliği eklemek için

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
  const depth = 0.2;
  const [volume, setVolume] = useState(null); // Hacim

  // Vehicles
  const [numberOfExcavator, setNumberOfExcavator] = useState(null);
  const [numberOfTruck, setNumberOfTruck] = useState(null);
  const [numberOfRoller, setNumberOfRoller] = useState(null);
  const [numberOfGreyder, setNumberOfGreyder] = useState(null);
  const [numberOfFinisher, setNumberOfFinisher] = useState(null);

  // Materials
  const [valueOfPmt, setValuOfPmt] = useState(null);
  const [valueOfAsphalt_1, setValuOfAsphlt_1] = useState(null);
  const [valueOfAsphalt_2, setValuOfAsphlt_2] = useState(null);
  const [valueOfExcavation, setValuOfExcavation] = useState(null);

  // Workers
  const [numberOfWorkers, setNumberOfWorkers] = useState(null);

  //unit Prices
  const [excavatorUnitPrice, setExcavatorUnitPrice] = useState(null);
  const [truckUnitPrice, setTruckUnitPrice] = useState(null);
  const [rollerunitPrice, setRollerunitPrice] = useState(null);
  const [greyderUnitPrice, setGreyderUnitPrice] = useState(null);
  const [finisherUnitPrice, setFinisherUnitPrice] = useState(null);
  const [pmtUnitPrice, setPmtUnitPrice] = useState(null);
  const [asphalt_1UnitPrice, setAsphalt_1UnitPrice] = useState(null);
  const [asphalt_2UnitPrice, setAsphalt_2UnitPrice] = useState(null);
  const [excavationUnitPrice, setExcavationUnitPrice] = useState(null);
  const [workerUnitPrice, setWorkerUnitPrice] = useState(null);

  // Prices
  const [priceExcavator, setPriceExcavator] = useState(null);
  const [priceTruck, setPriceTruck] = useState(null);
  const [priceRoller, setPriceRoller] = useState(null);
  const [priceGreyder, setPriceGreyder] = useState(null);
  const [priceFinisher, setPriceFinisher] = useState(null);
  const [pricePmt, setPricePmt] = useState(null);
  const [priceAsphalt_1, setPriceAsphalt_1] = useState(null);
  const [priceAsphalt_2, setPriceAsphalt_2] = useState(null);
  const [priceExcavation, setPriceExcavation] = useState(null);
  const [priceWorkers, setPriceWorkers] = useState(null);
  const [totalProjectPrice, setTotalProjectPrice] = useState(null);
  const [calProjectTime, setCalProjectTime] = useState(null);

  // Asphalt project id
  const [idAsphaltProject, setIdAsphaltProject] = useState("");

  const [matPrices, setMatPrices] = useState([]);
  const [vehPrices, setVehPrices] = useState([]);
  const [worPrices, setWorPrices] = useState(0);

  const CalculateEssential_1 = useCallback((matPrices, vehPrices) => {
      console.log("first caluclation");
      console.log("matPrices", matPrices);
      console.log("vehPrices", vehPrices);

      const calTimeofProject = Math.ceil(volume / 3200);

      const calculatedVolume = length * width * depth;
      setVolume(calculatedVolume.toFixed(0));

      const essentialNumberOfEquipment = Math.ceil(length / 3000);
      const numberOfTwo = 2 * essentialNumberOfEquipment;
      const numberOfOne = essentialNumberOfEquipment;
      const numberOfWorkers = 4 * essentialNumberOfEquipment;

      const totalValueAsphalt_1 = 2.4 * (0.15 * length * width); // alt tabaka 15 cm
      const totalValueAsphalt_2 = 2.4 * (0.05 * length * width); // üst tabaka 5 cm
      const totalValuePmt = 0.1 * length * width; // pmt tabakası 10 cm


      vehPrices.forEach((item) => {
        switch (item.type) {
          case "excavator":
            setPriceExcavator(item.price * numberOfTwo * calTimeofProject);
            break;
          case "truck":
            setPriceTruck(item.price * numberOfTwo * calTimeofProject);
            break;
          case "roller":
            setPriceRoller(item.price * numberOfOne * calTimeofProject);
            break;
          case "greyder":
            setPriceGreyder(item.price * numberOfOne * calTimeofProject);
            break;
          case "finisher":
            setPriceFinisher(item.price * numberOfOne * calTimeofProject);
            break;
          default:
            break;
        }
      });

      matPrices.forEach((item) => {
        switch (item.type) {
          case "pmt":
            setPricePmt(item.price * totalValuePmt);
            break;
          case "asphalt_1":
            setPriceAsphalt_1(item.price * totalValueAsphalt_1);
            break;
          case "asphalt_2":
            setPriceAsphalt_2(item.price * totalValueAsphalt_2); // yes like that  calculatedVolume
            break;
          case "excavation":
            setPriceExcavation(item.price * calculatedVolume);
            break;
          default:
            break;
        }
      });

      setNumberOfExcavator(numberOfTwo);
      setNumberOfTruck(numberOfTwo);
      setNumberOfRoller(numberOfOne);
      setNumberOfGreyder(numberOfOne);
      setNumberOfFinisher(numberOfOne);
      setNumberOfWorkers(numberOfWorkers);

      setValuOfExcavation(calculatedVolume.toFixed(0));
      setValuOfAsphlt_1(totalValueAsphalt_1);
      setValuOfAsphlt_2(totalValueAsphalt_2);
      setValuOfPmt(totalValuePmt);
      setCalProjectTime(calTimeofProject);

      return { numberOfWorkers: numberOfWorkers };
    },
    [length, width, depth, volume]
  );

  //#region materials price
  useEffect(() => {
    const fetchMaterialPrice = async () => {
      try {
        const response = await fetch(`http://localhost:3000/materials/all`);
        if (!response.ok) {
          throw new Error("Failed to fetch material prices");
        }

        const allMaterial = await response.json();

        const newPrices = [];

        allMaterial.forEach((material) => {
          if (material.material_name === "pmt") {
            setPmtUnitPrice(material.material_price);
            const pmtPrice = material.material_price;
            newPrices.push({ type: "pmt", price: pmtPrice });
          } else if (material.material_name === "asphalt_1") {
            setAsphalt_1UnitPrice(material.material_price);
            const asphaltPrice = material.material_price;
            newPrices.push({ type: "asphalt_1", price: asphaltPrice });
          } else if (material.material_name === "asphalt_2") {
            setAsphalt_2UnitPrice(material.material_price);
            const asphalt2Price = material.material_price;
            newPrices.push({ type: "asphalt_2", price: asphalt2Price });
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
  //#endregion

  //#region Vehicle price
  useEffect(() => {
    const fetchVehiclePrice = async () => {
      try {
        const response = await fetch(`http://localhost:3000/vehicles/all`);
        const response2 = await fetch("http://localhost:3000/worker/all");
        if (!response.ok || !response2.ok) {
          throw new Error("Failed to fetch vehicle or worker prices");
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
          } else if (vehicle.vehicle_type === "roller") {
            setRollerunitPrice(vehicle.vehicle_price);
            const rollerPrice = vehicle.vehicle_price;
            newVehPrices.push({ type: "roller", price: rollerPrice });
          } else if (vehicle.vehicle_type === "greyder") {
            setGreyderUnitPrice(vehicle.vehicle_price);
            const greyderPrice = vehicle.vehicle_price;
            newVehPrices.push({ type: "greyder", price: greyderPrice });
          } else if (vehicle.vehicle_type === "finisher") {
            setFinisherUnitPrice(vehicle.vehicle_price);
            const finisherPrices = vehicle.vehicle_price;
            newVehPrices.push({ type: "finisher", price: finisherPrices });
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
  //#endregion

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const getExcel = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/asphalt/${idAsphaltProject}/export/excel`,
        { responseType: "blob" } // Yanıtın blob formatında gelmesi için
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "asphalt_project.xlsx"); // Dosya adını belirleyin
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log("error: " + error);
    }
  }, [idAsphaltProject]);

  const sendToDB = useCallback(async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/asphalt/create",
        {
          equipments: [
            { type: "equipment Type", quantity: 10, unitprice: 10, price: 100 }, // Örnek değerler
          ],
          vehicles: [
            {
              type: "excavator",
              quantity: numberOfExcavator,
              unitprice: excavatorUnitPrice,
              price: priceExcavator,
            },
            {
              type: "truck",
              quantity: numberOfTruck,
              unitprice: truckUnitPrice,
              price: priceTruck,
            },
            {
              type: "roller",
              quantity: numberOfRoller,
              unitprice: rollerunitPrice,
              price: priceRoller,
            },
            {
              type: "greyder",
              quantity: numberOfGreyder,
              unitprice: greyderUnitPrice,
              price: priceGreyder,
            },
            {
              type: "finisher",
              quantity: numberOfFinisher,
              unitprice: finisherUnitPrice,
              price: priceFinisher,
            },
          ],
          materials: [
            {
              type: "pmt",
              quantity: valueOfPmt,
              unitprice: pmtUnitPrice,
              price: pricePmt,
            },
            {
              type: "asphalt_1",
              quantity: valueOfAsphalt_1,
              unitprice: asphalt_1UnitPrice,
              price: priceAsphalt_1,
            },
            {
              type: "asphalt_2",
              quantity: valueOfAsphalt_2,
              unitprice: asphalt_2UnitPrice,
              price: priceAsphalt_2,
            },
            {
              type: "excavation",
              quantity: valueOfExcavation,
              unitprice: excavationUnitPrice,
              price: priceExcavation,
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
      setIdAsphaltProject(data_id);

      console.log("Backend'den gelen yanıt:", response.data);
    } catch (error) {
      console.error("Hata:", error);
      if (isMounted.current) {
        console.error("Failed to send data to DB", error);
      }
    }
  }, [
    calProjectTime,
    numberOfExcavator,
    numberOfTruck,
    numberOfRoller,
    numberOfGreyder,
    numberOfFinisher,
    valueOfPmt,
    valueOfAsphalt_1,
    valueOfAsphalt_2,
    valueOfExcavation,
    numberOfWorkers,
    priceExcavator,
    priceTruck,
    priceRoller,
    priceGreyder,
    priceFinisher,
    pricePmt,
    priceAsphalt_1,
    priceAsphalt_2,
    priceExcavation,
    priceWorkers,
    excavatorUnitPrice,
    truckUnitPrice,
    rollerunitPrice,
    greyderUnitPrice,
    finisherUnitPrice,
    pmtUnitPrice,
    asphalt_1UnitPrice,
    asphalt_2UnitPrice,
    excavationUnitPrice,
    workerUnitPrice,
    totalProjectPrice,
  ]);

  useEffect(() => {
    //okey
    if (!matPrices && !vehPrices)
      return console.log("error gettign the data from the state");
    CalculateEssential_1(matPrices, vehPrices);

    if (!worPrices && !numberOfWorkers)
      return console.log("error getting worker price");
    setPriceWorkers(worPrices * numberOfWorkers);
  }, [matPrices, vehPrices, numberOfWorkers, worPrices, CalculateEssential_1]);

  const handleExport = (e) => {
    e.preventDefault();

    getExcel();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const totalMPrice =
    priceExcavator +
    priceTruck +
    priceRoller +
    priceGreyder +
    priceFinisher;

  const totalVPRice =
    pricePmt +
    priceAsphalt_1 +
    priceAsphalt_2 +
    priceExcavation +
    priceWorkers;

  const totalAllPrice = totalMPrice + totalVPRice;
  setTotalProjectPrice(totalAllPrice.toFixed(0));

  console.log("deneme price: " + totalAllPrice.toLocaleString("tr-TR"));

    sendToDB();
  };

  // Add asphalt project to user project list
  useEffect(() => {
    if (idAsphaltProject) {
      const postProjectId = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 saniye bekle
        try {
          const response = await axios.patch(
            `http://localhost:3000/project/${holdUserId}/asphalt`,
            {
              asphalt_projects: idAsphaltProject,
            }
          );
          console.log(response.data);
        } catch (err) {
          console.log(err);
        }
      };
      postProjectId();
    }
  }, [idAsphaltProject, holdUserId]);

  const [distance, setDistance] = useState(0);

  //leaflet map
  const handleTotalDistanceChange = (newDistance) => {
    setDistance(newDistance);
  };

  useEffect(() => {
    setLength(distance);
  }, [distance]);

  return (
    <div className="asphalt">
      <Col>
        <Row className="mt-5">
          <Col>
            <LeafletMap onTotalDistanceChange={handleTotalDistanceChange} />
          </Col>
          <Col xs={6}>
            <div className="excavation-col flex-grow-1 ">
              <h2>Asphalt Road Calculating</h2>
              <form onSubmit={handleSubmit}>
                <label>
                  Length (m):
                  <input
                    className="m-2"
                    type="number"
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
                    type="number"
                    value={width}
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
                    value={depth}
                    readOnly // Sadece okunabilir olarak ayarla
                  />
                </label>
                <br />
                <div className="calculate">
                  <button type="submit" className="calculate-button">
                    {" "}
                    Record it
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
                    <td>Total Excavation Volume (m³)</td>
                    <td>
                      {valueOfExcavation ? `${valueOfExcavation} m³` : "-"}
                    </td>
                    <td>
                      {priceExcavation
                        ? `${priceExcavation.toLocaleString("tr-TR") + " TL"} `
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td>Pmt Quantity</td>
                    <td>{valueOfPmt ? `${valueOfPmt.toFixed(2)} m³` : "-"}</td>
                    <td>
                      {pricePmt
                        ? `${pricePmt.toLocaleString("tr-TR") + " TL"}`
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td>Bitum Asphalt Quantity</td>
                    <td>
                      {valueOfAsphalt_1
                        ? `${valueOfAsphalt_1.toFixed(2)} m³`
                        : "-"}
                    </td>
                    <td>
                      {priceAsphalt_1
                        ? `${priceAsphalt_1.toLocaleString("tr-TR") + " TL"}`
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td>Wear Asphalt Quantity</td>
                    <td>
                      {valueOfAsphalt_1
                        ? `${valueOfAsphalt_1.toFixed(2)} m³`
                        : "-"}
                    </td>
                    <td>
                      {priceAsphalt_2
                        ? `${priceAsphalt_2.toLocaleString("tr-TR") + " TL"}`
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
                    <td>Number of Excavator (m³)</td>
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
                    <td>Number of Truck</td>
                    <td>{numberOfTruck ? `${numberOfTruck} piece` : "-"}</td>
                    <td>
                      {priceTruck
                        ? `${priceTruck.toLocaleString("tr-TR") + " TL"}`
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td>Number of Roller</td>
                    <td>{numberOfRoller ? `${numberOfRoller} piece` : "-"}</td>
                    <td>
                      {priceRoller
                        ? `${priceRoller.toLocaleString("tr-TR") + " TL"}`
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td>Number of Greyder</td>
                    <td>
                      {numberOfGreyder ? `${numberOfGreyder} piece ` : "-"}
                    </td>
                    <td>
                      {priceGreyder
                        ? `${priceGreyder.toLocaleString("tr-TR") + " TL"}`
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td>Number of Finisher</td>
                    <td>
                      {numberOfFinisher ? `${numberOfFinisher} piece` : "-"}
                    </td>
                    <td>
                      {priceFinisher
                        ? `${priceFinisher.toLocaleString("tr-TR") + " TL"}`
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
                    <td>None</td>
                    <td>{emptyValue ? `${emptyValue} piece` : "-"}</td>
                    <td>
                      {emptyValue
                        ? `${emptyValue.toLocaleString("tr-TR") + " TL"}`
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
