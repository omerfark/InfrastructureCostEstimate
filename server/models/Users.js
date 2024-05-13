const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
    unique:true
  },
  user_surname: {
    type: String,
    required: true,
  },
  user_email: {
    type: String,
    required: true,
    unique: true,
  },
  user_tel: {
    type: String,
    required: true,
  },
  user_password: {
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

UsersSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

const UsersModel = mongoose.model("user", UsersSchema);
module.exports = UsersModel;
