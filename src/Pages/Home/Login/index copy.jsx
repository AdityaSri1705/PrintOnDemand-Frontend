import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation  } from "react-router-dom";
import { Box, Typography, TextField } from '@mui/material';
//import GoogleAuth from "../../../Components/GoogleAuth"
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

export default function Login({setMyUser}) {
  const navigate = useNavigate();
  const { token } = useParams();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const redirect = searchParams.get("redirect");
  const act = searchParams.get("act");

  const BACKEND_URL = config.BACKEND_URL;

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const validateEmail = (email) => {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  useEffect( () => {
    //for runn the function at page lode
    var userSession = sessionStorage.getItem("User");

    //condition of perticuler customer is login than it set
    if (userSession) {
      setMyUser(userSession); //we use JSON.parse for covert the string in to object
      setIsLoggedIn(true);

      if(redirect!=""){
        const redirectPath = act!=""? redirect+"?act="+act : redirect;
        navigate("/"+redirectPath)
      }else{
        navigate("/myaccount");
      }
    }
   
  }, []);

    /* ------------- Google Login Code -------------------*/
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleLoginSuccess = async (response) => {
    setIsLoggedIn(true);
    setUserData(response.profileObj);

    //GET https://graph.facebook.com/{user-id}?fields=id,name,email,picture.type(large)&access_token={access-token}
    /* const data = {
        name: name,
        email: email,
        profile_image: picture,
        google_token: response.authResponse.access_token
    }*/
    const data = {
        name: 'aaa',
        email: 'aa@gmail.com',
        profile_image: 'https://img.indiafilings.com/learn/wp-content/uploads/2017/07/12010424/Trademark-User-Affidavit.jpg',
        google_token: response.authResponse.accessToken
    }
    await axios.post(
      `${BACKEND_URL}/api/V1/login-with-google-auth`,
      userLoginLog
    ).then((res) => {
        if (res.status && res.result && res.result.token && res.result.user) {
            //localStorage.setItem('token', res.result.token);
            //localStorage.setItem('user', JSON.stringify(res.result.user));
            setMyUser(JSON.stringify(res.result.user)); //customerlog hold the data of registered user or data of store in backend and database
            sessionStorage.setItem("User", JSON.stringify(res.result.user)); //hear we customerlog JSON.stringify for convert the object in to string
            sessionStorage.setItem("Token", res.result.token); 
            //console.log(res.result);
            if(redirect){
              const redirectPath = act!=""? redirect+"?act="+act : redirect;
              navigate("/"+redirectPath)
            }else{
              navigate("/myaccount");
            }
        } else {
            if (res.errors) {
              console.log(res.errors);
            }
        }
    }).catch((error) => {
        if (error.errors) {
          console.log(error.errors);
        }
    });
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
          sessionStorage.setItem("User", JSON.stringify(response.data.result.user)); //hear we customerlog JSON.stringify for convert the object in to string
          sessionStorage.setItem("Token", response.data.result.token); 
          if(redirect){
            const redirectPath = act!=""? redirect+"?act="+act : redirect;
            navigate("/"+redirectPath)
          }else{
            navigate("/myaccount");
          }
          
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




  return (
    <>
      <Box className="signUpContainer">
        <Box className="backDrop"></Box>

        {/* LoginPopUp */}
        <Box className="loginBox">
          <img onClick={() => navigate('/')} className='lonIn_crossButton' src={whiteCross} alt='CrossButton' />

          <Box className="companyBanner">
            <img src={NavHeaderImg} alt='NavHeaderImg' />
          </Box>

          

         <Box className="googleSignUp pointer">
            <img className='googleIcon' src={GoogleIcon} alt='GoogleIcon' />
            <Typography ml={1.5}>CONTINUE WITH GOOGLE</Typography>
            </Box>
           {/*<GoogleAuth onLoginSuccess={handleLoginSuccess} onLoginFailure={handleLoginFailure} />*/}

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
            <Box onClick={()=>navigate('/register')} className="CandPtab CandPRightBorder pointer">
              <Typography>Create Account</Typography>
            </Box>

            <Box onClick={()=>navigate('/forgot-password')}  className="CandPtab pointer">
              <Typography>Reset Password</Typography>
            </Box>

          </Box>

        </Box>


      </Box>
    </>
  )
}
