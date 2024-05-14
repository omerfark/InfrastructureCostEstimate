const express = require('express');
const router = express.Router();
const WorkersModel = require('../models/Worker.js');


//team name e göre getirme

router.get("/",async(req,res) =>{
    const {worker_name} = req.body;

    try{
        const worker1 = await WorkersModel.findOne({});

        if(!worker1){
            return res.status(400).json({error: "Worker not found"});
        }
        res.json(worker1)
    }catch (err){
        console.log(err)

    }
})


router.get("/all", (req, res) => {
    WorkersModel.find({})
      .then((worker) => res.json(worker))
      .catch((err) => res.json(err));
  });

router.post("/create", async(req,res) => {
    WorkersModel.create(req.body)
        .then((worker) => res.json(worker))
        .catch((err) => res.json(err))
});

module.exports = router;
