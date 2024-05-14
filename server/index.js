const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require('./routes/userRoutes.js');
const excavationRoutes = require('./routes/excavationRoutes.js');
const materialsRoutes = require('./routes/materialsRoutes.js');
const projectRoutes = require('./routes/projectRoutes.js');
const vehicleRoutes = require('./routes/vehicleRoutes.js');
const workerRoutes = require('./routes/workerRoutes.js')

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/excavations", excavationRoutes);
app.use("/materials", materialsRoutes);
app.use("/project", projectRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/worker", workerRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/infracost_est")
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
    console.log("Connection failed -->" + err);
  });

app.listen(3000, () => {
  console.log("server is running");
});
