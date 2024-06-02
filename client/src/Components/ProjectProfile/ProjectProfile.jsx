import { useCallback, useEffect, useState } from "react";
import "./ProjectProfile.css";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const ProjectProfile = () => {
  const [isVehiclesLoading, setIsVehiclesLoading] = useState(true);
  const [isMaterialsLoading, setIsMaterialsLoading] = useState(true);
  const [isEquipmentsLoading, setIsEquipmentsLoading] = useState(true);
  const [isWorkersLoading, setIsWorkersLoading] = useState(true);
  const [isProjectTimeLoading, setIsProjectTimeLoading] = useState(true)

  const [selectedId, setSelectedId] = useState(null);
  const [userToken, setUserToken] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

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

  // Handle logout
  const handleLogout = () => {
    axios
      .get("http://localhost:3000/auth/logout")
      .then((res) => {
        if (res.data.status) {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Fetch user information
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/users/${userToken.userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }
        const data = await response.json();
        setUserInfo(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (userToken) {
      fetchUserInfo();
    }
  }, [userToken]);

  // Fetch user projects
  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/project?user_id=${userToken.userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user projects");
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (userToken) {
      fetchUserProjects();
    }
  }, [userToken]);

  //project yoksa burası calışıyor
  useEffect(() => {
    const fetchUserProject = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/project?user_id=${userToken.userId}`
        );
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
          user_id: "66434a87466a87c3c9ac6b58",
          project_name: "New Project",
          // Diğer gerekli proje verilerini ekleyin
        };
        const response = await axios.post(
          `http://localhost:3000/project/create`,
          newProjectData
        );
        console.log("New project created:", response.data);
      } catch (err) {
        console.log("Error creating new project:", err);
      }
    };

    fetchUserProject();
  }, []);

  //#region  Fetch selected project details  Aphalt
  const fetchSelectedAsphaltProject = useCallback(async () => {
    if (selectedId) {
      try {
        const response = await fetch(
          `http://localhost:3000/asphalt/${selectedId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch project details");
        }
        const dataOfAsphaltP = await response.json();
        setSelectedProject(dataOfAsphaltP);
      } catch (err) {
        console.error(err);
      }
    }
  }, [selectedId]);

  // Handle Asphalt project selection
  const handleButtonClick = (id) => {
    setSelectedId(id);
    fetchSelectedAsphaltProject();
  };
  //#endregion

  //#region  Fetch selected project details  Electric
  const fetchSelectedElectricProject = useCallback(async () => {
    if (selectedId) {
      try {
        const response = await fetch(
          `http://localhost:3000/electric/${selectedId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch project details");
        }
        const dataOfElectricP = await response.json();
        setSelectedProject(dataOfElectricP);
      } catch (err) {
        console.error(err);
      }
    }
  }, [selectedId]);

  // Handle Asphalt project selection
  const electricHandleButtonClick = (id) => {
    setSelectedId(id);
    fetchSelectedElectricProject();
  };
  //#endregion

  //#region  Fetch selected project details  Concrete Road
  const fetchSelectedConcreteRoadProject = useCallback(async () => {
    if (selectedId) {
      try {
        const response = await fetch(
          `http://localhost:3000/concreteRoad/${selectedId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch project details");
        }
        const dataOfElectricP = await response.json();
        setSelectedProject(dataOfElectricP);
      } catch (err) {
        console.error(err);
      }
    }
  }, [selectedId]);

  // Handle Asphalt project selection
  const concreteRoadHandleButtonClick = (id) => {
    setSelectedId(id);
    fetchSelectedConcreteRoadProject();
  };
  //#endregion

  //#region  Fetch selected project details  Concrete Road
  const fetchSelectedPipeConcreteProject = useCallback(async () => {
    if (selectedId) {
      try {
        const response = await fetch(
          `http://localhost:3000/pipeConcrete/${selectedId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch pipe concrete project details");
        }
        const dataOfPipeconcrete = await response.json();
        setSelectedProject(dataOfPipeconcrete);
      } catch (err) {
        console.error(err);
      }
    }
  }, [selectedId]);

  // Handle Asphalt project selection
  const pipeConcreteHandleButtonClick = (id) => {
    setSelectedId(id);
    fetchSelectedPipeConcreteProject();
  };
  //#endregion

  // Update loading states based on selected project
  useEffect(() => {
    if (selectedProject) {
      setIsVehiclesLoading(false);
      setIsMaterialsLoading(false);
      setIsEquipmentsLoading(false);
      setIsWorkersLoading(false);
      setIsProjectTimeLoading(false)
    }
  }, [selectedProject]);

  const handleCreateProjectClick = () => {
    navigate("/"); // Proje oluşturma sayfasına yönlendir
  };

  useEffect(() => {
    console.log("Projects:", projects.length); // Veri yapısını ve içeriğini kontrol edin
  }, [projects]);

  const handleUpdate = () => {};

  return (
    <Col className="mt-5">
      <Row className="mt-5">
        <Col className="excavation-col" xs={8}>
          <Row>
            <div >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <h2>Asphalt Road Project</h2>
                <button className="create-button">
                  <Link to="/asphaltcalculator">Create New</Link>
                </button>
              </div>
              <ul>
                {projects.map((project) => (
                  <li key={project._id}>
                    {project.asphalt_projects.length === 0 ? (
                      <button
                        className="no-projects-button"
                        onClick={handleCreateProjectClick}
                      >
                        No Asphalt projects found. Click here to create a new
                        project.
                      </button>
                    ) : (
                      project.asphalt_projects.map((asphaltProject, index) => (
                        <button
                          key={asphaltProject._id}
                          className="project-button"
                          onClick={() => handleButtonClick(asphaltProject)}
                        >
                          Project {index + 1}
                        </button>
                      ))
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Row>
          <Row>
            <div >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <h2>Electric Laying Project</h2>
                <button className="create-button">
                  <Link to="/electric">Create New</Link>
                </button>
              </div>
              <ul>
                {projects.map((project) => (
                  <li key={project._id}>
                    {project.electric_projects.length === 0 ? (
                      <button
                        className="no-projects-button"
                        onClick={handleCreateProjectClick}
                      >
                        No Electric projects found. Click here to create a new
                        project.
                      </button>
                    ) : (
                      project.electric_projects.map(
                        (electricProject, index) => (
                          <button
                            key={electricProject._id}
                            className="project-button"
                            onClick={() =>
                              electricHandleButtonClick(electricProject)
                            }
                          >
                            Project {index + 1}
                          </button>
                        )
                      )
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Row>
          <Row>
            <div >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <h2>Concrete Road Projects</h2>
                <button className="create-button">
                  <Link to="/concreteroad">Create New</Link>
                </button>
              </div>
              <ul>
                {projects.map((project) => (
                  <li key={project._id}>
                    {project.concreteroad_projects.length === 0 ? (
                      <button className="no-projects-button">
                        <Link to="/concreteroad">
                          No Concrete Road projects found. Click here to create
                          a new project.
                        </Link>
                      </button>
                    ) : (
                      project.concreteroad_projects.map(
                        (concreteRoadProject, index) => (
                          <button
                            key={concreteRoadProject._id}
                            className="project-button"
                            onClick={() =>
                              concreteRoadHandleButtonClick(concreteRoadProject)
                            }
                          >
                            Project {index + 1}
                          </button>
                        )
                      )
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Row>
          <Row>
            <div >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <h2>Concrete Road Projects</h2>
                <button className="create-button">
                  <Link to="/pipeconcrete">Create New</Link>
                </button>
              </div>
              <ul>
                {projects.map((project) => (
                  <li key={project._id}>
                    {project.pipeconcrete_projects.length === 0 ? (
                      <button className="no-projects-button">
                        <Link to="/pipeconcrete">
                          No Pipe Concrete projects found. Click here to create
                          a new project.
                        </Link>
                      </button>
                    ) : (
                      project.pipeconcrete_projects.map(
                        (pipeConcreteProject, index) => (
                          <button
                            key={pipeConcreteProject._id}
                            className="project-button"
                            onClick={() =>
                              pipeConcreteHandleButtonClick(pipeConcreteProject)
                            }
                          >
                            Project {index + 1}
                          </button>
                        )
                      )
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Row>
        </Col>
        <Col className="mt-5" xs={4}>
          <div>{isProjectTimeLoading ? (<p>Loading...</p>) : (<h2>Project Time : {selectedProject.project_time} Months</h2>)}</div>
            {isVehiclesLoading ? (
              <p>Loading vehicles...</p>
            ) : (
              <div className="uniform-table">
                {selectedProject && !isVehiclesLoading && (
                  <table>
                    <thead>
                      <tr>
                        <th>Vehicle Name</th>
                        <th>Vehicle Quantity</th>
                        <th>Vehicle Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProject.vehicles &&
                        selectedProject.vehicles.map((vehicle) => (
                          <tr key={vehicle._id}>
                            <td>{vehicle.type}</td>
                            <td>{vehicle.quantity}</td>
                            <td>
                              {vehicle.price.toLocaleString("tr-TR") + "TL"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {selectedProject ? (
              isMaterialsLoading ? (
                <div>Loading materials...</div>
              ) : (
                <div className="uniform-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Material Type</th>
                        <th>Material Quantity</th>
                        <th>Material Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProject.materials &&
                        selectedProject.materials.map((material) => (
                          <tr key={material._id}>
                            <td>{material.type}</td>
                            <td>{material.quantity}</td>
                            <td>
                              {material.price.toLocaleString("tr-TR") + "TL"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : null}

            {selectedProject ? (
              isEquipmentsLoading ? (
                <div>Loading equipments...</div>
              ) : (
                <div className="uniform-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Equipment Type</th>
                        <th>Equipment Quantity</th>
                        <th>Equipment Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProject.equipments &&
                        selectedProject.equipments.map((equipment) => (
                          <tr key={equipment._id}>
                            <td>{equipment.type}</td>
                            <td>{equipment.quantity}</td>
                            <td>
                              {equipment.price.toLocaleString("tr-TR") + "TL"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : null}

            {selectedProject ? (
              isWorkersLoading ? (
                <div>Loading workers...</div>
              ) : (
                <div>
                  <table className="uniform-table">
                    <thead>
                      <tr>
                        <th>Worker Type</th>
                        <th>Worker Quantity</th>
                        <th>Worker Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProject.worker &&
                        selectedProject.worker.map((worker) => (
                          <tr key={worker._id}>
                            <td>{worker.type}</td>
                            <td>{worker.quantity}</td>
                            <td>
                              {worker.price.toLocaleString("tr-TR") + "TL"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : null}
          </Col>
      </Row>
    </Col>
  );
};

export default ProjectProfile;
{
  /* <Col className="mt-5">
<div className=" mt-5">
  <div className="user-info">
    <p>Name: {userInfo.user_name}</p>
    <p>Surname: {userInfo.user_surname}</p>
    <p>Phone No: {userInfo.user_tel}</p>
    <button onClick={handleUpdate} className="btn update-btn">
      Update Info
    </button>
  </div>
</div>
</Col>
<Col className="mt-5">
<div className="excavation-col mt-5">
  <button
    onClick={handleLogout}
    type="logout"
    className="btn logout-btn"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "20px",
    }}
  >
    Logout
  </button>
</div>
</Col> */
}
