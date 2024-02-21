import React, { useEffect } from 'react';
import { Box } from '@mui/material'
import "./style.css"

//import ReferCover from "../../Assets/images/refferCover.png";

//component
import NavBar from '../NavBar';
import Footer from '../Footer';


export default function Referral() {
  
  
  useEffect(() => {
    // Track page referral

    if(window.friendbuyAPI.merchantId){
      
      //window.friendbuyAPI.push(["track","page","Referral"]);
      window.friendbuyAPI.push(["track","page",{ name:"Referral"}]);
      console.log("Call1=>",window.friendbuyAPI, window.friendbuyAPI.merchantId)
    }
    
  }, []);


  return (
    <>
      <NavBar />
      <Box className="referralContainer">
        
        <Box className="referralCoverBox">

          <Box id="friendbuy-landingpage"></Box>
      

        </Box>


      </Box>
      
      <Footer />

    </>
  )
}
