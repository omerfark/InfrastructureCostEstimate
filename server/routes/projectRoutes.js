const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const ProjectModel = require('../models/Project.js');

//project proje ekleme
router.post("/", (req, res) => {
    ProjectModel.create(req.body)
      .then((project) => res.json(project))
      .catch((err) => res.json(err));
  });
  
  
  //project update
  router.put("/:id", (req, res) => {
    const projectId = req.params.id;
    const updatedProject = req.body;
  
    // Projenin güncellenme tarihini ekleyelim
    updatedProject.updated_at = new Date();
  
    ProjectModel.findOneAndUpdate({ _id: projectId }, updatedProject, {
      new: true,
    })
      .then((project) => res.json(project))
      .catch((err) => res.json(err));
  });

  //project id ye göre getirme
  router.get("/:id", (req, res) => {
    const projectId = req.params.id;
  
    ProjectModel.findOne({ _id: projectId })
      .then((project) => {
        if (!project) {
          return res.status(404).json({ message: "Proje bulunamadı" });
        }
        res.json(project);
      })
      .catch((err) =>
        res.status(500).json({ message: "Sunucu hatası", error: err })
      );
  });
  
  
  router.get("/", async(req,res) =>{
    const {user_id} = req.query;
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ error: "Invalid user_id" });
    }
    try{
      const userId= await ProjectModel.find({user_id: user_id})
  
      if(!userId){
        return res.status(404).json({ error: "user not found" });
      }
      res.json(userId);
  
    }catch(err){
      console.log(err)
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  router.get("/all", (req, res) => {
    ProjectModel.find({})
      .then((project) => res.json(project))
      .catch((err) => res.json(err));
  });

  
module.exports = router;
