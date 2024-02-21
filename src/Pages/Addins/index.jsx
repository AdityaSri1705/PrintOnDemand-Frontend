import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';
import "./style.css";

//Component 
import NavBar from '../NavBar';
import Footer from '../Footer';
import PriceBox from '../../Components/PriceBox';
import PlusIcon from '../../Assets/images/plus.png';

// pages
import Reflection from "./Reflection";
import Habits from "./Habits"
import FitnessAndFood from "./FitnessAndFood"
import Work from "./Work"
import Family from "./Family"
import VisionAndGoal from "./VisionAndGoals"
import Others from "./Others"


export default function Addins() {
  const [tab, setTab] = useState("VisionAndGoal");
  const [priceBox, setPriceBox] = useState(1);
  const [menuPopInfo, setMenuPopInfo] = useState(true);


  const handlePricebox =()=>{
    setPriceBox(priceBox+1);
  }

  return (
    <>
      <NavBar />
      <Box className="PageContainer">
          <Box className="SubNav">
            <Box className="CnavItem">
              <Typography className={tab === "VisionAndGoal" ? "navFont" : null} onClick={() => setTab("VisionAndGoal")}>Vision and Goals</Typography>
            </Box>
            <Box className="CnavItem">
              <Typography className={tab === "Reflection" ? "navFont" : null} onClick={() => setTab("Reflection")}>Reflection</Typography>
            </Box>
           
            <Box className="CnavItem">
              <Typography className={tab === "Habits" ? "navFont" : null} onClick={() => setTab("Habits")}>Habits</Typography>
            </Box>
            <Box className="CnavItem">
              <Typography className={tab === "FitnessAndFood" ? "navFont" : null} onClick={() => setTab("FitnessAndFood")}>Fitness and Food</Typography>
            </Box>
            <Box className="CnavItem">
              <Typography className={tab === "Work" ? "navFont" : null} onClick={() => setTab("Work")}>Work</Typography>
            </Box>
            <Box className="CnavItem">
              <Typography className={tab === "Family" ? "navFont" : null} onClick={() => setTab("Family")}>Family</Typography>
            </Box>
            
            <Box className="CnavItem">
              <Typography className={tab === "Others" ? "navFont" : null} onClick={() => setTab("Others")}>Other</Typography>
            </Box>
            <Box className={menuPopInfo? 'PopInfo arrow-top open':'PopInfo'}>
              <Box className="PopInfo-wrapper">
                <Typography className="PopInfoClose" onClick={()=>setMenuPopInfo(false)}>X</Typography>
                <Typography className="PopInfoText">
                    <span>Add-In Options</span>
                    Don’t miss these add-in options! The submenu bar above has add-ins like habit trackers, meal planners, fitness logs, child info sheets, meeting notes, brainstorm sheets, monthly reflection pages, rituals, and so much more.
                </Typography>
                <Typography className="PopInfoText">
                    <span>How to Include Add-Ins</span>
                    See an add-in you want? Hit the <img src={PlusIcon} alt="plus icon" className="plusicon" /> icon on the top right corner of the thumbnail in the design bar. Be sure to select from the dropdown where you’d like your add-in (e.g., the front of your planner, between each week, between each month, or at the end of your planner).
                </Typography>
                <Typography className="PopInfoText">
                  We do encourage people to select a personal vision and goals page for the front of their planner, but it is your planner, and you create it how you like. You do you! 😎
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box className="PageBox">
            {tab === "Reflection" ? <Reflection  updatePriceBox={handlePricebox} /> : null}
            {tab === "Habits" ? <Habits  updatePriceBox={handlePricebox} /> : null}
            {tab === "FitnessAndFood" ? <FitnessAndFood  updatePriceBox={handlePricebox} /> : null}
            {tab === "Work" ? <Work  updatePriceBox={handlePricebox} /> : null}
            {tab === "Family" ? <Family  updatePriceBox={handlePricebox} /> : null}
            {tab === "VisionAndGoal" ? <VisionAndGoal  updatePriceBox={handlePricebox} /> : null}
            {tab === "Others" ? <Others  updatePriceBox={handlePricebox} /> : null}
          </Box>
          <PriceBox Xval="380" Yval="250" updatePriceBox={priceBox} />
        </Box>
      <Footer />
    </>
  )
}
