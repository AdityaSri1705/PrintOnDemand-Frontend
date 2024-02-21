import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import "./style.css";
import { useNavigate } from "react-router-dom";
import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined';

import axios from 'axios';
import config from '../../../config';

//component
import NavBar from "../../NavBar";
import Footer from "../../Footer";
import MyAccountMenu from "../../../Components/MyAccountMenu";


export default function MyAccount() {
  const BACKEND_URL = config.BACKEND_URL;
  const navigate = useNavigate()

  const userSession = sessionStorage.getItem("User");
  const apiToken = sessionStorage.getItem("Token");
  const ApiHeaders= {
    'Authorization': `Bearer ${apiToken}`,
    'Content-Type': 'application/json', // Include this header if needed
  }

  const [activeTab, setActiveTab] = useState("MY-ACCOUNT")
  const [sideMenu, setSideMenu] = useState(false)
  const [userData, setUserData] = useState([])
  const [orderData, setOrderData] = useState([])

  useEffect(() => {
    
    if(userSession!==undefined && userSession!==null){
      axios.get(`${BACKEND_URL}/api/V1/myorders/`, { headers: ApiHeaders})
          .then(response => {
            const { User, Orders } = response.data.result;
            setUserData(User);
            setOrderData(Orders);
          })
          .catch(error => {
            console.error('Error fetching layout data:', error);
          });
      }else{
        navigate("/");
      }
    
  },[]);

  return (
    <>
      <NavBar />
      <Box className="myAccountContainer">

        <Box className="myAccountHeader">
          <Typography className="myAccountHeaderText">
            Hello, {userData.first_name+' '+userData.last_name}
          </Typography>
          <Box className="myAccountHeaderNavigation">
            <Typography mr={1}>HOME / </Typography>
            <Typography mr={1}>ACCOUNT / </Typography>
            <Typography mr={1}>MY ACCOUNT </Typography>
          </Box>
        </Box>

        <Box className="myAccountInfoBox">
          <MyAccountMenu />

          <Box className="myAccountDetailsBox">

            {/* my account info  */}
            <Box className="myAccountTab">
              <SwapHorizontalCircleOutlinedIcon onClick={() => setSideMenu(!sideMenu)} className="sideMenuIcon" />
  
              <Box className="myAccountTabItem myAccountTabSubYSpacing2">
                <Typography className="myAccountTabHeader">Recent Orders</Typography>
                <Typography className="myAccountTabLinkText">OPEN TICKET</Typography>

              </Box>

              <Box className="myAccountTabItem myAccountTabSubSpacing2">
                <Typography className="myAccountTabSubHeader">ORDER NUMBER</Typography>
                <Typography className="myAccountTabSubHeader">DATE</Typography>
                <Typography className="myAccountTabSubHeader">SHIP TO</Typography>
                <Typography className="myAccountTabSubHeader">ORDER TOTAl</Typography>
                <Typography className="myAccountTabSubHeader">STATUS</Typography>
                <Typography className="myAccountTabSubHeader">ACTION</Typography>
              </Box>
                {orderData.map((order)=>(
                  <Box className="myAccountTabItem myAccountTabSubSpacing2">
                    <Typography className="myAccountTabSubHeader">{order.code}</Typography>
                    <Typography className="myAccountTabSubHeader">{order.created_at}</Typography>
                    <Typography className="myAccountTabSubHeader">{order.shipping_name}</Typography>
                    <Typography className="myAccountTabSubHeader">${order.total}</Typography>
                    <Typography className="myAccountTabSubHeader">{order.status_title}</Typography>
                    <Typography className="myAccountTabSubHeader">ACTION</Typography>
                  </Box>
                ))}
              
            </Box>

          </Box>

        </Box>

      </Box >
      <Footer />
    </>
  );
}
