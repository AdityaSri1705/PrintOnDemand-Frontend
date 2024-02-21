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
  const [saveData, setSaveData] = useState([])

  useEffect(() => {
    
    if(userSession!==undefined && userSession!==null){
      axios.get(`${BACKEND_URL}/api/V1/myaccount/`, { headers: ApiHeaders})
          .then(response => {
            const { User, Orders, SaveData } = response.data.result;
            setUserData(User);
            setOrderData(Orders);
            setSaveData(SaveData);
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
              <Box className="myAccountTabItem">
                <Typography className="myAccountTabHeader">Recent Projects</Typography>
              </Box>
              <Box className="myAccountTabItem myAccountTabSubSpacing">
                <Typography className="myAccountTabSubHeader ">PROJECT</Typography>
                <Typography className="myAccountTabSubHeader ">PROJECT NAME</Typography>
                <Typography className="myAccountTabSubHeader ">DETAILS</Typography>
              </Box>
              {saveData.length>0 && saveData.map((item)=>{console.log(item.diarydata);
                  const diaryData = JSON.parse(item.diarydata);
                  const coverData = JSON.parse(diaryData.Cover);
                  const firstPageData = JSON.parse(diaryData.FirstPage);
              
                  return (<Box key={item.id} className="myAccountTabItem myAccountTabSubSpacing">
                    <Typography className="myAccountTabSubHeader ">
                    {coverData.CoverType === 'predesign' && (
                      <img src={coverData.FrontImage} alt="Front Cover" width="50" />
                    )}
                    </Typography>
                    <Typography className="myAccountTabSubHeader ">{firstPageData.Name}</Typography>
                    <Typography className="myAccountTabSubHeader ">DETAILS</Typography>
                  </Box>)
              })}
              <Box className="myAccountTabItem myAccountTabSubYSpacing2">
                <Typography className="myAccountTabHeader">Recent Orders</Typography>
                <Typography className="myAccountTabLinkText" onClick={() => {
                  navigate("/myorders")
                }}>VIEW ALL</Typography>
                {/*<Typography className="myAccountTabLinkText">OPEN TICKET</Typography>*/}

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
                  <Box key={order.id} className="myAccountTabItem myAccountTabSubSpacing2">
                    <Typography className="myAccountTabSubHeader">{order.code}</Typography>
                    <Typography className="myAccountTabSubHeader">{order.created_at}</Typography>
                    <Typography className="myAccountTabSubHeader">{order.shipping_name}</Typography>
                    <Typography className="myAccountTabSubHeader">${order.total}</Typography>
                    <Typography className="myAccountTabSubHeader">{order.status_title}</Typography>
                    <Typography className="myAccountTabSubHeader">ACTION</Typography>
                  </Box>
                ))}
              

              <Box className="myAccountTabItem">
                <Typography className="myAccountTabHeader">Account Information</Typography>
              </Box>

              <Box className="myAccountTabItem2">
                <Typography className="myAccountTabSubHeaderEmail">CONTACT INFORMATION</Typography>
                <Typography className="myAccountTabSubHeaderEmail">{userData.email}</Typography>
                <Typography className="myAccountTabSubHeaderEmail">{userData.phone}</Typography>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <Typography mr={11} className="myAccountTabLinkText" onClick={() => {
                  navigate("/edit-profile")
                }}>EDIT</Typography>
                  <Typography className="myAccountTabLinkText" onClick={() => {
                  navigate("/change-password")
                }}>CHANGE PASSWORD TICKET</Typography>
                </Box>

              </Box>

              <Box className="myAccountTabItem myAccountTabSubYSpacing2">
                <Typography className="myAccountTabHeader">Address Book</Typography>
                <Typography className="myAccountTabLinkText">MANAGE ADDRESS</Typography>


              </Box>

              <Box className="myAccountTabItem">
                <Typography className="myAccountTabHeader">0</Typography>

              </Box>



            </Box>


          </Box>

        </Box>





      </Box >
      <Footer />
    </>
  );
}
