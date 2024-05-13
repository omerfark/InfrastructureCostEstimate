import { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [user_email, setEmail] = useState();
  const navigate = useNavigate();


  const handleSubmit = (e) => {

    e.preventDefault();
    Axios.post("http://localhost:3000/auth/forgot-password", { 
        user_email 
    }).then((result) => {
          if (result.data.status) {
            alert("check your email for reset password")
            navigate("/login");
          }
          console.log(result.data) 
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="login">
      <div className="login-form">
        <h2 className="login-title">Fotgot Password</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Email"
              autoComplete="off"
              name="email"
              className="form-control"
              value={user_email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-center ">
            <button type="submit" className=" w-50 button-green  mt-4">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
