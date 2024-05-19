import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AsphaltCalculator.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import asphalt_1 from "../../assets/asphalt-1.png";

const AsphaltCalculator = () => {
  const [holdUserId, setHoldUserId] = useState("");
  const navigate = useNavigate();
  axios.defaults.withCredentials = true; // cookie özelliği eklemek için

  const [excavation_length, setLength] = useState(""); // Kazı boyu
  const [excavation_width, setWidth] = useState(""); // Genişlik
  const [excavation_depth, setDepth] = useState(0.2); // Derinlik
  const [excavation_volume, setVolume] = useState(""); // Hacim
  const [asphaltAmount, setAmount] = useState("");

  // Vehicles
  const [numberOfExcavator, setNumberOfExcavator] = useState("");
  const [numberOfTruck, setNumberOfTruck] = useState("");
  const [numberOfRoller, setNumberOfRoller] = useState("");
  const [numberOfGreyder, setNumberOfGreyder] = useState("");
  const [numberOfFinisher, setNumberOfFinisher] = useState("");

  // Materials
  const [valueOfPmt, setValuOfPmt] = useState("");
  const [valueOfAsphalt_1, setValuOfAsphlt_1] = useState("");
  const [valueOfAsphalt_2, setValuOfAsphlt_2] = useState("");
  const [valueOfExcavation, setValuOfExcavation] = useState("");

  // Workers
  const [numberOfWorkers, setNumberOfWorkers] = useState("");

  // Prices
  const [priceExcavator, setPriceExcavator] = useState("");
  const [priceTruck, setPriceTruck] = useState("");
  const [priceRoller, setPriceRoller] = useState("");
  const [priceGreyder, setPriceGreyder] = useState("");
  const [priceFinisher, setPriceFinisher] = useState("");
  const [pricePmt, setPricePmt] = useState("");
  const [priceAsphalt_1, setPriceAsphalt_1] = useState("");
  const [priceAsphalt_2, setPriceAsphalt_2] = useState("");
  const [priceExcavation, setPriceExcavation] = useState("");
  const [priceWorkers, setPriceWorkers] = useState("");
  const [totalProjectPrice, setTotalProjectPrice] = useState("");
  const [calProjectTime, setCalProjectTime] = useState("");

  // Asphalt project id
  const [idAsphaltProject, setIdAsphaltProject] = useState("");

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

  useEffect(() => {
    const fetchUserProject = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/project?user_id=${holdUserId}`);
        if (response.data && response.data.length > 0) {
          console.log("resp:", response.data);
        } else {
          console.log("No projects found for this user.");
          createNewProject();
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          console.log("User not found. Creating a new project...");
          createNewProject();
        } else {
          console.log(err);
        }
      }
    };

    const createNewProject = async () => {
      try {
        const newProjectData = {
          user_id: holdUserId, //bak buraya
          project_name: "New Project",
          // Diğer gerekli proje verilerini ekleyin
        };
        const response = await axios.post(`http://localhost:3000/project/create`, newProjectData);
        console.log("New project created:", response.data);
      } catch (err) {
        console.log("Error creating new project:", err);
      }
    };

    fetchUserProject();
  },[holdUserId])


  const CalculateEssential_1 = () => {
    setDepth(0.2);
    const calculatedVolume =
      excavation_length * excavation_width * excavation_depth;
    setVolume(calculatedVolume);
    const asphaltCalculate = (calculatedVolume * 2.4).toFixed(2); // Maksimum 2 ondalık hane
    setAmount(asphaltCalculate);

    const essentialNumberOfEquipment = Math.ceil(excavation_length / 3000);
    const numberOfTwo = 2 * essentialNumberOfEquipment;
    const numberOfOne = essentialNumberOfEquipment;
    const numberOfWorkers = 4 * essentialNumberOfEquipment;

    setNumberOfExcavator(numberOfTwo);
    setNumberOfTruck(numberOfTwo);
    setNumberOfRoller(numberOfOne);
    setNumberOfGreyder(numberOfOne);
    setNumberOfFinisher(1);
    setNumberOfWorkers(numberOfWorkers);

    const totalValueAsphalt_1 =
      2.4 * (0.15 * excavation_length * excavation_width); // alt tabaka 15 cm
    const totalValueAsphalt_2 =
      2.4 * (0.05 * excavation_length * excavation_width); // üst tabaka 5 cm
    const totalValuePmt = 0.1 * excavation_length * excavation_width; // pmt tabakası 10 cm

    setValuOfExcavation(calculatedVolume);
    setValuOfAsphlt_1(totalValueAsphalt_1);
    setValuOfAsphlt_2(totalValueAsphalt_2);
    setValuOfPmt(totalValuePmt);
  };

  //#region materials price
  useEffect(() => {
    const fetchMaterialPrice = async () => {
      try {
        const response = await fetch(`http://localhost:3000/materials/all`);
        if (!response.ok) {
          throw new Error("Failed to fetch material prices");
        }
        const allMaterial = await response.json();
        allMaterial.forEach((material) => {
          switch (material.material_name) {
            case "pmt":
              setPricePmt(valueOfPmt * material.material_price);
              break;
            case "asphalt_1":
              setPriceAsphalt_1(valueOfAsphalt_1 * material.material_price);
              break;
            case "asphalt_2":
              setPriceAsphalt_2(valueOfAsphalt_2 * material.material_price);
              break;
            case "excavation":
              setPriceExcavation(valueOfExcavation * material.material_price);
              break;
            default:
              break;
          }
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchMaterialPrice();
  }, [valueOfPmt, valueOfAsphalt_1, valueOfAsphalt_2, valueOfExcavation]);
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

        allVehicles.forEach((vehicle) => {
          switch (vehicle.vehicle_type) {
            case "truck":
              setPriceTruck(
                numberOfTruck * vehicle.vehicle_price * calProjectTime
              );
              break;
            case "excavator":
              setPriceExcavator(
                numberOfExcavator * vehicle.vehicle_price * calProjectTime
              );
              break;
            case "roller":
              setPriceRoller(
                numberOfRoller * vehicle.vehicle_price * calProjectTime
              );
              break;
            case "greyder":
              setPriceGreyder(
                numberOfGreyder * vehicle.vehicle_price * calProjectTime
              );
              break;
            case "finisher":
              setPriceFinisher(
                numberOfFinisher * vehicle.vehicle_price * calProjectTime
              );
              break;
            default:
              break;
          }
        });

        // Worker Price
        setPriceWorkers(
          numberOfWorkers * workerGet[0].worker_price * calProjectTime
        );
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
    numberOfFinisher,
    numberOfWorkers,
    calProjectTime,
  ]);
  //#endregion

  const handleSubmit = async (e) => {
    e.preventDefault();

    const calTimeofProject = Math.ceil(excavation_volume / 3200);
    setCalProjectTime(calTimeofProject);

    CalculateEssential_1(); //hesaplamaların yapıldığı fonksiyon

    try {
      const response = await axios.post(
        "http://localhost:3000/asphalt/create",
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
            {
              type: "finisher",
              quantity: numberOfFinisher,
              price: priceFinisher,
            },
          ],
          materials: [
            { type: "pmt", quantity: valueOfPmt, price: pricePmt },
            {
              type: "asphalt_1",
              quantity: valueOfAsphalt_1,
              price: priceAsphalt_1,
            },
            {
              type: "asphalt_2",
              quantity: valueOfAsphalt_2,
              price: priceAsphalt_2,
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
      setIdAsphaltProject(data_id);

      console.log("Backend'den gelen yanıt:", response.data);
    } catch (error) {
      console.error("Hata:", error);
    }

    const totalMPrice =
      priceExcavator + priceTruck + priceRoller + priceGreyder + priceFinisher;
    const totalVPRice =
      pricePmt +
      priceAsphalt_1 +
      priceAsphalt_2 +
      priceExcavation +
      priceWorkers;
    const totalAllPrice = totalMPrice + totalVPRice;
    setTotalProjectPrice(totalAllPrice);
    console.log("deneme price: " + totalProjectPrice.toLocaleString("tr-TR"));
  };

  //Add asphalt project to user project list
  // useEffect(() => {
  //   const postProjectId = async () => {
  //     await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 saniye bekle
  //     try {
  //       const response = await axios.patch(
  //         `http://localhost:3000/project/${holdUserId}/asphalt`,
  //         {
  //           asphalt_projects: idAsphaltProject,
  //         }
  //       );
  //       console.log(response.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   postProjectId();
  // }, [idAsphaltProject, holdUserId]);

  return (
    <div className="asphalt">
      <Col>
        <Row>
          <Col xs={6}>
            <div className="excavation-col">
              <h2>Excavation Volume Calculating</h2>
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
                    value={excavation_width}
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
          <Col xs={6} className="mt-4">
            <div className="excavation-col">
              <h2> Asphalt Calculator </h2>

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
                <li>
                  Total Quantity ={" "}
                  {asphaltAmount && (
                    <span>
                      {""}
                      {asphaltAmount} m³
                    </span>
                  )}
                </li>
              </ul>
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
