import { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [user_email, setEmail] = useState();
  const [user_password, setPassword] = useState();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState(); //şifre veya mail yanlışsa mesaj döndür

  Axios.defaults.withCredentials = true; //cookie özelliği eklemek için

  const handleSubmit = (e) => {
    const emailPattern = /\S+@\S+\.\S+/; // Email adress control

    e.preventDefault();
    Axios.post("http://localhost:3000/auth/login", {
      user_email,
      user_password,
    })
      .then((result) => {
        console.log(result);
        if (!emailPattern.test(user_email)) {
          setErrorMessage("Lütfen geçerli bir email adresi giriniz.");
        }
        if (result.data.status) {
          alert("Login is successfully");
          setTimeout(function () {
            window.alert = function () {};
          }, 3000);
          navigate("/");
        } else {
          setErrorMessage(result.data.message);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="login">
      <div className="login-form">
        <h2 className="login-title">Login</h2>
        {errorMessage && (
          <div className="error-message text-center mt-2">{errorMessage}</div>
        )}
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
          <div className="mb-2 mt-3">
            <input
              type="password"
              placeholder="Password"
              autoComplete="off"
              name="password"
              className="form-control"
              value={user_password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Link
            to="/forgotPassword"
            className="d-flex justify-content-center m-2"
          >
            {" "}
            Forgot Password?
          </Link>
          <div className="d-flex justify-content-center ">
            <button type="submit" className=" w-50 button-green ">
              Login
            </button>
          </div>
        </form>

        <div className="d-flex justify-content-center mt-1">
          <p>If don't have an account?</p>
        </div>
        <div className="d-flex justify-content-center ">
          <Link to="/signup" className="btn dark-btn w-50">
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
