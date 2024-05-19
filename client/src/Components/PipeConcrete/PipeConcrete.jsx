import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PipeConcrete.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import büzz_pipe from "../../assets/büzz-pipe.png";
import koruge_pipe from "../../assets/koruge-pipe.png";

const PipeConcrete = () => {
  const [holdUserId, setHoldUserId] = useState("");

  //Doğrulama anahtarı
  // const navigate = useNavigate();
  // axios.defaults.withCredentials = true; //cookie özelliği eklemek için

  // useEffect(() => {
  //   axios.get("http://localhost:3000/auth/verify").then((res) => {
  //     if (res.data.status) {
  //       console.log(res.data);
  //       const tokenValue = res.data.token;
  //       const sbtUser = tokenValue.userId;
  //       setHoldUserId(sbtUser);
  //     } else {
  //       navigate("/login");
  //     }
  //   });
  // }, []);

  const [excavation_length, setLength] = useState(""); // Kazı boyu
  const [excavation_width, setWidth] = useState(""); // Genişlik
  const [excavation_depth, setDepth] = useState(""); // Derinlik
  const [excavation_volume, setVolume] = useState(""); // Hacim
  const [homePiece, setHomePiece] = useState(""); // kaç adet ev olduğu

  const [selectedDiameter, setSelectedDiameter] = useState("");
  const [pipeSelected, setPipeSelected] = useState(""); // boru türünü tut

  //Equipment
  //vehicle
  const [numberOfExcavator, setNumberOfExcavator] = useState("");
  const [numberOfTruck, setNumberOfTruck] = useState("");
  const [numberOfJCB, setNumberOfJCB] = useState("");
  //materials
  const [valueOfSand, setValueOfSand] = useState(0); // kum koruge
  const [valueOfSoil, setValueOfSoil] = useState(0); // toprak koruge
  const [valueOfAggregate, setValueOfAggregate] = useState(0);
  const [valueOfExcavation, setValuOfExcavation] = useState(0);
  const [numberOfPipe, setNumberOfPipe] = useState(0); // kazı uzunluğuna göre kullanılacak boru adedi
  const [numberOfBaseElement, setNumberofBaseElement] = useState(0); // taban, bilezik ve kanalizasyon kapak kısmı
  const [numberOfConnectors, setNumberOfConnector] = useState(0); // parsel ve c bağlantısı adedi, kazı uzunluğundan cıkarılacak 1 mt c elemanı, pvc adedi
  const [numberOfPvcPipe, setNumberOfPvcPipe] = useState(0); // parsel ile aynı 2 mt bağlantı boruları

  //workers
  const [numberOfWorkers, setNumberOfWorkers] = useState("");

  //priceAll
  const [priceExcavator, setPriceExcavator] = useState("");
  const [priceTruck, setPriceTruck] = useState("");
  const [priceJCB, setPriceJCB] = useState("");
  const [priceAggregate, setPriceAggregate] = useState("");
  const [priceExcavation, setPriceExcavation] = useState("");
  const [priceSand, setPriceSand] = useState("");
  const [priceSoil, setPriceSoil] = useState("");
  const [pricePipe, setPricePipe] = useState("");
  const [priceBaseElement, setPriceBaseElement] = useState("");
  const [priceConnectors, setPriceConnectors] = useState("");
  const [pricePvcPipe, setPricePvcPrice] = useState("");
  const [priceWorkers, setPriceWorkers] = useState("");
  const [calProjectTime, setCalProjectTime] = useState("");
  const [totalProjectPrice, setTotalProjectPrice] = useState(0);

  //PipeConcrete project id
  const [idPipeConcreteProject, setIdPipeConcreteProject] = useState("");

  // Seçenekler listesi
  const pipeOptions = [
    {
      name: "concretepipe",
      diameter: "0.3",
      volume: "0.11",
      length: "1.5",
      nickname: "sewer type 1 - (Concrete)",
    },
    {
      name: "corrugated",
      diameter: "0.2",
      volume: "0.19",
      length: "6",
      nickname: "sewer type 2 - (Corrugated)",
    },
  ];

  // Seçeneklerin dropdown menüsüne dönüştürülmesi
  const options = pipeOptions.map((option, index) => (
    <option key={index} value={option.diameter}>
      {option.nickname}
    </option>
  ));

  const calcualteEssential = () => {
    // Seçilen borunun özelliklerini al
    const selectedPipe = pipeOptions.find(
      (option) => option.diameter === selectedDiameter
    );
    setPipeSelected(selectedPipe);

    const depthValue = 10 * pipeSelected.diameter; // dernilik boru çapı nın 8 katı olmalı, km artarsa 2  katına cıkar
    const widthValue = 4 * pipeSelected.diameter;
    setDepth(depthValue);
    setWidth(widthValue);
    const calculatedVolume = (
      excavation_length *
      excavation_width *
      excavation_depth
    ).toFixed(2);
    setVolume(calculatedVolume);

    const meterConnectors = homePiece * 1; // 1 mt c eleman
    const meterBaseElements = (1 * (excavation_length / 60)).toFixed(2); // 1mt genişlik
    const calPiecePipe =
      (excavation_length - (meterBaseElements + meterConnectors)) /
      pipeSelected.length;
    const piecePipe = Math.ceil(calPiecePipe);
    setNumberOfPipe(piecePipe); // kaç adet boru hesabı

    const calAggregateVolume =
      calculatedVolume - pipeSelected.volume * piecePipe; //beton boru aggrega hesabı
    const calSandVolume = 0.2 * excavation_width * excavation_length; // koruge boru alt taban
    const calSoilVolume =
      calculatedVolume - pipeSelected.volume * piecePipe - calSandVolume; // koruge boru üüst kısım

    setValuOfExcavation(calculatedVolume);
    setValueOfAggregate(calAggregateVolume);
    setValueOfSand(calSandVolume);
    setValueOfSoil(calSoilVolume);

    const calBaseElement = Math.ceil(excavation_length / 60);
    const calConnectors = Math.ceil(homePiece);

    setNumberofBaseElement(calBaseElement); // bağlantı noktaları, taban , bilezik ve kapak
    setNumberOfConnector(calConnectors); // parsel bağlantısı icin, c elemanı, parsel taba, parsel kapak olarak
    setNumberOfPvcPipe(calConnectors); // ev adedi sayısıyla parsel borusu sayısı aynı olacak 2mt lik alınacak

    const calNumberOfVehicles = Math.ceil(calculatedVolume / 6000); // üst tama yuvarlama
    const numberOfTwo = 2 * calNumberOfVehicles;
    const calNumberOfWorkers = 6 * calNumberOfVehicles;

    setNumberOfExcavator(numberOfTwo);
    setNumberOfJCB(numberOfTwo);
    setNumberOfTruck(numberOfTwo);
    setNumberOfWorkers(calNumberOfWorkers);
  };



  useEffect(() => {
    if (valueOfSand && valueOfAggregate && valueOfSoil && valueOfExcavation) {
      const fetchMaterialPrice = async () => {
        try {
          const response = await fetch(`http://localhost:3000/materials/all`);
          if (!response.ok) {
            throw new Error("Unexpected error");
          }
          const selectPipeName = pipeSelected.name; // seçilen borunun ismini al
          const allMaterial = await response.json();
          allMaterial.forEach((material) => {
            if (material.material_name === "sand") {
              const sandPRice = valueOfSand * material.material_price;
              setPriceSand(sandPRice);
            } else if (material.material_name === "aggregate") {
              const aggregatePrice = valueOfAggregate * material.material_price;
              setPriceAggregate(aggregatePrice);
            } else if (material.material_name === "excavation") {
              const excavationPrice =
                valueOfExcavation * material.material_price;
              setPriceExcavation(excavationPrice);
            } else if (material.material_name === "soil") {
              const soilPrice = valueOfSoil * material.material_price;
              setPriceSoil(soilPrice);
            } else if (material.material_name === selectPipeName) {
              const pipePrice = numberOfPipe * material.material_price;
              setPricePipe(pipePrice);
            } else if (material.material_name === "baseElement") {
              const baseElementPrice =
                numberOfBaseElement * material.material_price;
              setPriceBaseElement(baseElementPrice);
            } else if (material.material_name === "connector") {
              const connectorsPrice =
                numberOfConnectors * material.material_price;
              setPriceConnectors(connectorsPrice);
            } else if (material.material_name === "pvc") {
              const pvcPrice = numberOfPvcPipe * material.material_price;
              setPricePvcPrice(pvcPrice);
            }
          });
        } catch (err) {
          console.error(err);
        }
      };
      fetchMaterialPrice();
    }
  }, [
    valueOfSand,
    valueOfAggregate,
    valueOfSoil,
    valueOfExcavation,
    numberOfPipe,
    numberOfBaseElement,
    numberOfConnectors,
    numberOfPvcPipe,
    pipeSelected,
  ]);


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

          const workerPrice =
            numberOfWorkers * workerGet[0].worker_price * calProjectTime;
          setPriceWorkers(workerPrice);
        } catch (err) {
          console.error(err);
        }
      };
      fetchVehiclePrice();
    }
  }, [
    numberOfTruck,
    numberOfExcavator,
    numberOfJCB,
    numberOfWorkers,
    calProjectTime,
  ]);


  //Tüm fiyatlar hesaplanınca db ye kaydediyor
  useEffect(() => {
    if (totalProjectPrice) {
      const sendToDB = async () => {
        // send to db
        try {
          const response = await axios.post(
            "http://localhost:3000/pipeConcrete/create",
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
            { type: "roller", quantity: numberOfJCB, price: priceJCB },
          ],
          materials: [
            { type: "sand", quantity: valueOfSand, price: priceSand },
            {
              type: "soil",
              quantity: valueOfSoil,
              price: priceSoil,
            },
            {
              type: "aggregate",
              quantity: valueOfAggregate,
              price: priceAggregate,
            },
            {
              type: "excavation",
              quantity: valueOfExcavation,
              price: priceExcavation,
            },
            { type: "pipe", quantity: numberOfPipe, price: pricePipe },
            {
              type: "baseElement",
              quantity: numberOfBaseElement,
              price: priceBaseElement,
            },
            {
              type: "connectors",
              quantity: numberOfConnectors,
              price: priceConnectors,
            },
            { type: "pvc", quantity: numberOfPvcPipe, price: pricePvcPipe },
          ],
          worker: [
            { type: "worker", quantity: numberOfWorkers, price: priceWorkers },
          ],
          project_time: calProjectTime,
            }
          );
  
          const data_id = response.data._id;
          setIdPipeConcreteProject(data_id);
  
          console.log("Backend'den gelen yanıt:", response.data);
        } catch (error) {
          console.error("Hata:", error);
        }
      };
      sendToDB();
    }
  }, [totalProjectPrice]);
  

  // useEffect(()=>{
  //   const sendToDB = async() =>{
      
  //   // send to db
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:3000/pipeConcrete/create",
  //       {
  //         equipments: [
  //           { type: "equipment Type", quantity: 10, price: 100 }, // Örnek değerler
  //         ],
  //         vehicles: [
  //           {
  //             type: "excavator",
  //             quantity: numberOfExcavator,
  //             price: priceExcavator,
  //           },
  //           { type: "truck", quantity: numberOfTruck, price: priceTruck },
  //           { type: "roller", quantity: numberOfJCB, price: priceJCB },
  //         ],
  //         materials: [
  //           { type: "sand", quantity: valueOfSand, price: priceSand },
  //           {
  //             type: "soil",
  //             quantity: valueOfSoil,
  //             price: priceSoil,
  //           },
  //           {
  //             type: "aggregate",
  //             quantity: valueOfAggregate,
  //             price: priceAggregate,
  //           },
  //           {
  //             type: "excavation",
  //             quantity: valueOfExcavation,
  //             price: priceExcavation,
  //           },
  //           { type: "pipe", quantity: numberOfPipe, price: pricePipe },
  //           {
  //             type: "baseElement",
  //             quantity: numberOfBaseElement,
  //             price: priceBaseElement,
  //           },
  //           {
  //             type: "connectors",
  //             quantity: numberOfConnectors,
  //             price: priceConnectors,
  //           },
  //           { type: "pvc", quantity: numberOfPvcPipe, price: pricePvcPipe },
  //         ],
  //         worker: [
  //           { type: "worker", quantity: numberOfWorkers, price: priceWorkers },
  //         ],
  //         project_time: calProjectTime,
  //       }
  //     );

  //     const data_id = response.data._id;
  //     setIdPipeConcreteProject(data_id);

  //     console.log("Backend'den gelen yanıt:", response.data);
  //   } catch (error) {
  //     console.error("Hata:", error);
  //   }

  //   };
  //   sendToDB();
  // },[totalProjectPrice])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const calTimeofProject = Math.ceil(excavation_length / 2500);
    setCalProjectTime(calTimeofProject);

    await calcualteEssential();

    const totalMPrice =
      priceExcavator +
      priceTruck +
      priceJCB +
      priceBaseElement +
      priceConnectors +
      pricePvcPipe;
    const totalVPRice =
      priceAggregate +
      priceSand +
      priceExcavation +
      priceWorkers +
      priceSoil +
      pricePipe;
    const totalAllPrice = (totalMPrice + totalVPRice).toLocaleString("tr-TR");
    setTotalProjectPrice(totalAllPrice);

    console.log("deneme price: " + totalProjectPrice.toLocaleString("tr-TR"));
  };

  return (
    <div className="pipe-calculator">
      <Col>
        <Row>
          <Col xs={6}>
            <div className="excavation-col">
              <h2>Excavation and Pipe Calculator</h2>
              <form onSubmit={handleSubmit}>
                <label>
                  Diameter (m):
                  <select
                    className="m-2"
                    value={selectedDiameter}
                    onChange={(e) => setSelectedDiameter(e.target.value)}
                  >
                    <option value="">Select Pipe</option>
                    {options}
                  </select>
                </label>
                {/* Seçilen derinlik değerini gösterme */}
                {selectedDiameter && (
                  <div>Selected Diameter: {selectedDiameter} m</div>
                )}
                <br />
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
                {excavation_volume && <span> {excavation_volume} m³</span>}
              </div>
            </div>
          </Col>
          <Col xs={6}>
            <div className="excavation-col">
              <h2> Pipe Infrastructure Calculator </h2>
              <ul>
                <li>Total Volume = Length X Width X Depth</li>
                <li>
                  Excavation Volume (m³) ={" "}
                  {excavation_volume && <span> {excavation_volume} m³</span>}
                </li>
                <li>
                  Pipe Volume (m³) = 3.14 X Pipe Diameter (m) X Pipe Length (m){" "}
                </li>
                <li>Total Pipe Volume = Pipe Volume (m³) X Pipe Piece </li>
                <li>
                  Total Sand value ={" "}
                  {valueOfSand && <span>{valueOfSand} </span>}{" "}
                </li>
                <li>
                  Total Aggregate (m³) ={" "}
                  {valueOfAggregate && (
                    <span> {valueOfAggregate.toLocaleString("tr-TR")} m³</span>
                  )}
                </li>
                <li>
                  {" "}
                  Total Price ={" "}
                  {totalProjectPrice && (
                    <span>
                      {totalProjectPrice.toLocaleString("tr-TR") + " TL"}{" "}
                    </span>
                  )}
                </li>
              </ul>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="excavation-col">
              <ul>
                <li>
                  {" "}
                  Price of Excavation:
                  {priceExcavation && (
                    <span>
                      {" "}
                      {priceExcavation.toLocaleString("tr-TR") + " TL"}
                    </span>
                  )}
                </li>
                <li>
                  Price of Aggregate:{" "}
                  {priceAggregate && (
                    <span>
                      {" "}
                      {priceAggregate.toLocaleString("tr-TR") + " TL"}
                    </span>
                  )}
                </li>
                <li>Total Price = Price of Excavation + Price of Aggregate</li>
                <li>
                  Total Price ={" "}
                  {totalProjectPrice.toLocaleString("tr-TR") + " TL"}
                </li>
              </ul>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="excavation-col">
              <ul>
                {/* {vehicles.map(
                  (vehicle, index) => (
                    <li key={index}>Vehicle type :{vehicle.vehicle_type} -- Vehicle price: {vehicle.vehicle_price} </li>
                  )
                )} */}
                <li>
                  Excavator Total Price:{" "}
                  {priceExcavator && (
                    <span>
                      {priceExcavator.toLocaleString("tr-TR") + " TL"}{" "}
                    </span>
                  )}{" "}
                </li>
                <li>
                  Truck Total Price:
                  {priceTruck && (
                    <span>{priceTruck.toLocaleString("tr-TR") + " TL"} </span>
                  )}{" "}
                </li>
                <li>
                  JCB total Price:
                  {priceJCB && (
                    <span>{priceJCB.toLocaleString("tr-TR") + " TL"} </span>
                  )}{" "}
                </li>
                <li>
                  Connector Price:{" "}
                  {priceConnectors && (
                    <span>
                      {priceConnectors.toLocaleString("tr-TR") + " TL"}{" "}
                    </span>
                  )}{" "}
                </li>
                <li>
                  Worker Price:{" "}
                  {priceWorkers && (
                    <span>{priceWorkers.toLocaleString("tr-TR") + " TL"} </span>
                  )}{" "}
                </li>
                <li>
                  {" "}
                  Project Time :{" "}
                  {calProjectTime && <span>{calProjectTime} months</span>}{" "}
                </li>
              </ul>
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
              {/* <div className="asphalt-info ">
                <h3>Polyethylene Pipes</h3>
                <div className="pipe-type">
                  <p>
                    Polyethylene pipes, commonly used for transporting clean
                    water, are lightweight, flexible, and durable. They are made
                    from various types of polyethylene, including high-density
                    polyethylene (HDPE) and low-density polyethylene (LDPE).
                    HDPE pipes are resistant to high pressure and chemicals,
                    making them ideal for clean water systems and wastewater
                    management. LDPE pipes, known for their flexibility, are
                    preferred for low-pressure irrigation systems. Polyethylene
                    pipes are easy to install and require minimal maintenance.
                    Their flexible nature allows for easy installation even in
                    challenging terrain. Additionally, their lightweight reduces
                    transportation and installation costs.
                  </p>
                  <div className="pipe-image">
                    <img src={polietilen_pipe} alt="Asphalt" />
                  </div>
                </div>
              </div> */}
            </div>
          </Col>
        </Row>
      </Col>
    </div>
  );
};

export default PipeConcrete;
