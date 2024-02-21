import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, TextField } from '@mui/material';
import axios from "axios";
import "./style.css"
import config from '../../../config';

import NavHeaderImg from "../../../Assets/images/BYBnewtag blue (3)-no-bottom.png"
import whiteCross from "../../../Assets/images/whiteCross.svg"
import EmailIcon from "../../../Assets/images/EmailIcon.svg"
import PasswordHide from "../../../Assets/images/passwordIcon.svg"
import PasswordVisible from "../../../Assets/images/passwordIcon.svg"
import TickIcon from "../../../Assets/images/TickIcon.svg"
import CrossIcon from "../../../Assets/images/CrossIcon.png"

export default function ForgortPassword({setMyUser, showBox}) {
  const navigate = useNavigate();
  const { token } = useParams();

  const [forgotPassBox] = useState(showBox)
  const [changePassBox] = useState(!showBox)

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email) => {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  useEffect( () => {
    //for runn the function at page lode
    //readSesstion();
    
    checkEmailToken(token);
   
  }, []);

   /* ------------- Forgot Password Code -------------------*/

  const [forgotPassSubmit, setForgotPassSubmit] = useState(false);
  const [passFormShow, setPassFormShow] = useState(true);
  const [forgotPassLog, SetForgotPassLog] = useState({
    email: "",
  });

  const handleForgotPassParameter = (e) => {
    const { name, value } = e.target;
    setErrorMessage('');
    setMessage('');

    SetForgotPassLog({
      ...forgotPassLog,
      [name]: value,
    });
  };

  const handelForgotPass = async (e) => {
    e.preventDefault();
    const BACKEND_URL = config.BACKEND_URL;
    setForgotPassSubmit(true);
    
    //for not send data in url
    if(forgotPassLog.email &&  validateEmail(forgotPassLog.email)){
      axios.post(
        `${BACKEND_URL}/api/V1/forgot-password`,
        forgotPassLog
      ).then(response => {

        if (response.data.status) {
          setPassFormShow(false);
        }else{
          setErrorMessage(response.data.errors);
        }
      }).catch(error => {
        console.error('Error fetching data:', error);
        setErrorMessage('Email is not exists');
      });
      
    }
    
  };

  

  /* ------------- Change Password Code -------------------*/

  const [changePassSubmit, setChangePassSubmit] = useState(false)
  const [changePassFormShow, setChangePassFormShow] = useState("")
  const [changePassNV, setChangePassNV] = useState(false)
  const [changePassCV, setChangePassCV] = useState(false)
  const [changePassLog, setChangePassLog] = useState({
    user_id:0,
    new_password: "",
    confirm_password: "",
  });
  const handleChangePassParameter = (e) => {
    const { name, value } = e.target;

    setErrorMessage('');
    setMessage('');
    
    setChangePassLog({
      ...changePassLog,
      [name]: value,
    });
  };

  const checkEmailToken = async(token)=>{
    const BACKEND_URL = config.BACKEND_URL;

    if(token!=='' && token!==undefined ){
      
     axios.post(
        `${BACKEND_URL}/api/V1/send-password-token`,
        { password_token: token }
      ).then(response => {
       
        if(response.data.status){
          setChangePassLog(prevState => ({ ...prevState, user_id: response.data.result.user_id }));
          setChangePassFormShow("showPassForm");
        }else{
          setErrorMessage(response.data.errors);
          setChangePassFormShow("errorMsg");
        }
        
      }).catch(error => {
        console.error('Error fetching Token data:', error);
        setErrorMessage('Invalid Token');
        setChangePassFormShow("errorMsg");
      }); 

    }
  }

  const handelChangePass = async (e) => {
    e.preventDefault();
    const BACKEND_URL = config.BACKEND_URL;
    setChangePassSubmit(true);
    //for not send data in url
   
    if(changePassLog.current_password!=="" && changePassLog.new_password!=="" && changePassLog.confirm_password!=="" && (changePassLog.new_password===changePassLog.confirm_password)){
      axios.post(
        `${BACKEND_URL}/api/V1/update-password`,
        changePassLog
      ).then(response => {

        setChangePassFormShow("");
        if(response.data.status){
          setChangePassLog(prevState => ({ ...prevState, user_id: response.data.result.user_id }));
          setChangePassFormShow("successMsg");
        }else{
          setErrorMessage(response.data.errors);
          setChangePassFormShow("errorMsg");
        }

      }).catch(error => {
          console.error('Error fetching data:', error);
          setErrorMessage('Unable to change password. <br>Please contact to administrator.');
          setChangePassFormShow("errorMsg");
      });
      
    }
    
  };
  /* ------------- Change Password  Code -------------------*/

   

  return (
    <>
      <Box className="forgortPassContainer">
        <Box className="backDrop"></Box>

        {/* Forgot Password PopUp */}
        <Box sx={{ display: forgotPassBox ? "flex" : "none" }} className={`forgotPassBox${forgotPassBox>0 ? ' success' : ''}`}>
          <img onClick={() => navigate('/')} className='lonIn_crossButton' src={whiteCross} alt='CrossButton' />
          
          <Box className="companyBanner">
            <img src={NavHeaderImg} alt='NavHeaderImg' />
          </Box>
          
          <Box sx={{ display: passFormShow ? "block" : "none" }} >
            <Box className="resetText">
              <Typography ml={1.5}>RESET YOUR PASSWORD</Typography>
            </Box>

            {errorMessage!=="" ? <p className="text-red-600">{errorMessage}</p>:"" }

            <Box mb={1} className="emailInputBox">
              <TextField className='emailInput' name='email' type='email' placeholder='Email'  onChange={handleForgotPassParameter} required/>
              <img className='emailIcon' src={EmailIcon} alt='EmailIcon' />
            </Box>
            { !forgotPassLog.email & forgotPassSubmit ? <p className="text-red-600">*please enter a Email</p>:"" }   
            { !validateEmail(forgotPassLog.email) & forgotPassLog.email!=="" & forgotPassSubmit ? <p className="text-red-600">*please enter valid Email</p>:"" }
            
            <Box className="singInButton pointer" onClick={handelForgotPass}>
              <Typography>SEND RESET LINK</Typography>
            </Box>

            <Box className="loginTab">
              <Box onClick={() => navigate('/login')} className="CandPtab pointer">
                <Typography>Remember your password? Login</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: !passFormShow ? "block" : "none" }} >
            <Box className="tickbox">
              <img className='tickIcon' src={TickIcon} alt='TickIcon' />
              <Typography ml={1.5}>Check your email.</Typography>
            </Box>
            <Box className="tickbox2">
              <Typography ml={1.5} mt={3.5}>We just sent you an email to recover your
