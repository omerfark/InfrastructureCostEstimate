const mongoose = require("mongoose");

const WorkerSchema = new mongoose.Schema({
  worker_number: {
    type: Number,
    required: true,
  },
  worker_name: {
    type: String,
    required: true,
  },
  worker_price: {
    type: Number,
    required: true,
    default:0
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

WorkerSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

const WorkersModel = mongoose.model("Worker", WorkerSchema);

module.exports = WorkersModel;
