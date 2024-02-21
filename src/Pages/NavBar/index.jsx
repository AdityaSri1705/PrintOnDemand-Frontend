import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import config from '../../config';
import "./style.css"

import NavHeaderImg from "../../Assets/images/BYBnewtag(white)-PLANNER.png"
import navScrollBtn from "../../Assets/images/scroll-svgrepo-com.svg"

import { ButtonPrimary } from "../../Components/Buttons"

export default function NavBar({setNextBtnUrl}) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentRoute = location.pathname;
  const hashValue = location.hash.replace("#","");



  var CoverData = JSON.parse(sessionStorage.getItem("Cover")); 
  var FirstPageData = JSON.parse(sessionStorage.getItem("FirstPage")); 
  var LayoutData = JSON.parse(sessionStorage.getItem("Layout"));
  var CalendarData = JSON.parse(sessionStorage.getItem("Calendar")); 
  var AddinsData = JSON.parse(sessionStorage.getItem("Addins")); 
  var DatesData = JSON.parse(sessionStorage.getItem("Dates")); 
  var PriceData = JSON.parse(sessionStorage.getItem("Price")); 
  var ReviewData = JSON.parse(sessionStorage.getItem("Review")); 

  const searchParams = new URLSearchParams(location.search);
  const act = searchParams.get("act");

  const BACKEND_URL = config.BACKEND_URL;
  
  const [mobileNav, setMobileNav] = useState(false)
  const [myUser,setMyUser] = useState("");
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const [nextBtnEnable,setNextBtnEnable] = useState(false);
  const [saveDiary,setSaveDiary] = useState(false);
  
  

  useEffect(()=>{
    var userSession = sessionStorage.getItem("User");
    var SaveDiaryData = sessionStorage.getItem("SaveDairy"); 
    if(userSession!=undefined ){
      userSession = JSON.parse(userSession);
      setMyUser(userSession);
      setIsLoggedIn(true);
    }

    if(act=="saveprogress"){
      saveProgressFunc()
    }

    if(SaveDiaryData!==null){
      setSaveDiary(true);
    }

  },[]);

  const handleLogin = ()=>{
    const currentUrl2 = currentRoute.replace("/",""); 
    window.location.href=`/login?redirect=${currentUrl2}`;
  }
  const handleSaveProgress = ()=>{

    if(isLoggedIn){
      saveProgressFunc();
    }else{
      const currentUrl2 = currentRoute.replace("/",""); 
      window.location.href=`/login?redirect=${currentUrl2}&act=saveprogress`;
    }
  }

  const saveProgressFunc =()=>{
    //getting session data
    var CoverData = sessionStorage.getItem("Cover"); 
    var FirstPageData = sessionStorage.getItem("FirstPage"); 
    var LayoutData = sessionStorage.getItem("Layout"); 
    var CalendarData = sessionStorage.getItem("Calendar"); 
    var AddinsData = sessionStorage.getItem("Addins"); 
    var DatesData = sessionStorage.getItem("Dates"); 
    var PriceData = sessionStorage.getItem("Price"); 



    const apiToken = sessionStorage.getItem("Token")

    const postData  = {
        Cover : CoverData,
        FirstPage : FirstPageData,
        Layout: LayoutData,
        Calendar: CalendarData,
        Addins: AddinsData,
        Dates: DatesData,
        PriceData:PriceData,

    }
    const headers= {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json', // Include this header if needed
    }
  
    axios.post(`${BACKEND_URL}/api/V1/saveProgress`, postData, { headers: headers } )
    .then(response => {
      if(response.data.status){
          toast(response.data.message,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
      }else{
        toast("Sorry! unable to save data",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
        
    })
    .catch(error => {
      console.error('Error saving data:', error);
    }); 
  }

  const handleLoadSaveDairy =()=>{
    var SaveDiaryData = sessionStorage.getItem("SaveDairy");
    if(SaveDiaryData!==null){

      SaveDiaryData = JSON.parse(SaveDiaryData);
      // Parse each inner JSON string
      var Cover = (SaveDiaryData.Cover);
      var FirstPage = (SaveDiaryData.FirstPage);
      var Layout = (SaveDiaryData.Layout);
      var Calendar = (SaveDiaryData.Calendar);
      var Addins = (SaveDiaryData.Addins);
      var Dates = (SaveDiaryData.Dates);
      console.log("SaveDiaryData=>",SaveDiaryData)
      sessionStorage.removeItem("SaveDairy")
      setSaveDiary(false);

      sessionStorage.setItem("Cover", Cover); 
      sessionStorage.setItem("FirstPage", FirstPage); 
      sessionStorage.setItem("Layout", Layout); 
      sessionStorage.setItem("Calendar", Calendar); 
      sessionStorage.setItem("Addins", Addins); 
      sessionStorage.setItem("Dates", Dates); 

      toast("Save Dairy data load successfully",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

    }
    

  }

  const handleLogout = ()=>{
    setMyUser("");
    setIsLoggedIn(false);
    sessionStorage.removeItem("User")
    sessionStorage.removeItem("Token");
    sessionStorage.removeItem("SaveDairy");
    sessionStorage.removeItem("Cover");
    sessionStorage.removeItem("FirstPage");
    sessionStorage.removeItem("Layout");
    sessionStorage.removeItem("Calendar");
    sessionStorage.removeItem("Addins");
    sessionStorage.removeItem("Dates");
    sessionStorage.removeItem("Price");

    toast("Logout successfully",
    {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      onClose: () =>  navigate('/')
    });
  }

  const previousNavigate = ()=>{
    if(currentRoute=="/cover"){
      setNextBtnEnable(true);
      navigate('/')
    }
    /*if(currentRoute=="/cover" && hashValue=="FirstPage"){
      setNextBtnEnable(true);
      navigate('/cover')
    }*/
    if(currentRoute=="/layout"){
      setNextBtnEnable(true);
      navigate('/cover')
    }
    /*if(currentRoute=="/layout" && hashValue=="Calendars"){
      setNextBtnEnable(true);
      navigate('/layout')
    }*/
    if(currentRoute=="/addins"){
      setNextBtnEnable(true);
      navigate('/layout')
    }
    if(currentRoute=="/dates" ){
      setNextBtnEnable(true);
      navigate('/addins')
    }
    if(currentRoute=="/review"){
      setNextBtnEnable(true);
      navigate('/dates')
    }
    if(currentRoute=="/cart"){
      setNextBtnEnable(true);
      navigate('/review')
    }
  }

  const nextNavigate = ()=>{

    setNextBtnEnable(false);
    if(currentRoute=="/"){
      setNextBtnEnable(true);
      navigate('/cover')
    }
    if(currentRoute=="/cover" && CoverData!==undefined && FirstPageData===null){
      setNextBtnEnable(true);
      navigate('/cover#FirstPage')
    }
    if(currentRoute=="/cover" && CoverData!==undefined && FirstPageData!==null){
      setNextBtnEnable(true);
      navigate('/layout#Calendars')
    }
    if(currentRoute=="/layout" && LayoutData!==undefined  && CalendarData===null){
      setNextBtnEnable(true);
      navigate('/layout#Calendars')
    }
    if(currentRoute=="/layout" && LayoutData!==undefined  && CalendarData!==null){
      setNextBtnEnable(true);
      navigate('/addins')
    }
    if(currentRoute=="/addins" && AddinsData!==undefined){
      setNextBtnEnable(true);
      navigate('/dates')
    }
    if(currentRoute=="/dates" && DatesData!==undefined && PriceData.pageCount<PriceData.maxPageCount){
      setNextBtnEnable(true);
      navigate('/review')
    }
    if(currentRoute=="/review" && ReviewData!==undefined && ReviewData!==null && ReviewData.TermsAgree==false){
      setNextBtnEnable(false);
    }
    if(currentRoute=="/review" && ReviewData!==undefined && ReviewData!==null  && ReviewData.TermsAgree==true){
      setNextBtnEnable(true);
      navigate('/cart')
    }
  }

  
  return (
    <>
      <Box className="navBar">

        <Box className="navTopTextBox">
          <Box className="logo">
            <img className='navTopImg' src={NavHeaderImg} />

          </Box>

          <Box className="login_Box">
            {!isLoggedIn && <Box className="loginCartTab" onClick={handleLogin}>
              <Typography>LOGIN</Typography>
              <svg onClick={() => navigate("/cart")} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.0752 3.05775C16.8637 2.80458 16.599 2.60096 16.2998 2.46136C16.0005 2.32176 15.6742 2.2496 15.3439 2.25H3.18906L3.15748 1.98675C3.09286 1.43956 2.82924 0.935049 2.41659 0.568858C2.00394 0.202667 1.47096 0.000256345 0.918677 0H0.751781C0.552396 0 0.361178 0.0790176 0.220192 0.21967C0.0792053 0.360322 0 0.551088 0 0.75C0 0.948912 0.0792053 1.13968 0.220192 1.28033C0.361178 1.42098 0.552396 1.5 0.751781 1.5H0.918677C1.10281 1.50002 1.28054 1.56747 1.41814 1.68954C1.55574 1.81161 1.64365 1.97981 1.6652 2.16225L2.69965 10.9373C2.80704 11.8498 3.24655 12.6913 3.93475 13.302C4.62296 13.9127 5.51195 14.25 6.43299 14.25H14.2838C14.4832 14.25 14.6744 14.171 14.8154 14.0303C14.9564 13.8897 15.0356 13.6989 15.0356 13.5C15.0356 13.3011 14.9564 13.1103 14.8154 12.9697C14.6744 12.829 14.4832 12.75 14.2838 12.75H6.43299C5.96768 12.7487 5.51416 12.6038 5.13462 12.3353C4.75507 12.0668 4.46807 11.6877 4.31297 11.25H13.2742C14.1555 11.2501 15.0088 10.9412 15.685 10.3773C16.3612 9.81348 16.8174 9.03052 16.9737 8.16525L17.5639 4.89975C17.6228 4.57576 17.6095 4.2428 17.5251 3.92448C17.4406 3.60616 17.2871 3.31026 17.0752 3.05775Z" fill="white" />
                <path d="M5.26247 18C6.09286 18 6.76603 17.3284 6.76603 16.5C6.76603 15.6716 6.09286 15 5.26247 15C4.43207 15 3.75891 15.6716 3.75891 16.5C3.75891 17.3284 4.43207 18 5.26247 18Z" fill="white" />
                <path d="M12.7803 18C13.6107 18 14.2838 17.3284 14.2838 16.5C14.2838 15.6716 13.6107 15 12.7803 15C11.9499 15 11.2767 15.6716 11.2767 16.5C11.2767 17.3284 11.9499 18 12.7803 18Z" fill="white" />
              </svg>
            </Box>}

            {isLoggedIn && <Box className="UserInfoBox">
                <Typography className='UserInfo'>{myUser.first_name}</Typography>
                <Box className="LogoutBtn" onClick={handleLogout}>
                  <ButtonPrimary buttonText="Logout"  />
                </Box>
              </Box>}

            {!saveDiary && <Box className="SaveProgressBtn" onClick={handleSaveProgress}>
              <ButtonPrimary buttonText="Save progress"  />
            </Box>}

            {saveDiary && <Box className="SaveProgressBtn" onClick={handleLoadSaveDairy}>
              <ButtonPrimary buttonText="Load Save Diary"  />
            </Box>}
          </Box>
        </Box>

        <Box onClick={() => setMobileNav(!mobileNav)} className="downArrow">
          <img src={navScrollBtn} alt='navScrollBtn' />
        </Box>

        <Box sx={{ height: mobileNav ? "auto" : "0px" }} className="navItems">
          <Box className="navItem">
            <Typography className="navFont" onClick={() => previousNavigate()}>{`<`}</Typography>
          </Box>
          <Box className="navItem">
            <Typography className={currentRoute === "/" ? "navFont" : null} onClick={() => navigate("/")}>Home</Typography>
          </Box>
          <Box className="navItem">
            <Typography className={currentRoute === "/cover" ? "navFont" : null} onClick={() => navigate("/cover")}>Cover</Typography>
          </Box>
          <Box className="navItem">
            <Typography className={currentRoute === "/layout" ? "navFont" : null} onClick={() => navigate("/layout")}>Layout</Typography>
          </Box>
          <Box className="navItem">
            <Typography className={currentRoute === "/addins" ? "navFont" : null} onClick={() => navigate("/addins")}>Add-ins</Typography>
          </Box>
          <Box className="navItem">
            <Typography className={currentRoute === "/dates" ? "navFont" : null} onClick={() => navigate("/dates")}>Dates</Typography>
          </Box>
          <Box className="navItem">
            <Typography className={currentRoute === "/review" ? "navFont" : null} onClick={() => navigate("/review")}>Review</Typography>
          </Box>
          
          <Box className="navItem">
            <Typography className={currentRoute === "/cart" ? "navFont" : null} onClick={() => navigate("/cart")}>Cart</Typography>
          </Box>
          <Box className="navItem">
            <Typography className={currentRoute === "/giftCard" ? "navFont" : null} onClick={() => navigate("/giftCard")}>Gift Card</Typography>
          </Box>
          <Box className="navItem">
            <Typography className={nextBtnEnable? `navFont`:`navFont disabled`} onClick={() => nextNavigate()}>{`>`}</Typography>
          </Box>
        </Box>
      </Box>
      <ToastContainer autoClose={false} draggable={false} />
    </>
  )
}
