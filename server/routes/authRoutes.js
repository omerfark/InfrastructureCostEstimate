const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const UsersModel = require("../models/Users.js");

router.post("/signup", async (req, res) => {
  try {
    const { user_name, user_surname, user_email, user_tel, user_password } = req.body;
    
    // Kullanıcıyı veritabanında ara
    const user = await UsersModel.findOne({ user_email, user_name });

    // Kullanıcı varsa hata mesajı gönder
    if (user) {
      return res.status(400).json({ message: "Bu e-posta adresi zaten kullanılıyor." });
    }

    // Kullanıcı yoksa yeni kullanıcı oluştur
    const hashpassword = await bcrypt.hash(user_password, 10);
    const newUser = new UsersModel({
      user_name,
      user_surname,
      user_email,
      user_tel,
      user_password: hashpassword,
    });

    // Yeni kullanıcıyı kaydet
    await newUser.save();
    return res.json({ status: true, message: "Kayıt başarıyla tamamlandı." });
  } catch (error) {
    // MongoDB'den gelen hatayı yakalayarak kullanıcıya göster
    if (error.code === 11000 && error.keyValue && error.keyValue.user_email) {
      return res.status(400).json({ message: "Bu e-posta adresi zaten kullanılıyor." });
    } else {
      return res.status(500).json({ message: "Bir hata oluştu, lütfen tekrar deneyin." });
    }
  }
});

router.post("/login", async (req, res) => {
  const { user_email, user_password } = req.body;
  const user = await UsersModel.findOne({ user_email });
  if (!user) {
    return res.json({ message: "User is not registered" });
  }

  const validPassword = await bcrypt.compare(user_password, user.user_password);
  if (!validPassword) {
    return res.json({ message: "Password is incorrect" });
  }

  const token = jwt.sign({ userId: user._id }, "jwttokenkey", {
    expiresIn: "1h",
  }); //user should login again then 1 hour

  res.cookie("token", token, { httpOnly: true, maxAge: 600000 });//

  return res.json({ status: true, message: "login successfully"});
});

router.post("/forgot-password", async (req, res) => {
  const { user_email } = req.body;
  try {
    const user = UsersModel.findOne({ user_email });
    if (!user) {
      return res.json({ message: " user not registered" });
    }

    const token = jwt.sign({ id: user._id }, "jwttokenkey", {
      expiresIn: "15m",
    });
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "test.omer1212@gmail.com",
        pass: "ojer rwzt cyfl dwze",
      },
    });

    var mailOptions = {
      from: "test.omer1212@gmail.com",
      to: user_email,
      subject: "Reset Password",
      text: `http://localhost:5173/resetPassword/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.json({ status: true, message: "error sending email" });
      } else {
        return res.json({ status: true, message: "email sent" });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { user_password } = req.body;

  try {
    const decoded = await jwt.verify(token, "jwttokenkey");
    const id = decoded.id;
    const hashpassword = await bcrypt.hash(user_password, 10);

    await UsersModel.findByIdAndUpdate(id, { user_password: hashpassword }); //password güncellenmiyor
    return res.json({ status: true, message: "updated password" }); //password güncellenmiyor
  } catch (err) {
    console.log(err);
    return res.json("invalid token");
  }
});

const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ status: false, message: "no token" });
    }
    const decoded = await jwt.verify(token, "jwttokenkey");
    next();
  } catch (err) {
    return res.json(err);
  }
};

router.get("/verify", verifyUser,async (req, res) => {
  const sbtToken= req.cookies.token;
  const decoded = await jwt.verify(sbtToken, "jwttokenkey");
  return res.json({status: true, message: "authorized", token: decoded})
});


router.get('/logout', (req, res)=>{
  res.clearCookie('token')
  return res.json({status: true})
})



//#region 

//#endregion

module.exports = router;
