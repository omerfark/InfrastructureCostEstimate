//#region normali
// import React, { useEffect, useState } from "react";
// import "./UserProfile.css";
// import Col from "react-bootstrap/esm/Col";
// import Row from "react-bootstrap/esm/Row";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const UserProfile = () => {
//   // test.omer1212@gmail.com

//   const [projectName, setProjectName] = useState("");
//   // const [projectType, setProjectType] = useState("");
//   const [projectDescription, setProjectDescription] = useState("");
//   const [idlist, setIdList] = useState("");
//   const [userInfo,setUserInfo] = useState("");

//   const [selectProjectType, setSelectProjectType] = useState(""); // Derinlik
//   const navigate = useNavigate();

//   //#region Project Type
//   const projectOptions = [
//     { name: "Asphalt Project", projectType: "1" },
//     { name: "Pipe Laying Project", projectType: "2" },
//     { name: " Power Line Laying Project", projectType: "3" },
//   ];

//   const options = projectOptions.map((option, index) => (
//     <option key={index} value={option.projectType}>
//       {option.name}
//     </option>
//   ));

//   //#endregion

//   axios.defaults.withCredentials = true; //cookie özelliği eklemek için

//   useEffect(() => {
//     axios.get("http://localhost:3000/auth/verify").then((res) => {
//       if (res.data.status) {
//         console.log(res.data);
//       } else {
//         navigate("/login");
//       }
//     });
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//   };

//   const handleLogout = () => {
//     axios
//       .get("http://localhost:3000/auth/logout")
//       .then((res) => {
//         console.log(res.data.status);
//         if (res.data.status) {
//           navigate("/login");
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   //#region USER PROCCESS

//   useEffect(()=>{
//     const fetchUserInfo = async()=>{
//       try{
//         const response = await fetch(`http://localhost:3000/project/663939e26907e029e594fad4`)
//         if(!response.ok){
//           if(response.status === 404){
//             throw new Error("Project not found");
//           } else {
//             throw new Error("Unexpected error");
//           }
//         }
//         const infoUser = await response.json();
//         setUserInfo(infoUser);
//       }catch(err){
//         console.log(err);
//       }
//     };
//     fetchUserInfo();
//   },[]);
//   //#endregion

//   return (
//     <div className="asphalt">
//       <Col>
//         <Row>
//           <div>
//             <button onClick={handleLogout} type="logout" className="btn">
//               {" "}
//               Logout
//             </button>
//           </div>
//         </Row>
//         <Row>
//           <Col xs={6}>
//             <div className="excavation-col">
//               <h2>New Project Create</h2>
//               <form onSubmit={handleSubmit}>
//                 <label>
//                   Project Type:
//                   <select
//                     className="m-2"
//                     value={selectProjectType}
//                     onChange={(e) => setSelectProjectType(e.target.value)}
//                   >
//                     <option value="">Select Project</option>
//                     {options}
//                   </select>
//                 </label>
//                 <br />
//                 <label>
//                   Project Name:
//                   <input
//                     className="m-2"
//                     type="string"
//                     value={projectName}
//                     onChange={(e) => setProjectName(e.target.value)}
//                     onFocus={(e) => e.target.select()} // Girdiye odaklandığında içeriği seç
//                   />
//                 </label>
//                 <br />
//                 <label>
//                   Project Description :
//                   <input
//                     className="m-2"
//                     type="project type"
//                     value={projectDescription}
//                     onChange={(e) => setProjectDescription(e.target.value)}
//                     onFocus={(e) => e.target.select()} // Girdiye odaklandığında içeriği seç
//                   />
//                 </label>
//                 <br />
//                 <label>
//                   Project Id :
//                   <input
//                     className="m-2"
//                     type="project type"
//                     value={idlist}
//                     onChange={(e) => setIdList(e.target.value)}
//                     onFocus={(e) => e.target.select()} // Girdiye odaklandığında içeriği seç
//                   />
//                 </label>
//                 <br />
//                 <div className="calculate">
//                   <button type="submit" className="calculate-button">
//                     {" "}
//                     Create
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </Col>
//           <Col xs={6} className="">
//             <div className="excavation-col">
//               <h2> Asphalt Calculator </h2>

//               <ul>
//                 <li>Total Volume = Length X Width X Depth</li>
//                 <li>
//                   Total Volume (m³) =
//                 </li>
//                 <li>Total Quantity = Total Volume X Density of Asphalt</li>
//                 <li>
//                   Total Quantity =
//                 </li>
//                 <li>
//                   User Info ={" "}
//                   {userInfo.project_name && (
//                     <span>
//                       {""}
//                       {userInfo.project_name} m³
//                     </span>
//                   )}
//                 </li>

//               </ul>
//             </div>
//           </Col>
//         </Row>
//       </Col>
//     </div>
//   );
// };

// export default UserProfile;
//#endregion
import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [userToken, setUserToken] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  //Project Post
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectType, setProjectType] = useState("");
  const [projectUser, setProjectUser] = useState("");
  

  const navigate = useNavigate();
  axios.defaults.withCredentials = true; //cookie özelliği eklemek için

  useEffect(() => {
    axios.get("http://localhost:3000/auth/verify").then((res) => {
      if (res.data.status) {
        console.log(res.data);
        const tokenValue = res.data.token;
        setUserToken(tokenValue);
        console.log("token degeri : " + res.data.token);
      } else {
        navigate("/login");
      }
    });
  }, []);

  //user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/users/${userToken.userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user Info");
        }
        const data = await response.json();
        setUserInfo(data);
      } catch (err) {
        console.log(err);
      }
    };
    if (userToken) {
      fetchUserInfo();
    }
  }, [userToken]);

  // get all project info
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
        console.log(data[1].project_requirements.materials[1])
      } catch (err) {
        console.log(err);
      }
    };
    if (userToken) {
      fetchUserProjects();
    }
  }, [userToken]);



  const handleLogout = () => {
    axios
      .get("http://localhost:3000/auth/logout")
      .then((res) => {
        console.log(res.data.status);
        if (res.data.status) {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProjectUser(userInfo._id)


  }
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
          <Col>
            <div>
              <h1>Projects</h1>
              <ul>
                {projects.map((project) => (
                  <li
                    key={project._id}
                    onClick={() => handleProjectClick(project)}
                  >
                    <button className="btn">{project.project_name}</button>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
          <Col className="">
            <div className="excavation-col">
              {selectedProject && (
                <div>
                  <h2>Selected Project Details</h2>
                  <p>Project Name: {selectedProject.project_name}</p>
                  <p>Project Type: {selectedProject.project_type}</p>
                  <p>
                    Project Description: {selectedProject.project_description}
                  </p>
                  <p>
                    Project Materials:{" "}
                    {selectedProject.project_requirements.materials[0]}
                  </p>
                    <ul>
                      {selectedProject.project_requirements.materials.map(
                        (material, index) => (
                          <li key={index}>
                            Name: {material}
                          </li>
                        )
                      )}
                    </ul>
                  {/* Diğer proje detaylarını buraya ekleyebilirsiniz */}
                </div>
              )}
            </div>
          </Col>
        </Row>
        <Row>
          
        </Row>
      </Col>
    </div>
  );
};

export default UserProfile;
