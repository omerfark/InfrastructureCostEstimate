const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const AsphaltModel = require("../models/Asphalt.js");
const ExcelJS = require("exceljs");

router.get("/:id/export/excel", async (req, res) => {
  const projectId = req.params.id;

  try {
    const asphaltProject = await AsphaltModel.findById(projectId);

    if (!asphaltProject) {
      return res.status(404).json({ message: "Asphalt project not found" });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Asphalt Projects");

    worksheet.columns = [
      { header: "Product", key: "product", width: 15 },
      { header: "Quantity", key: "quantity", width: 10 },
      { header: "Definition", key: "definition", width: 10 },
      { header: "Unit Price (TL)", key: "unitprice", width: 15 },
      { header: "Unit Price Currency", key: "unitpriceCurrency", width: 10 },
      { header: "Price (TL)", key: "price", width: 15 },
      { header: "Currency", key: "currency", width: 10 },
    ];

    // Ekipmanları ekle
    asphaltProject.equipments.forEach((equipment) => {
      worksheet.addRow({
        product: equipment.type,
        quantity: equipment.quantity,
        definition: "piece",
        unitprice: equipment.unitprice,
        unitpriceCurrency: "TL",
        price: equipment.price,
        currency: "TL",
      });
    });

    // Araçları ekle
    asphaltProject.vehicles.forEach((vehicle) => {
      worksheet.addRow({
        product: vehicle.type,
        quantity: vehicle.quantity,
        definition: "piece",
        unitprice: vehicle.unitprice,
        unitpriceCurrency: "TL",
        price: vehicle.price,
        currency: "TL",
      });
    });

    // Malzemeleri ekle
    asphaltProject.materials.forEach((material) => {
      worksheet.addRow({
        product: material.type,
        quantity: material.quantity,
        definition: "m3",
        unitprice: material.unitprice,
        unitpriceCurrency: "TL",
        price: material.price,
        currency: "TL",
      });
    });

    asphaltProject.worker.forEach((worker) => {
      worksheet.addRow({
        product: worker.type,
        quantity: worker.quantity,
        definition: "people",
        unitprice: worker.unitprice,
        unitpriceCurrency: "TL",
        price: worker.price,
        currency: "TL",
      });
    });
    // Excel dosyasını oluşturun ve yanıt olarak gönderin
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "asphalt_projects.xlsx"
    );
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Excel oluşturma hatası:", err);
    res.status(500).json({ message: "Excel dosyası oluşturma hatası" });
  }
});

router.post("/create", (req, res) => {
  AsphaltModel.create(req.body)
    .then((model) => res.json(model))
    .catch((err) => res.json(err));
});

router.get("/:id", async (req, res) => {
  const projectId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ error: "Invalid projectId" });
  }
  try {
    const asphaltProject = await AsphaltModel.findById(projectId);

    res.json(asphaltProject);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
