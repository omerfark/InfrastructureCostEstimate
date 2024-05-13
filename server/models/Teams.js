const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  team_name: {
    type: String,
    required: true,
  },
  team_number: {
    type: Number,
    required: true,
  },
  team_description: {
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

TeamSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

const TeamsModel = mongoose.model("Team", TeamSchema);

module.exports = TeamsModel;
