const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const AsphaltModel = require('../models/Asphalt.js');
const ExcelJS = require('exceljs');

//#region dnme
// router.get("/:id/export/excel", async (req, res) => {
//     const projectId = req.params.id;

//     try {
//         const asphaltProject = await AsphaltModel.findById(projectId);

//         if (!asphaltProject) {
//             return res.status(404).json({ message: "Asphalt project not found" });
//         }

//         const workbook = new ExcelJS.Workbook();
//         const worksheet = workbook.addWorksheet('Asphalt Projects');

//         // Sütunları tanımlayın
//         worksheet.columns = [
//             { header: 'Equipment Type', key: 'equipmentType', width: 20 },
//             { header: 'Equipment Quantity', key: 'equipmentQuantity', width: 15 },
//             { header: 'Equipment Price', key: 'equipmentPrice', width: 15 },
//             { header: 'Vehicle Type', key: 'vehicleType', width: 20 },
//             { header: 'Vehicle Quantity', key: 'vehicleQuantity', width: 15 },
//             { header: 'Vehicle Price', key: 'vehiclePrice', width: 15 },
//             { header: 'Material Type', key: 'materialType', width: 20 },
//             { header: 'Material Quantity', key: 'materialQuantity', width: 15 },
//             { header: 'Material Price', key: 'materialPrice', width: 15 },
//             // Diğer sütunlar buraya eklenebilir...
//         ];

//         // Verileri ekleyin
//         asphaltProject.equipments.forEach(equipment => {
//             worksheet.addRow({
//                 equipmentType: equipment.type,
//                 equipmentQuantity: equipment.quantity,
//                 equipmentPrice: equipment.price,
//                 vehicleType: '', // Veri yoksa boş bırakabilirsiniz
//                 vehicleQuantity: '',
//                 vehiclePrice: '',
//                 materialType: '',
//                 materialQuantity: '',
//                 materialPrice: '',
//                 // Diğer sütunlara da gerekli verileri ekleyin...
//             });
//         });
//         asphaltProject.vehicles.forEach(vehicle => {
//             worksheet.addRow({
//                 equipmentType: '',
//                 equipmentQuantity: '',
//                 equipmentPrice: '',
//                 vehicleType: vehicle.type,
//                 vehicleQuantity: vehicle.quantity,
//                 vehiclePrice: vehicle.price,
//                 materialType: '',
//                 materialQuantity: '',
//                 materialPrice: '',
//                 // Diğer sütunlara da gerekli verileri ekleyin...
//             });
//         });
//         asphaltProject.materials.forEach(material => {
//             worksheet.addRow({
//                 equipmentType: '',
//                 equipmentQuantity: '',
//                 equipmentPrice: '',
//                 vehicleType: '',
//                 vehicleQuantity: '',
//                 vehiclePrice: '',
//                 materialType: material.type,
//                 materialQuantity: material.quantity,
//                 materialPrice: material.price,
//                 // Diğer sütunlara da gerekli verileri ekleyin...
//             });
//         });
//         // Diğer veri tipleri ve sütunlar için gerekli kodları ekleyin...

//         // Excel dosyasını oluşturun ve yanıt olarak gönderin
//         res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//         res.setHeader('Content-Disposition', 'attachment; filename=' + 'asphalt_projects.xlsx');
//         await workbook.xlsx.write(res);
//         res.end();

//     } catch (err) {
//         console.error('Excel oluşturma hatası:', err);
//         res.status(500).json({ message: "Excel dosyası oluşturma hatası" });
//     }
// });
//#endregion


router.get("/:id/export/excel", async (req, res) => {
  const projectId = req.params.id;

  try {
      const asphaltProject = await AsphaltModel.findById(projectId);

      if (!asphaltProject) {
          return res.status(404).json({ message: "Asphalt project not found" });
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Asphalt Projects');

      // Sütunu tanımlayın
      worksheet.columns = [
          { header: 'Product', key: 'product', width: 20 },
          { header: 'Quantity', key: 'quantity', width: 15 },
          { header: 'Definition', key: 'definition', width: 15 },
          { header: 'Price (TL)', key: 'price', width: 15 },
          { header: 'Currency', key: 'currency', width: 15 } // TL ifadesini buraya ekleyin
      ];

      // Ekipmanları ekle
      asphaltProject.equipments.forEach(equipment => {
          worksheet.addRow({
              product: equipment.type,
              quantity: equipment.quantity,
              definition: "adet",
              price: equipment.price,
              currency: 'TL' // TL ifadesini ekleyin
          });
      });

      // Araçları ekle
      asphaltProject.vehicles.forEach(vehicle => {
          worksheet.addRow({
              product: vehicle.type,
              quantity: vehicle.quantity,
              definition: "adet",
              price: vehicle.price,
              currency: 'TL' // TL ifadesini ekleyin
          });
      });

      // Malzemeleri ekle
      asphaltProject.materials.forEach(material => {
          worksheet.addRow({
              product: material.type,
              quantity: material.quantity, 
              definition: "m3",
              price: material.price,
              currency: 'TL' // TL ifadesini ekleyin
          });
      });

      asphaltProject.worker.forEach(worker => {
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
      res.setHeader('Content-Disposition', 'attachment; filename=' + 'asphalt_projects.xlsx');
      await workbook.xlsx.write(res);
      res.end();

  } catch (err) {
      console.error('Excel oluşturma hatası:', err);
      res.status(500).json({ message: "Excel dosyası oluşturma hatası" });
  }
});


router.post("/create", (req, res) => {
    AsphaltModel.create(req.body)
      .then((model) => res.json(model))
      .catch((err) => res.json(err));
  });


  router.get("/:id", async(req,res) =>{
    const projectId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({ error: "Invalid projectId" });
      }
    try{
        const asphaltProject = await AsphaltModel.findById(projectId)

        res.json(asphaltProject);
        
    }catch(err){
        console.log(err)
    }
  });

module.exports = router;
