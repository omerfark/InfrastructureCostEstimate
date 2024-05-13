// {
//     "excavation_length": 1000,
//     "excavation_width": 0.8,
//     "excavation_depth": 2
//   }

const mongoose = require("mongoose");

const ExcavationSchema = new mongoose.Schema({
  excavation_length: {
    type: Number,
    required: true,
  },
  excavation_width: {
    type: Number,
    required: true,
  },
  excavation_depth: {
    type: Number,
    required: true,
  },
  excavation_volume: {
    type: Number,
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

ExcavationSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

const Excavation = mongoose.model("excavation", ExcavationSchema);
module.exports = Excavation;
