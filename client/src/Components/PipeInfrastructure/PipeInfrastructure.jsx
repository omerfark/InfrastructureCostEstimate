import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PipeInfrastructure.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import polietilen_pipe from "../../assets/polietilen-pipe.png";
import büzz_pipe from "../../assets/büzz-pipe.png";
import koruge_pipe from "../../assets/koruge-pipe.png";

const PipeInfrastructure = () => {
  const [excavation_length, setLength] = useState(""); // Kazı boyu
  const [excavation_width, setWidth] = useState(""); // Genişlik
  const [excavation_depth, setDepth] = useState(""); // Derinlik
  const [excavation_volume, setVolume] = useState(""); // Hacim
  const [homePiece, setHomePiece ] = useState("");// kaç adet ev olduğu
  const [homePrice, setHomePrice] = useState(""); // toplam fiyat deeğeri
  const [connectorsPrice ,setConnectorsPrice]  = useState(""); // bağlantı elemanları her 100 mt 1 adet

  const [pipeVolume, setPipeVolume] = useState(""); // boru hacmi
  const [pipePiece, setPipePiece] = useState(""); // boru adeti
  const [totalPipeV, setTotalPipeV] = useState(""); // toplam boruların hacmi
  const [aggregateAmount, setAggregateAmount] = useState("");
  const [selectedDiameter, setSelectedDiameter] = useState("");
  const [totalPriceAggregate, setTotalPriceAggregate] = useState("");
  const [totalPriceExcavation, setTotalPriceExcavation] = useState("");
  const [teamCost, setTeamCost] = useState("");
  const [totalTeamCost, setTotalTeamCost] = useState("");
  const [pipeSelected, setPipeSelected] = useState("") // boru türünü tut

  const [excavationPrice, setExcavationPrice] = useState("");// api den çekilen değer
  const [aggregatePrice, setAggregatePrice] = useState("");// api den çekilen değer
  const [selectedPipePrice, setSelectedPipePrice] = useState(0);
  const [pipePiecePrice, setPipePiecePrice] = useState(""); // boruların tekil fiyatı

  const [projectTime, setProjectTime] = useState(0);

  // vehicles -----
  const [excavatorPrice, setExcavatorPrice] = useState(""); // api den çekilen değer
  const [truckPrice, setTruckPrice] = useState(""); // api den çekilen değer
  const [totalExcavatorPrice, setTotalExcavatorPrice] = useState("");
  const [totalTruckPrice, setTotalTruckPrice] = useState("");
  
  // const navigate = useNavigate();
  // axios.defaults.withCredentials = true; //cookie özelliği eklemek için

  // useEffect(() => {
  //     axios.get("http://localhost:3000/auth/verify").then((res) => {
  //       if (res.data.status) {
  //         console.log(res.data);
  //         const tokenValue = res.data.token;
  //         console.log("token degeri : " + res.data.token);
  //       } else {
  //         navigate("/login");
  //       }
  //     });
  //   }, []);



  const excavator1= "excavator";
  const truck1="truck";
  const teamName= "team1"
  useEffect(() =>{
    const fetchVehicles = async () => {
      try{
        const response = await fetch( `http://localhost:3000/vehicles?vehicle_type=${excavator1}`);
        const response2 = await fetch( `http://localhost:3000/vehicles?vehicle_type=${truck1}`);
        const response3 = await  fetch( `http://localhost:3000/teams?team_name=${teamName}`);
        if(!response.ok && !response2.ok && response3.ok){
          if (response.status === 404) {
            throw new Error("Vehicles are not found");
          } else {
            throw new Error("Unexpected error");
          }
        }
        const excavatorVehicles = await response.json();
        const truckVehicles = await response2.json();
        const teamPrice = await response3.json();
        setExcavatorPrice(excavatorVehicles);
        setTruckPrice(truckVehicles);
        setTeamCost(teamPrice);
      } catch(err) {
        console.log(err)
      }
    };
    fetchVehicles();

  },[excavator1,truck1])


    // Seçenekler listesi
    const pipeOptions = [
      { name: "concrete", diameter: "0.3", volume: "0.11", length: "1.5", nickname:"sewer type 1 - (Concrete)" },
      { name: "corrugated", diameter: "0.2", volume: "0.19", length: "6", nickname:"sewer type 2 - (Corrugated)" },
      { name: "polietilen", diameter: "0.11", volume: "0.05", length: "6",nickname:"clean water pipe"},
    ];
    // Seçeneklerin dropdown menüsüne dönüştürülmesi
    const options = pipeOptions.map((option, index) => (
      <option key={index} value={option.diameter}>
        {option.nickname}
      </option>
    ));
  
    
  const excavationMaterial = "excavation"; 
  const aggregateMaterial = "aggregate";
  const concretePipe = pipeSelected.name;
  //material price
  useEffect(() => {
    const fetchMaterialPrice = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/materials?material_name=${excavationMaterial}`
        );
        const response2 = await fetch(
          `http://localhost:3000/materials?material_name=${aggregateMaterial}`
        );
        const response3 = await fetch(
          `http://localhost:3000/materials?material_name=${concretePipe}`
        );
        if (!response.ok && !response2.ok && !response3.ok) {
          if (response.status === 404) {
            throw new Error("Material not found");
          } else {
            throw new Error("Unexpected error");
          }
        }
        const materialExcavationPrice = await response.json();
        const materialAggregatePrice = await response2.json();
        const materialPipePrice = await response3.json(); 

        setExcavationPrice(materialExcavationPrice);
        setAggregatePrice(materialAggregatePrice);
        setPipePiecePrice(materialPipePrice)
      } catch (err) {
        console.error(err);
        setExcavationPrice(null);
      }
    };

    fetchMaterialPrice();
  }, [excavationMaterial, aggregateMaterial,concretePipe]);

  useEffect(() => {
    const postProjectDb = async () => {
      try {
        const response = await axios.post('http://localhost:3000/projects/create', {
          // Göndermek istediğiniz veriler buraya gelecek
        });
        console.log('Proje başarıyla kaydedildi:', response.data);
      } catch (error) {
        console.error('Proje kaydetme işlemi başarısız oldu:', error);
      }
    };
    postProjectDb();
  }, [pipeSelected]);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const calculatedVolume = (excavation_length * excavation_width * excavation_depth).toFixed(2);
  
    // Seçilen borunun özelliklerini al
    const selectedPipe = pipeOptions.find((option) => option.diameter === selectedDiameter);
    setPipeSelected(selectedPipe);
  
    const width = selectedPipe.diameter * 4;
    const depth = selectedPipe.diameter * 8;
  
    //kazı ve dolgu malzeme fiyatı
    const calculatedPipePiece = Math.round(excavation_length / selectedPipe.length); // en yakın tama yuvarlama
    const calculatedPipeVolume = selectedPipe.volume;
    const calculatedTotalPipeV = calculatedPipePiece * calculatedPipeVolume;
    const calculatedAggregateAmount = calculatedVolume - calculatedTotalPipeV;
    const calculatedAggregatePrice = calculatedAggregateAmount * aggregatePrice.material_price;
    const calculatedExcavationPrice = calculatedVolume * excavationPrice.material_price;
    const calProjectTime = Math.ceil(calculatedVolume / 6000);  // üst tama yuvarlama
  
    // Araç maliyeti hesaplama
    const pieceVehicle = Math.ceil(excavation_length / 4000);
    const totalExPrice = pieceVehicle * excavatorPrice.vehicle_price * 1.1; 
    const totalTrPrice = pieceVehicle * truckPrice.vehicle_price * 1.1;
    const totalTeamPr = pieceVehicle * teamCost.team_price;
    
    // Diğer hesaplamalar
    const pipePriceOp = pipePiece * pipePiecePrice.material_price;
    const avarageHomeCost = homePiece * 2000;
    const pieceConnectors = (excavation_length / 200) * 5000;
  
    // State'leri güncelleme
    setWidth(width);
    setDepth(depth);
    setTotalExcavatorPrice(totalExPrice);
    setTotalTruckPrice(totalTrPrice);
    setProjectTime(calProjectTime);
    setVolume(calculatedVolume);
    setPipeVolume(calculatedPipeVolume);
    setPipePiece(calculatedPipePiece);
    setTotalPipeV(calculatedTotalPipeV);
    setAggregateAmount(calculatedAggregateAmount);
    setTotalPriceAggregate(calculatedAggregatePrice);
    setTotalPriceExcavation(calculatedExcavationPrice);
    setSelectedPipePrice(pipePriceOp);
    setHomePrice(avarageHomeCost);
    setConnectorsPrice(pieceConnectors);
    setTotalTeamCost(totalTeamPr);
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
                  Total Volume (m³) ={" "}
                  {excavation_volume && <span> {excavation_volume} m³</span>}
                </li>
                <li>
                  Pipe Volume (m³) = 3.14 X Pipe Diameter (m) X Pipe Length (m){" "}
                </li>
                <li>
                  Pipe Volume (m³) = {pipeVolume && <span>{pipeVolume} </span>}
                </li>
                <li>Total Pipe Volume = Pipe Volume (m³) X Pipe Piece </li>
                <li>
                  Total Pipe Volume = {totalPipeV && <span>{totalPipeV} </span>}{" "}
                </li>
                <li>
                  Total Aggregate (m³) = Total Volume (m³) - Total Pipe Volume
                  (m³)
                </li>
                <li>
                  Total Aggregate (m³) ={" "}
                  {aggregateAmount && <span> {aggregateAmount.toLocaleString("tr-TR")} m³</span>}
                </li>
                <li>
                  (silinecek) Pipe Volume ={" "}
                  {pipeVolume && <span>{pipeVolume} </span>}
                </li>
                <li>
                  (silinecek) pipe Piece ={" "}
                  {pipePiece && <span>{pipePiece} pice</span>}
                </li>
                <li> Pipe total Price = {selectedPipePrice && <span>{selectedPipePrice.toLocaleString("tr-TR") +
                        " TL" } </span>}</li>
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
                  {excavationPrice.material_price && (
                    <span>
                      {" "}
                      {excavationPrice.material_price.toLocaleString("tr-TR") +
                        " TL"}
                    </span>
                  )}
                </li>
                <li>
                  Price of Aggregate:{" "}
                  {aggregatePrice.material_price && (
                    <span>
                      {" "}
                      {aggregatePrice.material_price.toLocaleString("tr-TR") +
                        " TL"}
                    </span>
                  )}
                </li>
                <li>Total Price = Price of Excavation + Price of Aggregate</li>
                <li>
                  Total Price ={" "}
                  {totalPriceExcavation && (
                    <span>
                      {totalPriceExcavation.toLocaleString("tr-TR") + " TL"}{" "}
                    </span>
                  )}{" "}
                   +{" "}
                  {totalPriceAggregate && (
                    <span>
                      {totalPriceAggregate.toLocaleString("tr-TR") + " TL"}{" "}
                    </span>
                  )}
                </li>
                <li>
                  Total Price ={" "}
                  {(totalPriceExcavation + totalPriceAggregate).toLocaleString(
                    "tr-TR"
                  ) + " TL"}
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
                <li>Excavator Total Price: {totalExcavatorPrice && <span>{totalExcavatorPrice.toLocaleString("tr-TR") + " TL"} </span>} </li>
                <li>Truck Total Price:{totalTruckPrice && <span>{totalTruckPrice.toLocaleString("tr-TR") + " TL"} </span> } </li>
                <li>Home parcel total Price:{homePrice && <span>{homePrice.toLocaleString("tr-TR") + " TL"} </span>} </li>
                <li>Connector Price: {connectorsPrice && <span>{connectorsPrice.toLocaleString("tr-TR") + " TL"} </span>} </li>
                <li>Team Price: {totalTeamCost && <span>{totalTeamCost.toLocaleString("tr-TR") + " TL"} </span>} </li>
                <li> Project Time : {" "} {projectTime && <span>{projectTime} months</span>} </li>
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
              <div className="asphalt-info ">
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
              </div>
            </div>
          </Col>
        </Row>
      </Col>
    </div>
  );
};

export default PipeInfrastructure;
