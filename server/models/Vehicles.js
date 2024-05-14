const mongoose = require("mongoose");

// Şema tanımı
const VehicleSchema = new mongoose.Schema({
  vehicle_type: {
    type: String,
    required: true,
  },
  vehicle_price: {
    type: Number,
    required: true,
  },
  vehicle_definition: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: new Date(),
  },
  updated_at: {
    type: Date,
    default: new Date(),
  },
  active: {
    type: Boolean,
    default: true,
  },
});

VehicleSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

// Model oluşturma
const VehiclesModel = mongoose.model("Vehicle", VehicleSchema);

module.exports = VehiclesModel;
