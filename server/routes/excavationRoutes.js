const express = require('express');
const router = express.Router();
const ExcavationModel = require('../models/Excavation.js');


// Excavation veri ekleme
router.post("/create", (req, res) => {
    ExcavationModel.create(req.body)
      .then((excavation) => res.json(excavation))
      .catch((err) => res.json(err));
  });
  
  // Tüm Excavation verilerini alma
router.get("/", (req, res) => {
    ExcavationModel.find({})
      .then((excavations) => res.json(excavations))
      .catch((err) => res.json(err));
  });

module.exports = router;
