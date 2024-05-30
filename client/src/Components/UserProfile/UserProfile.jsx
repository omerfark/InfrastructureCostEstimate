import { useCallback, useEffect, useRef, useState } from "react";
import "./UserProfile.css";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import axios from "axios";
import {useNavigate } from "react-router-dom";
import LeafletMap from "../LeafletMap/LeafletMap";

const UserProfile = () => {
  const [userToken, setUserToken] = useState("");

  const [distance, setDistance] = useState(0); //leaflet değeri
  const [length, setLength] = useState(null); // Kazı boyu
  const [volume, setVolume] = useState(null); // Hacim

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  // Fetch user token and verify authentication
  useEffect(() => {
    axios.get("http://localhost:3000/auth/verify").then((res) => {
      if (res.data.status) {
        setUserToken(res.data.token);
      } else {
        navigate("/login");
      }
    });
  }, []);

  //vehicles
  const [numberOfExcavator, setNumberOfExcavator] = useState(null);
  const [numberOfTruck, setNumberOfTruck] = useState(null);
  const [numberOfRoller, setNumberOfRoller] = useState(null);
  const [numberOfJCB, setNumberOfJCB] = useState(null);
  const [numberOfGreyder, setNumberOfGreyder] = useState(null);
  const [numberOfFinisher, setNumberOfFinisher] = useState(null);

  // Materials of asphalt
  const [totalExcavationVolume, setTotalExcavationVolume] = useState(null);
  const [totalAggregateVolume, setTotalAggregateVolume] = useState(null);
  const [valueOfPmt, setValuOfPmt] = useState(null);
  const [valueOfAsphalt_1, setValuOfAsphlt_1] = useState(null);
  const [valueOfAsphalt_2, setValuOfAsphlt_2] = useState(null);
  const [valueOfAsphaltExcavation, setValueOfAsphaltExcavation] =
    useState(null); // asfalt kazısı

  // Materials of electric
  const [valueOfSand, setValueOfSand] = useState(null);
  const [electricValueOfAggregate, setElectricValueOfAggregate] =
    useState(null);
  const [valueOfConcreteSlab, setValueOfConcreteSlab] = useState(null);
  const [valueOfElectricExcavation, setValueOfElectricExcavation] =
    useState(null);

  //materials of concrete pipe
  const [pipeValueOfAggregate, setPipeValueOfAggregate] = useState(null);
  const [valueOfPipeExcavation, setValuOfPipeExcavation] = useState(null);
  const [numberOfPipe, setNumberOfPipe] = useState(null); // kazı uzunluğuna göre kullanılacak boru adedi
  const [numberOfBaseElement, setNumberofBaseElement] = useState(null); // taban, bilezik ve kanalizasyon kapak kısmı
  const [numberOfConnectors, setNumberOfConnector] = useState(null); // parsel ve c bağlantısı adedi, kazı uzunluğundan cıkarılacak 1 mt c elemanı, pvc adedi
  const [numberOfPvcPipe, setNumberOfPvcPipe] = useState(null); // parsel ile aynı 2 mt bağlantı boruları

  // Workers
  const [numberOfWorkers, setNumberOfWorkers] = useState(null);

  //Equipment
  const [numberOfCompactor, setNumberOfCompactor] = useState(null);
  const [valueofCable, setValueOfCable] = useState(null);

  //unit Prices
  //vehicle
  const [excavatorUnitPrice, setExcavatorUnitPrice] = useState(null);
  const [truckUnitPrice, setTruckUnitPrice] = useState(null);
  const [rollerunitPrice, setRollerunitPrice] = useState(null);
  const [greyderUnitPrice, setGreyderUnitPrice] = useState(null);
  const [finisherUnitPrice, setFinisherUnitPrice] = useState(null);
  const [jcbUnitPrice, setJcbUnitPrice] = useState(null);
  const [workerUnitPrice, setWorkerUnitPrice] = useState(null);
  //material
  const [pmtUnitPrice, setPmtUnitPrice] = useState(null);
  const [asphalt_1UnitPrice, setAsphalt_1UnitPrice] = useState(null);
  const [asphalt_2UnitPrice, setAsphalt_2UnitPrice] = useState(null);
  const [excavationUnitPrice, setExcavationUnitPrice] = useState(null);
  const [sandUnitPrice, setSandUnitPrice] = useState(null);
  const [aggregateUnitPrice, setAggregateUnitPrice] = useState(null);
  const [concreteSlabUnitPrice, setConcreteSlabUnitPrice] = useState(null);
  const [pipeUnitPrice, setPipeUnitPrice] = useState(null);
  const [baseElementUnitPrice, setBaseElementUnitPrice] = useState(null);
  const [connectorsUnitPrice, setConnectorsUnitPrice] = useState(null);
  const [pvcUnitPrice, setPvcUnitPrice] = useState(null);
  //equipment
  const [compactorUnitPrice, setCompactorUnitPrice] = useState(null);
  const [cableUnitPrice, setCableUnitPrice] = useState(null);

  //priceAll
  const [priceExcavator, setPriceExcavator] = useState(null);
  const [priceTruck, setPriceTruck] = useState(null);
  const [priceRoller, setPriceRoller] = useState(null);
  const [priceGreyder, setPriceGreyder] = useState(null);
  const [priceFinisher, setPriceFinisher] = useState(null);
  const [pricePmt, setPricePmt] = useState(null);
  const [priceAsphalt_1, setPriceAsphalt_1] = useState(null);
  const [priceAsphalt_2, setPriceAsphalt_2] = useState(null);
  const [pricePipe, setPricePipe] = useState(null);
  const [priceBaseElement, setPriceBaseElement] = useState(null);
  const [priceConnectors, setPriceConnectors] = useState(null);
  const [pricePvcPipe, setPricePvcPrice] = useState(null);
  const [priceCompactor, setPriceCompactor] = useState(null);
  const [priceCable, setPriceCable] = useState(null);
  const [priceJCB, setPriceJCB] = useState(null);
  const [priceSand, setPriceSand] = useState(null);
  const [priceAggregate, SetPriceAggregate] = useState(null);
  const [priceConcreteSlab, setPriceConcreteSlab] = useState(null);
  const [priceWorkers, setPriceWorkers] = useState(null);
  const [priceExcavation, setPriceExcavation] = useState(null);
  const [calProjectTime, setCalProjectTime] = useState(null);
  const [totalProjectPrice, setTotalProjectPrice] = useState(null);

  //AllProject project id
  const [idAllProject, setIdAllProject] = useState("");
  const [matPrices, setMatPrices] = useState([]);
  const [vehPrices, setVehPrices] = useState([]);
  const [worPrices, setWorPrices] = useState(0);
  const [eqPrices, setEqPrices] = useState([]);

  const calculateEssential = useCallback((matPrices, vehPrices, eqPrices) => {
    console.log("first caluclation");
    console.log("matPrices", matPrices);
    console.log("vehPrices", vehPrices);
    console.log("eqPrices", eqPrices);
    
    const asphaltExcavationVolume = 0.2 * 2 * length; // derinlik * genişlik * uzunluk
    const electricProjectVolum = 0.8 * 0.4 * length; // derinlik * genişlik * uzunluk
    const pipeConcreteProjectVolume = 3 * 0.7 * length; // derinlik * genişlik * uzunluk


    const asphaltRoadProejctTime = Math.ceil(length / 2000);
    const electricProejctTime = Math.ceil(electricProjectVolum / 2000);
    const pipeConcreteProjectTime = Math.ceil(pipeConcreteProjectVolume / 1500);
    const totalProjectTime =
      asphaltRoadProejctTime + electricProejctTime + pipeConcreteProjectTime;

    const totalExcavationVolume =
      asphaltExcavationVolume +
      electricProjectVolum +
      pipeConcreteProjectVolume;

    const totalExcavator =
      asphaltRoadProejctTime * 1 +
      electricProejctTime * 1 +
      pipeConcreteProjectTime * 1;
    const totalTruck =
      asphaltRoadProejctTime * 1 +
      electricProejctTime * 1 +
      pipeConcreteProjectTime * 1;
    const totalJcb = electricProejctTime * 1 + pipeConcreteProjectTime * 1;
    const totalRoller = asphaltRoadProejctTime;
    const totalGreyder = asphaltRoadProejctTime;
    const totalFinisher = asphaltRoadProejctTime;
    const totalWorker =
      asphaltRoadProejctTime * 4 +
      electricProejctTime * 4 +
      pipeConcreteProjectTime * 6;

    const compactorValue = electricProejctTime;
    const cableValue = length;

    const pmtValue = 0.1 * 2 * length; //10 cm pmt, genişlik sabit
    const asphalt_1Value = 2.4 * (0.15 * length * 2); // alt tabaka 15 cm
    const asphalt_2Value = 2.4 * (0.05 * length * 2); // üst tabaka 5 cm

    const sandValue = 0.2 * 0.4 * length;
    const electricAggregateValue = 0.3 * 0.4 * length;
    const concreteSlabValue = Math.ceil(length * 0.2); // 20 cm uzunluğu
    const concreteSlabWidth = Math.ceil(0.4 * 0.1); // 10 cm genişliği olduğu icin
    const concreteSlab = concreteSlabValue * concreteSlabWidth;

    const meterConnectors = 1; // 1 adet ev
    const meterBaseElements = 1 * (length / 60); // 1mt genişlik uzunluk, 60 mtde 1 adet
    const calPiecePipe = (length - (meterBaseElements + meterConnectors)) / 1.5;
    const piecePipe = Math.ceil(calPiecePipe);

    const pipeAggregateValue = pipeConcreteProjectVolume - 0.11 * piecePipe;
    const calBaseElement = Math.ceil(length / 60);
    const calConnectors = 1;

    vehPrices.forEach((item) => {
      switch (item.type) {
        case "excavator":
          setPriceExcavator(
            item.price * totalExcavator * (totalProjectTime / 3)
          );
          break;
        case "truck":
          setPriceTruck(item.price * totalTruck * (totalProjectTime / 3));
          break;
        case "roller":
          setPriceRoller(item.price * totalRoller * asphaltRoadProejctTime);
          break;
        case "greyder":
          setPriceGreyder(item.price * totalGreyder * asphaltRoadProejctTime);
          break;
        case "finisher":
          setPriceFinisher(item.price * totalFinisher * asphaltRoadProejctTime);
          break;
        case "JCB":
          setPriceJCB(item.price * totalJcb * (totalProjectTime / 3));
          break;
        default:
          break;
      }
    });

    matPrices.forEach((item) => {
      switch (item.type) {
        case "pmt":
          setPricePmt(item.price * pmtValue);
          break;
        case "asphalt_1":
          setPriceAsphalt_1(item.price * asphalt_1Value);
          break;
        case "asphalt_2":
          setPriceAsphalt_2(item.price * asphalt_2Value); // yes like that  calculatedVolume
          break;
        case "sand":
          setPriceSand(item.price * sandValue);
          break;
        case "aggregate":
          SetPriceAggregate(
            item.price * (pipeAggregateValue + electricAggregateValue)
          );
          break;
        case "concretepipe":
          setPricePipe(item.price * piecePipe);
          break;
        case "concrete slab":
          setPriceConcreteSlab(item.price * concreteSlab); // yes like that  calculatedVolume
          break;
        case "baseElement":
          setPriceBaseElement(item.price * calBaseElement);
          break;
        case "excavation":
          setPriceExcavation(item.price * totalExcavationVolume);
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

    eqPrices.forEach((item) => {
      switch (item.type) {
        case "cable":
          setPriceCable(item.price * length * 0.1);
          break;
        case "compactor":
          setPriceCompactor(item.price * compactorValue * electricProejctTime);
          break;
        default:
          break;
      }
    });

    setTotalAggregateVolume(electricAggregateValue + pipeAggregateValue);
    setTotalExcavationVolume(totalExcavationVolume);
    setPipeValueOfAggregate(pipeAggregateValue);
    setNumberofBaseElement(calBaseElement); // bağlantı noktaları, taban , bilezik ve kapak
    setNumberOfConnector(calConnectors); // parsel bağlantısı icin, c elemanı, parsel taba, parsel kapak olarak 1mt
    setNumberOfPvcPipe(calConnectors);
    setNumberOfPipe(piecePipe);
    setValueOfSand(sandValue);
    setElectricValueOfAggregate(electricAggregateValue);
    setValueOfConcreteSlab(concreteSlab);
    setValuOfPmt(pmtValue);
    setValuOfAsphlt_1(asphalt_1Value);
    setValuOfAsphlt_2(asphalt_2Value);
    setNumberOfCompactor(compactorValue);
    setValueOfCable(cableValue);
    setNumberOfExcavator(totalExcavator);
    setNumberOfTruck(totalTruck);
    setNumberOfJCB(totalJcb);
    setNumberOfRoller(totalRoller);
    setNumberOfGreyder(totalGreyder);
    setNumberOfFinisher(totalFinisher);
    setNumberOfWorkers(totalWorker);
    setValueOfAsphaltExcavation(asphaltExcavationVolume);
    setValueOfElectricExcavation(electricProjectVolum);
    setValuOfPipeExcavation(pipeConcreteProjectVolume);

    setCalProjectTime(totalProjectTime);

    return { numberOfWorkers: numberOfWorkers };
  }, [length]);

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
          } else if (material.material_name === "pmt") {
            setPmtUnitPrice(material.material_price);
            const pmtPrice = material.material_price;
            newPrices.push({ type: "pmt", price: pmtPrice });
          } else if (material.material_name === "asphalt_1") {
            setAsphalt_1UnitPrice(material.material_price);
            const asphalt_1Price = material.material_price;
            newPrices.push({ type: "asphalt_1", price: asphalt_1Price });
          } else if (material.material_name === "asphalt_2") {
            setAsphalt_2UnitPrice(material.material_price);
            const asphalt_2Price = material.material_price;
            newPrices.push({ type: "asphalt_2", price: asphalt_2Price });
          } else if (material.material_name === "excavation") {
            setExcavationUnitPrice(material.material_price);
            const excavationPrice = material.material_price;
            newPrices.push({ type: "excavation", price: excavationPrice });
          } else if (material.material_name === "sand") {
            setSandUnitPrice(material.material_price);
            const sandPrice = material.material_price;
            newPrices.push({ type: "sand", price: sandPrice });
          } else if (material.material_name === "concrete slab") {
            setConcreteSlabUnitPrice(material.material_price);
            const concreteSlabPrice = material.material_price;
            newPrices.push({ type: "concrete slab", price: concreteSlabPrice });
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

  //vehicle Price
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
          } else if (vehicle.vehicle_type === "JCB") {
            setJcbUnitPrice(vehicle.vehicle_price);
            const jCBPrice = vehicle.vehicle_price;
            newVehPrices.push({ type: "JCB", price: jCBPrice });
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

  //equipment Price
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

  //#region  leaflet map
  const handleTotalDistanceChange = (newDistance) => {
    setDistance(newDistance);
  };
  useEffect(() => {
    setLength(distance);
  }, [distance]);
  //#endregion

  const handleExport = (e) => {
    e.preventDefault();
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    const totalVPrice =
      priceJCB +
      priceTruck +
      priceExcavator +
      priceGreyder +
      priceRoller +
      priceFinisher;
    const totalMPrice =
      pricePmt +
      priceAsphalt_2 +
      priceAsphalt_1 +
      priceExcavation +
      priceSand +
      priceAggregate +
      priceConcreteSlab +
      pricePipe +
      priceBaseElement +
      priceConnectors +
      pricePvcPipe +
      priceWorkers;
    const totalEPrice = priceCompactor + priceCable;
    setTotalProjectPrice(totalVPrice + totalMPrice + totalEPrice);
  };

  return (
    <div className="asphalt">
      <Col>
        <Row>
          <Col className="mt-3">
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
                    <th>M3 && Piece</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Excavation </td>
                    <td>
                      {totalExcavationVolume
                        ? `${totalExcavationVolume.toFixed(2)} m³`
                        : "-"}
                    </td>
                    <td>
                      {priceExcavation
                        ? `${priceExcavation.toLocaleString("tr-TR") + " TL"} `
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td>Pmt</td>
                    <td>{valueOfPmt ? `${valueOfPmt.toFixed(2)} m³` : "-"}</td>
                    <td>
                      {pricePmt
                        ? `${pricePmt.toLocaleString("tr-TR") + " TL"}`
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td>Bitum Asphalt</td>
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
                    <td>Wear Asphalt</td>
                    <td>
                      {valueOfAsphalt_2
                        ? `${valueOfAsphalt_2.toFixed(2)} m³`
                        : "-"}
                    </td>
                    <td>
                      {priceAsphalt_2
                        ? `${priceAsphalt_2.toLocaleString("tr-TR") + " TL"}`
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
                      {totalAggregateVolume
                        ? `${totalAggregateVolume.toFixed(0)} m³`
                        : "-"}
                    </td>
                    <td>
                      {priceAggregate
                        ? `${priceAggregate.toLocaleString("tr-TR") + " TL"}`
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td>Concrete Pipe</td>
                    <td>{numberOfPipe ? `${numberOfPipe} piece` : "-"}</td>
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
                      {numberOfConnectors ? `${numberOfConnectors} piece` : "-"}
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
                      {numberOfPvcPipe ? `${numberOfPvcPipe} piece` : "-"}
                    </td>
                    <td>
                      {pricePvcPipe
                        ? `${pricePvcPipe.toLocaleString("tr-TR") + " TL"}`
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
                    <td>Excavator (m³)</td>
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
                        ? `${(priceTruck.toFixed(2)).toLocaleString("tr-TR") + " TL"}`
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td>Roller</td>
                    <td>{numberOfRoller ? `${numberOfRoller} piece` : "-"}</td>
                    <td>
                      {priceRoller
                        ? `${priceRoller.toLocaleString("tr-TR") + " TL"}`
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td>Greyder</td>
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
                    <td>Finisher</td>
                    <td>
                      {numberOfFinisher ? `${numberOfFinisher} piece` : "-"}
                    </td>
                    <td>
                      {priceFinisher
                        ? `${priceFinisher.toLocaleString("tr-TR") + " TL"}`
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
                      {valueofCable ? `${valueofCable} meter` : "-"}
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
                    <th>Number of</th>
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
      </Col>
    </div>
  );
};

export default UserProfile;
