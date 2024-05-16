const mongoose = require("mongoose");

const ElectricSchema = new mongoose.Schema({
    equipments: [{
        type: {
            type: String,
        },
        quantity: Number,
        price:Number
    }],
    vehicles: [{ 
        type: {
            type: String,
            // enum: ["excavator", "truck", "finisher", "roller", "JCB", "freze", "greyder"] 
        },
        quantity: Number,
        price: Number,
    }],
    materials: [{
        type: {
            type: String,
            // enum: ["pmt", "asphalt_1", "asphalt_2", "sand", "excavation"]
        },
        quantity: Number,
        price:Number
    }], 
    worker: [{
        type:{
            type:String,
            // enum:["Worker"]
        },
        quantity: Number,
        price: Number
    }],
    project_time:{
        type: Number
    },
    created_at: {
        type: Date,
        default: new Date(),
      }

});

const ElectricModel = mongoose.model("Electric", ElectricSchema);

module.exports = ElectricModel;
