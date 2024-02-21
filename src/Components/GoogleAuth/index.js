import React from 'react';
import { Box } from '@mui/material';
import { GoogleLogin } from 'react-google-login';
import "./style.css";
import config from '../../config';

const GoogleAuth = ({ onLoginSuccess, onLoginFailure }) => {

  const clientId = config.GOOGLE_CLIENTID; // Replace with your own client ID

  const handleSuccess = (response) => {
    onLoginSuccess(response);
  };

  const handleFailure = (error) => {
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