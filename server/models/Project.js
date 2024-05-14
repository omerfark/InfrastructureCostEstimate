const mongoose = require("mongoose");

const Asphalt = require("./Asphalt")

const ProjectSchema = new mongoose.Schema({
  asphalt_projects: [{type: mongoose.Schema.Types.ObjectId,ref: "Asphalt"}],
  // concreteroad_projects: [{type: mongoose.Schema.Types.ObjectId,ref: "teams"}],
  // sewer_projects: [{type: mongoose.Schema.Types.ObjectId,ref: "teams"}],
  // corrugated_projects: [{type: mongoose.Schema.Types.ObjectId,ref: "teams"}],
  // water_projects: [{type: mongoose.Schema.Types.ObjectId,ref: "teams"}],
  // electric_projects: [{type: mongoose.Schema.Types.ObjectId,ref: "teams"}],
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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

ProjectSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

const ProjectModel = mongoose.model("Project", ProjectSchema);

module.exports = ProjectModel;
