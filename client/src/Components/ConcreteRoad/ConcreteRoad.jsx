import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ConcreteRoad.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import LeafletMap from "../LeafletMap/LeafletMap";
import asphalt_1 from "../../assets/asphalt-1.png";

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
  }, [navigate]);

  const emptyValue = null;
  const [length, setLength] = useState(null); // Kazı boyu
  const width = 4.5; // Genişlik
  const depth = 0.2; // Derinlik // ı run the code ?? yes is there any errors?  no error
  const [excavation_volume, setVolume] = useState(null); // Hacim okey ı am looking

  //Vehicles
  const [numberOfExcavator, setNumberOfExcavator] = useState(null);
  const [numberOfTruck, setNumberOfTruck] = useState(null);
  const [numberOfRoller, setNumberOfRoller] = useState(null);
  const [numberOfGreyder, setNumberOfGreyder] = useState(null);
  //materials
  const [valueOfPmt, setValueOfPmt] = useState(null);
  const [valueOfCesan, setValueOfCesan] = useState(null); // cesan demir 7cm
  const [valueOfExcavation, setValueOfExcavation] = useState(null);
  const [valueOfConcrete, setValueOfConcrete] = useState(null);
  //Workers
  const [numberOfWorkers, setNumberOfWorkers] = useState(null);

  //unit Prices
  const [excavatorUnitPrice, setExcavatorUnitPrice] = useState(null);
  const [truckUnitPrice, setTruckUnitPrice] = useState(null);
  const [rollerunitPrice, setRollerunitPrice] = useState(null);
  const [greyderUnitPrice, setGreyderUnitPrice] = useState(null);
  const [pmtUnitPrice, setPmtUnitPrice] = useState(null);
  const [cesanUnitPrice, setCesanUnitPrice] = useState(null);
  const [concreteUnitPrice, setConcreteUnitPrice] = useState(null);
  const [excavationUnitPrice, setExcavationUnitPrice] = useState(null);
  const [workerUnitPrice, setWorkerUnitPrice] = useState(null);

  //price All
  const [priceExcavator, setPriceExcavator] = useState(null);
  const [priceTruck, setPriceTruck] = useState(null);
  const [priceRoller, setPriceRoller] = useState(null);
  const [priceGreyder, setPriceGreyder] = useState(null);
  const [pricePmt, setPricePmt] = useState(null);
  const [priceCesan, setPriceCesan] = useState(null);
  const [priceConcrete, setPriceConcrete] = useState(null);
  const [priceExcavation, setPriceExcavation] = useState(null);
  const [priceWorkers, setPriceWorkers] = useState(null);
  const [calProjectTime, setCalProjectTime] = useState(null);
  const [totalProjectPrice, setTotalProjectPrice] = useState(null);

  //concrete project id
  const [idConcreteRoadProject, setIdConcreteRoadProject] = useState("");

  const [matPrices, setMatPrices] = useState([]);
  const [vehPrices, setVehPrices] = useState([]);
  const [worPrices, setWorPrices] = useState(0);

  const calculateEssential = useCallback(
    (matPrices, vehPrices) => {
      console.log("first caluclation");
      console.log("matPrices", matPrices);
      console.log("vehPrices", vehPrices);

      const calculatedVolume = length * depth * width;
      setVolume(calculatedVolume.toFixed(0));

      const calTimeofProject = Math.ceil(length / 1500); // proje süresi

      const essentialNumberOfEquipment = Math.ceil(length / 3000);
      const numberOfTwo = 2 * essentialNumberOfEquipment;
      const numberOfOne = essentialNumberOfEquipment;
      const numberOfWorkers = 8 * essentialNumberOfEquipment;

      const cesanValue = (length / 5) * 2; // 1 tanesi 5m x 2.15 m, 7cm şeklinde --> adet 100 adet 10 bin tl
      const totalValuePmt = 0.1 * length * width; // 10 cm pmt serilir
      const totalValueConcrete = 2.5 * (width * length * 0.15); // 1 m3 beton 2.5 ton ediyor



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
          default:
            break;
        }
      });

      matPrices.forEach((item) => {
        switch (item.type) {
          case "pmt":
            setPricePmt(item.price * 0.1 * length * width);
            break;
          case "cesan":
            setPriceCesan(item.price * (length / 5) * 2);
            break;
          case "excavation":
            setPriceExcavation(item.price * calculatedVolume);
            break;
          case "concrete":
            setPriceConcrete(item.price * 2.5 * (width * length * 0.15));
            break;
          default:
            break;
        }
      });

      setNumberOfExcavator(numberOfTwo);
      setNumberOfTruck(numberOfTwo);
      setNumberOfRoller(numberOfOne);
      setNumberOfGreyder(numberOfOne);
      setNumberOfWorkers(numberOfWorkers);

      setValueOfExcavation(calculatedVolume);
      setValueOfCesan(cesanValue);
      setValueOfPmt(totalValuePmt);
      setValueOfConcrete(totalValueConcrete); // yes understand
      setCalProjectTime(calTimeofProject);

      return { NumOfWorkers: numberOfWorkers };
    },
    [length, width, depth] // this is used to memorize the data passed to the function, and will compare the VDom and the Dom to check if any changes has been made if so it will re-render the component
  );

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

        // Yeni bir dizi oluştur
        const newPrices = [];

        // Set Material Price
        allMaterial.forEach((material) => {
          if (material.material_name === "pmt") {
            setPmtUnitPrice(material.material_price);
            const pmtPrice = material.material_price;
            newPrices.push({ type: "pmt", price: pmtPrice });
          } else if (material.material_name === "cesan") {
            setCesanUnitPrice(material.material_price);
            const cesanPrice = material.material_price;
            newPrices.push({ type: "cesan", price: cesanPrice });
          } else if (material.material_name === "excavation") {
            setExcavationUnitPrice(material.material_price);
            const excavationPrice = material.material_price;
            newPrices.push({ type: "excavation", price: excavationPrice });
          } else if (material.material_name === "concrete") {
            setConcreteUnitPrice(material.material_price);
            const concretePrice = material.material_price;
            console.log("usestate içi : " + concretePrice);
            newPrices.push({ type: "concrete", price: concretePrice });
          }
        });

        // Yeni diziyi state'e atayın
        setMatPrices(newPrices);

        // Bu kısmı useEffect dışında kullanmak istediğiniz yere taşıyın
      } catch (err) {
        console.error(err);
      }
    };
    fetchMaterialPrice();
  }, []);
  //#endregion

  //#region get Vehicle price
  //  independent of promise ( this is okay )
  useEffect(() => {
    const fetchVehiclePrice = async () => {
      try {
        // here check only how to fetch two promises at the same time and then set the states<----
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

        // Yeni bir dizi oluştur
        const newVehPrices = [];
        //Set Material Price
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
          }
        });
        setVehPrices(newVehPrices);
        //worker Price
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
        `http://localhost:3000/concreteRoad/${idConcreteRoadProject}/export/excel`,
        { responseType: "blob" } // Yanıtın blob formatında gelmesi için
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "concreteroad_project.xlsx"); // Dosya adını belirleyin
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log("error: " + error);
    }
  }, [idConcreteRoadProject]);

  const sendToDB = useCallback(async () => {
    // okey
    try {
      const response = await axios.post(
        "http://localhost:3000/concreteRoad/create",
        {
          equipments: [
            { type: "equipment Type", quantity: 10, unitprice: 10, price: 100 }, // Örnek değerler
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
              type: "roller",
              quantity: numberOfRoller,
              unitprice: rollerunitPrice,
              price: priceRoller.toFixed(0),
            },
            {
              type: "greyder",
              quantity: numberOfGreyder,
              unitprice: greyderUnitPrice,
              price: priceGreyder.toFixed(0),
            },
          ],
          materials: [
            {
              type: "pmt",
              quantity: valueOfPmt.toFixed(0),
              unitprice: pmtUnitPrice,
              price: pricePmt.toFixed(0),
            },
            {
              type: "cesan",
              quantity: valueOfCesan.toFixed(0),
              unitprice: cesanUnitPrice,
              price: priceCesan.toFixed(0),
            },
            {
              type: "concrete",
              quantity: valueOfConcrete.toFixed(0),
              unitprice: concreteUnitPrice,
              price: priceConcrete.toFixed(0),
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
      setIdConcreteRoadProject(data_id);

      console.log("Backend'den gelen yanıt:", response.data);
    } catch (err) {
      console.log(err);
      if (isMounted.current) {
        console.error("Failed to send data to DB", err);
      }
    }
  }, [
    calProjectTime,
    numberOfExcavator,
    numberOfTruck,
    numberOfRoller,
    numberOfGreyder,
    valueOfPmt,
    valueOfCesan,
    valueOfConcrete,
    valueOfExcavation,
    numberOfWorkers,
    priceExcavator,
    priceTruck,
    priceRoller,
    priceGreyder,
    pricePmt,
    priceCesan,
    priceConcrete,
    priceExcavation,
    priceWorkers,
    excavatorUnitPrice,
    truckUnitPrice,
    rollerunitPrice,
    greyderUnitPrice,
    pmtUnitPrice,
    cesanUnitPrice,
    concreteUnitPrice,
    excavationUnitPrice,
    workerUnitPrice,
    totalProjectPrice,
  ]);

  useEffect(() => {
    //okey
    if (!matPrices && !vehPrices)
      return console.log("error gettign the data from the state");
    calculateEssential(matPrices, vehPrices);

    if (!worPrices && !numberOfWorkers)
      return console.log("error getting worker price");
    setPriceWorkers(worPrices * numberOfWorkers);
  }, [matPrices, vehPrices, numberOfWorkers, worPrices, calculateEssential]);

  const handleExport = (e) => {
    e.preventDefault();

    getExcel();
  };

  const handleRecordIt =( e) =>{
    e.preventDefault();
    sendToDB();
  };

  //Calculate button
  const handleSubmit = (e) => {
    e.preventDefault();

    const totalMPrice =
    priceExcavator + priceTruck + priceRoller + priceGreyder;

  const totalVPRice =
    pricePmt +
    priceCesan +
    priceConcrete +
    priceExcavation +
    worPrices * numberOfWorkers;

  const totalAllPrice = totalMPrice + totalVPRice;

  setTotalProjectPrice(totalAllPrice.toFixed(0));

  console.log("deneme price: " + totalAllPrice.toLocaleString("tr-TR"));

  };

  // okey ?yup
  //Add Concrede Road project to user project list
  useEffect(() => {
    if (idConcreteRoadProject) {
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
    }
  }, [idConcreteRoadProject, holdUserId]);

  const [distance, setDistance] = useState(0);

  const handleTotalDistanceChange = (newDistance) => {
    setDistance(newDistance);
  };

  useEffect(() => {
    setLength(distance);
  }, [distance]);

  return (
    <div className="concrete">
      <Col>
        <Row className="mt-5">
          <Col>
            <LeafletMap onTotalDistanceChange={handleTotalDistanceChange} />
          </Col>
          <Col xs={6}>
            <div className="excavation-col">
              <h2>Concrete Volume Calculating</h2>
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
                    placeholder="Not needed"
                    value={width} //width yani genişlik 4,50 sabit
                    readOnly // Sadece okunabilir olarak ayarla
                  />
                </label>
                <br />
                <label>
                  Depth (m):
                  <input
                    className="m-2"
                    type="number"
                    placeholder="Not needed" // okey yes
                    value={depth} // you have it set to 0.2 as defualt so we are okay, just need to check one thing then u can try to run the code
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
                Volume (m³) :{" "}
                {excavation_volume && <span> {excavation_volume} m³</span>}
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="mt-4">
            <div className="excavation-col">
              <h2>Concrete Road Calculator </h2>
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
                    <td>Cesan Quantity</td>
                    <td>
                      {valueOfCesan ? `${valueOfCesan.toFixed(2)} m³` : "-"}
                    </td>
                    <td>
                      {priceCesan
                        ? `${priceCesan.toLocaleString("tr-TR") + " TL"}`
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td>Concrete Quantity</td>
                    <td>
                      {valueOfConcrete
                        ? `${valueOfConcrete.toFixed(2)} m³`
                        : "-"}
                    </td>
                    <td>
                      {priceConcrete
                        ? `${priceConcrete.toLocaleString("tr-TR") + " TL"}`
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
                    <td>Number of Excavator </td>
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
              <h2>Understanding Concrete Roads and Their Characteristics</h2>
              <h3>Concrete Roads</h3>
              <p>
                Concrete roads, also referred to as rigid pavements, are
                constructed using a mixture of cement, aggregates (such as sand
                and gravel), water, and often additives or admixtures to enhance
                properties like workability and durability. Unlike flexible
                pavements such as asphalt, concrete roads have a rigid structure
                and rely on their own inherent strength to distribute loads and
                withstand traffic stresses.
              </p>

              <h3>Characteristics of Concrete Roads</h3>
              <p>
                Concrete roads possess several key characteristics that make
                them highly desirable for various transportation applications:
              </p>
              <ul>
                <li>
                  <strong>Durability:</strong> Concrete roads exhibit
                  exceptional durability, capable of withstanding heavy loads
                  and resisting deformation over time. Their rigid structure
                  provides long-term stability, reducing the need for frequent
                  repairs or maintenance.
                </li>
                <li>
                  <strong>Longevity:</strong> With proper construction and
                  maintenance practices, concrete roads can have a lifespan
                  exceeding several decades. Their resistance to environmental
                  factors such as moisture, temperature fluctuations, and
                  chemical exposure contributes to their longevity.
                </li>
                <li>
                  <strong>Smooth Riding Surface:</strong> Concrete roads offer a
                  smooth and even riding surface, enhancing driving comfort and
                  safety for motorists. The absence of rutting or deformation
                  ensures consistent vehicle performance and reduces driver
                  fatigue.
                </li>
                <li>
                  <strong>Reflectivity:</strong> Concrete roads typically have a
                  light-colored surface that reflects more sunlight compared to
                  asphalt, resulting in lower surface temperatures and improved
                  visibility, particularly during nighttime driving.
                </li>
                <li>
                  <strong>Eco-Friendly:</strong> Concrete roads are
                  environmentally friendly due to their sustainable construction
                  materials and potential for recycling. They contribute to
                  reduced energy consumption, lower greenhouse gas emissions,
                  and enhanced overall environmental quality.
                </li>
              </ul>

              <h3>Usage and Applications</h3>
              <p>
                Concrete roads are utilized in various transportation
                infrastructures, including highways, expressways, urban streets,
                airports, and industrial facilities. They are particularly
                favored in locations experiencing heavy traffic volumes,
                frequent freeze-thaw cycles, or aggressive environmental
                conditions where superior performance and durability are
                paramount.
              </p>
              <p>
                Furthermore, concrete roads are preferred for heavy-duty
                applications such as truck routes, bus lanes, and port terminals
                due to their ability to withstand concentrated loads and
                repetitive stress without significant deformation or
                deterioration.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <img src={asphalt_1} alt="Asphalt" className="img-fluid" />
            <img src={asphalt_1} alt="Asphalt" className="img-fluid" />
          </div>
        </Row>
      </Col>
    </div>
  );
};

export default ConcreteRoad;
