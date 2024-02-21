import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation  } from "react-router-dom";
import { Box, Typography, TextField } from '@mui/material';
import { useForm } from "react-hook-form";
import ErrorMessagePara from "../../../CommonComponents/ErrorMessagePara";
import axios from "axios";
import "./style.css"
import config from '../../../config';
import { useGoogleLogin } from '@react-oauth/google';

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

  const {
    register: loginForm,
    handleSubmit: loginSubmit,
    errors: loginErrors,
  } = useForm();


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

  const loginWIthGoogle = useGoogleLogin({
    onSuccess: async tokenResponse => {
        sessionStorage.setItem('token', tokenResponse.access_token);
        let user = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json',{
            headers:{
                Authorization:"Bearer "+ tokenResponse.access_token
            }
        })
        const GoogleuserData = await user.json();
        let userData = {
                google_login:tokenResponse.access_token,
                first_name:GoogleuserData.given_name,
                last_name:GoogleuserData.name,
                email:GoogleuserData.email,
                profile_image:GoogleuserData.picture,
                social_Id:GoogleuserData.id
        }
        
        await axios.post(
          `${BACKEND_URL}/api/V1/login-with-google-auth`,
          userData
        ).then((res) => {
           if (res.data.status) {
              setMyUser(res.data.result.user); 
              sessionStorage.setItem("User", JSON.stringify(res.data.result.user)); 
              sessionStorage.setItem("Token", res.data.result.token); 
              sessionStorage.setItem("SaveDairy", res.data.result.saveDairy); 
              if(redirect){
                const redirectPath = act!=""? redirect+"?act="+act : redirect;
                navigate("/"+redirectPath)
              }else{
                navigate("/myaccount");
              }
          } else {
              if (!res.data.status && res.data.errors) {
                setErrorMessage(res.data.errors);
              }
          }
        }).catch((error) => {
            if (error.errors) {
              setErrorMessage(error.errors);
            }
        });
         
    },
});
  /* ------------- Login Code -------------------*/
  const [loginSubmited, setLoginSubmited] = useState(false)
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


  const submitLoginForm = async (data) => {

    setLoginSubmited(true);
    if(data.email!=="" && validateEmail(data.email) && data.password!==""){

      await axios.post( `${BACKEND_URL}/api/V1/login`, data)
        .then((res) => {
          if (res.data.status) {
              setMyUser(res.data.result.user); //customerlog hold the data of registered user or data of store in backend and database
              sessionStorage.setItem("User", JSON.stringify(res.data.result.user)); //hear we customerlog JSON.stringify for convert the object in to string
              sessionStorage.setItem("Token", res.data.result.token); 
              sessionStorage.setItem("SaveDairy", res.data.result.saveDairy); 
              
              if(redirect){
                const redirectPath = act!=""? redirect+"?act="+act : redirect;
                navigate("/"+redirectPath)
              }else{
                navigate("/myaccount");
              }
          } else {
            
              if (!res.data.status && res.data.errors) {
                setErrorMessage(res.data.errors);
              }
          }
      }).catch((error) => {
          if (error.errors) {
            setErrorMessage(error.errors);
          }
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

          

         <Box className="googleSignUp pointer" onClick={() => loginWIthGoogle()}>
            <img className='googleIcon' src={GoogleIcon} alt='GoogleIcon' />
            <Typography ml={1.5}>CONTINUE WITH GOOGLE</Typography>
          </Box>

          <Box className="divider">
            <hr />
            <Typography>OR</Typography>
          </Box>
          <form onSubmit={loginSubmit(submitLoginForm)}>
            {errorMessage!=="" ? <p className="text-red-600">{errorMessage}</p>:"" }

            <Box mb={1} className="emailInputBox">
              <TextField className='emailInput' name='email' type='email' placeholder='Email' {...loginForm("email", { required: true, })} onChange={handleLoginParameter}  required/>
              <img className='emailIcon' src={EmailIcon} alt="" />
              <ErrorMessagePara errorType={loginErrors?.email?.type} />
              { !validateEmail(userLoginLog.email) & userLoginLog.email!==""  && loginSubmited ? <p className="text-red-600">*please enter valid Email</p>:"" }
            </Box>
            
            

            <Box className="passwordInputBox">
              <TextField className='passwordInput' name='password' type={loginPassV ? "text" : "password"} {...loginForm("password", { required: true, })}  onChange={handleLoginParameter} placeholder='password' required />
              <img onClick={() => setLoginPassV(!loginPassV)} className='passwordIcon' src={loginPassV ? PasswordVisible: PasswordHide } alt="" />
              <ErrorMessagePara errorType={loginErrors?.password?.type} />
            </Box>
            

            <button type="submit" className="singInButton pointer" >
              <Typography>SIGN IN</Typography>
            </button>
          </form>

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
