const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const ElectricModel = require('../models/Electric.js');
const ExcelJS = require('exceljs');

router.get("/:id/export/excel", async (req, res) => {
  const projectId = req.params.id;

  try {
      const electricProject = await ElectricModel.findById(projectId);

      if (!electricProject) {
          return res.status(404).json({ message: "Electric project not found" });
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Electric Projects');

      // Sütunu tanımlayın
      worksheet.columns = [
        { header: 'Product', key: 'product', width: 15 },
        { header: 'Quantity', key: 'quantity', width: 10 },
        { header: 'Definition', key: 'definition', width: 10 },
        { header: 'Unit Price (TL)', key: 'unitprice', width: 15 },
        { header: 'Unit Price Currency', key: 'unitpriceCurrency', width: 10 },
        { header: 'Price (TL)', key: 'price', width: 15 },
        { header: 'Currency', key: 'currency', width: 10 } 
      ];

      // Ekipmanları ekle
      electricProject.equipments.forEach(equipment => {
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
      electricProject.vehicles.forEach(vehicle => {
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
      electricProject.materials.forEach(material => {
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

      electricProject.worker.forEach(worker => {
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
      res.setHeader('Content-Disposition', 'attachment; filename=' + 'electric_projects.xlsx');
      await workbook.xlsx.write(res);
      res.end();

  } catch (err) {
      console.error('Excel oluşturma hatası:', err);
      res.status(500).json({ message: "Excel dosyası oluşturma hatası" });
  }
});


router.post("/create", (req, res) => {
    ElectricModel.create(req.body)
      .then((model) => res.json(model))
      .catch((err) => res.json(err));
  });


  router.get("/:id", async(req,res) =>{
    const projectId = req.params.id;

    try{
        const electricProject = await ElectricModel.findById(projectId)

        res.json(electricProject);
        
    }catch(err){
        console.log(err)
    }
  });

module.exports = router;
