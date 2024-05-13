const express = require('express');
const router = express.Router();
const TeamsModel = require('../models/Teams.js');


//team name e göre getirme

router.get("/",async(req,res) =>{
    const {team_name} = req.body;

    try{
        const team1 = await TeamsModel.findOne({});

        if(!team1){
            return res.status(400).json({error: "Team not found"});
        }
        res.json(team1)
    }catch (err){
        console.log(err)

    }
})


router.get("/all", (req, res) => {
    TeamsModel.find({})
      .then((team) => res.json(team))
      .catch((err) => res.json(err));
  });

module.exports = router;
