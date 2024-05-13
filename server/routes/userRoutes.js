const express = require('express');
const router = express.Router();
const UsersModel = require("../models/Users.js");

router.get("/:id", async(req,res) =>{
    const user_id = req.params.id;
    try{
      const user = await UsersModel.findById(user_id);
      if(!user){
        return res.json({message: "User not found"});
      }
      res.json(user);
    
    }catch(err){
      console.log(err)
      res.status(500).json({ error: "Internal server error" });
    }
  });


module.exports = router;
