const express = require('express');
const router = express.Router();
const VehiclesModel = require("../models/Vehicles.js");

//tüm araçalrı göster
router.get("/all", (req, res) => {
    VehiclesModel.find({})
      .then((vehicle) => res.json(vehicle))
      .catch((err) => res.json(err));
  });

//type göre getirme
router.get("/", async(req,res)=>{
    const {vehicle_type} = req.query;

    try{
        const vehicle = await VehiclesModel.findOne({vehicle_type});

        if(!vehicle){
            return res.status(400).json({error: "vehicle not found"});
        }

        res.json(vehicle);
    }catch(err){
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

//yeni araç ekleme
router.post("/create", async(req,res)=>{
    VehiclesModel.create(req.body)
        .then((vehicle) => res.json(material))
        .catch((err) => res.json(err))
});

//update vehicle id
router.put("/update/:id", (req,res) =>{
    const vehicleId = req.params.id;
    const updatedVehicle = req.body;

    updatedVehicle.updated_at = new Date();

    VehiclesModel.findByIdAndUpdate({_id:vehicleId}, updatedVehicle,{new:true})
        .then((vehicle) => res.json(vehicle))
        .catch((err) => res.json(err));
});

module.exports = router;