const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const ProjectModel = require('../models/Project.js');
const AsphaltModel = require('../models/Asphalt.js');


router.post("/asphalt", (req, res) => {
  AsphaltModel.create(req.body)
    .then((model) => res.json(model))
    .catch((err) => res.json(err));
});

//project proje ekleme
router.post("/create", (req, res) => {
    ProjectModel.create(req.body)
      .then((project) => res.json(project))
      .catch((err) => res.json(err));
  });
  
  
  //project update
  router.patch("/:id", (req, res) => {
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
  

  //asfalt projesi ekleme
  router.patch('/:id/asphalt', async (req, res) => {
    try {
        const user_id = req.params.id; // Proje kimliğini alın
        const asphalt_projects = req.body.asphalt_projects; // Yeni asfalt projesi kimliğini alın

        // Proje belgesini bulun
        const project = await ProjectModel.findOne({user_id});

        // Eğer proje bulunamazsa, uygun bir hata mesajı döndürün
        if (!project) {
            return res.status(404).json({ message: "Proje bulunamadı" });
        }

        // Asfalt projesini projeye ekleyin
        project.asphalt_projects.push(asphalt_projects);
        await project.save();

        res.status(200).json({ message: "Yeni asfalt projesi başarıyla eklendi" });
    } catch (error) {
        console.error("Hata:", error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
});

// asfalt projesi silme
router.delete('/:id/asphalt/:asphaltId', async (req, res) => {
  try {
      const projectId = req.params.id; // Proje kimliğini alın
      const asphaltId  = req.params.asphaltId; // Yeni asfalt projesi kimliğini alın

      // Proje belgesini bulun
      const project = await ProjectModel.findById(projectId);

      // Eğer proje bulunamazsa, uygun bir hata mesajı döndürün
      if (!project) {
          return res.status(404).json({ message: "Proje bulunamadı" });
      }

      // Asfalt projesini projeye ekleyin
      project.asphalt_projects.pull(asphaltId );
      await project.save();

      res.status(200).json({ message: "Asfalt projesi başarıyla silindi" });
  } catch (error) {
      console.error("Hata:", error);
      res.status(500).json({ message: "Sunucu hatası" });
  }
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
