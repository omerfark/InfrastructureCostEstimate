const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const PipeConcreteModel = require('../models/PipeConcrete.js');
const ExcelJS = require('exceljs');


router.get("/:id/export/excel", async (req, res) => {
  const projectId = req.params.id;

  try {
      const pipeconcreteProject = await PipeConcreteModel.findById(projectId);

      if (!pipeconcreteProject) {
          return res.status(404).json({ message: "Pipe Concrete project not found" });
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Pipe Concrete  Projects');

      // Sütunu tanımlayın
      worksheet.columns = [
          { header: 'Product', key: 'product', width: 20 },
          { header: 'Quantity', key: 'quantity', width: 15 },
          { header: 'Definition', key: 'definition', width: 15 },
          { header: 'Price (TL)', key: 'price', width: 15 },
          { header: 'Currency', key: 'currency', width: 15 } // TL ifadesini buraya ekleyin
      ];

      // Ekipmanları ekle
      pipeconcreteProject.equipments.forEach(equipment => {
          worksheet.addRow({
              product: equipment.type,
              quantity: equipment.quantity,
              definition: "adet",
              price: equipment.price,
              currency: 'TL' // TL ifadesini ekleyin
          });
      });

      // Araçları ekle
      pipeconcreteProject.vehicles.forEach(vehicle => {
          worksheet.addRow({
              product: vehicle.type,
              quantity: vehicle.quantity,
              definition: "adet",
              price: vehicle.price,
              currency: 'TL' // TL ifadesini ekleyin
          });
      });

      // Malzemeleri ekle
      pipeconcreteProject.materials.forEach(material => {
          worksheet.addRow({
              product: material.type,
              quantity: material.quantity, 
              definition: "m3",
              price: material.price,
              currency: 'TL' // TL ifadesini ekleyin
          });
      });

      pipeconcreteProject.worker.forEach(worker => {
        worksheet.addRow({
            product: worker.type,
            quantity:worker.quantity,
            definition: "adet",
            price: worker.price,
            currency: 'TL'
        });
    });
      // Excel dosyasını oluşturun ve yanıt olarak gönderin
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=' + 'pipeConcrete_Project.xlsx');
      await workbook.xlsx.write(res);
      res.end();

  } catch (err) {
      console.error('Excel oluşturma hatası:', err);
      res.status(500).json({ message: "Excel dosyası oluşturma hatası" });
  }
});


router.post("/create", (req, res) => {
    PipeConcreteModel.create(req.body)
      .then((model) => res.json(model))
      .catch((err) => res.json(err));
  });


  router.get("/:id", async(req,res) =>{
    const projectId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({ error: "Invalid projectId" });
      }
    try{
        const pipeconcreteProject = await PipeConcreteModel.findById(projectId)

        res.json(pipeconcreteProject);
        
    }catch(err){
        console.log(err)
    }
  });

module.exports = router;