password</Typography>
            </Box>
          </Box>

        </Box>

        
       

        {/* Change Password PopUp */}

        <Box sx={{ display: changePassBox ? "flex" : "none" }} className="ChangePassBox">

          <Box className="companyBanner">
            <img src={NavHeaderImg} alt='NavHeaderImg' />
          </Box>

          <Box sx={{ display: changePassFormShow==="showPassForm" ? "block" : "none" }} >
            <Box className="resetText">
              <Typography ml={1.5}>ENTER NEW PASSWORD</Typography>
            </Box>
            {message ? <p className="text-green-600">*{message}</p>:"" }

            <Box mb={1} className="passwordInputBox">
              <TextField className='passwordInput' name='new_password' type={changePassNV ? "text" : "password"} placeholder='New Password' onChange={handleChangePassParameter} required />
              <img onClick={() => setChangePassNV(!changePassNV)} className='passwordIcon' src={changePassNV ? PasswordVisible: PasswordHide} alt='passwordIcon'  />
            </Box>
            { !changePassLog.new_password & changePassSubmit ? <p className="text-red-600">*please enter a Password</p>:"" } 

            <Box className="passwordInputBox">
              <TextField className='passwordInput' name='confirm_password' type={changePassCV ? "text" : "password"} placeholder='Confirm Password' onChange={handleChangePassParameter} required />
              <img onClick={() => setChangePassCV(!changePassCV)} className='passwordIcon' src={changePassCV ? PasswordVisible: PasswordHide} alt='passwordIcon' />
            </Box>
            { !changePassLog.confirm_password & changePassSubmit ? <p className="text-red-600">*please enter a Confirm Password</p>:"" } 
            { changePassLog.new_password!=="" & changePassLog.confirm_password!=="" & changePassLog.new_password!==changePassLog.confirm_password & changePassSubmit ? <p className="text-red-600">*Both password are not matched</p>:"" } 


            <Box className="singInButton pointer" onClick={handelChangePass}>
              <Typography>CHANGE PASSWORD</Typography>
            </Box>
            <Box className="loginTab">
              <Box onClick={() => navigate('/login')} className="CandPtab pointer">
                <Typography>Remember your password? Login</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: changePassFormShow==="successMsg" ? "block" : "none" }} >
            <Box className="tickbox">
              <img className='tickIcon' src={TickIcon} alt='TickIcon' />
              <Typography ml={1.5}>New Password updated successfully.</Typography>
            </Box>
            <Box className="loginTab">
              <Box className="CandPtab pointer">
                <Typography onClick={() =>navigate('/')} className='SignUpBText2 pointer'>Click here to Login</Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: changePassFormShow==="errorMsg" ? "block" : "none" }} >
            <Box className="tickbox">
              <img className='CrossIcon' src={CrossIcon} alt='CrossIcon' />
              <Typography ml={1.5}>{errorMessage}</Typography>
            </Box>
            <Box className="loginTab">
              <Box className="CandPtab pointer">
                <Typography onClick={() =>navigate('/')} className='SignUpBText2 pointer'>Click here to Login</Typography>
              </Box>
            </Box>
          </Box>

        </Box>

        
      </Box>
    </>
  )
}
