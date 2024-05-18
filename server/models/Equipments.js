const mongoose = require("mongoose");

const EquipmentSchema = new mongoose.Schema({
    equipment_name: {
      type: String,
      required: true,
    },
    equipment_description: {
      type: String,
      required: true
    },
    equipment_price: {
      type: Number,
      required: true,
    },
    created_at: {
      type: Date,
      default: new Date(),
    },
    active: {
      type: Boolean,
      default: true,
    },
  });
  
  
  const EquipmentModels = mongoose.model("equipment", EquipmentSchema);
  
  module.exports = EquipmentModels;
  