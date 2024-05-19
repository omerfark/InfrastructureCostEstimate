import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [isVehiclesLoading, setIsVehiclesLoading] = useState(true);
  const [isMaterialsLoading, setIsMaterialsLoading] = useState(true);
  const [isEquipmentsLoading, setIsEquipmentsLoading] = useState(true);
  const [isWorkersLoading, setIsWorkersLoading] = useState(true);

  const [selectedId, setSelectedId] = useState(null);
  const [userToken, setUserToken] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  // Project details
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectType, setProjectType] = useState("");
  const [projectUser, setProjectUser] = useState("");

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

  // Fetch selected project details
  useEffect(() => {
    const fetchSelectedProject = async () => {
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
    };
    fetchSelectedProject();
  }, [selectedId]);

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

  // Handle project selection
  const handleButtonClick = (id) => {
    setSelectedId(id);
  };

  // Update loading states based on selected project
  useEffect(() => {
    if (selectedProject) {
      setIsVehiclesLoading(false);
      setIsMaterialsLoading(false);
      setIsEquipmentsLoading(false);
      setIsWorkersLoading(false);
    }
  }, [selectedProject]);

  const handleCreateProjectClick = () => {
    navigate("/"); // Proje oluşturma sayfasına yönlendir
  };

  useEffect(() => {
    console.log("Projects:", projects.length); // Veri yapısını ve içeriğini kontrol edin
  }, [projects]);
  return (
    <div className="asphalt">
      <Col>
        <Row>
          <div>
            <button onClick={handleLogout} type="logout" className="btn">
              Logout
            </button>
          </div>
        </Row>
        <Row>
          <h2>Project List</h2>
          <Col>
            <div className="excavation-col">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h2>Asphalt project</h2>
          <button>
            <Link to="/asphaltcalculator">Create</Link>
          </button>
        </div>
              <ul>
                {projects.map((project) => (
                  <li key={project._id}>
                    {project.asphalt_projects.length === 0 ? (
                      <button onClick={handleCreateProjectClick}>
                        No asphalt projects found. Click here to create a new
                        project.
                      </button>
                    ) : (
                      project.asphalt_projects.map((asphaltProject) => (
                        <button
                          key={asphaltProject._id}
                          onClick={() => handleButtonClick(asphaltProject)}
                        >
                          id: {asphaltProject}
                        </button>
                      ))
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Col>
          <Col>
            <div className="excavation-col">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <h2>Project List</h2>
                <button>
                  <Link to="/asphaltcalculator">Create</Link>
                </button>
              </div>
              <ul>
                {projects.map((project) => (
                  <li key={project._id}>
                    {project.asphalt_projects.length === 0 ? (
                      <button onClick={handleCreateProjectClick}>
                        No asphalt projects found. Click here to create a new
                        project.
                      </button>
                    ) : (
                      project.asphalt_projects.map((asphaltProject) => (
                        <button
                          key={asphaltProject._id}
                          onClick={() => handleButtonClick(asphaltProject)}
                        >
                          id: {asphaltProject}
                        </button>
                      ))
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Col>
          <Col>
            <div className="excavation-col">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h2>Project List</h2>
          <button>
            <Link to="/asphaltcalculator">Create</Link>
          </button>
        </div>
              <ul>
                {projects.map((project) => (
                  <li key={project._id}>
                    {project.asphalt_projects.length === 0 ? (
                      <button onClick={handleCreateProjectClick}>
                        No asphalt projects found. Click here to create a new
                        project.
                      </button>
                    ) : (
                      project.asphalt_projects.map((asphaltProject) => (
                        <button
                          key={asphaltProject._id}
                          onClick={() => handleButtonClick(asphaltProject)}
                        >
                          id: {asphaltProject}
                        </button>
                      ))
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            {selectedProject ? (
              isVehiclesLoading ? (
                <div>Loading vehicles...</div>
              ) : (
                <div className="excavation-col">
                  <ul>
                    {selectedProject.vehicles &&
                      selectedProject.vehicles.map((vehicle) => (
                        <li key={vehicle._id}>
                          Vehicle Name: {vehicle.type}
                          <br />
                          Vehicle Quantity: {vehicle.quantity}
                          <br />
                          Vehicle Price: {vehicle.price}
                        </li>
                      ))}
                  </ul>
                </div>
              )
            ) : null}
          </Col>
          <Col>
            {selectedProject ? (
              isMaterialsLoading ? (
                <div>Loading materials...</div>
              ) : (
                <div className="excavation-col">
                  <ul>
                    {selectedProject.materials &&
                      selectedProject.materials.map((material) => (
                        <li key={material._id}>
                          Material Type: {material.type}
                          <br />
                          Material Quantity: {material.quantity}
                          <br />
                          Material Price: {material.price}
                        </li>
                      ))}
                  </ul>
                </div>
              )
            ) : null}
          </Col>
          <Col>
            <Row>
              {selectedProject ? (
                isEquipmentsLoading ? (
                  <div>Loading equipments...</div>
                ) : (
                  <div className="excavation-col">
                    <ul>
                      {selectedProject.equipments &&
                        selectedProject.equipments.map((equipment) => (
                          <li key={equipment._id}>
                            Equipment Type: {equipment.type}
                            <br />
                            Equipment Quantity: {equipment.quantity}
                            <br />
                            Equipment Price: {equipment.price}
                          </li>
                        ))}
                    </ul>
                  </div>
                )
              ) : null}
            </Row>
            <Row>
              {selectedProject ? (
                isWorkersLoading ? (
                  <div>Loading workers...</div>
                ) : (
                  <div className="excavation-col">
                    <ul>
                      {selectedProject.worker &&
                        selectedProject.worker.map((worker) => (
                          <li key={worker._id}>
                            Worker Type: {worker.type}
                            <br />
                            Worker Quantity: {worker.quantity}
                            <br />
                            Worker Price: {worker.price}
                          </li>
                        ))}
                    </ul>
                  </div>
                )
              ) : null}
            </Row>
          </Col>
        </Row>
      </Col>
    </div>
  );
};

export default UserProfile;
