const mongoose = require("mongoose");

const ConcreteRoadSchema = new mongoose.Schema({
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
            // enum: ["excavator", "truck", "roller", "JCB", "freze", "greyder"] 
        },
        quantity: Number,
        price: Number,
    }],
    materials: [{
        type: {
            type: String,
            // enum: ["pmt", "cesan", "sand", "excavation"]
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
})


const ConcreteRoadModel = mongoose.model("Concrete", ConcreteRoadSchema);

module.exports = ConcreteRoadModel;
