const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const ProjectModel = require('../models/Project.js');
const AsphaltModel = require('../models/Asphalt.js');




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
  
    // Projenin güncellenme 
    updatedProject.updated_at = new Date();
  
    ProjectModel.findOneAndUpdate({ _id: projectId }, updatedProject, {
      new: true,
    })
      .then((project) => res.json(project))
      .catch((err) => res.json(err));
  });
  
//#region about asphalt 
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

        if (project.asphalt_projects.includes(asphalt_projects)) {
          return res.status(400).json({ message: "Bu asfalt projesi zaten projeye eklenmiş" });
      } else {
          project.asphalt_projects.push(asphalt_projects);
          await project.save();
          res.status(200).json({ message: "Yeni asfalt projesi başarıyla eklendi" });
      }
        
    } catch (error) {
        console.error("Hata:", error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
});


router.delete('/:id/asphalt/:asphaltId', async (req, res) => {
  try {
      const userId = req.params.id; // Proje kimliğini alın
      const asphaltId  = req.params.asphaltId; // Yeni asfalt projesi kimliğini alın

      // Proje belgesini bulun
      const project = await ProjectModel.findOne({user_id : userId});

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
//#endregion

//#region about Concrete Road
//Concrete projesi ekleme
router.patch('/:id/concreteRoad', async (req, res) => {
  try {
      const user_id = req.params.id; // Proje kimliğini alın
      const concreteroad_projects = req.body.concreteroad_projects; // Yeni asfalt projesi kimliğini alın

      // Proje belgesini bulun
      const project = await ProjectModel.findOne({user_id});

      // Eğer proje bulunamazsa, uygun bir hata mesajı döndürün
      if (!project) {
          return res.status(404).json({ message: "Proje bulunamadı" });
      }

      if (project.concreteroad_projects.includes(concreteroad_projects)) {
        return res.status(400).json({ message: "Bu Beton yol projesi zaten projeye eklenmiş" });
    } else {
        project.concreteroad_projects.push(concreteroad_projects);
        await project.save();
        res.status(200).json({ message: "Yeni Beton yol projesi başarıyla eklendi" });
    }
      
  } catch (error) {
      console.error("Hata:", error);
      res.status(500).json({ message: "Sunucu hatası" });
  }
});

// Concrete projesi silme
router.delete('/:id/concreteRoad/:concreteRoadId', async (req, res) => {
try {
    const userId = req.params.id; // Proje kimliğini alın
    const concreteRoadId  = req.params.concreteRoadId; // Yeni asfalt projesi kimliğini alın

    // Proje belgesini bulun
    const project = await ProjectModel.findOne({user_id: userId});

    // Eğer proje bulunamazsa, uygun bir hata mesajı döndürün
    if (!project) {
        return res.status(404).json({ message: "Proje bulunamadı" });
    }

    // Asfalt projesini projeye ekleyin
    project.concreteroad_projects.pull(concreteRoadId );
    await project.save();

    res.status(200).json({ message: "Beton yol projesi başarıyla silindi" });
} catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ message: "Sunucu hatası" });
}
});
//#endregion

//#region about Electric
//Electric projesi ekleme
router.patch('/:id/electric', async (req, res) => {
  try {
      const user_id = req.params.id; // Proje kimliğini alın
      const electric_projects = req.body.electric_projects; // Yeni asfalt projesi kimliğini alın

      if (electric_projects == null) {
        return res.status(400).json({ message: "Geçersiz elektrik projesi verisi" });
    }

      // Proje belgesini bulun
      const project = await ProjectModel.findOne({user_id});

      // Eğer proje bulunamazsa, uygun bir hata mesajı döndürün
      if (!project) {
          return res.status(404).json({ message: "Proje bulunamadı" });
      }

      if (project.electric_projects.includes(electric_projects)) {
        return res.status(400).json({ message: "Bu elektrik projesi zaten projeye eklenmiş" });
    } else {
        project.electric_projects.push(electric_projects);
        await project.save();
        res.status(200).json({ message: "Yeni elektrik projesi başarıyla eklendi" });
    }
      
  } catch (error) {
      console.error("Hata:", error);
      res.status(500).json({ message: "Sunucu hatası" });
  }
});

// Electric projesi silme
router.delete('/:id/electric/:electricId', async (req, res) => {
try {
    const userId = req.params.id; // Proje kimliğini alın
    const electricId  = req.params.electricId; // Yeni asfalt projesi kimliğini alın

    // Proje belgesini bulun
    const project = await ProjectModel.findOne({user_id : userId});

    // Eğer proje bulunamazsa, uygun bir hata mesajı döndürün
    if (!project) {
        return res.status(404).json({ message: "Proje bulunamadı" });
    }

    // Asfalt projesini projeye ekleyin
    project.electric_projects.pull(electricId );
    await project.save();

    res.status(200).json({ message: "electrik projesi başarıyla silindi" });
} catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ message: "Sunucu hatası" });
}
});
//#endregion

//#region about PipeConcrete
//PipeConcrete projesi ekleme
router.patch('/:id/pipeConcrete', async (req, res) => {
  try {
      const user_id = req.params.id; // Proje kimliğini alın
      const pipeconcrete_projects = req.body.pipeconcrete_projects; // Yeni asfalt projesi kimliğini alın

      if (pipeconcrete_projects == null) {
        return res.status(400).json({ message: "Geçersiz pipeconcrete projesi verisi" });
    }

      // Proje belgesini bulun
      const project = await ProjectModel.findOne({user_id});

      // Eğer proje bulunamazsa, uygun bir hata mesajı döndürün
      if (!project) {
          return res.status(404).json({ message: "Proje bulunamadı" });
      }

      if (project.pipeconcrete_projects.includes(pipeconcrete_projects)) {
        return res.status(400).json({ message: "Bu pipeconcrete projesi zaten projeye eklenmiş" });
    } else {
        project.pipeconcrete_projects.push(pipeconcrete_projects);
        await project.save();
        res.status(200).json({ message: "Yeni pipeconcrete projesi başarıyla eklendi" });
    }
      
  } catch (error) {
      console.error("Hata:", error);
      res.status(500).json({ message: "Sunucu hatası" });
  }
});

// PipeConcrete projesi silme
router.delete('/:id/pipeConcrete/:pipeConcreteId', async (req, res) => {
try {
    const userId = req.params.id; // Proje kimliğini alın
    const pipeConcreteId  = req.params.pipeConcreteId; // Yeni asfalt projesi kimliğini alın

    // Proje belgesini bulun
    const project = await ProjectModel.findOne({user_id : userId});

    // Eğer proje bulunamazsa, uygun bir hata mesajı döndürün
    if (!project) {
        return res.status(404).json({ message: "Proje bulunamadı" });
    }

    // PipeConcrete  projesini projeden silin
    project.pipeconcrete_projects.pull(pipeConcreteId );
    await project.save();

    res.status(200).json({ message: "PipeConcrete projesi başarıyla silindi" });
} catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ message: "Sunucu hatası" });
}
});
//#endregion


  router.get("/", async(req,res) =>{
    const {user_id} = req.query;
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ error: "Invalid user_id" });
    }
    try{
      const userId= await ProjectModel.find({user_id: user_id})
  
      if (userId.length === 0) {
        return res.json({ error: "User not found" ,status: 404 });
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
