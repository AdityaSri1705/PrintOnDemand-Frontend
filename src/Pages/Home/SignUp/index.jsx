import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams  } from "react-router-dom";
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

export default function SignUp({setMyUser, showBox}) {
  const navigate = useNavigate();
  const { token } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const redirect = searchParams.get("redirect");
  const act = searchParams.get("act");

  const BACKEND_URL = config.BACKEND_URL;
  const [signUpBox, setSignUpBox] = useState((showBox==='register')? true:false)
  const [emailVerifyBox, setEmailVerifyBox] = useState((showBox==='emailverify')? true:false)

  
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register: registerForm,
    handleSubmit: registerSubmit,
    errors: registerErrors,
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
    checkEmailToken(showBox, token);
   
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
              setMyUser(res.data.result.user); //customerlog hold the data of registered user or data of store in backend and database
              sessionStorage.setItem("User", JSON.stringify(res.data.result.user)); //hear we customerlog JSON.stringify for convert the object in to string
              sessionStorage.setItem("Token", res.data.result.token); 

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


  /* ------------- Register Code -------------------*/
  
  const [registerSubmited, setRegisterSubmited] = useState(false)
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

  const submitRegisterForm = async (data) => {

    setRegisterSubmited(true);
    //for not send data in url
    if(data.email!=="" && data.password!=="" && data.confirm_password!=="" && (data.password===data.confirm_password)){
      axios.post(
        `${BACKEND_URL}/api/V1/register`,
        data
      ).then(response => {
        if(response.data.status){
          setShowRegisterForm(false);

        }else{
          setErrorMessage(response.data.errors);
        }
        //setErrorMessage(!response.data.status? response.data.errors:'');
        //setMessage(response.data.status? response.data.result:'');
        

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
      
  
     axios.get(
        `${BACKEND_URL}/api/V1/verify/${token}`
      ).then(response => {
     
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

        {/* SignUpPopUp */}

        <Box sx={{ display: signUpBox ? "flex" : "none" }} className={`SignUpBox${!showRegisterForm>0 ? ' success' : ''}`}>
          <img onClick={() => navigate('/')} className='lonIn_crossButton' src={whiteCross} alt='CrossButton'/>

          <Box className="companyBanner">
            <img src={NavHeaderImg} alt='NavHeaderImg' />
          </Box>
          
          <Box sx={{ display: showRegisterForm ? "block" : "none" }} >
            <Box className="googleSignUp pointer" onClick={() => loginWIthGoogle()}>
            <img className='googleIcon' src={GoogleIcon} alt='GoogleIcon' />
            <Typography ml={1.5}>CONTINUE WITH GOOGLE</Typography>
            </Box>
         
            

            <Box className="divider">
              <hr />
              <Typography>OR</Typography>
            </Box>
            <form onSubmit={registerSubmit(submitRegisterForm)}>
              {message ? <p className="text-green-600">*{message}</p>:"" }
              {errorMessage!=="" ? <p className="text-red-600">{errorMessage}</p>:"" }

              <Box mb={1} className="emailInputBox">
              <TextField className='emailInput' name='email' type='email' placeholder='Email' {...registerForm("email", {required: true,})}  onChange={handleRegisterParameter} required/>
                <img className='emailIcon' src={EmailIcon} alt='EmailIcon' />
              </Box>
              { !validateEmail(userRegisterLog.email) & userRegisterLog.email!==""  & registerSubmited ? <p className="text-red-600">*please enter valid Email</p>:"" }

              <Box mb={1} className="passwordInputBox">
                <TextField className='passwordInput' name='password' type={registerPassV ? "text" : "password"} placeholder='Password' {...registerForm("password", {required: true,})} onChange={handleRegisterParameter} required />
                <img onClick={() => setRegisterPassV(!registerPassV)} className='passwordIcon' src={registerPassV ? PasswordVisible: PasswordHide} alt='passwordIcon'  />
              </Box> 

              <Box className="passwordInputBox">
                <TextField className='passwordInput' name='confirm_password' type={registerPassCV ? "text" : "password"} placeholder='Confirm Password' {...registerForm("confirm_password", {required: true,})}  onChange={handleRegisterParameter} required />
                <img onClick={() => setRegisterPassCV(!registerPassCV)} className='passwordIcon' src={registerPassCV ? PasswordVisible: PasswordHide} alt='passwordIcon' />
              </Box>
              { userRegisterLog.password!=="" & userRegisterLog.confirm_password!=="" & userRegisterLog.password!==userRegisterLog.confirm_password & registerSubmited ? <p className="text-red-600">*Both password are not matched</p>:"" } 


              <button type="submit" className="singInButton pointer" >
                <Typography>CREATE ACCOUNT</Typography>
              </button>
            </form>

            <Box className="createAndResetTab">
              <Typography mr={1} className='SignUpBText1'>Already have an account?</Typography>
              <Typography onClick={() => navigate('/login')} className='SignUpBText2 pointer'>Sign in</Typography>

            </Box>

          </Box>
          <Box sx={{ display: !showRegisterForm ? "block" : "none" }} >
            <Box className="tickbox">
                <img className='tickIcon' src={TickIcon} alt='TickIcon' />
                <Typography ml={1.5}>Registeration  successfully.<br /> Please check your email.</Typography>
              </Box>
              <Box className="tickbox2">
                <Typography ml={1.5} mt={3.5}>We just sent you an email to verify your email</Typography>
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
            <Typography onClick={() =>navigate('/')} className='SignUpBText2 pointer'>Sign in</Typography>

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
