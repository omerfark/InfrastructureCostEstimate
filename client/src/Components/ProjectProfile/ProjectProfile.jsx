import { useCallback, useEffect, useState } from "react";
import "./ProjectProfile.css";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import HeaderTr from "../HeadTr/HeadTr.jsx";

const ProjectProfile = () => {
  const [isVehiclesLoading, setIsVehiclesLoading] = useState(true);
  const [isMaterialsLoading, setIsMaterialsLoading] = useState(true);
  const [isEquipmentsLoading, setIsEquipmentsLoading] = useState(true);
  const [isWorkersLoading, setIsWorkersLoading] = useState(true);
  const [isProjectTimeLoading, setIsProjectTimeLoading] = useState(true);

  const [selectedId, setSelectedId] = useState(null);
  const [userToken, setUserToken] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [userId, setUserId] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  // Fetch user token and verify authentication
  useEffect(() => {
    axios.get("http://localhost:3000/auth/verify").then((res) => {
      if (res.data.status) {
        setUserToken(res.data.token);
        setUserId(res.data.token.userId);
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
      if (userToken.userId) {
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

  const deleteSelectedAsphalt = useCallback(async () => {
    if (selectedId) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/project/${userId}/asphalt/${selectedId}`
        );
        console.log("response asphalt delete: " + response.data);
        window.location.reload(); // Sayfayı yenile
      } catch (err) {
        console.log(err);
      }
    }
  }, [selectedId, userId]);

  const handleDeleteAsphalt = (id) => {
    setSelectedId(id);
    deleteSelectedAsphalt();
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

  const deleteSelectedElectric = useCallback(async () => {
    if (selectedId) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/project/${userId}/electric/${selectedId}`
        );
        console.log("response electric delete: " + response.data);
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  }, [userId, selectedId]);

  const handleDeleteElectric = (id) => {
    setSelectedId(id);
    deleteSelectedElectric();
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

  const deleteSelectedConcreteRoad = useCallback(async () => {
    if (selectedId) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/project/${userId}/concreteRoad/${selectedId}`
        );
        console.log("response concrete road delete: " + response.data);
        window.location.reload(); // Sayfayı yenile
      } catch (err) {
        console.log(err);
      }
    }
  }, [userId, selectedId]);

  const handleDeleteConcreteRoad = (id) => {
    selectedId(id);
    deleteSelectedConcreteRoad();
  };

  //#endregion

  //#region  Fetch selected project details  pipe concrete Laying
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

  const deleteSelectedPipeConcrete = useCallback(async () => {
    if (selectedId) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/project/${userId}/pipeConcrete/${selectedId}`
        );
        console.log("response pipe concrete delete: " + response.data);
        window.location.reload(); // Sayfayı yenile
      } catch (err) {
        console.log(err);
      }
    }
  }, [selectedId, userId]);

  const handleDeletePipeConcrete = (id) => {
    setSelectedId(id);
    deleteSelectedPipeConcrete();
  };

  //#endregion

  //#region  Fetch selected project details  pipe concrete Laying
  const fetchSelectedComprehensiveProject = useCallback(async () => {
    if (selectedId) {
      try {
        const response = await fetch(
          `http://localhost:3000/comprehensive/${selectedId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch comprehensive project details");
        }
        const dataOfComprehensive = await response.json();
        setSelectedProject(dataOfComprehensive);
      } catch (err) {
        console.error(err);
      }
    }
  }, [selectedId]);

  // Handle Asphalt project selection
  const comprehensiveHandleButtonClick = (id) => {
    setSelectedId(id);
    fetchSelectedComprehensiveProject();
  };

  const deleteSelectedComprehensive = useCallback(async () => {
    if (selectedId) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/project/${userId}/comprehensive/${selectedId}`
        );
        console.log("response comprehensive project delete: " + response.data);
        window.location.reload(); // Sayfayı yenile
      } catch (err) {
        console.log(err);
      }
    }
  }, [selectedId, userId]);

  const handleDeleteComprehensive = (id) => {
    setSelectedId(id);
    deleteSelectedComprehensive();
  };

  //#endregion

  // Update loading states based on selected project
  useEffect(() => {
    if (selectedProject) {
      setIsVehiclesLoading(false);
      setIsMaterialsLoading(false);
      setIsEquipmentsLoading(false);
      setIsWorkersLoading(false);
      setIsProjectTimeLoading(false);
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
        <HeaderTr items="projectprofile" />
      </Row>
      <Row className="">
        <Col className="excavation-col" xs={8}>
          <Row>
            <div>
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
                        <div
                          className="project-container"
                          key={asphaltProject._id}
                        >
                          <button
                            className="project-button"
                            onClick={() => handleButtonClick(asphaltProject)}
                          >
                            Project {index + 1}
                          </button>
                          <button
                            key={asphaltProject._id}
                            className="delete-button"
                            onClick={() => handleDeleteAsphalt(asphaltProject)}
                          >
                            {" "}
                            Delete
                          </button>
                        </div>
                      ))
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Row>
          <br />
          <Row>
            <div>
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
                          <div
                            className="project-container"
                            key={electricProject._id}
                          >
                            <button
                              className="project-button"
                              onClick={() =>
                                electricHandleButtonClick(electricProject)
                              }
                            >
                              Project {index + 1}
                            </button>
                            <button
                              key={electricProject._id}
                              className="delete-button"
                              onClick={() =>
                                handleDeleteElectric(electricProject)
                              }
                            >
                              {" "}
                              Delete
                            </button>
                          </div>
                        )
                      )
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Row>
          <br />
          <Row>
            <div>
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
                          <div
                            className="project-container"
                            key={concreteRoadProject._id}
                          >
                            <button
                              className="project-button"
                              onClick={() =>
                                concreteRoadHandleButtonClick(
                                  concreteRoadProject
                                )
                              }
                            >
                              Project {index + 1}
                            </button>
                            <button
                              key={concreteRoadProject._id}
                              className="delete-button"
                              onClick={() =>
                                handleDeleteConcreteRoad(concreteRoadProject)
                              }
                            >
                              {" "}
                              Delete
                            </button>
                          </div>
                        )
                      )
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Row>
          <br />
          <Row>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <h2>Pipe Laying Projects</h2>
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
                          <div
                            className="project-container"
                            key={pipeConcreteProject._id}
                          >
                            <button
                              className="project-button"
                              onClick={() =>
                                pipeConcreteHandleButtonClick(
                                  pipeConcreteProject
                                )
                              }
                            >
                              Project {index + 1}
                            </button>
                            <button
                              key={pipeConcreteProject._id}
                              className="delete-button"
                              onClick={() =>
                                handleDeletePipeConcrete(pipeConcreteProject)
                              }
                            >
                              {" "}
                              Delete
                            </button>
                          </div>
                        )
                      )
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Row>
          <Row>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  marginTop: "20px",
                }}
              >
                <h2>Comprehensive Projects</h2>
                <button className="create-button">
                  <Link to="/comprehensive">Create New</Link>
                </button>
              </div>
              <ul>
                {projects.map((project) => (
                  <li key={project._id}>
                    {project.comprehensive_projects.length === 0 ? (
                      <button className="no-projects-button">
                        <Link to="/pipeconcrete">
                          No Comprehensive projects found. Click here to create
                          a new project.
                        </Link>
                      </button>
                    ) : (
                      project.comprehensive_projects.map(
                        (comprehensiveProject, index) => (
                          <div
                            className="project-container"
                            key={comprehensiveProject._id}
                          >
                            <button
                              className="project-button"
                              onClick={() =>
                                comprehensiveHandleButtonClick(
                                  comprehensiveProject
                                )
                              }
                            >
                              Project {index + 1}
                            </button>
                            <button
                              key={comprehensiveProject._id}
                              className="delete-button"
                              onClick={() =>
                                handleDeleteComprehensive(comprehensiveProject)
                              }
                            >
                              {" "}
                              Delete
                            </button>
                          </div>
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
          {isVehiclesLoading ? (
            <p>Loading vehicles...</p>
          ) : (
            <div className="uniform-table">
              {selectedProject && !isVehiclesLoading && (
                <>
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Project Time</td>
                        <td>
                          {selectedProject.project_time
                            ? `${selectedProject.project_time.toLocaleString("tr-TR")} Months`: "-"}
                        </td>
                      </tr>
                    </tbody>
                  </table>

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
                              {vehicle.price.toLocaleString("tr-TR") + " TL"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </>
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
                          <td>{material.quantity.toFixed(2)}</td>
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
                            {worker.price.toLocaleString("tr-TR") + " TL"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>

                <table className="uniform-table">
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
                        {selectedProject.total_price
                          ? `${selectedProject.total_price.toLocaleString(
                              "tr-TR"
                            )} TL`
                          : "-"}
                      </td>
                    </tr>
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
