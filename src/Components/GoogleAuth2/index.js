import React from 'react';
import { Box } from '@mui/material';
import { GoogleAuth } from 'react-google-login';
import "./style.css";
import config from '../../config';

const GoogleLogin = ({ onLoginSuccess, onLoginFailure }) => {
    const BACKEND_GOOGURL = config.BACKEND_URL;
  const clientId = config.GOOGLE_CLIENTID; // Replace with your own client ID

  const handleSuccess = (response) => {
    onLoginSuccess(response);
  };

  const handleFailure = (error) => {
    onLoginFailure(error);
  };

  return (

        <GoogleAuth
        clientId={clientId}
        buttonText="CONTINUE WITH GOOGLE"
        onSuccess={handleSuccess}
        onFailure={handleFailure}
        cookiePolicy={'single_host_origin'}
        className='googleButton pointer'
        />
  );
};

export default GoogleLogin;