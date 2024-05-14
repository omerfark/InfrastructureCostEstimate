const express = require('express');
const router = express.Router();
const MaterialsModel = require('../models/Materials.js');

router.post("/create", (req,res) =>{
  MaterialsModel.create(req.body)
    .then((material) =>res.json(material))
    .catch((err) => res.json(err));
})

router.get("/all", (req, res) => {
  MaterialsModel.find({})
    .then((material) => res.json(material))
    .catch((err) => res.json(err));
});

router.get("/", async (req, res) => {
    const { material_name } = req.query;
  
    try {
      const material = await MaterialsModel.findOne({ material_name });
  
      if (!material) {
        return res.status(404).json({ error: "Material not found" });
      }
  
      res.json(material);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  
router.get("/:id", async(req, res) => {
    const materials_id = req.params.id;
    try{
      const material = await MaterialsModel.findById(materials_id);
      if(!material){
        return res.json({message: "Material not found"});
      }
      res.json(material)
    }catch(err){
      console.log(err)
      res.json({ error: "Internal server error  --> /materials/:id" })
  
    }
  });


module.exports = router;
