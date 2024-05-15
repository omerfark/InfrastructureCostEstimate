const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const AsphaltModel = require('../models/Asphalt.js');

router.post("/create", (req, res) => {
    AsphaltModel.create(req.body)
      .then((model) => res.json(model))
      .catch((err) => res.json(err));
  });


  router.get("/:id", async(req,res) =>{
    const projectId = req.params.id;

    try{
        const asphaltProject = await AsphaltModel.findById(projectId)

        res.json(asphaltProject);
        
    }catch(err){
        console.log(err)
    }
  });

module.exports = router;
