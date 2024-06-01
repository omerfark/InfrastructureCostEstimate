import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PipeConcrete.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import büzz_pipe from "../../assets/büzz-pipe.png";
import koruge_pipe from "../../assets/koruge-pipe.png";
import LeafletMap from "../LeafletMap/LeafletMap";

const PipeConcrete = () => {
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

  //test.omer1212@gmail.com

  const emptyValue = null;
  const [length, setLength] = useState(null); // Kazı boyu
  const [excavation_width, setWidth] = useState(null); // Genişlik
  const [excavation_depth, setDepth] = useState(null); // Derinlik
  const [volume, setVolume] = useState(null); // Hacim
  const [homePiece, setHomePiece] = useState(null); // kaç adet ev olduğu

  //Equipment
  //vehicle
  const [numberOfExcavator, setNumberOfExcavator] = useState(null);
  const [numberOfTruck, setNumberOfTruck] = useState(null);
  const [numberOfJCB, setNumberOfJCB] = useState(null);
  //materials
  const [valueOfAggregate, setValueOfAggregate] = useState(null);
  const [valueOfExcavation, setValuOfExcavation] = useState(null);
  const [numberOfPipe, setNumberOfPipe] = useState(null); // kazı uzunluğuna göre kullanılacak boru adedi
  const [numberOfBaseElement, setNumberofBaseElement] = useState(null); // taban, bilezik ve kanalizasyon kapak kısmı
  const [numberOfConnectors, setNumberOfConnector] = useState(null); // parsel ve c bağlantısı adedi, kazı uzunluğundan cıkarılacak 1 mt c elemanı, pvc adedi
  const [numberOfPvcPipe, setNumberOfPvcPipe] = useState(null); // parsel ile aynı 2 mt bağlantı boruları

  //workers
  const [numberOfWorkers, setNumberOfWorkers] = useState(null);

  //unit Prices
  const [excavatorUnitPrice, setExcavatorUnitPrice] = useState(null);
  const [truckUnitPrice, setTruckUnitPrice] = useState(null);
  const [jcbUnitPrice, setJcbUnitPrice] = useState(null);
  const [aggregateUnitPrice, setAggregateUnitPrice] = useState(null);
  const [pipeUnitPrice, setPipeUnitPrice] = useState(null);
  const [baseElementUnitPrice, setBaseElementUnitPrice] = useState(null);
  const [excavationUnitPrice, setExcavationUnitPrice] = useState(null);
  const [connectorsUnitPrice, setConnectorsUnitPrice] = useState(null);
  const [pvcUnitPrice, setPvcUnitPrice] = useState(null);
  const [workerUnitPrice, setWorkerUnitPrice] = useState(null);

  //priceAll
  const [priceExcavator, setPriceExcavator] = useState(null);
  const [priceTruck, setPriceTruck] = useState(null);
  const [priceJCB, setPriceJCB] = useState(null);
  const [priceAggregate, setPriceAggregate] = useState(null);
  const [priceExcavation, setPriceExcavation] = useState(null);
  const [pricePipe, setPricePipe] = useState(null);
  const [priceBaseElement, setPriceBaseElement] = useState(null);
  const [priceConnectors, setPriceConnectors] = useState(null);
  const [pricePvcPipe, setPricePvcPrice] = useState(null);
  const [priceWorkers, setPriceWorkers] = useState(null);
  const [calProjectTime, setCalProjectTime] = useState(null);
  const [totalProjectPrice, setTotalProjectPrice] = useState(null);

  //PipeConcrete project id
  const [idPipeConcreteProject, setIdPipeConcreteProject] = useState("");

  const [matPrices, setMatPrices] = useState([]);
  const [vehPrices, setVehPrices] = useState([]);
  const [worPrices, setWorPrices] = useState(0);

  const calcualteEssential = useCallback((matPrices, vehPrices) => {
    console.log("first caluclation");
    console.log("matPrices", matPrices);
    console.log("vehPrices", vehPrices);

    const calTimeofProject = Math.ceil(length / 2500);

    const options = [
      {
        name: "concretepipe",
        diameter: "0.3",
        volume: "0.11",
        length: "1.5",
        nickname: "sewer type 1 - (Concrete)",
      },
    ];

    const depthValue = 7 * options[0].diameter; // boru tipine göre genişlik
    const widthValue = 4 * options[0].diameter; // boru tipine göre genişlik

    setDepth(depthValue);
    setWidth(widthValue);

    const calculatedVolume = length * widthValue * depthValue;
    setVolume(calculatedVolume.toFixed(0));

    const meterConnectors = homePiece * 1; // 1 mt c eleman
    const meterBaseElements = 1 * (length / 60); // 1mt genişlik uzunluk
    const calPiecePipe =(length - (meterBaseElements + meterConnectors)) /options[0].length;
    const piecePipe = Math.ceil(calPiecePipe);
    

    const calAggregateVolume = calculatedVolume - (options[0].volume * piecePipe); //beton boru aggrega hesabı alt üst eşit

    const calBaseElement = Math.ceil(length / 60);
    const calConnectors = Math.ceil(meterConnectors);

    const calNumberOfVehicles = Math.ceil(calculatedVolume / 6000); // üst tama yuvarlama
    const numberOfTwo = 2 * calNumberOfVehicles;
    const numberOfWorkers = 6 * calNumberOfVehicles;

    vehPrices.forEach((item) => {
      switch (item.type) {
        case "excavator":
          setPriceExcavator(item.price * numberOfTwo * calTimeofProject);
          break;
        case "truck":
          setPriceTruck(item.price * numberOfTwo * calTimeofProject);
          break;
        case "JCB":
          setPriceJCB(item.price * numberOfTwo * calTimeofProject);
          break;
        default:
          break;
      }
    });


    matPrices.forEach((item) => {
      switch (item.type) {
        case "aggregate":
          setPriceAggregate(item.price * calAggregateVolume);
          break;
        case "concretepipe":
          setPricePipe(item.price * piecePipe);
          break;
        case "baseElement":
          setPriceBaseElement(item.price * calBaseElement); 
          break;
        case "excavation":
          setPriceExcavation(item.price * calculatedVolume);
          break;
        case "connector":
          setPriceConnectors(item.price * calConnectors); 
          break;
        case "pvc":
          setPricePvcPrice(item.price * calConnectors);
          break;
        default:
          break;
      }
    });

    setCalProjectTime(calTimeofProject);

    setValuOfExcavation(calculatedVolume.toFixed(0));
    setValueOfAggregate(calAggregateVolume);
    setNumberOfPipe(piecePipe); // kaç adet boru hesabı
    setNumberofBaseElement(calBaseElement); // bağlantı noktaları, taban , bilezik ve kapak
    setNumberOfConnector(calConnectors); // parsel bağlantısı icin, c elemanı, parsel taba, parsel kapak olarak 1mt
    setNumberOfPvcPipe(calConnectors); // ev adedi sayısıyla parsel borusu sayısı aynı olacak 2mt lik alınacak pvc

    setNumberOfExcavator(numberOfTwo);
    setNumberOfJCB(numberOfTwo);
    setNumberOfTruck(numberOfTwo);
    setNumberOfWorkers(numberOfWorkers);

    return { numberOfWorkers: numberOfWorkers };
  }, [length,homePiece]);

  //material Price
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
          if (material.material_name === "aggregate") {
            setAggregateUnitPrice(material.material_price);
            const aggregatePrice = material.material_price;
            newPrices.push({ type: "aggregate", price: aggregatePrice });
          }else if (material.material_name === "excavation") {
            setExcavationUnitPrice(material.material_price);
            const excavationPrice = material.material_price;
            newPrices.push({ type: "excavation", price: excavationPrice });
          } else if (material.material_name === "concretepipe") {
            setPipeUnitPrice(material.material_price);
            const concretepipePrice = material.material_price;
            newPrices.push({ type: "concretepipe", price: concretepipePrice });
          } else if (material.material_name === "baseElement") {
            setBaseElementUnitPrice(material.material_price);
            const baseElementPrice = material.material_price;
            newPrices.push({ type: "baseElement", price: baseElementPrice });
          } else if (material.material_name === "connector") {
            setConnectorsUnitPrice(material.material_price);
            const connectorPrice = material.material_price;
            newPrices.push({ type: "connector", price: connectorPrice });
          } else if (material.material_name === "pvc") {
            setPvcUnitPrice(material.material_price);
            const pvcPrice = material.material_price;
            newPrices.push({ type: "pvc", price: pvcPrice });
          }
        });

        setMatPrices(newPrices);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMaterialPrice();
  }, []);

  //vehicle price
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

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  //get excel report
  const getExcel = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/pipeConcrete/${idPipeConcreteProject}/export/excel`,
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
  }, [idPipeConcreteProject]);

  //Tüm fiyatlar hesaplanınca db ye kaydediyor

  const sendToDB = useCallback(async () => {
    // send to db
    try {
      const response = await axios.post(
        "http://localhost:3000/pipeConcrete/create",
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
              type: "JCB",
              quantity: numberOfJCB,
              unitprice: jcbUnitPrice,
              price: priceJCB,
            },
          ],
          materials: [
            {
              type: "aggregate",
              quantity: valueOfAggregate,
              unitprice: aggregateUnitPrice,
              price: priceAggregate,
            },
            {
              type: "excavation",
              quantity: valueOfExcavation,
              unitprice: excavationUnitPrice,
              price: priceExcavation,
            },
            {
              type: "pipe",
              quantity: numberOfPipe,
              unitprice: pipeUnitPrice,
              price: pricePipe,
            },
            {
              type: "baseElement",
              quantity: numberOfBaseElement,
              unitprice: baseElementUnitPrice,
              price: priceBaseElement,
            },
            {
              type: "connectors",
              quantity: numberOfConnectors,
              unitprice: connectorsUnitPrice,
              price: priceConnectors,
            },
            {
              type: "pvc",
              quantity: numberOfPvcPipe,
              unitprice: pvcUnitPrice,
              price: pricePvcPipe,
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
      setIdPipeConcreteProject(data_id);

      console.log("Backend'den gelen yanıt:", response.data);
    } catch (error) {
      console.error("Hata:", error);
      if (isMounted.current) {
        console.error("Failed to send data to DB", error);
      }
    }
  }, [
    numberOfExcavator,
    excavatorUnitPrice,
    priceExcavator,
    numberOfTruck,
    truckUnitPrice,
    priceTruck,
    numberOfJCB,
    jcbUnitPrice,
    priceJCB,
    valueOfAggregate,
    aggregateUnitPrice,
    priceAggregate,
    valueOfExcavation,
    excavationUnitPrice,
    priceExcavation,
    numberOfPipe,
    pipeUnitPrice,
    pricePipe,
    numberOfBaseElement,
    baseElementUnitPrice,
    priceBaseElement,
    numberOfConnectors,
    connectorsUnitPrice,
    priceConnectors,
    numberOfPvcPipe,
    pvcUnitPrice,
    pricePvcPipe,
    numberOfWorkers,
    workerUnitPrice,
    priceWorkers,
    calProjectTime,
    totalProjectPrice
  ]);

  useEffect(() => {
    if (!matPrices && !vehPrices)
      return console.log("error gettign the data from the state");
    calcualteEssential(matPrices, vehPrices);

    if (!worPrices && !numberOfWorkers)
      return console.log("error getting worker price");
    setPriceWorkers(worPrices * numberOfWorkers);
  }, [matPrices, vehPrices, numberOfWorkers, worPrices, calcualteEssential]);

  const handleExport = (e) => {
    e.preventDefault();

    getExcel();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const totalMPrice =
      priceExcavator +
      priceTruck +
      priceJCB +
      priceBaseElement +
      priceConnectors +
      pricePvcPipe;
    const totalVPRice =
      priceAggregate +
      priceExcavation +
      priceWorkers +
      pricePipe;

    const totalAllPrice = totalMPrice + totalVPRice;
    setTotalProjectPrice(totalAllPrice.toFixed(0));

    console.log("deneme price: " + totalAllPrice.toLocaleString("tr-TR"));
    sendToDB();
  };

  // Add Pipe project to user project list
  useEffect(() => {
    if (idPipeConcreteProject) {
      const postProjectId = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 saniye bekle
        try {
          const response = await axios.patch(
            `http://localhost:3000/project/${holdUserId}/pipeConcrete`,
            {
              pipeconcrete_projects: idPipeConcreteProject,
            }
          );
          console.log(response.data);
        } catch (err) {
          console.log(err);
        }
      };
      postProjectId();
    }
  }, [idPipeConcreteProject, holdUserId]);


  const [distance, setDistance] = useState(0);

  //leaflet map
  const handleTotalDistanceChange = (newDistance) => {
    setDistance(newDistance);
  };

  useEffect(() => {
    setLength(distance);
  }, [distance]);



  return (
    <div className="pipe-calculator">
      <Col>
        <Row>
        <Col>
            <LeafletMap onTotalDistanceChange={handleTotalDistanceChange} />
          </Col>
          <Col xs={6}>
            <div className="excavation-col">
              <h2>Excavation and Pipe Calculator</h2>
              <form onSubmit={handleSubmit}>
                {/* Seçilen derinlik değerini gösterme */}
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
                    placeholder="Not needed"
                    type="number"
                    readOnly // Sadece okunabilir olarak ayarla
                    value={excavation_width} // Varsayılan genişlik hesaplaması, değiştirilemez
                  />
                </label>
                <br />
                <label>
                  Depth (m):
                  <input
                    className="m-2"
                    placeholder="Not needed"
                    type="number"
                    readOnly // Sadece okunabilir olarak ayarla
                    value={excavation_depth} // Varsayılan genişlik hesaplaması, değiştirilemez
                  />
                </label>
                <br />
                <label>
                  Home (Piece):
                  <input
                    className="m-2"
                    placeholder=""
                    type="number"
                    value={homePiece} // Varsayılan genişlik hesaplaması, değiştirilemez
                    onChange={(e) => setHomePiece(e.target.value)}
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
                {volume && <span> {volume} m³</span>}
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
                    <th>M3 && Piece</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Excavation (m³)</td>
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
                    <td>Aggreaga</td>
                    <td>{valueOfAggregate ? `${valueOfAggregate.toFixed(2)} m³` : "-"}</td>
                    <td>
                      {priceAggregate
                        ? `${priceAggregate.toLocaleString("tr-TR") + " TL"}`
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td> Concrete Pipe</td>
                    <td>
                      {numberOfPipe
                        ? `${numberOfPipe} piece`
                        : "-"}
                    </td>
                    <td>
                      {pricePipe
                        ? `${pricePipe.toLocaleString("tr-TR") + " TL"}`
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td>Base Element</td>
                    <td>
                      {numberOfBaseElement
                        ? `${numberOfBaseElement} piece`
                        : "-"}
                    </td>
                    <td>
                      {priceBaseElement
                        ? `${priceBaseElement.toLocaleString("tr-TR") + " TL"}`
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td>Connectors</td>
                    <td>
                      {numberOfConnectors
                        ? `${numberOfConnectors} piece`
                        : "-"}
                    </td>
                    <td>
                      {priceConnectors
                        ? `${priceConnectors.toLocaleString("tr-TR") + " TL"}`
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td>PVC</td>
                    <td>
                      {numberOfPvcPipe
                        ? `${numberOfPvcPipe} piece`
                        : "-"}
                    </td>
                    <td>
                      {pricePvcPipe
                        ? `${pricePvcPipe.toLocaleString("tr-TR") + " TL"}`
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
                    <td>Excavator</td>
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
                    <th>Number of </th>
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
        <Row>
          <Col>
            <div className=" excavation-col">
              <h2>Types of Pipes for Infrastructure</h2>

              <div className="asphalt-info">
                <h3>Concrete Pipes</h3>
                <div className="pipe-type">
                  <p>
                    Concrete pipes are commonly preferred for sewerage systems.
                    They are known for their durable and long-lasting
                    structures. Concrete pipes are resistant to high pressure
                    and weights, making them suitable for underground water
                    drainage and sewage systems. Their resistance to strong
                    fluids, chemicals, and roots makes them an ideal choice for
                    sewerage lines. The installation of concrete pipes creates a
                    robust infrastructure. Concrete pipes should be placed on a
                    suitable foundation to ensure stability. Proper alignment
                    and installation of the pipes are essential to prevent
                    blockages in the system. Additionally, adequate drainage and
                    slope should be provided during concrete pipe laying.
                  </p>
                  <div className="pipe-image">
                    <img src={büzz_pipe} alt="Asphalt" />
                  </div>
                </div>
              </div>
              <div className="asphalt-info">
                <h3>Corrugated Pipes</h3>
                <div className="pipe-type">
                  <p>
                    Corrugated pipes are another popular choice for sewerage
                    systems. They are characterized by their lightweight and
                    flexible structures. The flexibility of corrugated pipes
                    facilitates easy installation, especially in challenging
                    terrain conditions. Corrugated pipes are often used in areas
                    with high water levels and difficult terrain conditions.
                    Their flexibility provides resistance to soil movements and
                    reduces the risk of blockages in the system. Compared to
                    concrete pipes, corrugated pipes may offer a more economical
                    option and are known for their easy installation.
                  </p>
                  <div className="pipe-image">
                    <img src={koruge_pipe} alt="Asphalt" />
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Col>
    </div>
  );
};

export default PipeConcrete;
