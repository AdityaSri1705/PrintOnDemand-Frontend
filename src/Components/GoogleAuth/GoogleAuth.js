import React from 'react';
import { Box } from '@mui/material';
import { GoogleLogin } from 'react-google-login';
import "./style.css";
import config from '../../config';

const GoogleAuth = ({ onLoginSuccess, onLoginFailure }) => {
    const clientId = config.GOOGLE_CLIENTID; 

  const handleSuccess = (response) => {
    console.log('Login Success:', response);
    onLoginSuccess(response);
  };

  const handleFailure = (error) => {
    console.error('Login Failure:', error);
    onLoginFailure(error);
  };

  return (
    <GoogleLogin
        clientId={clientId}
        buttonText="CONTINUE WITH GOOGLE"
        onSuccess={handleSuccess}
        onFailure={handleFailure}
        cookiePolicy={'single_host_origin'}
        className='googleButton pointer'
    />
  );
};

export default GoogleAuth;