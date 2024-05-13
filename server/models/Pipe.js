const mongoose = require("mongoose");

// Şema tanımı
const PipeSchema = new mongoose.Schema({
  pipe_type: {
    type: String,
    required: true,
  },
  pipe_length: {
    type: Number,
    required: true,
  },
  pipe_diameter: {
    type: Number,
    required: true,
  },
  pipe_price: {
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

PipeSchema.pre('save', function(next) {
    this.updated_at = new Date();
    next();
  });

// Model oluşturma
const PipeModel = mongoose.model("Pipe", PipeSchema);

module.exports = PipeModel;
