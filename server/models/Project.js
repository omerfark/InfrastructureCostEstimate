const mongoose = require("mongoose");

const Asphalt = require("./Asphalt")
const concreteRoad = require("./ConcreteRoad")
const electric = require("./Electric")
const pipeConcrete = require("./Electric")
const comprehensive = require("./Comprehensive")

const ProjectSchema = new mongoose.Schema({
  asphalt_projects: [{type: mongoose.Schema.Types.ObjectId,ref: "Asphalt"}],
  concreteroad_projects: [{type: mongoose.Schema.Types.ObjectId,ref: "concreteRoad"}],
  pipeconcrete_projects: [{type: mongoose.Schema.Types.ObjectId,ref: "pipeConcrete"}],
  comprehensive_projects: [{type: mongoose.Schema.Types.ObjectId,ref: "comprehensive"}],
  electric_projects: [{type: mongoose.Schema.Types.ObjectId,ref: "electric"}],
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
