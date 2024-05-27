import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ConcreteRoad.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import LeafletMap from "../LeafletMap/LeafletMap";

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

  const [length, setLength] = useState(null); // Kazı boyu
  const [width, setWidth] = useState(4.5); // Genişlik
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
  const [idConcreteRoadProject, setIdConcreteRoadProject] = useState(null);

  const [matPrices, setMatPrices] = useState([]);
  const [vehPrices, setVehPrices] = useState([]);
  const [worPrices, setWorPrices] = useState(0);

  const calculateEssential = useCallback(
    (matPrices, vehPrices) => {
      console.log("first caluclation");
      console.log("matPrices", matPrices);
      console.log("vehPrices", vehPrices);

      const calculatedVolume = length * depth * width;
      setVolume(calculatedVolume);

      const calTimeofProject = Math.ceil(length / 1500); // proje süresi
      console.log(calTimeofProject);

      const essentialNumberOfEquipment = Math.ceil(length / 3000);
      const numberOfTwo = 2 * essentialNumberOfEquipment;
      const numberOfOne = essentialNumberOfEquipment;
      const numberOfWorkers = 8 * essentialNumberOfEquipment;

      const cesanValue = (length / 5) * 2; // 1 tanesi 5m x 2.15 m, 7cm şeklinde --> adet 100 adet 10 bin tl
      const totalValuePmt = 0.1 * length * width; // 10 cm pmt serilir
      const totalValueConcrete = 2.5 * (width * length * 0.15); // 1 m3 beton 2.5 ton ediyor

      let excPrice = 0;
      let truPrice = 0;
      let rolPrice = 0;
      let grePrice = 0;

      vehPrices.forEach((item) => {
        switch (item.type) {
          case "excavator": {
            excPrice = item.price * numberOfTwo * calTimeofProject;
            break;
          }
          case "truck":
            truPrice = item.price * numberOfTwo * calTimeofProject;
            break;
          case "roller":
            rolPrice = item.price * numberOfOne * calTimeofProject;
            break;
          case "greyder":
            grePrice = item.price * numberOfOne * calTimeofProject;
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

      setPriceExcavator(excPrice);
      setPriceTruck(truPrice);
      setPriceRoller(rolPrice);
      setPriceGreyder(grePrice);

      setNumberOfExcavator(numberOfTwo);

      setNumberOfTruck(numberOfTwo);
      setNumberOfRoller(numberOfOne);
      setNumberOfGreyder(numberOfOne);
      setNumberOfWorkers(numberOfWorkers);
      setValueOfExcavation(calculatedVolume);
      setValueOfCesan(cesanValue);
      setValueOfPmt(totalValuePmt);
      setValueOfConcrete(totalValueConcrete); // yes understand

      setCalProjectTime(calTimeofProject); // it is already calculated here
      return { NumOfWorkers: numberOfWorkers };
    },
    [length, width, depth] // this is used to memorize the data passed to the function, and will compare the VDom and the Dom to check if any changes has been made if so it will re-render the component
  );

  //#region Material Price
  // depend on promise ( this is okay )
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
            const pmtPrice = material.material_price;
            newPrices.push({ type: "pmt", price: pmtPrice });
          } else if (material.material_name === "cesan") {
            const cesanPrice = material.material_price;
            newPrices.push({ type: "cesan", price: cesanPrice });
          } else if (material.material_name === "excavation") {
            const excavationPrice = material.material_price;
            newPrices.push({ type: "excavation", price: excavationPrice });
          } else if (material.material_name === "concrete") {
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
            const truckPrice = vehicle.vehicle_price;
            newVehPrices.push({ type: "truck", price: truckPrice });
          } else if (vehicle.vehicle_type === "excavator") {
            const excavatorPrice = vehicle.vehicle_price;
            newVehPrices.push({ type: "excavator", price: excavatorPrice });
          } else if (vehicle.vehicle_type === "roller") {
            const rollerPrice = vehicle.vehicle_price;
            newVehPrices.push({ type: "roller", price: rollerPrice });
          } else if (vehicle.vehicle_type === "greyder") {
            const greyderPrice = vehicle.vehicle_price;

            newVehPrices.push({ type: "greyder", price: greyderPrice });
          }
        });
        setVehPrices(newVehPrices);
        //worker Price
        const workerPrice = workerGet[0].worker_price;
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

  const sendToDB = useCallback(async () => {
    // okey
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
            {
              type: "roller",
              quantity: numberOfRoller,
              price: priceRoller,
            },
            {
              type: "greyder",
              quantity: numberOfGreyder,
              price: priceGreyder,
            },
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
            {
              type: "worker",
              quantity: numberOfWorkers,
              price: priceWorkers,
            },
          ],
          project_time: calProjectTime,
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

    setTotalProjectPrice(totalAllPrice);

    console.log("deneme price: " + totalAllPrice.toLocaleString("tr-TR"));
    sendToDB();
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
          <Col >
            <LeafletMap onTotalDistanceChange={handleTotalDistanceChange} />
          </Col>
          <Col xs={6} >
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
                    placeholder="Not needed" // okey yes
                    value={depth} // you have it set to 0.2 as defualt so we are okay, just need to check one thing then u can try to run the code
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
        </Row>
        <Row>
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
