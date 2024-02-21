import React, { useState, useEffect } from "react";
import { Box, Typography, TextField } from '@mui/material';
import "./style.css";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined';
import PasswordHide from "../../../Assets/images/passwordIcon.svg"
import PasswordVisible from "../../../Assets/images/passwordIcon.svg"

import axios from 'axios';
import config from '../../../config';

//component
import NavBar from "../../NavBar";
import Footer from "../../Footer";
import MyAccountMenu from "../../../Components/MyAccountMenu";
import { ButtonPrimary } from "../../../Components/Buttons"


export default function MyAccount() {
  const BACKEND_URL = config.BACKEND_URL;
  const navigate = useNavigate()
  const location = useLocation();
  const currentRoute = location.pathname;

  const userSession = sessionStorage.getItem("User");
  const apiToken = sessionStorage.getItem("Token");
  const ApiHeaders= {
    'Authorization': `Bearer ${apiToken}`,
    'Content-Type': 'application/json', // Include this header if needed
  }

  const [activeTab, setActiveTab] = useState("MY-ACCOUNT")
  const [sideMenu, setSideMenu] = useState(false)
  const [userData, setUserData] = useState([])

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [isEmailChecked, setIsEmailChecked] = useState(false)
  const [isPasswordChecked, setIsPasswordChecked] = useState(false)
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [currentPassCV, setCurrentPassCV] = useState(false)
  const [newPassCV, setNewPassCV] = useState(false)
  const [newConfirmPassCV, setNewConfirmPassCV] = useState(false)
  const [firstNameError, setFirstNameError] = useState("")
  const [lastNameError, setLastNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [currentPassError, setCurrentPassError] = useState("")
  const [newPassError, setNewPassError] = useState("")
  const [newCPassError, setNewCPassError] = useState("")


  useEffect(() => {
    
    if(userSession!==undefined && userSession!==null){
      axios.get(`${BACKEND_URL}/api/V1/myaccount/`, { headers: ApiHeaders})
          .then(response => {
            const { User } = response.data.result;
            setUserData(User);
            setFirstName(User.first_name);
            setLastName(User.last_name);
            setEmail(User.email);
          })
          .catch(error => {
            console.error('Error fetching layout data:', error);
          });
      }else{
        navigate("/");
      }

      if(currentRoute=="/change-password"){
        setIsPasswordChecked(true);
      }

  },[]);

  const handleSaveInfo = ()=>{
    var err = false;
    if(firstName==""){  setFirstNameError("First name is required."); err=true; }
    if(lastName==""){ setLastNameError("Last name is required."); err=true; }
    if(isEmailChecked && email==""){ setEmailError("Email is required."); err=true; }
    if(isPasswordChecked && currentPassword==""){ setCurrentPassError("Current password is required."); err=true; }
    if(isPasswordChecked && newPassword==""){ setNewPassError("New password is required."); err=true; }
    if(isPasswordChecked && confirmNewPassword==""){ setNewCPassError("Confirm new password is required."); err=true; }
    if(isPasswordChecked && newPassword!="" && confirmNewPassword!="" && newPassword!=confirmNewPassword){ setNewCPassError("Both password is not matched."); err=true; }

    if(!err){
      const postData ={
        firstName : firstName,
        lastName : lastName,
        email: email,
        currentPassword: currentPassword,
        newPassword: newPassword
      }
      axios.post(`${BACKEND_URL}/api/V1/saveprofile/`, postData, { headers: ApiHeaders})
            .then(response => {
              if(response.data.status){
                toast(response.data.result.message,
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
                toast(response.data.errors,
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
              toast(error,
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
            })
    }
          
  }

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
                <Typography className="myAccountTabHeader">My Detail</Typography>
              </Box>
              <Box mb={1.5} className="myAccountInputBox">
                <Typography  className="label" mt={1}>First Name *</Typography>
                <TextField className='stateInput' placeholder='First name' tabIndex='1' value={firstName}  onChange={(e) =>{ setFirstName(e.target.value);setFirstNameError("");}} />
                {firstNameError!="" && <Typography className='errtext'>{firstNameError}</Typography>}
              </Box>
              <Box mb={1.5} className="myAccountInputBox">
                <Typography className="label" mt={1}>Last Name *</Typography>
                <TextField className='stateInput' placeholder='Last name' tabIndex='2' value={lastName}  onChange={(e) =>{ setLastName(e.target.value);setLastNameError("");}} />
                {lastNameError!="" && <Typography className='errtext'>{lastNameError}</Typography>}
              </Box>
              <Box mb={1.5} className="myAccountCheckBox">
                <input
                    onClick={()=>setIsEmailChecked(!isEmailChecked)}
                    checked={isEmailChecked}
                    type="checkbox" tabIndex='3' />
                  <Typography ml={1}>Email</Typography>
              </Box>
              <Box mb={1.5} className="myAccountCheckBox">
                <input
                    onClick={()=>setIsPasswordChecked(!isPasswordChecked)}
                    checked={isPasswordChecked}
                    type="checkbox" tabIndex='4' />
                  <Typography ml={1}>Password</Typography>
              </Box>

              <Box mb={4} className="myAccountTitleBox">
                {isEmailChecked && <Typography className="myAccountTitle">Change Email</Typography>}
                {!isEmailChecked && isPasswordChecked && <Typography className="myAccountTitle">Change Password</Typography>}
                {isEmailChecked && isPasswordChecked && <Typography className="myAccountTitle" ml={1}> And Password</Typography>}
              </Box>

              {isEmailChecked && <Box mb={1.5} className="myAccountInputBox">
                <Typography  className="label" mt={1}>Email *</Typography>
                <TextField className='stateInput' placeholder='Email' tabIndex='5' value={email}  onChange={(e) =>{ setEmail(e.target.value); setEmailError("");}} />
                {emailError!="" && <Typography className='errtext'>{emailError}</Typography>}
              </Box>}

              {isPasswordChecked && <Box className="passwordBox">
                <Box mb={1.5} className="myAccountInputBox">
                  <Typography  className="label" mt={1}>Current Password *</Typography>
                  <Box className="passwordInputBox">
                    <TextField className='passwordInput' placeholder='Current Password' type={currentPassCV ? "text" : "password"} tabIndex='6' value={currentPassword}  onChange={(e) =>{ setCurrentPassword(e.target.value); setCurrentPassError("");}} required />
                    <img onClick={() => setCurrentPassCV(!currentPassCV)} className='passwordIcon' src={currentPassCV ? PasswordVisible: PasswordHide } alt="" />
                  </Box>
                  {currentPassError!="" && <Typography className='errtext'>{currentPassError}</Typography>}
                </Box>
                <Box mb={1.5} className="myAccountInputBox">
                  <Typography  className="label" mt={1}>New Password *</Typography>
                  <Box className="passwordInputBox">
                    <TextField className='passwordInput' placeholder='New Password' type={newPassCV ? "text" : "password"} tabIndex='6' value={newPassword}  onChange={(e) =>{ setNewPassword(e.target.value);setNewPassError("");}} />
                    <img onClick={() => setNewPassCV(!newPassCV)} className='passwordIcon' src={newPassCV ? PasswordVisible: PasswordHide } alt="" />
                  </Box>
                  {newPassError!="" && <Typography className='errtext'>{newPassError}</Typography>}
                </Box>
                <Box mb={1.5} className="myAccountInputBox">
                  <Typography  className="label" mt={1}>Confirm New Password *</Typography>
                  <Box className="passwordInputBox">
                    <TextField className='passwordInput' placeholder='Confirm New Password' type={newConfirmPassCV ? "text" : "password"} tabIndex='6' value={confirmNewPassword}  onChange={(e) =>{ setConfirmNewPassword(e.target.value); setNewCPassError("");}} />
                    <img onClick={() => setNewConfirmPassCV(!newConfirmPassCV)} className='passwordIcon' src={newConfirmPassCV ? PasswordVisible: PasswordHide } alt="" />
                  </Box>
                  {newCPassError!="" && <Typography className='errtext'>{newCPassError}</Typography>}
                </Box>
              </Box>}

              <Box className="myAccountButtonBox">
              <ButtonPrimary buttonText="Save" handelClick={handleSaveInfo}  />
              </Box>
              
              
            </Box>

          </Box>

        </Box>

      </Box >
      <Footer />
      <ToastContainer autoClose={false} draggable={false} />
    </>
  );
}
