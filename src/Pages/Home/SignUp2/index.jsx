import React, { useState, useEffect } from 'react';
import { useNavigate, useParams  } from "react-router-dom";
import { Box, Typography, TextField } from '@mui/material';
import GoogleAuth from "../../../Components/GoogleAuth"
import axios from "axios";
import "./style.css"
import config from '../../../config';

import NavHeaderImg from "../../../Assets/images/BYBnewtag blue (3)-no-bottom.png"
import GoogleIcon from "../../../Assets/images/GoogleIcon.svg";
import whiteCross from "../../../Assets/images/whiteCross.svg"
import EmailIcon from "../../../Assets/images/EmailIcon.svg"
import PasswordHide from "../../../Assets/images/passwordIcon.svg"
import PasswordVisible from "../../../Assets/images/passwordIcon.svg"
import TickIcon from "../../../Assets/images/TickIcon.svg"
import CrossIcon from "../../../Assets/images/CrossIcon.png"

export default function SignUp({setMyUser, showBox}) {
  const navigate = useNavigate();
  const { token } = useParams();
  const [loginBox, setLoginBox] = useState((showBox==='login')? true:false)
  const [signUpBox, setSignUpBox] = useState((showBox==='register')? true:false)
  const [emailVerifyBox, setEmailVerifyBox] = useState((showBox==='emailverify')? true:false)

  
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const validateEmail = (email) => {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const readSesstion = () => {
    
    var item_value = sessionStorage.getItem("User");

    //condition of perticuler customer is login than it set
    if (item_value) {
      setMyUser(item_value); //we use JSON.parse for covert the string in to object
    }
  };

  useEffect( () => {
    //for runn the function at page lode
    readSesstion();
    checkEmailToken(showBox, token);
   
  }, []);

    /* ------------- Google Login Code -------------------*/
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleLoginSuccess = (response) => {
    setIsLoggedIn(true);
    setUserData(response.profileObj);
  };

  const handleLoginFailure = (error) => {
    console.error('Google login failed:', error);
  };


  /* ------------- Login Code -------------------*/
  const [loginSubmit, setLoginSubmit] = useState(false)
  const [loginPassV, setLoginPassV] = useState(false)
  const [userLoginLog, SetUserLoginLog] = useState({
    email: "",
    password: "",
  });
 
  const handleLoginParameter = (e) => {
    const { name, value } = e.target;

    setErrorMessage('');
    setMessage('');
    

    SetUserLoginLog({
      ...userLoginLog,
      [name]: value,
    });
  };

  const handelLogin = async (e) => {
    e.preventDefault();
    const BACKEND_URL = config.BACKEND_URL;
    
    setLoginSubmit(true);
    
    //for not send data in url
   
    if(userLoginLog.email!=="" && userLoginLog.password!==""){
       await axios.post(
        `${BACKEND_URL}/api/V1/login`,
        userLoginLog
      ).then(response => {
    
        if (response.data.status) {
          // console.log(responce.data.data, "Myadmin");
          setMyUser(response.data.result.user); //customerlog hold the data of registered user or data of store in backend and database
          sessionStorage.setItem("User", response.data.result.user); //hear we customerlog JSON.stringify for convert the object in to string
          sessionStorage.setItem("Token", response.data.result.token); 
          navigate("/myaccount");
        }else{
          console.error('Error fetching data:', response.data);
          setErrorMessage(response.data.errors);
        }

      }).catch(error => {
        console.error('Error fetching data:', error);
        setErrorMessage('Invalid Email or Password');
      });
      
    }
    
  };
  /* ------------- Login Code -------------------*/


  /* ------------- Register Code -------------------*/
  
  const [registerSubmit, setRegisterSubmit] = useState(false)
  const [showRegisterForm, setShowRegisterForm] = useState(true)
  const [registerPassV, setRegisterPassV] = useState(false)
  const [registerPassCV, setRegisterPassCV] = useState(false)
  const [userRegisterLog, SetUserRegisterLog] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });
  const handleRegisterParameter = (e) => {
    const { name, value } = e.target;

    setErrorMessage('');
    setMessage('');
    
    SetUserRegisterLog({
      ...userRegisterLog,
      [name]: value,
    });
  };

  const handelRegister = async (e) => {
    e.preventDefault();
    const BACKEND_URL = config.BACKEND_URL;
    setRegisterSubmit(true);
    //for not send data in url
   
    if(userRegisterLog.email!=="" && userRegisterLog.password!=="" && userRegisterLog.confirm_password!=="" && (userRegisterLog.password===userRegisterLog.confirm_password)){
      axios.post(
        `${BACKEND_URL}/api/V1/register`,
        userRegisterLog
      ).then(response => {
      
        //setErrorMessage(!response.data.status? response.data.errors:'');
        //setMessage(response.data.status? response.data.result:'');
        setShowRegisterForm(false);

      }).catch(error => {
        console.error('Error fetching data:', error);
        setErrorMessage('Unable to register');
      });
      
    }
    
  };
  /* ------------- Register Code -------------------*/

    /* ------------- Email Verify Code -------------------*/
  const [verifySuccess, setVerifySuccess] = useState(false)
  const checkEmailToken = async(showBox, token)=>{
    const BACKEND_URL = config.BACKEND_URL;

    if(showBox==='emailverify'){
      
      console.log(token, `${BACKEND_URL}/api/V1/verify/${token}`);
     axios.get(
        `${BACKEND_URL}/api/V1/verify/${token}`
      ).then(response => {
        console.log(response.data);
        if(response.data.status){
          setVerifySuccess(true);
        }else{
          setErrorMessage(!response.data.status? response.data.errors:'');
        }
        
       
      }).catch(error => {
        console.error('Error fetching Token data:', error);
        setErrorMessage('Invalid Token');
      }); 

    }
  }

  return (
    <>
      <Box className="signUpContainer">
        <Box className="backDrop"></Box>

        {/* LoginPopUp */}
        <Box sx={{ display: loginBox ? "flex" : "none" }} className="loginBox">
          <img onClick={() => navigate('/')} className='lonIn_crossButton' src={whiteCross} alt='CrossButton' />

          <Box className="companyBanner">
            <img src={NavHeaderImg} alt='NavHeaderImg' />
          </Box>

          

          {/*<Box className="googleSignUp pointer">
            <img className='googleIcon' src={GoogleIcon} alt='GoogleIcon' />
            <Typography ml={1.5}>CONTINUE WITH GOOGLE</Typography>
            </Box>*/}
          <GoogleAuth onLoginSuccess={handleLoginSuccess} onLoginFailure={handleLoginFailure} />

          <Box className="divider">
            <hr />
            <Typography>OR</Typography>
          </Box>
          {errorMessage!=="" ? <p className="text-red-600">{errorMessage}</p>:"" }

          <Box mb={1} className="emailInputBox">
            <TextField className='emailInput' name='email' type='email' placeholder='Email'  onChange={handleLoginParameter} required/>
            <img className='emailIcon' src={EmailIcon} alt="" />
          </Box>
          { !userLoginLog.email & loginSubmit ? <p className="text-red-600">*please enter a Email</p>:"" }   
          { !validateEmail(userLoginLog.email) & userLoginLog.email!==""  & loginSubmit ? <p className="text-red-600">*please enter valid Email</p>:"" }
           

          <Box className="passwordInputBox">
            <TextField className='passwordInput' name='password' type={loginPassV ? "text" : "password"} placeholder='password' onChange={handleLoginParameter} required />
            <img onClick={() => setLoginPassV(!loginPassV)} className='passwordIcon' src={loginPassV ? PasswordVisible: PasswordHide } alt="" />

          </Box>
          { !userLoginLog.password & loginSubmit ? <p className="text-red-600">*please enter a Password</p>:"" }   

          <Box className="singInButton pointer" onClick={handelLogin}>
            <Typography>SIGN IN</Typography>
          </Box>


          <Box className="createAndResetTab">
            <Box onClick={() => {
              setLoginBox(false)
              setSignUpBox(true)
            }} className="CandPtab CandPRightBorder pointer">
              <Typography>Create Account</Typography>
            </Box>

            <Box className="CandPtab pointer">
              <Typography>Reset Password</Typography>
            </Box>

          </Box>

        </Box>


        {/* SignUpPopUp */}

        <Box sx={{ display: signUpBox ? "flex" : "none" }} className={`SignUpBox${!showRegisterForm>0 ? ' success' : ''}`}>
          <img onClick={() => navigate('/')} className='lonIn_crossButton' src={whiteCross} alt='CrossButton'/>

          <Box className="companyBanner">
            <img src={NavHeaderImg} alt='NavHeaderImg' />
          </Box>
          
          <Box sx={{ display: showRegisterForm ? "block" : "none" }} >
            {/*<Box className="googleSignUp pointer">
              <img className='googleIcon' src={GoogleIcon} alt='GoogleIcon' />
              <Typography ml={1.5}>CONTINUE WITH GOOGLE</Typography>
          </Box><GoogleAuth2 onLoginSuccess={handleLoginSuccess} onLoginFailure={handleLoginFailure} />*/}
            <GoogleAuth onLoginSuccess={handleLoginSuccess} onLoginFailure={handleLoginFailure} />


            <Box className="divider">
              <hr />
              <Typography>OR</Typography>
            </Box>

            {message ? <p className="text-green-600">*{message}</p>:"" }
            {errorMessage!=="" ? <p className="text-red-600">{errorMessage}</p>:"" }

            <Box mb={1} className="emailInputBox">
            <TextField className='emailInput' name='email' type='email' placeholder='Email'  onChange={handleRegisterParameter} required/>
              <img className='emailIcon' src={EmailIcon} alt='EmailIcon' />
            </Box>
            { !userRegisterLog.email & registerSubmit ? <p className="text-red-600">*please enter a Email</p>:"" } 
            { !validateEmail(userRegisterLog.email) & userRegisterLog.email!==""  & registerSubmit ? <p className="text-red-600">*please enter valid Email</p>:"" }

            <Box mb={1} className="passwordInputBox">
              <TextField className='passwordInput' name='password' type={registerPassV ? "text" : "password"} placeholder='Password' onChange={handleRegisterParameter} required />
              <img onClick={() => setRegisterPassV(!registerPassV)} className='passwordIcon' src={registerPassV ? PasswordVisible: PasswordHide} alt='passwordIcon'  />
            </Box>
            { !userRegisterLog.password & registerSubmit ? <p className="text-red-600">*please enter a Password</p>:"" } 

            <Box className="passwordInputBox">
              <TextField className='passwordInput' name='confirm_password' type={registerPassCV ? "text" : "password"} placeholder='Confirm Password' onChange={handleRegisterParameter} required />
              <img onClick={() => setRegisterPassCV(!registerPassCV)} className='passwordIcon' src={registerPassCV ? PasswordVisible: PasswordHide} alt='passwordIcon' />
            </Box>
            { !userRegisterLog.confirm_password & registerSubmit ? <p className="text-red-600">*please enter a Confirm Password</p>:"" } 
            { userRegisterLog.password!=="" & userRegisterLog.confirm_password!=="" & userRegisterLog.password!==userRegisterLog.confirm_password & registerSubmit ? <p className="text-red-600">*Both password are not matched</p>:"" } 


            <Box className="singInButton pointer" onClick={handelRegister}>
              <Typography>CREATE ACCOUNT</Typography>
            </Box>

            <Box className="createAndResetTab">
              <Typography mr={1} className='SignUpBText1'>Already have an account?</Typography>
              <Typography onClick={() => {
                setSignUpBox(false)
                setLoginBox(true)
              }} className='SignUpBText2 pointer'>Sign in</Typography>

            </Box>

          </Box>
          <Box sx={{ display: !showRegisterForm ? "block" : "none" }} >
            <Box className="tickbox">
                <img className='tickIcon' src={TickIcon} alt='TickIcon' />
                <Typography ml={1.5}>Registeration  successfully.<br /> Please check your email.</Typography>
              </Box>
              <Box className="tickbox2">
                <Typography ml={1.5} mt={3.5}>We just sent you an email to verify your
  email</Typography>
            </Box>
          </Box>


          

        </Box>

        {/* EmailVerifyPopUp */}

        <Box sx={{ display: emailVerifyBox ? "flex" : "none" }} className="emailVerifyBox">
          <img onClick={() => navigate('/')} className='lonIn_crossButton' src={whiteCross}  alt='CrossButton' />

          <Box className="companyBanner">
            <img src={NavHeaderImg} alt='NavHeaderImg' />
          </Box>


          <Box className="tickbox" style={{ display: verifySuccess ? "block" : "none" }}>
            <img className='tickIcon' src={TickIcon} alt='TickIcon' />
            <Typography ml={1.5}>Email is verified.</Typography>
          </Box>
          <Box className="createAndResetTab"  style={{ display: verifySuccess ? "flex" : "none" }}>
            <Typography mr={1} className='SignUpBText1'>Click here to access your account</Typography>
            <Typography onClick={() => {
              setSignUpBox(false)
              setLoginBox(true)
              setEmailVerifyBox(false)
            }} className='SignUpBText2 pointer'>Sign in</Typography>

          </Box>

          <Box className="tickbox" style={{ display: !verifySuccess ? "block" : "none" }}>
            <img className='CrossIcon' src={CrossIcon} alt='CrossIcon' />
            <Typography ml={1.5}>{errorMessage}</Typography>
          </Box>

        </Box>


      </Box>
    </>
  )
}
