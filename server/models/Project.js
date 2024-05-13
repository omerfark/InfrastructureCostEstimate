const mongoose = require("mongoose");

const Material = require("./Materials"); // Material modelini içe aktar
const Vehicles = require("./Vehicles");
const Teams = require("./Teams");
const Users = require("./Users");

const ProjectSchema = new mongoose.Schema({
  project_name: {
    type: String,
    required: true,
  },
  project_description: {
    type: String,
    required: true,
  },
  project_type: {
    type: Number,
    required: true,
  },
  project_requirements: {
    materials: [{ type: String  },{type:Number}], // Malzemeler için referanslar ref: "materials"
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "teams" }],
    vehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: "vehicles" }],
    excavation: [{
      excavation_length: {type: Number,required: true,},
      excavation_width: {type: Number,required: true,},
      excavation_depth: {type: Number,required: true,},
      excavation_volume: {type: Number,required: true,}
    }]
  },
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
