const mongoose = require("mongoose");

const ComprehensiveSchema = new mongoose.Schema({
  equipments: [
    {
      type: {
        type: String,
      },
      quantity: Number,
      unitprice: Number,
      price: Number,
    },
  ],
  vehicles: [
    {
      type: {
        type: String,
      },
      quantity: Number,
      unitprice: Number,
      price: Number,
    },
  ],
  materials: [
    {
      type: {
        type: String,
      },
      quantity: Number,
      unitprice: Number,
      price: Number,
    },
  ],
  worker: [
    {
      type: {
        type: String,
      },
      quantity: Number,
      unitprice: Number,
      price: Number,
    },
  ],
  project_time: {
    type: Number,
  },
  total_price: {
    type: Number,
  },
  created_at: {
    type: Date,
    default: new Date(),
  },
});

const ComprehensiveModel = mongoose.model("Comprehensive", ComprehensiveSchema);

module.exports = ComprehensiveModel;
