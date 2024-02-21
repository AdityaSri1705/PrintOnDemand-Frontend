import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { Typography, Box } from '@mui/material';
import "./DailySinglePage/style.css";

//Component 
import NavBar from '../NavBar';
import Footer from '../Footer';
import PriceBox from '../../Components/PriceBox';
// pages
import WeeklyView from "./WeeklyView";
import DailySinglePage from "./DailySinglePage";
import DailyTwoPage from "./DailyTwoPage";
import Calender from "./Calendars";

export default function Layout() {
  const location = useLocation();
  const hashValue = location.hash.replace("#","");

  const [tab, setTab] = useState("");
  const [priceBox, setPriceBox] = useState(1);
  const [menuPopInfo, setMenuPopInfo] = useState(true);
  
  useEffect(() => {
    var defaultParameters = "DailySinglePage";
    
  var sessionData = JSON.parse(sessionStorage.getItem("Layout")); 

    if(sessionData!==null){
      if(sessionData.hasOwnProperty('DailySinglePage')){
        setTab("DailySinglePage");
        
      }
      if(sessionData.hasOwnProperty('DailyTwoPage')){
        setTab("DailyTwoPage");
      }

      if(sessionData.hasOwnProperty('WeeklyView')){
        setTab("WeeklyView");
      }
      if(hashValue!=""){
        setTab(hashValue);
      }
    }else{
      setTab(defaultParameters);
      if(hashValue!=""){
        setTab(hashValue);
      }
    }
    

  },[]);

  const handleTab =(tabname)=>{
    setTab(tabname);
  }

  const handlePricebox =()=>{
    setPriceBox(priceBox+1);
  }

  const handleNextUrl = (tab) =>{
    if(tab=="Calendars"){
      handleTab('Calendars')
    }
    
  }

  return (
    <>
      <NavBar setNextBtnUrl={handleNextUrl}/>
      <Box className="PageContainer">
        <Box className="SubNav">
          <Box className="CnavItem">
            <Typography className={tab === "WeeklyView" ? "navFont" : null} onClick={() => handleTab("WeeklyView")}>Weekly View</Typography>
          </Box>
          <Box className="CnavItem">
            <Typography className={tab === "DailySinglePage" ? "navFont" : null} onClick={() => handleTab("DailySinglePage")}>Daily Single Page</Typography>
          </Box>
          <Box className="CnavItem">
            <Typography className={tab === "DailyTwoPage" ? "navFont" : null} onClick={() => handleTab("DailyTwoPage")}>Daily - Two Page</Typography>
          </Box>
          <Box className="CnavItem">
            <Typography className={tab === "Calendars" ? "navFont" : null} onClick={() => handleTab("Calendars")}>Calendars</Typography>
          </Box>
          <Box className={menuPopInfo? 'PopInfo arrow-top open':'PopInfo'}>
            <Box className="PopInfo-wrapper">
              <Typography className="PopInfoClose" onClick={()=>setMenuPopInfo(false)}>X</Typography>
              <Typography className="PopInfoText">
                <span>Three Layout Options</span>
                Would you like a weekly view calendar, daily one page calendar, or daily two-page calendar? Use the submenu above to explore the three layout options.
              </Typography>
              <Typography className="PopInfoText">
                <span>Customize Your Layout</span>
                Select your layout option, and then use the design bar on the left to modify and customize it to your liking (e.g., select no times, earlier or later times, different “to do” list options, etc.).
              </Typography>
              <Typography className="PopInfoText">
                <span>Select Monthly and Yearly Calendars</span>
                After you select your layout and hit “next,” you can add monthly and year-at-a-glance calendars in the “Calendar” page.
              </Typography>
              <Typography className="PopInfoText">Live rad and have fun! 🤓</Typography>
            </Box>
          </Box>
        </Box>
        <Box className="PageBox">
          {tab === "Calendars" ? <Calender updatePriceBox={handlePricebox}/> : null}
          {tab === "WeeklyView" ? <WeeklyView updatePriceBox={handlePricebox} /> : null}
          {tab === "DailySinglePage" ? <DailySinglePage updatePriceBox={handlePricebox} /> : null}
          {tab === "DailyTwoPage" ? <DailyTwoPage updatePriceBox={handlePricebox} /> : null}
        </Box>
        <PriceBox buttonText="Next" Xval='480' Yval='280' updatePriceBox={priceBox}  nextUrl={handleNextUrl}/> 
      </Box>
      <Footer />
    </>
  )
}
