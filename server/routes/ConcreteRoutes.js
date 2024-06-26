const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const ConcreteRoadModel = require('../models/ConcreteRoad.js');
const ExcelJS = require('exceljs');


router.get("/:id/export/excel", async (req, res) => {
  const projectId = req.params.id;

  try {
      const concreteRoadProject = await ConcreteRoadModel.findById(projectId);

      if (!concreteRoadProject) {
          return res.status(404).json({ message: "Concrete Road project not found" });
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Concrete Road Projects');

      worksheet.columns = [
        { header: 'Product', key: 'product', width: 20 },
        { header: 'Quantity', key: 'quantity', width: 15 },
        { header: 'Definition', key: 'definition', width: 15 },
        { header: 'Unit Price (TL)', key: 'unitprice', width: 15 },
        { header: 'Unit Price Currency', key: 'unitpriceCurrency', width: 20 },
        { header: 'Price (TL)', key: 'price', width: 15 },
        { header: 'Currency', key: 'currency', width: 15 } // TL ifadesini buraya ekleyin
      ];

      // Ekipmanları ekle
      concreteRoadProject.equipments.forEach(equipment => {
          worksheet.addRow({
            product: equipment.type,
            quantity: equipment.quantity,
            definition: "piece",
            unitprice: equipment.unitprice,
            unitpriceCurrency: "TL",
            price: equipment.price,
            currency: 'TL' // TL ifadesini ekleyin
          });
      });

      // Araçları ekle
      concreteRoadProject.vehicles.forEach(vehicle => {
          worksheet.addRow({
            product: vehicle.type,
            quantity: vehicle.quantity,
            definition: "piece",
            unitprice: vehicle.unitprice,
            unitpriceCurrency: "TL",
            price: vehicle.price,
            currency: 'TL' // TL ifadesini ekleyin
          });
      });

      // Malzemeleri ekle
      concreteRoadProject.materials.forEach(material => {
          worksheet.addRow({
            product: material.type,
            quantity: material.quantity, 
            definition: "m3",
            unitprice: material.unitprice,
            unitpriceCurrency: "TL",
            price: material.price,
            currency: 'TL' // TL ifadesini ekleyin
          });
      });

      concreteRoadProject.worker.forEach(worker => {
        worksheet.addRow({
            product: worker.type,
            quantity:worker.quantity,
            definition: "people",
            unitprice: worker.unitprice,
            unitpriceCurrency: "TL",
            price: worker.price,
            currency: 'TL'
        });
    });
      // Excel dosyasını oluşturun ve yanıt olarak gönderin
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=' + 'concrete_road_projects.xlsx');
      await workbook.xlsx.write(res);
      res.end();

  } catch (err) {
      console.error('Excel oluşturma hatası:', err);
      res.status(500).json({ message: "Excel dosyası oluşturma hatası" });
  }
});

router.post("/create", (req, res) => {
    ConcreteRoadModel.create(req.body)
      .then((model) => res.json(model))
      .catch((err) => res.json(err));
  });


  router.get("/:id", async(req,res) =>{
    const projectId = req.params.id;

    try{
        const concreteProject = await ConcreteRoadModel.findById(projectId)

        res.json(concreteProject);
        
    }catch(err){
        console.log(err)
    }
  });


module.exports = router;
