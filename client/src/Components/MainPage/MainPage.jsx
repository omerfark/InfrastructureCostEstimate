import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Hero from "../Hero/Hero";
import Programs from "../Programs/Programs";
import Title from "../Title/Title";

function MainPage(){
    const navigate = useNavigate();
    axios.defaults.withCredentials = true; //cookie özelliği eklemek için
    
    useEffect(() => {
        axios.get("http://localhost:3000/auth/verify").then((res) => {
          if (res.data.status) {
            console.log(res.data);
            const tokenValue = res.data.token;
            console.log("token degeri : " + res.data.token);
          } else {
            navigate("/login");
          }
        });
      }, []);
      
    return(
        <div>
             <Hero/>
            <Title subTitle='Our COMPANY' title='What We Offer'/>
            <Programs/>
        </div>
    )
}

export default MainPage