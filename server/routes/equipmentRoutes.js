const express = require('express');
const router = express.Router();
const EquipmentModels = require('../models/Equipments.js');

router.post("/create", (req,res) =>{
    EquipmentModels.create(req.body)
    .then((equipment) =>res.json(equipment))
    .catch((err) => res.json(err));
})

router.get("/all", (req, res) => {
    EquipmentModels.find({})
    .then((equipment) => res.json(equipment))
    .catch((err) => res.json(err));
});

router.get("/", async (req, res) => {
    const { equipment_name } = req.query;
  
    try {
      const equipment = await EquipmentModels.findOne({ equipment_name });
  
      if (!equipment) {
        return res.status(404).json({ error: "Equipment not found" });
      }
  
      res.json(equipment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  
router.get("/:id", async(req, res) => {
    const equipment_id = req.params.id;
    try{
      const equipment = await EquipmentModels.findById(equipment_id);
      if(!equipment){
        return res.json({message: "Equipment not found"});
      }
      res.json(equipment)
    }catch(err){
      console.log(err)
      res.json({ error: "Internal server error  --> /equipment/:id" })
  
    }
  });


module.exports = router;
