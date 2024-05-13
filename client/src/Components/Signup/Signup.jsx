import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css"; // Signup.css dosyasını içeri aktar

function Signup() {
  const [user_name, setName] = useState();
  const [user_surname, setSurname] = useState();
  const [user_email, setEmail] = useState();
  const [user_tel, setTel] = useState();
  const [user_password, setPassword] = useState();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !user_name ||
      !user_surname ||
      !user_email ||
      !user_tel ||
      !user_password
    ) {
      alert("Lütfen tüm alanları doldurunuz.");
      return;
    }

    const emailPattern = /\S+@\S+\.\S+/; // Email adress control
    if (!emailPattern.test(user_email)) {
      alert("Lütfen geçerli bir email adresi giriniz.");
      return;
    }

    const phonePattern = /^[0-9]{10}$/; //telephone number control
    if (!phonePattern.test(user_tel)) {
      alert("Lütfen geçerli bir telefon numarası giriniz.");
      return;
    }

    axios.post("http://localhost:3000/auth/signup", {
      user_name,
      user_surname,
      user_email,
      user_tel,
      user_password,
    })
    .then((result) => {
      alert("kayıt tamamlandı");
      console.log(result);
      navigate("/login");
    })
    .catch((err) => {
      if (err.response && err.response.status === 400) {
        alert("email already exist");
      } else {
        console.log(err);
      }
    });
  }
  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2 className="signup-title">Signup</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Name"
              autoComplete="off"
              name="name"
              className="form-control"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Surname"
              autoComplete="off"
              name="surname"
              className="form-control"
              onChange={(e) => setSurname(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Email"
              autoComplete="off"
              name="email"
              className="form-control"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Number"
              autoComplete="off"
              name="number"
              className="form-control"
              onChange={(e) => setTel(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              autoComplete="off"
              name="email"
              className="form-control"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-center mt-2">
            <button type="submit" className="button-green w-50">
            Signup
            </button>
          </div>
        </form>
        <div className="d-flex justify-content-center ">
          <p>Do you have an account ?</p>
        </div>

        <div className="d-flex justify-content-center ">
          <Link to="/login" className="btn dark-btn w-50">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
