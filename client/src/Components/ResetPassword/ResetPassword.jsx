import { useState } from "react";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const [user_password, setPassword] = useState("");
  const [notification, setNotification] = useState(""); // Bildirim mesajı için state
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post("http://localhost:3000/auth/reset-password/" + token, {
      user_password,
    })
      .then((result) => {
        if (result.data.status) {
          setNotification("Password has been successfully changed."); // Başarılı mesajı
          setTimeout(() => {
            navigate("/login");
          }, 2000); // 2 saniye sonra login sayfasına yönlendir
        } else {
          setNotification("Failed to reset password. Please try again."); // Hata mesajı
        }
        console.log(result.data);
      })
      .catch((err) => {
        setNotification("An error occurred. Please try again."); // Hata mesajı
        console.log(err);
      });
  };

  return (
    <div className="login">
      <div className="login-form">
        <h2 className="login-title">Reset Password</h2>
        {notification && <p>{notification}</p>} {/* Bildirim mesajı */}
        <form onSubmit={handleSubmit}>
          <div>
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
          <div className="d-flex justify-content-center ">
            <button type="submit" className=" w-50 button-green mt-4">
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
