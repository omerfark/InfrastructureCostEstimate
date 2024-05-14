// {
//     "material_name": "aggregate",
//     "material_m3": 1,
//     "material_price": 400,
//     "material_description": "type number 1"
//   }

const mongoose = require("mongoose");

const MaterialsSchema = new mongoose.Schema({
  material_name: {
    type: String,
    required: true,
  },
  material_m3: {
    type: Number,
    required: true,
    default: 0
  },
  material_m: {
    type:Number,
    required: true,
    default: 0
  },
  material_price: {
    type: Number,
    required: true,
  },
  material_description: {
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

MaterialsSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

const MaterialsModel = mongoose.model("materials", MaterialsSchema);

module.exports = MaterialsModel;
