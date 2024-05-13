import { useState } from "react";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const [user_password, setPassword] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post("http://localhost:3000/auth/reset-password/" + token, {
      user_password,
    }).then((result) => {
        if (result.data.status) {
          navigate("/login");
        }
        console.log(result.data); //password güncellenmiyor
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="login">
      <div className="login-form">
        <h2 className="login-title">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="password"
              placeholder="Password"
              autoComplete="off"
              name="password"
              className="form-control"
              value={user_password} // value eklendi
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-center ">
            <button type="submit" className=" w-50 button-green  mt-4">
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
